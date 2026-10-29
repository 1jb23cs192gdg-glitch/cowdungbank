# Security Specification: PUNARNAVA Rural Cow Dung & Agri-Biomass Bank

## 1. Data Invariants
1. **Admin Master Gate**: The primary bootstrap administrator is `jagannatha.jvm@gmail.com` or users with records in `/admins/{uid}`. Only authenticated admins may log deposits into any farmer's ledger, adjust prices, or dispatch logistics.
2. **Farmer Self-Access**: A farmer can read their own profile, ledger, vouchers, and SMS logs (matched by `request.auth.uid == resource.data.ownerUid` or `request.auth.token.email == resource.data.email` or when authenticated as an admin).
3. **Public Read for Prices & Storage Status**: Village biomass buying rates and aggregate storage levels are publicly viewable to guarantee full transparency across all farming communities.
4. **Immutable Ledger Transactions**: Once written, a `LedgerEntry` cannot be modified or deleted by anyone to preserve anti-fraud accounting integrity.
5. **Voucher Claim & Redemption**: Farmers can create a voucher request from their earned bio-slurry quota; once redeemed, it cannot be changed.
6. **Key & Type Hardening**: All inputs enforce strict boundaries, ID lengths, and allowed field lists to avoid shadow injection attacks.

## 2. The Dirty Dozen Payloads
1. **Unauthenticated Deposit Log Injection**: Anonymous attacker attempting to write a fake `tx-999` to `/farmers/8431413473/ledger/tx-fake`. Expected: PERMISSION_DENIED.
2. **Farmer Self-Credit Fraud**: Authenticated farmer setting their own `walletBalance` to ₹999999. Expected: PERMISSION_DENIED.
3. **Tampering with Ledger Records**: Attendant attempting to update an existing `LedgerEntry` weight from 50kg to 500kg. Expected: PERMISSION_DENIED.
4. **Negative Weight / Zero Rate Attack**: Admin payload with `weightKg: -50`. Expected: PERMISSION_DENIED.
5. **Urban Plastic / Scrap Stream Injection**: Attempting to log `biomassType: "Plastic Bottle Waste"`. Expected: PERMISSION_DENIED.
6. **Arbitrary ID Poisoning**: Trying to create document at `/farmers/../../../etc/passwd` or using 10KB string ID. Expected: PERMISSION_DENIED.
7. **PII Harvesting / Cross-Farmer Snooping**: Farmer A trying to query and read Farmer B's private vouchers and SMS records. Expected: PERMISSION_DENIED.
8. **Price Gouging Spoof**: Non-admin user writing to `/prices/cattle_dung`. Expected: PERMISSION_DENIED.
9. **Logistics Reset Spoof**: Non-admin resetting `/villageStorage/current` storage to zero. Expected: PERMISSION_DENIED.
10. **Shadow Key Ghost Field Attack**: Sending extra `{ isSuperAdmin: true }` inside a profile write. Expected: PERMISSION_DENIED.
11. **Email Spoof Attack without Verification**: User with unverified email attempting admin operations. Expected: PERMISSION_DENIED.
12. **Voucher Value Overdraw**: Requesting a voucher exceeding available quota. Expected: PERMISSION_DENIED.
