

import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import { useDispatch, useSelector } from 'react-redux';
import { openDrawer } from './../store/reducers/drawer';

export default function DrawerComponent({ component}) {

  const dispatch = useDispatch();
  const { drawerOpen } = useSelector((state) => state.drawer);
  
  return (
    <div>
     
          <Drawer
              anchor='right'
            open={drawerOpen}
             onClose={()=>dispatch(openDrawer(!drawerOpen))}
              style={{ zIndex: 1250 }}
              PaperProps={{
                  sx: {
                      width: '50vw',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center'
                  }
              }}
          >
          {component}
          </Drawer>
    
    </div>
  );
}