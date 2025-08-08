import axios from "axios";
import Config from "./config";
import Auth from "./Auth";
const url = Config.baseurl;

class PaymentService {
    constructor() { }


    CreateOrder = async (order) => {

        const res = await axios.post(`${url}Payment/create-order`, order, {
            headers: Auth.getHeader()
        });
        return res.data;
    };

    VerifyOrder = async (payment) => {

        const res = await axios.post(`${url}Payment/verify`, payment, {
            headers: Auth.getHeader()
        });
        return res.data;
    };

}

export default new PaymentService();
