import axios from "axios";
import { baseURL } from "./axiosInstance";

export function checkAuth() {
    return new Promise((resolve, reject) => {
        axios.get(`${baseURL}/auth/token`, {
            withCredentials: true
        })
            .then(res => {

                resolve(res.data);
            }).catch(() => {
                reject();
            });
    })
}