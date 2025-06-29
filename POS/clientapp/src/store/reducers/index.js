// third-party
import { combineReducers } from 'redux';

// project import
import menu from './menu';
import property from './property';
import users from './users'
import propertydetails from './propertydetails'
import { categoryApi } from './../../services/categoryApi'
import drawer from './drawer';

// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({ drawer, menu, property, users, propertydetails, categoryApi });

export default reducers;
