import axios from "axios";
import Config from "./config";
import Auth from "./Auth";
const url = Config.baseurl;

class SaleService {
    constructor() { }

   

    GetSales = async (params) => {
        const res = await axios.get(`${url}Sales`, { params: params, headers: Auth.getHeader() });
        return res.data;
    };

    GetSalesById = async (query) => {
        const res = await axios.get(`${url}Sales/GetSalesById/${query}`, {
            headers: Auth.getHeader()
        });
        return res.data;
    };

    GetCustomerByNumber = async (query) => {
        const res = await axios.get(`${url}Sales/GetCustomerByNumber/${query}`, {
            headers: Auth.getHeader()
        });
        return res.data;
    };

    getMonthlySales = async () => {
        const response = await axios.get(`${url}Sales/GetMonthlySalesSummary`, {
            headers: Auth.getHeader()
        });
        return response.data;
    };

    SaveProperty = async (property) => {
     
        const res = await axios.post(`${url}SaveProperty`, property,{
            headers: Auth.getHeader()
        } );
        return res.data;
    };

    getProperties = async (params) => {
        const res = await axios.post(`${url}GetProperties`, params);
        return res.data;
    };


    SaveWishList = async (UserId,PropertyId) => {

        const res = await axios.post(`${url}SaveWishList`, { UserId:UserId, PropertyId:PropertyId } , {
            headers: Auth.getHeader()
        });
        return res.data;
    };


    SavePhoto = async (property) => {

        const res = await axios.post(`${url}SavePhoto`, property, {
            headers: Auth.getHeader()
        });
        return res.data;
    };

}

export default new SaleService();
