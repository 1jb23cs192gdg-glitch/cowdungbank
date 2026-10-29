import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  onSnapshot,
  writeBatch,
} from 'firebase/firestore';
import { signInWithPopup, signOut as fbSignOut, User } from 'firebase/auth';
import { db, auth, googleProvider } from './config';
import { handleFirestoreError, OperationType } from './firestoreErrors';
import {
  FarmerProfile,
  LedgerEntry,
  PriceRecord,
  VillageStorage,
  BiomassType,
  BioSlurryVoucher,
  SmsLog,
} from '../types';

export const ADMIN_EMAIL = 'jagannatha.jvm@gmail.com';

// Sign in with Google Popup
export async function signInWithGoogle(): Promise<User> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Google Sign-In failed:', error);
    throw error;
  }
}

// Sign out
export async function signOutUser(): Promise<void> {
  try {
    await fbSignOut(auth);
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
}

// Seed baseline data to Firestore if not already present
export async function initializeFirestoreData(
  initialFarmers: Record<string, FarmerProfile>,
  initialPrices: PriceRecord[],
  initialStorage: VillageStorage
) {
  try {
    // 1. Check & Seed Prices (allow read: if true, allow create: if valid price)
    try {
      const pricesColl = collection(db, 'prices');
      const priceDocs = await getDocs(pricesColl);
      if (priceDocs.empty) {
        for (const p of initialPrices) {
          const priceDocId = p.category.toLowerCase().replace(/[^a-z0-9]/g, '_');
          const pPath = `prices/${priceDocId}`;
          try {
            await setDoc(doc(db, 'prices', priceDocId), p);
          } catch (e) {
            handleFirestoreError(e, OperationType.CREATE, pPath);
          }
        }
      }
    } catch {
      // Non-blocking fallback
    }

    // 2. Check & Seed Village Storage (allow read: if true, allow create: if valid storage)
    try {
      const storageDocRef = doc(db, 'villageStorage', 'current');
      const storageSnap = await getDoc(storageDocRef);
      if (!storageSnap.exists()) {
        try {
          await setDoc(storageDocRef, initialStorage);
        } catch (e) {
          handleFirestoreError(e, OperationType.CREATE, 'villageStorage/current');
        }
      }
    } catch {
      // Non-blocking fallback
    }

    // 3. Check & Seed Farmers - Seed when authenticated as admin or initial setup
    if (auth.currentUser) {
      try {
        const farmersColl = collection(db, 'farmers');
        const farmerDocs = await getDocs(farmersColl);
        if (farmerDocs.empty) {
          for (const [ubid, farmer] of Object.entries(initialFarmers)) {
            const fPath = `farmers/${ubid}`;
            try {
              await setDoc(doc(db, 'farmers', ubid), {
                ubid: farmer.ubid,
                name: farmer.name,
                phone: farmer.phone,
                village: farmer.village,
                gramPanchayat: farmer.gramPanchayat,
                district: farmer.district,
                state: farmer.state,
                totalDungKg: farmer.totalDungKg,
                totalStubbleKg: farmer.totalStubbleKg,
                walletBalance: farmer.walletBalance,
                bioSlurryQuotaLiters: farmer.bioSlurryQuotaLiters,
                environmentalImpact: farmer.environmentalImpact,
              });

              for (const item of farmer.ledger) {
                await setDoc(doc(db, 'farmers', ubid, 'ledger', item.id), item);
              }
              for (const v of farmer.vouchers) {
                await setDoc(doc(db, 'farmers', ubid, 'vouchers', v.id), v);
              }
              for (const s of farmer.smsLogs) {
                await setDoc(doc(db, 'farmers', ubid, 'smsLogs', s.id), s);
              }
            } catch (e) {
              handleFirestoreError(e, OperationType.CREATE, fPath);
            }
          }
        }
      } catch {
        // Non-blocking fallback
      }
    }
  } catch (error) {
    console.warn('Non-blocking initializeFirestoreData notice:', error);
  }
}

// Real-time listener for Prices (Public read)
export function subscribeToPrices(
  onUpdate: (prices: PriceRecord[]) => void
) {
  const path = 'prices';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const list: PriceRecord[] = [];
      snapshot.forEach((d) => {
        list.push(d.data() as PriceRecord);
      });
      if (list.length > 0) {
        onUpdate(list);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

// Real-time listener for Village Storage (Public read)
export function subscribeToVillageStorage(
  onUpdate: (storage: VillageStorage) => void
) {
  const path = 'villageStorage/current';
  return onSnapshot(
    doc(db, 'villageStorage', 'current'),
    (snap) => {
      if (snap.exists()) {
        onUpdate(snap.data() as VillageStorage);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

// Real-time listener for All Farmers (Only attach if auth is ready and authenticated as admin)
export function subscribeToFarmers(
  onUpdate: (farmers: Record<string, FarmerProfile>) => void
) {
  if (!auth.currentUser) {
    return () => {};
  }
  const path = 'farmers';
  return onSnapshot(
    collection(db, path),
    async (snapshot) => {
      const map: Record<string, FarmerProfile> = {};

      for (const d of snapshot.docs) {
        const data = d.data();
        const ubid = d.id;

        let ledger: LedgerEntry[] = [];
        let vouchers: BioSlurryVoucher[] = [];
        let smsLogs: SmsLog[] = [];

        try {
          const ledgerSnap = await getDocs(collection(db, 'farmers', ubid, 'ledger'));
          ledger = ledgerSnap.docs.map((docSnap) => docSnap.data() as LedgerEntry);
        } catch {
          // Fallback
        }

        try {
          const vouchersSnap = await getDocs(collection(db, 'farmers', ubid, 'vouchers'));
          vouchers = vouchersSnap.docs.map((docSnap) => docSnap.data() as BioSlurryVoucher);
        } catch {
          // Fallback
        }

        try {
          const smsSnap = await getDocs(collection(db, 'farmers', ubid, 'smsLogs'));
          smsLogs = smsSnap.docs.map((docSnap) => docSnap.data() as SmsLog);
        } catch {
          // Fallback
        }

        map[ubid] = {
          ubid,
          name: data.name || '',
          phone: data.phone || '',
          village: data.village || '',
          gramPanchayat: data.gramPanchayat || '',
          district: data.district || '',
          state: data.state || '',
          totalDungKg: data.totalDungKg || 0,
          totalStubbleKg: data.totalStubbleKg || 0,
          walletBalance: data.walletBalance || 0,
          bioSlurryQuotaLiters: data.bioSlurryQuotaLiters || 0,
          environmentalImpact: data.environmentalImpact || {
            stubbleBurningAvoidedKg: 0,
            co2AvertedKg: 0,
            soilHumusRestoredSqM: 0,
            methaneCapturedCubicM: 0,
          },
          ownerUid: data.ownerUid,
          email: data.email,
          ledger,
          vouchers,
          smsLogs,
        };
      }

      onUpdate(map);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

// Real-time listener for a single Farmer profile and subcollections
export function subscribeToFarmerProfile(
  ubid: string,
  onUpdate: (farmer: FarmerProfile) => void
) {
  const path = `farmers/${ubid}`;
  return onSnapshot(
    doc(db, 'farmers', ubid),
    async (snap) => {
      if (!snap.exists()) return;
      const data = snap.data();
      let ledger: LedgerEntry[] = [];
      let vouchers: BioSlurryVoucher[] = [];
      let smsLogs: SmsLog[] = [];

      try {
        const ledgerSnap = await getDocs(collection(db, 'farmers', ubid, 'ledger'));
        ledger = ledgerSnap.docs.map((docSnap) => docSnap.data() as LedgerEntry);
      } catch {
        // Fallback
      }

      try {
        const vouchersSnap = await getDocs(collection(db, 'farmers', ubid, 'vouchers'));
        vouchers = vouchersSnap.docs.map((docSnap) => docSnap.data() as BioSlurryVoucher);
      } catch {
        // Fallback
      }

      try {
        const smsSnap = await getDocs(collection(db, 'farmers', ubid, 'smsLogs'));
        smsLogs = smsSnap.docs.map((docSnap) => docSnap.data() as SmsLog);
      } catch {
        // Fallback
      }

      onUpdate({
        ubid,
        name: data.name || '',
        phone: data.phone || '',
        village: data.village || '',
        gramPanchayat: data.gramPanchayat || '',
        district: data.district || '',
        state: data.state || '',
        totalDungKg: data.totalDungKg || 0,
        totalStubbleKg: data.totalStubbleKg || 0,
        walletBalance: data.walletBalance || 0,
        bioSlurryQuotaLiters: data.bioSlurryQuotaLiters || 0,
        environmentalImpact: data.environmentalImpact || {
          stubbleBurningAvoidedKg: 0,
          co2AvertedKg: 0,
          soilHumusRestoredSqM: 0,
          methaneCapturedCubicM: 0,
        },
        ownerUid: data.ownerUid,
        email: data.email,
        ledger,
        vouchers,
        smsLogs,
      });
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

// Log a deposit transaction to Firestore
export async function persistBiomassDeposit({
  ubid,
  entry,
  sms,
  updatedFarmer,
  updatedStorage,
}: {
  ubid: string;
  entry: LedgerEntry;
  sms: SmsLog;
  updatedFarmer: FarmerProfile;
  updatedStorage: VillageStorage;
}) {
  const farmerPath = `farmers/${ubid}`;
  try {
    const batch = writeBatch(db);

    batch.set(
      doc(db, 'farmers', ubid),
      {
        totalDungKg: updatedFarmer.totalDungKg,
        totalStubbleKg: updatedFarmer.totalStubbleKg,
        walletBalance: updatedFarmer.walletBalance,
        bioSlurryQuotaLiters: updatedFarmer.bioSlurryQuotaLiters,
        environmentalImpact: updatedFarmer.environmentalImpact,
      },
      { merge: true }
    );

    batch.set(doc(db, 'farmers', ubid, 'ledger', entry.id), entry);
    batch.set(doc(db, 'farmers', ubid, 'smsLogs', sms.id), sms);
    batch.set(doc(db, 'villageStorage', 'current'), updatedStorage);

    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, farmerPath);
  }
}

// Persist a claimed Bio-Slurry Voucher
export async function persistBioSlurryVoucher(
  ubid: string,
  voucher: BioSlurryVoucher,
  sms: SmsLog,
  newQuota: number
) {
  const vPath = `farmers/${ubid}/vouchers/${voucher.id}`;
  try {
    const batch = writeBatch(db);

    batch.set(doc(db, 'farmers', ubid, 'vouchers', voucher.id), voucher);
    batch.set(doc(db, 'farmers', ubid, 'smsLogs', sms.id), sms);
    batch.set(
      doc(db, 'farmers', ubid),
      {
        bioSlurryQuotaLiters: newQuota,
      },
      { merge: true }
    );

    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, vPath);
  }
}

// Update buy rate in Firestore
export async function persistBiomassPrice(category: BiomassType, newRate: number) {
  const priceDocId = category.toLowerCase().replace(/[^a-z0-9]/g, '_');
  const path = `prices/${priceDocId}`;
  try {
    await updateDoc(doc(db, 'prices', priceDocId), {
      ratePerKg: newRate,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

// Update Village Storage Dispatch
export async function persistVillageStorage(storage: VillageStorage) {
  const path = 'villageStorage/current';
  try {
    await setDoc(doc(db, 'villageStorage', 'current'), storage);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}
