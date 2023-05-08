import axios from 'axios';

axios.defaults.withCredentials = true;
const url = process.env.REACT_APP_BASE_URL + '/debt/user';
export const fetchAllDebts = async (channelId, userId) => await axios.get(`${url}/${userId}?channelId=${channelId}`);
// export const createPlace = (newPlace, planId) => axios.post(`${url}/${planId}`, newPlace);
// export const fetchAllPlace = (planId) => axios.get(`${url}/all/${planId}`);
// export const updatePlace = (updatedPlace) => axios.put(`${url}/${updatedPlace._id}`, updatedPlace);
// export const fetchOnePlace = (placeId) => axios.get(`${url}/${placeId}`);
// export const deletePlace = (placeId) => axios.delete(`${url}/${placeId}`);