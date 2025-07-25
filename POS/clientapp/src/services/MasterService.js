import axios from "axios";
import Config from "./config";
import Auth from "./Auth";
const url = Config.baseurl;

class MasterService {
    constructor() { }

    getLocations = async (event) => {
       
        const res = await axios.get(`${url}GetLocations?Search=${event.target.value}`);
        return res.data;
    };

    getCities = async () => {
       
        const res = await axios.get(`${url}GetCities`);
        return res.data;
    };
    
}

export default new MasterService();
