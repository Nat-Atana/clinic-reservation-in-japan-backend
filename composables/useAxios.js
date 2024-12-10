import axios from 'axios';

const devURL = 'http://localhost:3002/api';

export const useAxios = () => {
    const getBaseURL = () => {
        const hostname = window.location.hostname;
        if (hostname.includes("localhost")) {
            return devURL;
        } else {
            return "http://" + hostname + "/api";
        }
    };

    const axiosInstance = axios.create({
        baseURL: getBaseURL(),
    });
    
    return axiosInstance;
};