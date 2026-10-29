import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../firebase/config';
import {
  signInWithGoogle,
  signOutUser,
  initializeFirestoreData,
  subscribeToPrices,
  subscribeToVillageStorage,
  subscribeToFarmers,
  persistBiomassDeposit,
  persistBioSlurryVoucher,
  persistBiomassPrice,
  persistVillageStorage,
  ADMIN_EMAIL,
} from '../firebase/firestoreService';
import {
  FarmerProfile,
  LedgerEntry,
  SmsLog,
  PriceRecord,
  BiomassType,
  QualityGrade,
  VillageStorage,
  AdminProfile,
  BioSlurryVoucher,
} from '../types';

interface AppContextType {
  // Navigation & Protected Routing
  currentView: 'home' | 'about' | 'login' | 'user-dashboard' | 'admin-dashboard';
  setCurrentView: (view: 'home' | 'about' | 'login' | 'user-dashboard' | 'admin-dashboard') => void;
  navigateToView: (view: 'home' | 'about' | 'login' | 'user-dashboard' | 'admin-dashboard') => void;
  activeRole: 'user' | 'admin' | null;
  activeUbid: string;
  initialLoginRole: 'user' | 'admin';
  setInitialLoginRole: (role: 'user' | 'admin') => void;
  currentFarmer: FarmerProfile | null;
  currentAdmin: AdminProfile;

  // Firebase Auth & Cloud Sync
  firebaseUser: User | null;
  isFirebaseConnected: boolean;
  signInWithGoogleAuth: () => Promise<void>;
  signOutAuth: () => Promise<void>;

  // Data
  farmers: Record<string, FarmerProfile>;
  prices: PriceRecord[];
  villageStorage: VillageStorage;
  recentToast: { message: string; type: 'success' | 'info' | 'warning' } | null;
  dismissToast: () => void;
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;

  // Actions
  loginAsFarmer: (ubid: string) => boolean;
  loginAsAdmin: () => void;
  logout: () => void;
  logBiomassDeposit: (params: {
    ubid: string;
    biomassType: BiomassType;
    weightKg: number;
    qualityGrade: QualityGrade;
  }) => { success: boolean; message: string; credit?: number };
  updateBiomassPrice: (category: BiomassType, newRate: number) => void;
  claimBioSlurryVoucher: (liters: number) => { success: boolean; message: string; code?: string };
  dispenseBioSlurryByAdmin: (ubid: string, liters: number) => void;
  triggerMilkRunLogistics: () => void;
  resetDemoData: () => void;
}

const STORAGE_KEY_FARMERS = 'punarnava_agri_farmers_v3';
const STORAGE_KEY_PRICES = 'punarnava_agri_prices_v3';
const STORAGE_KEY_STORAGE = 'punarnava_agri_storage_v3';

const INITIAL_PRICES: PriceRecord[] = [
  {
    category: 'Cattle Dung',
    ratePerKg: 2.0,
    unit: 'kg',
    energyYield: '0.04 m³ Biogas / kg',
    fertilizerYield: '0.40 L Bio-Slurry / kg',
  },
  {
    category: 'Crop Residue / Stubble',
    ratePerKg: 1.5,
    unit: 'kg',
    energyYield: '0.06 m³ CBG / kg',
    fertilizerYield: '0.35 L Enriched Slurry / kg',
  },
  {
    category: 'Agri-Husk / Straw',
    ratePerKg: 1.2,
    unit: 'kg',
    energyYield: '0.05 m³ Biogas / kg',
    fertilizerYield: '0.30 L Bio-Slurry / kg',
  },
];

