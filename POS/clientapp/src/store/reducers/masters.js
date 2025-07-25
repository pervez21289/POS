// types
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import MasterService from "./../../services/MasterService";

// initial state
const initialState = {
    leadStatusDetails: {},
    search: ''
};

export const fetchLeadStatus = createAsyncThunk(
    "leadStatusData/fetchLeadStatus",
    async () => {
        const response = await MasterService.GetStatus();
        return response;
    }
);

export const fetchIndustryType = createAsyncThunk(
    "industryTypeData/fetchIndutryType",
    async () => {
        const response = await MasterService.GetIndustryType();
        return response;
    }
);

export const fetchBusinessType = createAsyncThunk(
    "businessTypeData/fetchBusinessType",
    async () => {
         
        const response = await MasterService.GetBusinessType();
        return response;
    }
);

export const fetchBrand = createAsyncThunk(
    "brandData/fetchBrand",
    async () => {
         
        const response = await MasterService.GetBrands();
        return response;
    }
);

export const fetchLeadType = createAsyncThunk(
    "leadTypeData/fetchLeadType",
    async () => {

        const response = await MasterService.GetLeadType();
        return response;
    }
);

export const fetchLeadCategory = createAsyncThunk(
    "leadCategoryData/fetchLeadCategory",
    async () => {

        const response = await MasterService.GetLeadCategory();
        return response;
    }
);

export const fetchLeadSource = createAsyncThunk(
    "leadSourceData/fetchLeadSource",
    async () => {

        const response = await MasterService.GetLeadSource();
        return response;
    }
);




// ==============================|| SLICE - Accounts ||============================== //

const masters = createSlice({
    name: "masters",
    initialState,
    reducers: {
        setSelectedStatus(state, action) {
            state.leadStatusDetails = action.payload.leadStatusDetails;
        },
        setSelectedIndustry(state, action) {
            state.insdustryTypeDetails = action.payload.insdustryTypeDetails;
        },
        setSelectedBusiness(state, action) {
            state.businessTypeDetails = action.payload.businessTypeDetails;
        },
        setSelectedBrand(state, action) {
            state.brandDetails = action.payload.brandDetails;
        },
        setSearch(state, action) {
            return { ...state, search: action.payload.search };
        },
    },
    extraReducers: (builder) => {
       
        builder.addCase(fetchLeadStatus.fulfilled, (state, action) => {
           
            return { ...state, leadStatusData: action.payload };
        });

        builder.addCase(fetchIndustryType.fulfilled, (state, action) => {
          
            return { ...state, industryTypeData: action.payload };
        });

        builder.addCase(fetchBusinessType.fulfilled, (state, action) => {
            
            return { ...state, businessTypeData: action.payload };
        });

        builder.addCase(fetchBrand.fulfilled, (state, action) => {

            return { ...state, brandData: action.payload };
        });

        builder.addCase(fetchLeadType.fulfilled, (state, action) => {

            return { ...state, leadTypeData: action.payload };
        });


        builder.addCase(fetchLeadCategory.fulfilled, (state, action) => {

            return { ...state, leadCategoryData: action.payload };
        });

        builder.addCase(fetchLeadSource.fulfilled, (state, action) => {

            return { ...state, leadSourceData: action.payload };
        });
    }
});

export default masters.reducer;

export const { setSelectedStatus, setSearch, setSelectedIndustry, setSelectedBusiness, setSelectedBrand } = masters.actions;
