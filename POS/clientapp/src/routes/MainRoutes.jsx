import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// render- Dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/default')));

// render - color
const Color = Loadable(lazy(() => import('pages/component-overview/color')));
const Typography = Loadable(lazy(() => import('pages/component-overview/typography')));
const Shadow = Loadable(lazy(() => import('pages/component-overview/shadows')));
const CategoryPage = Loadable(lazy(() => import('pages/categories/CategoryPage')));
import ProductPage from './../pages/product/ProductPage';
import Sales from './../pages/sales/SalesPOSPage';
import SalesGrid from './../pages/sales/SalesGrid';


// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/sample-page')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <DashboardLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
      },
      {
          path: 'category',
          element: <CategoryPage />
      },
      {
          path: 'product',
          element: <ProductPage />
      },
    {
        path: 'sales',
        element: <Sales />
    },
    {
      path: 'invoice',
        element: <SalesGrid />
    },
    {
      path: 'shadow',
      element: <Shadow />
    },
    {
      path: 'sample-page',
      element: <SamplePage />
    }
  ]
};

export default MainRoutes;
