import axios from 'axios';

axios.defaults.withCredentials = true;
const url = process.env.REACT_APP_BASE_URL + '/user';

export const getUser = (userId) => axios.get(`${url}/${userId}`);
export const updateUser = (newUser, userId) => (axios.put(`${url}/${userId}`, newUser));
export const deleteUser = (userId) => axios.delete(`${url}/${userId}`);
export const subUser = (userId) => axios.put(`${url}/sub/${userId}`);
export const unSubUser = (userId) => axios.put(`${url}/unsub/${userId}`)