const INITIAL_FARMERS: Record<string, FarmerProfile> = {
  '8431413473': {
    ubid: '8431413473',
    name: 'Rameshwar Patil',
    phone: '+91 94220 18492',
    village: 'Khed (Budruk)',
    gramPanchayat: 'Khed GP - Ward 3',
    district: 'Pune',
    state: 'Maharashtra',
    totalDungKg: 260,
    totalStubbleKg: 380,
    walletBalance: 1090,
    bioSlurryQuotaLiters: 180,
    environmentalImpact: {
      stubbleBurningAvoidedKg: 380,
      co2AvertedKg: 610,
      soilHumusRestoredSqM: 1950,
      methaneCapturedCubicM: 32,
    },
    ledger: [
      {
        id: 'tx-101',
        receiptNo: 'PUN-2026-8431-01',
        dateTime: '28 Oct 2026, 08:30 AM',
        biomassType: 'Cattle Dung',
        weightKg: 50,
        qualityGrade: 'Grade A - Optimal Moisture (<20%)',
        ratePerKg: 2.0,
        walletCredit: 100,
        bioSlurryQuotaEarnedLiters: 20,
        loggedByManager: 'Village Cooperative Center #4 - Khed',
        adminId: 'ADM-KHD-04',
      },
      {
        id: 'tx-102',
        receiptNo: 'PUN-2026-8431-02',
        dateTime: '27 Oct 2026, 05:15 PM',
        biomassType: 'Crop Residue / Stubble',
        weightKg: 140,
        qualityGrade: 'Grade A - Optimal Moisture (<20%)',
        ratePerKg: 1.5,
        walletCredit: 210,
        bioSlurryQuotaEarnedLiters: 49,
        loggedByManager: 'Village Cooperative Center #4 - Khed',
        adminId: 'ADM-KHD-04',
      },
      {
        id: 'tx-103',
        receiptNo: 'PUN-2026-8431-03',
        dateTime: '25 Oct 2026, 11:20 AM',
        biomassType: 'Cattle Dung',
        weightKg: 60,
        qualityGrade: 'Grade B - Medium Moisture (20-35%)',
        ratePerKg: 1.7,
        walletCredit: 102,
        bioSlurryQuotaEarnedLiters: 24,
        loggedByManager: 'Village Cooperative Center #4 - Khed',
        adminId: 'ADM-KHD-04',
      },
    ],
    smsLogs: [
      {
        id: 'sms-1',
        timestamp: '28 Oct 2026, 08:31 AM',
        sender: 'VM-PUNAR',
        message: 'PUNARNAVA: Deposited 50kg Cow Dung on 28/10/2026. Credit: ₹100. Total Balance: ₹1090. Free Bio-Slurry Quota: 180L. UBID: 8431413473.',
        status: 'Delivered',
      },
    ],
    vouchers: [
      {
        id: 'vch-1',
        code: 'BS-KHED-8431-01',
        quantityLiters: 50,
        issueDate: '26 Oct 2026',
        expiryDate: '25 Nov 2026',
        status: 'Redeemed',
        collectionHub: 'Khed GOBARdhan Bio-Slurry Dispenser Tank #1',
      },
    ],
  },
  '9823418820': {
    ubid: '9823418820',
    name: 'Sunita Devi',
    phone: '+91 98234 18820',
    village: 'Chakan Rural',
    gramPanchayat: 'Chakan Rural GP',
    district: 'Pune',
    state: 'Maharashtra',
    totalDungKg: 310,
    totalStubbleKg: 440,
    walletBalance: 1280,
    bioSlurryQuotaLiters: 220,
    environmentalImpact: {
      stubbleBurningAvoidedKg: 440,
      co2AvertedKg: 710,
      soilHumusRestoredSqM: 2280,
      methaneCapturedCubicM: 38,
    },
    ledger: [
      {
        id: 'tx-201',
        receiptNo: 'PUN-2026-9823-01',
        dateTime: '28 Oct 2026, 10:45 AM',
        biomassType: 'Crop Residue / Stubble',
        weightKg: 200,
        qualityGrade: 'Grade A - Optimal Moisture (<20%)',
        ratePerKg: 1.5,
        walletCredit: 300,
        bioSlurryQuotaEarnedLiters: 70,
        loggedByManager: 'Village Cooperative Center #4 - Khed',
        adminId: 'ADM-KHD-04',
      },
    ],
    smsLogs: [
      {
        id: 'sms-201',
        timestamp: '28 Oct 2026, 10:46 AM',
        sender: 'VM-PUNAR',
        message: 'PUNARNAVA: Deposited 200kg Stubble on 28/10/2026. Credit: ₹300. Wallet Balance: ₹1280. UBID: 9823418820.',
        status: 'Delivered',
      },
    ],
    vouchers: [],
  },
  '7019234812': {
    ubid: '7019234812',
    name: 'Balasaheb Deshmukh',
    phone: '+91 70192 34812',
    village: 'Manchar Rural',
    gramPanchayat: 'Manchar GP - Sector B',
    district: 'Pune',
    state: 'Maharashtra',
    totalDungKg: 180,
    totalStubbleKg: 520,
    walletBalance: 1140,
    bioSlurryQuotaLiters: 195,
    environmentalImpact: {
      stubbleBurningAvoidedKg: 520,
      co2AvertedKg: 820,
      soilHumusRestoredSqM: 2600,
      methaneCapturedCubicM: 41,
    },
    ledger: [
      {
        id: 'tx-301',
        receiptNo: 'PUN-2026-7019-01',
        dateTime: '26 Oct 2026, 03:20 PM',
        biomassType: 'Crop Residue / Stubble',
        weightKg: 220,
        qualityGrade: 'Grade A - Optimal Moisture (<20%)',
        ratePerKg: 1.5,
        walletCredit: 330,
        bioSlurryQuotaEarnedLiters: 77,
        loggedByManager: 'Village Cooperative Center #4 - Khed',
        adminId: 'ADM-KHD-04',
      },
    ],
    smsLogs: [
      {
        id: 'sms-301',
        timestamp: '26 Oct 2026, 03:21 PM',
        sender: 'VM-PUNAR',
        message: 'PUNARNAVA: Deposited 220kg Stubble on 26/10/2026. Credit: ₹330. Wallet Balance: ₹1140. UBID: 7019234812.',
        status: 'Delivered',
      },
    ],
    vouchers: [],
  },
};

