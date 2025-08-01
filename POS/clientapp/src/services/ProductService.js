import axios from "axios";
import Config from "./config";
import Auth from "./Auth";
const url = Config.baseurl;

class ProductService {
    constructor() { }

   

    GetProduct = async (query) => {
        const res = await axios.get(`${url}products/search?q=${encodeURIComponent(query)}`, {
            headers: Auth.getHeader()
        });
        return res.data;
    };

    SaveLocation = async (contact) => {
        const res = await axios.post(`${url}SaveLocation`, contact,{
            headers: Auth.getHeader()
        });
        return res.data;
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

export default new ProductService();
