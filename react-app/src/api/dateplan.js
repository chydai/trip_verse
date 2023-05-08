import axios from 'axios';

axios.defaults.withCredentials = true;
const url = process.env.REACT_APP_BASE_URL + '/dateplan';

export const createDatePlan = (newPlan, channelId) => axios.post(`${url}/${channelId}`, newPlan);
export const fetchAllPlan = (channelId) => axios.get(`${url}/all/${channelId}`);
export const updatePlan = (updatedPlan) => axios.put(`${url}/${updatedPlan._id}`, updatedPlan);
export const fetchOnePlan = (planId) => axios.get(`${url}/${planId}`);
export const deletePlan = (planId) => axios.delete(`${url}/${planId}`);