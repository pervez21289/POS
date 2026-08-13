import { RouterProvider } from 'react-router-dom';

// project imports
import router from 'routes';
import ThemeCustomization from 'themes';

import ScrollTop from 'components/ScrollTop';
import useBillSync from './hooks/useBillSync';
import { useProductSync } from './hooks/useProductSync';

// ==============================|| APP - THEME, ROUTER, LOCAL ||============================== //

export default function App() {
    useProductSync();
  useBillSync();
  return (
    <ThemeCustomization>
      <ScrollTop>
        <RouterProvider router={router} />
      </ScrollTop>
    </ThemeCustomization>
  );
}
