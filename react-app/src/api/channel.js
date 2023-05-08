import axios from 'axios';

axios.defaults.withCredentials = true;
const url = process.env.REACT_APP_BASE_URL + '/channel';


export const createChannel = (newChannel) => {
  const { groupid, ...body } = newChannel;
  return (axios.post(`${url}/${groupid}`, body))
  // /${userid}
};

export const joinChannel = (channelId) => axios.put(`${url}/join/${channelId}`)
export const quitChannel = (channelId) => axios.put(`${url}/quit/${channelId}`)
export const editChannel = (updatedChannel) => axios.put(`${url}/${updatedChannel._id}`, updatedChannel)
export const getChannel = (channelId) => axios.get(`${url}/${channelId}`)
export const deleteChannel = (channelId) => axios.delete(`${url}/${channelId}`)
export const fetchMyOwnedChannels = (groupid) => axios.get(`${url}/owned/${groupid}`);
export const fetchMyJoinedChannels = (groupid) => axios.get(`${url}/joined/${groupid}`)
export const removeMember = (channelId, userId) => axios.put(`${url}/remove/${channelId}?targetId=${userId}`)