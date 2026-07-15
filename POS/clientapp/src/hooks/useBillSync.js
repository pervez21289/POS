// src/hooks/useBillSync.js
import { useEffect } from 'react';
import { db } from '../data/db';
import { useCreateSaleMutation } from '../services/salesApi'; // adjust path if needed
import { useGetProductsQuery } from '../services/productApi';

const SYNC_INTERVAL_MS = 10000;

const useBillSync = () => {
    const [createSale] = useCreateSaleMutation(); // RTK Mutation Hook

    useEffect(() => {
        const syncBills = async () => {
           
            if (!navigator.onLine) {
                console.log('[Sync] Offline. Skipping sync...');
                return;
            }

            try {
                //const unsyncedBills = await db.bills.where('isSynced').toArray();

                const billData = await db.bills.toArray();
                const unsyncedBills = billData.filter(x => x.isSynced === false)
                    

                if (unsyncedBills.length === 0) {
                    console.log('[Sync] No bills to sync.');
                    return;
                }

                console.log(`[Sync] Found ${unsyncedBills.length} unsynced bills. Syncing...`);

                for (const bill of unsyncedBills) {
                    try {
                        await createSale(bill.sales).unwrap(); // RTK Query mutation call
                        await db.bills.update(bill.id, { isSynced: true });
                        console.log(`[Sync] Bill ${bill.id} synced successfully.`);
                    } catch (err) {
                        console.error(`[Sync] Failed to sync bill ${bill.id}:`, err.message);
                    }
                }
            } catch (err) {
                console.error('[Sync] Unexpected sync error:', err);
            }
        };

        const interval = setInterval(syncBills, SYNC_INTERVAL_MS);
        console.log('[Sync] Auto-sync started.');

        return () => {
            clearInterval(interval);
            console.log('[Sync] Auto-sync stopped.');
        };
    }, [createSale]); // Include mutation in dependency array
};

export default useBillSync;
