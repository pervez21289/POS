// types
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import PropertyService from './../../services/PropertyService';

// initial state
const initialState = {
  positionDetails: {
    lat: 30.2938312,
    lng: 78.06298795850616,
    locationName: ''
  },
  showLocation: false,
  showMapModal: false,
  search: '',
  selectedLocation: { page: 0, ptype: 0 },
  selectedMainLocation: null,
  params: {},
    properties: [],
    bProperties: [],
  userProperty: null
};

export const fetchProperties = createAsyncThunk('propertiesData/fetchProperties', async (params) => {
  const response = await PropertyService.getProperties(params);
  return response;
});

export const fetchPropertyBreadCrum = createAsyncThunk('propertiesData/fetchPropertyBreadCrum', async (params) => {
    const response = await PropertyService.getProperties(params);
    return response;
});

// ==============================|| SLICE - Accounts ||============================== //

const property = createSlice({
    name: 'property',
    initialState,
    reducers: {
        setSelectedPosition(state, action) {
            state.showLocation = action.payload.showLocation;

            if (action.payload.showMapModal !== undefined) state.showMapModal = action.payload.showMapModal;

            if (action.payload.positionDetails) state.positionDetails = action.payload.positionDetails;
        },

        setSearch(state, action) {
            return { ...state, search: action.payload.search };
        },
        locationSearch(state, action) {
            state.selectedLocation = { ...state.selectedLocation, ...action.payload };

            /*return { ...state, {...payload.selectedLocation, ...action.payload } }*/
        },
        locationMainSearch(state, action) {
            state.selectedMainLocation = { ...state.selectedMainLocation, ...action.payload };

            /*return { ...state, {...payload.selectedLocation, ...action.payload } }*/
        },
        setParams(state, action) {
            state.params = action.payload;
        },
        setShowMapModal(state, action) {
            state.showMapModal = action.payload.showMapModal;
        },
        setUserProperty(state, action) {
            state.userProperty = action.payload.userProperty;
        },
        setProperties(state, action) {
            state.properties = action.payload.properties;
            state.selectedLocation = { page: 0, ptype: 0 };
        }
    },
    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading state as needed
        builder.addCase(fetchProperties.fulfilled, (state, action) => {
            if (state.selectedLocation?.page == 0) {
                state.properties = action.payload;
            } else return { ...state, properties: [...state.properties, ...action.payload] };
        });
        builder.addCase(fetchPropertyBreadCrum.fulfilled, (state, action) => {
            return { ...state, bProperties: [...state.properties, ...action.payload] };
        });
    }
});

export default property.reducer;

export const { setSelectedPosition, setSearch, locationSearch, locationMainSearch, setShowMapModal, setUserProperty, setProperties } = property.actions;
