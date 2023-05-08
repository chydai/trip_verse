import axios from "axios";

axios.defaults.withCredentials = true;
const url = process.env.REACT_APP_BASE_URL + "/debt/user";
export const fetchAllDebts = async (channelId, userId) =>
  await axios.get(`${url}/${userId}?channelId=${channelId}`);
