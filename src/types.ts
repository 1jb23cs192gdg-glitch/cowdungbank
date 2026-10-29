/**
 * Types for PUNARNAVA - Rural Cow Dung & Agri-Biomass Bank
 * SIH26195 / Problem Statement: T2A - Trash-to-Ayurveda (Rural Agri-Biomass Edition)
 * STRICT SCOPE: Only Cattle Dung and Agricultural Crop Residue / Stubble.
 */

export type BiomassType =
  | 'Cattle Dung'
  | 'Crop Residue / Stubble'
  | 'Agri-Husk / Straw';

export type QualityGrade =
  | 'Grade A - Optimal Moisture (<20%)'
  | 'Grade B - Medium Moisture (20-35%)'
  | 'Grade C - High Moisture (>35%)';

export interface PriceRecord {
  category: BiomassType;
  ratePerKg: number;
  unit: string;
  energyYield: string;
  fertilizerYield: string;
}

export interface LedgerEntry {
  id: string;
  receiptNo: string;
  dateTime: string;
  biomassType: BiomassType;
  weightKg: number;
  qualityGrade: QualityGrade;
  ratePerKg: number;
  walletCredit: number;
  bioSlurryQuotaEarnedLiters: number;
  loggedByManager: string;
  adminId: string;
}

export interface SmsLog {
  id: string;
  timestamp: string;
  sender: string;
  message: string;
  status: 'Delivered';
}

export interface BioSlurryVoucher {
  id: string;
  code: string;
  quantityLiters: number;
  issueDate: string;
  expiryDate: string;
  status: 'Available' | 'Redeemed';
  collectionHub: string;
}

export interface EnvironmentalImpact {
  stubbleBurningAvoidedKg: number;
  co2AvertedKg: number;
  soilHumusRestoredSqM: number;
  methaneCapturedCubicM: number;
}

export interface FarmerProfile {
  ubid: string; // 10-Digit Unique Biomass ID
  name: string;
  phone: string;
  village: string;
  gramPanchayat: string;
  district: string;
  state: string;
  totalDungKg: number;
  totalStubbleKg: number;
  walletBalance: number;
  bioSlurryQuotaLiters: number;
  environmentalImpact: EnvironmentalImpact;
  ledger: LedgerEntry[];
  smsLogs: SmsLog[];
  vouchers: BioSlurryVoucher[];
  ownerUid?: string;
  email?: string;
}

export interface VillageStorage {
  currentTonnes: number;
  thresholdTonnes: number;
  villageCenter: string;
  centerId: string;
  holdingDungKg: number;
  holdingStubbleKg: number;
  lastDispatchDate: string;
  activeDispatch: {
    dispatchId: string;
    vehicleType: string;
    vehicleNo: string;
    driverName: string;
    driverPhone: string;
    destinationCBGPlant: string;
    status: 'Scheduled' | 'Tractor Dispatched' | 'Loading at Center' | 'En Route CBG Refinery';
    allocatedTonnes: number;
    etaMinutes: number;
  } | null;
}

export interface AdminProfile {
  adminId: string;
  name: string;
  role: string;
  centerName: string;
  centerCode: string;
  taluka: string;
  district: string;
  email?: string;
  uid?: string;
}

