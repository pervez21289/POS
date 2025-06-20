import axios from 'axios';
import Config from './config';
import Auth from './Auth';
const url = Config.baseurl;

class UserService {
  constructor() {}

  SaveUser = async (user) => {
    const res = await axios.post(`${url}SaveUser`, user);
    return res.data;
  };

  SaveMessage = async (message) => {
    const res = await axios.post(`${url}SaveMessage`, message);
    return res.data;
  };

  ValidateOTP = async (user) => {
    const res = await axios.post(`${url}ValidateOTP`, user);
    return res.data;
  };

  getProperties = async (params) => {
    const res = await axios.post(`${url}GetProperties`, params);
    return res.data;
  };

  GetMessages = async (userId) => {
    const res = await axios.get(`${url}GetMessages?UserId=${userId}`);
    return res.data;
  };

  getUser = async (userId) => {
    const res = await axios.get(`${url}GetUser?UserId=${userId}`);
    return res.data;
  };

  getProperty = async (propertyId) => {
    const res = await axios.get(`${url}GetProperty?propertyId=${propertyId}`);
    return res.data;
  };

  getPropertyFiles = async (propertyId) => {
    const res = await axios.get(`${url}GetPropertyFiles?propertyId=${propertyId}`);
    return res.data;
  };

  updateUser = async (user) => {
    const res = await axios.post(`${url}UpdateUser`, user, {
      headers: Auth.getHeader()
    });
    return res.data;
  };

  getWishList = async (userId) => {
    const res = await axios.get(`${url}GetWishList?userId=${userId}`, {
      headers: Auth.getHeader()
    });
    return res.data;
  };

  getUserProperties = async (userId) => {
    const res = await axios.get(`${url}GetUserProperties?userId=${userId}`, {
      headers: Auth.getHeader()
    });
    return res.data;
    };


    deletePhoto = async (imageUrl) => {
        const res = await axios.get(`${url}DeletePhoto?ImageUrl=${imageUrl}`, {
            headers: Auth.getHeader()
        });
        return res.data;
    };
}

export default new UserService();
