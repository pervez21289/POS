import { useEffect } from 'react';
import { db } from '../data/db';
import { useCreateSaleMutation } from '../services/salesApi';

const SYNC_INTERVAL_MS = 10000;
const MAX_RETRIES = 3;

const useBillSync = () => {
    const [createSale] = useCreateSaleMutation();

    useEffect(() => {
        const syncBills = async () => {
            if (!navigator.onLine) {
                console.log('[Sync] Offline. Skipping...');
                return;
            }
         
            try {
                // 1. Fetch all bills and filter unsynced ones
                const allBills = await db.bills.toArray();
                const unsyncedBills = allBills.filter(bill => bill.isSynced !== true);

                if (unsyncedBills.length === 0) {
                    console.log('[Sync] No unsynced bills.');
                    return;
                }

                console.log(`[Sync] Found ${unsyncedBills.length} unsynced bills.`);

                // 2. Sync each bill
                for (const bill of unsyncedBills) {
                    try {
                        console.log(`[Sync] Sending bill ${bill.id}:`, bill.sales);
                        await createSale(bill.sales).unwrap();
                        await db.bills.update(bill.id, { isSynced: true });
                        console.log(`[Sync] Bill ${bill.id} synced.`);
                    } catch (err) {
                        console.error(`[Sync] Failed for bill ${bill.id}:`, err);

                        // Optional: track retries to avoid infinite retries
                        const retries = bill.retryCount || 0;
                        if (retries >= MAX_RETRIES) {
                            await db.bills.update(bill.id, { syncFailed: true });
                            console.warn(`[Sync] Bill ${bill.id} permanently failed.`);
                        } else {
                            await db.bills.update(bill.id, { retryCount: retries + 1 });
                        }
                    }
                }
            } catch (err) {
                console.error('[Sync] Unexpected error:', err);
            }
        };

        const interval = setInterval(syncBills, SYNC_INTERVAL_MS);
        console.log('[Sync] Auto-sync started.');

        return () => {
            clearInterval(interval);
            console.log('[Sync] Auto-sync stopped.');
        };
    }, [createSale]);
};

export default useBillSync;