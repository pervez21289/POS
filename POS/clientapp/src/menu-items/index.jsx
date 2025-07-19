import dashboard from './dashboard';
import pages from './page';
import utilities from './utilities';
import support from './support';

let menuItems = { items: [] };

try {
    const storedMenus = localStorage.getItem('userDetails');
    debugger;
    if (storedMenus) {
        const menuItemsData = JSON.parse(storedMenus)?.menus;
        menuItems.items = JSON.parse(menuItemsData).items;
    }
} catch (e) {
    console.error('Error loading menu items from localStorage', e);
}

// ==============================|| MENU ITEMS ||============================== //

const menuItemss = {
  items: [dashboard, pages, utilities, support]
};

console.log("first",menuItemss);

console.log("mainmenuutems", menuItems);

export default menuItems;
