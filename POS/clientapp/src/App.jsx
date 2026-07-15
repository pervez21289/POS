import { RouterProvider } from 'react-router-dom';

// project imports
import router from 'routes';
import ThemeCustomization from 'themes';

import ScrollTop from 'components/ScrollTop';
import useBillSync from './hooks/useBillSync'; 

// ==============================|| APP - THEME, ROUTER, LOCAL ||============================== //

export default function App() {
  useBillSync();
  return (
    <ThemeCustomization>
      <ScrollTop>
        <RouterProvider router={router} />
      </ScrollTop>
    </ThemeCustomization>
  );
}