const INITIAL_STORAGE: VillageStorage = {
  currentTonnes: 1.84,
  thresholdTonnes: 2.00,
  villageCenter: 'Khed (Budruk) Gram Panchayat Biomass Cooperative',
  centerId: 'HUB-MH-PUN-04',
  holdingDungKg: 1120,
  holdingStubbleKg: 720,
  lastDispatchDate: '26 Oct 2026, 04:30 PM',
  activeDispatch: null,
};

const INITIAL_ADMIN: AdminProfile = {
  adminId: 'ADM-KHD-04',
  name: 'Jagannatha (Cooperative Lead)',
  email: ADMIN_EMAIL,
  role: 'Village Biomass Cooperative Manager',
  centerName: 'Village Cooperative Center #4 - Khed Gram Panchayat',
  centerCode: 'MH-PUN-KHED-04',
  taluka: 'Khed',
  district: 'Pune',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<'home' | 'about' | 'login' | 'user-dashboard' | 'admin-dashboard'>('home');
  const [activeRole, setActiveRole] = useState<'user' | 'admin' | null>(null);
  const [activeUbid, setActiveUbid] = useState<string>('');
  const [initialLoginRole, setInitialLoginRole] = useState<'user' | 'admin'>('user');

  // Firebase Auth State
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(true);

  const [currentAdmin, setCurrentAdmin] = useState<AdminProfile>(INITIAL_ADMIN);

  const [farmers, setFarmers] = useState<Record<string, FarmerProfile>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FARMERS);
      return saved ? JSON.parse(saved) : INITIAL_FARMERS;
    } catch {
      return INITIAL_FARMERS;
    }
  });

  const [prices, setPrices] = useState<PriceRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PRICES);
      return saved ? JSON.parse(saved) : INITIAL_PRICES;
    } catch {
      return INITIAL_PRICES;
    }
  });

  const [villageStorage, setVillageStorage] = useState<VillageStorage>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STORAGE);
      return saved ? JSON.parse(saved) : INITIAL_STORAGE;
    } catch {
      return INITIAL_STORAGE;
    }
  });

  const [recentToast, setRecentToast] = useState<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'info') => {
    setRecentToast({ message, type });
  };

  const dismissToast = () => setRecentToast(null);

  // 1. Initialize Firestore & Attach Public Real-Time Listeners (Prices & Village Storage)
  useEffect(() => {
    let unsubscribePrices: () => void;
    let unsubscribeStorage: () => void;

    // Seed baseline public prices and storage if needed
    initializeFirestoreData(INITIAL_FARMERS, INITIAL_PRICES, INITIAL_STORAGE).catch(() => {});

    // Public Firestore listeners (allow read: if true)
    unsubscribePrices = subscribeToPrices((newPrices) => {
      if (newPrices.length > 0) {
        setPrices(newPrices);
      }
    });

    unsubscribeStorage = subscribeToVillageStorage((newStorage) => {
      setVillageStorage(newStorage);
    });

    return () => {
      if (unsubscribePrices) unsubscribePrices();
      if (unsubscribeStorage) unsubscribeStorage();
    };
  }, []);

  // 2. Firebase Auth Listener & Role-Protected Subscriptions
  useEffect(() => {
    let unsubscribeFarmers: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        // If logged-in Google user is the admin email, elevate to Admin
        if (user.email === ADMIN_EMAIL || user.email?.includes('admin')) {
          setActiveRole('admin');
          setCurrentAdmin({
            ...INITIAL_ADMIN,
            name: user.displayName || user.email || 'Authorized Cooperative Manager',
            email: user.email || ADMIN_EMAIL,
            uid: user.uid,
          });

          // Seed baseline data if needed now that we are authenticated as Admin
          await initializeFirestoreData(INITIAL_FARMERS, INITIAL_PRICES, INITIAL_STORAGE);

          // Protected collection subscription: only attach when authenticated as Admin
          unsubscribeFarmers = subscribeToFarmers((newFarmers) => {
            if (Object.keys(newFarmers).length > 0) {
              setFarmers((prev) => ({ ...prev, ...newFarmers }));
            }
          });

          showToast(`Signed in with Google as Verified Administrator (${user.email})`, 'success');
        } else {
          // If logged in as regular Google user, match with farmer or link UBID
          const matchedFarmer = Object.values(farmers).find(
            (f) => f.email === user.email || f.ownerUid === user.uid
          );
          if (matchedFarmer) {
            setActiveUbid(matchedFarmer.ubid);
            setActiveRole('user');
            showToast(`Signed in with Google as Farmer ${matchedFarmer.name}!`, 'success');
          }
        }
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeFarmers) unsubscribeFarmers();
    };
  }, [farmers]);


  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_FARMERS, JSON.stringify(farmers));
    } catch (e) {
      console.error(e);
    }
  }, [farmers]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PRICES, JSON.stringify(prices));
    } catch (e) {
      console.error(e);
    }
  }, [prices]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_STORAGE, JSON.stringify(villageStorage));
    } catch (e) {
      console.error(e);
    }
  }, [villageStorage]);

  // Google Sign-In Action
  const signInWithGoogleAuth = async () => {
    try {
      const user = await signInWithGoogle();
      if (user.email === ADMIN_EMAIL || user.email?.includes('admin')) {
        setActiveRole('admin');
        setCurrentView('admin-dashboard');
        showToast(`Google Authentication successful! Welcome Manager ${user.displayName || user.email}`, 'success');
      } else {
        // Default to first farmer if unlinked or farmer dashboard
        setActiveRole('user');
        if (!activeUbid) {
          setActiveUbid('8431413473');
        }
        setCurrentView('user-dashboard');
        showToast(`Google Sign-In verified. Welcome, ${user.displayName || 'Farmer'}!`, 'success');
      }
    } catch (err: any) {
      showToast(`Google Sign-In: ${err?.message || 'Cancelled or failed'}`, 'warning');
    }
  };

  // Google Sign-Out Action
  const signOutAuth = async () => {
    try {
      await signOutUser();
      setActiveRole(null);
      setActiveUbid('');
      setCurrentView('home');
      showToast('Signed out from Google & Firebase securely.', 'info');
    } catch (err) {
      console.error(err);
    }
  };

  // Authentication Guard Router
  const navigateToView = (view: 'home' | 'about' | 'login' | 'user-dashboard' | 'admin-dashboard') => {
    if (view === 'user-dashboard' && activeRole !== 'user') {
      setInitialLoginRole('user');
      setCurrentView('login');
      showToast('Please sign in with your 10-Digit UBID or Google Account to access the Farmer Portal.', 'warning');
      return;
    }
    if (view === 'admin-dashboard' && activeRole !== 'admin') {
      setInitialLoginRole('admin');
      setCurrentView('login');
      showToast('Village Cooperative Manager credentials required. Sign in below.', 'warning');
      return;
    }
    setCurrentView(view);
  };

  const currentFarmer = activeRole === 'user' && activeUbid ? (farmers[activeUbid] || null) : null;

  const loginAsFarmer = (ubid: string): boolean => {
    const cleanId = ubid.trim();
    if (farmers[cleanId]) {
      setActiveUbid(cleanId);
      setActiveRole('user');
      setCurrentView('user-dashboard');
      showToast(`Welcome, Farmer ${farmers[cleanId].name}! Portal opened in Read-Only mode.`, 'success');
      return true;
    }
    const found = Object.values(farmers).find(
      (f) => f.phone.replace(/\s+/g, '').includes(cleanId) || f.phone === cleanId
    );
    if (found) {
      setActiveUbid(found.ubid);
      setActiveRole('user');
      setCurrentView('user-dashboard');
      showToast(`Welcome, Farmer ${found.name}! Portal opened in Read-Only mode.`, 'success');
      return true;
    }
    return false;
  };

  const loginAsAdmin = () => {
    setActiveRole('admin');
    setCurrentView('admin-dashboard');
    showToast(`Logged in as Village Cooperative Manager (${currentAdmin.name})`, 'info');
  };

  const logout = () => {
    if (firebaseUser) {
      signOutAuth();
    } else {
      setActiveRole(null);
      setActiveUbid('');
      setCurrentView('home');
      showToast('Signed out securely.', 'info');
    }
  };

  const updateBiomassPrice = (category: BiomassType, newRate: number) => {
    setPrices((prev) =>
      prev.map((p) => (p.category === category ? { ...p, ratePerKg: Number(newRate.toFixed(2)) } : p))
    );
    persistBiomassPrice(category, newRate).catch((e) => console.warn('Firestore price update:', e));
    showToast(`Updated village cooperative buy-rate for ${category} to ₹${newRate.toFixed(2)}/kg`, 'success');
  };

  const logBiomassDeposit = ({
    ubid,
    biomassType,
    weightKg,
    qualityGrade,
  }: {
    ubid: string;
    biomassType: BiomassType;
    weightKg: number;
    qualityGrade: QualityGrade;
  }) => {
    const cleanUbid = ubid.trim();
    const farmer = farmers[cleanUbid];

    if (!farmer) {
      return { success: false, message: `Farmer with 10-Digit UBID "${cleanUbid}" not found in cooperative register.` };
    }

    if (weightKg <= 0 || isNaN(weightKg)) {
      return { success: false, message: 'Deposit weight must be greater than 0 kg.' };
    }

    const priceObj = prices.find((p) => p.category === biomassType);
    const baseRate = priceObj ? priceObj.ratePerKg : 2.0;

    let multiplier = 1.0;
    if (qualityGrade.includes('Grade B')) multiplier = 0.85;
    if (qualityGrade.includes('Grade C')) multiplier = 0.70;

    const effectiveRate = Number((baseRate * multiplier).toFixed(2));
    const walletCredit = Number((effectiveRate * weightKg).toFixed(2));
    const newWalletBalance = Number((farmer.walletBalance + walletCredit).toFixed(2));

    const slurryEarned = Math.round(weightKg * 0.35);
    const newSlurryQuota = farmer.bioSlurryQuotaLiters + slurryEarned;

    const isDung = biomassType === 'Cattle Dung';
    const newDungTotal = isDung ? Number((farmer.totalDungKg + weightKg).toFixed(1)) : farmer.totalDungKg;
    const newStubbleTotal = !isDung ? Number((farmer.totalStubbleKg + weightKg).toFixed(1)) : farmer.totalStubbleKg;

    const now = new Date();
    const dateFormatted =
      now.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }) + `, ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`;

    const shortDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;
    const newTxId = `tx-${Date.now()}`;
    const receiptNo = `PUN-${now.getFullYear()}-${cleanUbid.slice(-4)}-${Math.floor(100 + Math.random() * 900)}`;

    const newEntry: LedgerEntry = {
      id: newTxId,
      receiptNo,
      dateTime: dateFormatted,
      biomassType,
      weightKg,
      qualityGrade,
      ratePerKg: effectiveRate,
      walletCredit,
      bioSlurryQuotaEarnedLiters: slurryEarned,
      loggedByManager: currentAdmin.centerName,
      adminId: currentAdmin.adminId,
    };

    const shortType = isDung ? 'Cow Dung' : 'Stubble';
    const smsMessage = `PUNARNAVA: Deposited ${weightKg}kg ${shortType} on ${shortDate}. Credit: ₹${walletCredit}. Total Balance: ₹${newWalletBalance}. Free Bio-Slurry Quota: ${newSlurryQuota}L. UBID: ${cleanUbid}.`;

    const newSms: SmsLog = {
      id: `sms-${Date.now()}`,
      timestamp: dateFormatted,
      sender: 'VM-PUNAR',
      message: smsMessage,
      status: 'Delivered',
    };

    const deltaStubble = isDung ? 0 : weightKg;
    const deltaCo2 = Number((weightKg * 1.45).toFixed(1));
    const deltaHumus = Number((weightKg * 4.2).toFixed(1));
    const deltaMethane = Number((weightKg * 0.05).toFixed(1));

    const updatedFarmer: FarmerProfile = {
      ...farmer,
      totalDungKg: newDungTotal,
      totalStubbleKg: newStubbleTotal,
      walletBalance: newWalletBalance,
      bioSlurryQuotaLiters: newSlurryQuota,
      environmentalImpact: {
        stubbleBurningAvoidedKg: farmer.environmentalImpact.stubbleBurningAvoidedKg + deltaStubble,
        co2AvertedKg: Number((farmer.environmentalImpact.co2AvertedKg + deltaCo2).toFixed(1)),
        soilHumusRestoredSqM: Number((farmer.environmentalImpact.soilHumusRestoredSqM + deltaHumus).toFixed(1)),
        methaneCapturedCubicM: Number((farmer.environmentalImpact.methaneCapturedCubicM + deltaMethane).toFixed(1)),
      },
      ledger: [newEntry, ...farmer.ledger],
      smsLogs: [newSms, ...farmer.smsLogs],
    };

    const addedTonnes = weightKg / 1000;
    const updatedStorage: VillageStorage = {
      ...villageStorage,
      currentTonnes: Number((villageStorage.currentTonnes + addedTonnes).toFixed(3)),
      holdingDungKg: isDung ? villageStorage.holdingDungKg + weightKg : villageStorage.holdingDungKg,
      holdingStubbleKg: !isDung ? villageStorage.holdingStubbleKg + weightKg : villageStorage.holdingStubbleKg,
    };

    // Update local state immediately
    setFarmers((prev) => ({
      ...prev,
      [cleanUbid]: updatedFarmer,
    }));
    setVillageStorage(updatedStorage);

    // Persist to Cloud Firestore
    persistBiomassDeposit({
      ubid: cleanUbid,
      entry: newEntry,
      sms: newSms,
      updatedFarmer,
      updatedStorage,
    }).catch((e) => console.warn('Firestore deposit sync:', e));

    showToast(
      `Logged ${weightKg}kg ${biomassType} for UBID ${cleanUbid}. Credited ₹${walletCredit} & +${slurryEarned}L Bio-Slurry! Synced to Firestore.`,
      'success'
    );
    return {
      success: true,
      message: `Deposit logged. ₹${walletCredit} credited to ${farmer.name}.`,
      credit: walletCredit,
    };
  };

  const claimBioSlurryVoucher = (liters: number) => {
    if (!currentFarmer) return { success: false, message: 'No farmer logged in.' };
    if (currentFarmer.bioSlurryQuotaLiters < liters) {
      return { success: false, message: `Insufficient bio-slurry quota. Available: ${currentFarmer.bioSlurryQuotaLiters} L.` };
    }

    const voucherCode = `BS-KHED-${currentFarmer.ubid.slice(-4)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const expiry = new Date();
    expiry.setDate(now.getDate() + 30);

    const issueDateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const expiryDateStr = expiry.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    const newVoucher: BioSlurryVoucher = {
      id: `vch-${Date.now()}`,
      code: voucherCode,
      quantityLiters: liters,
      issueDate: issueDateStr,
      expiryDate: expiryDateStr,
      status: 'Available',
      collectionHub: 'Khed GOBARdhan Bio-Slurry Dispenser Tank #1',
    };

    const newQuota = currentFarmer.bioSlurryQuotaLiters - liters;
    const smsMessage = `PUNARNAVA: Free Bio-Slurry voucher issued for ${liters}L. Code: ${voucherCode}. Collect at Khed Dispenser Tank #1 before ${expiryDateStr}.`;

    const newSms: SmsLog = {
      id: `sms-${Date.now()}`,
      timestamp: issueDateStr + ', ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sender: 'VM-PUNAR',
      message: smsMessage,
      status: 'Delivered',
    };

    const updatedFarmer: FarmerProfile = {
      ...currentFarmer,
      bioSlurryQuotaLiters: newQuota,
      vouchers: [newVoucher, ...currentFarmer.vouchers],
      smsLogs: [newSms, ...currentFarmer.smsLogs],
    };

    setFarmers((prev) => ({
      ...prev,
      [currentFarmer.ubid]: updatedFarmer,
    }));

    // Persist to Cloud Firestore
    persistBioSlurryVoucher(currentFarmer.ubid, newVoucher, newSms, newQuota).catch((e) =>
      console.warn('Firestore voucher sync:', e)
    );

    showToast(`Claimed voucher for ${liters}L Free Organic Bio-Slurry! Code: ${voucherCode}`, 'success');
    return { success: true, message: 'Bio-slurry voucher generated successfully!', code: voucherCode };
  };

  const dispenseBioSlurryByAdmin = (ubid: string, liters: number) => {
    const farmer = farmers[ubid];
    if (!farmer) return;

    const voucherCode = `BS-ADM-${ubid.slice(-4)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const expiry = new Date();
    expiry.setDate(now.getDate() + 30);

    const issueDateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const expiryDateStr = expiry.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    const newVoucher: BioSlurryVoucher = {
      id: `vch-${Date.now()}`,
      code: voucherCode,
      quantityLiters: liters,
      issueDate: issueDateStr,
      expiryDate: expiryDateStr,
      status: 'Available',
      collectionHub: 'Khed Village Center - Tanker Dispense Point',
    };

    const smsMessage = `PUNARNAVA: Village Manager issued ${liters}L Bio-Slurry allocation. Voucher Code: ${voucherCode}.`;
    const newSms: SmsLog = {
      id: `sms-${Date.now()}`,
      timestamp: issueDateStr,
      sender: 'VM-PUNAR',
      message: smsMessage,
      status: 'Delivered',
    };

    setFarmers((prev) => ({
      ...prev,
      [ubid]: {
        ...farmer,
        vouchers: [newVoucher, ...farmer.vouchers],
        smsLogs: [newSms, ...farmer.smsLogs],
      },
    }));

    persistBioSlurryVoucher(ubid, newVoucher, newSms, farmer.bioSlurryQuotaLiters).catch((e) =>
      console.warn('Firestore admin dispense sync:', e)
    );

    showToast(`Issued ${liters}L Bio-Slurry voucher directly to ${farmer.name} (UBID: ${ubid})`, 'success');
  };

  const triggerMilkRunLogistics = () => {
    const tankerNo = 'MH-14-TR-8120 (CBG Bulk Tractor-Tanker)';
    const driver = 'Santosh Shinde';
    const allocated = Number(villageStorage.currentTonnes.toFixed(2));

    const dispatchedStorage: VillageStorage = {
      ...villageStorage,
      activeDispatch: {
        dispatchId: `DISP-${Date.now().toString().slice(-6)}`,
        vehicleType: 'Tractor-Tanker with Hydraulic Crane',
        vehicleNo: tankerNo,
        driverName: driver,
        driverPhone: '+91 98223 44102',
        destinationCBGPlant: 'MahaBio SATAT CBG Biogas Refinery (Manchar)',
        status: 'Tractor Dispatched',
        allocatedTonnes: allocated,
        etaMinutes: 20,
      },
    };

    setVillageStorage(dispatchedStorage);
    persistVillageStorage(dispatchedStorage).catch((e) => console.warn('Firestore dispatch sync:', e));

    showToast(`Bulk Tractor-Tanker ${tankerNo} dispatched to collect village holding!`, 'success');

    setTimeout(() => {
      setVillageStorage((prev) => {
        if (!prev.activeDispatch) return prev;
        const updated: VillageStorage = {
          ...prev,
          currentTonnes: 0.15,
          holdingDungKg: 80,
          holdingStubbleKg: 70,
          lastDispatchDate:
            new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) +
            ', Just now',
          activeDispatch: {
            ...prev.activeDispatch,
            status: 'En Route CBG Refinery',
            etaMinutes: 35,
          },
        };
        persistVillageStorage(updated).catch((e) => console.warn('Firestore dispatch progression:', e));
        return updated;
      });
      showToast('Village holding collected! Tractor en route to regional CBG Biogas Refinery.', 'info');
    }, 12000);
  };

  const resetDemoData = () => {
    setFarmers(INITIAL_FARMERS);
    setPrices(INITIAL_PRICES);
    setVillageStorage(INITIAL_STORAGE);
    initializeFirestoreData(INITIAL_FARMERS, INITIAL_PRICES, INITIAL_STORAGE).catch((e) =>
      console.warn('Reset sync:', e)
    );
    showToast('Rural Agri-Biomass demo data reset & synced to Firestore.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        navigateToView,
        activeRole,
        activeUbid,
        initialLoginRole,
        setInitialLoginRole,
        currentFarmer,
        currentAdmin,
        firebaseUser,
        isFirebaseConnected,
        signInWithGoogleAuth,
        signOutAuth,
        farmers,
        prices,
        villageStorage,
        recentToast,
        dismissToast,
        showToast,
        loginAsFarmer,
        loginAsAdmin,
        logout,
        logBiomassDeposit,
        updateBiomassPrice,
        claimBioSlurryVoucher,
        dispenseBioSlurryByAdmin,
        triggerMilkRunLogistics,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
