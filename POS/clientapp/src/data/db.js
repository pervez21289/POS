import Dexie from 'dexie';

export const db = new Dexie('RestaurantPOS');

db.version(1).stores({
    bills: '++id, isSynced',
    products: 'productID, name, category, price',
    settings:'id'
});


export const saveProducts = async (products) => {
    await db.products.clear();
    await db.products.bulkPut(products);
};

export const getProducts = async () => {
    
return await db.products.toArray();
 
};


export const saveSettings = async (settings) => {
    await db.settings.clear();
    await db.settings.add(settings);
};

export const getSettings = async (settings) => {
    return await db.settings.toCollection().first();
};