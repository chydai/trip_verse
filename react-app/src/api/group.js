import axios from 'axios';

axios.defaults.withCredentials = true;
const url = process.env.REACT_APP_BASE_URL + '/group';

export const fetchRandomGroups = () => axios.get(`${url}/random`);
export const fetchAllGroups = () => axios.get(`${url}/all`);

export const fetchCurGroup = (groupid) => axios.get(`${url}/${groupid}`);
export const fetchMyJoinedGroups = (targetId) => axios.get(`${url}/joined?targetId=${targetId}`);
export const fetchMyOwnedGroups = (targetId) => axios.get(`${url}/owned?targetId=${targetId}`);

export const createGroup = (newGroup) => {
    const { userid, ...body } = newGroup;
    return (axios.post(`${url}`, body))
    // /${userid}
};
export const updateGroup = (updatedGroup) => axios.put(`${url}/${updatedGroup._id}`, updatedGroup);
export const deleteGroup = (groupid) => axios.delete(`${url}/${groupid}`);
export const transferGroup = (groupid, userid) => axios.put(`${url}/transfer/${groupid}?targetId=${userid}`);
export const removeMemberFromGroup = (groupid, userid) => axios.put(`${url}/remove/${groupid}?targetId=${userid}`);

export const joinGroup = (groupid) => axios.put(`${url}/join/${groupid}`);
export const quitGroup = async (groupid) => { 
    return axios.put(`${url}/quit/${groupid}`)
    .catch(error => {
        // alert(error.response.data.message);
        throw new Error(error.response.data.message);
    });
    }

export const searchGroup = (name) => {
    return (axios.get(`${url}/search?name=${name}`))
};


export const likeGroup = (groupid) => axios.put(`${url}/like/${groupid}`);
export const dislikeGroup = (groupid) => axios.put(`${url}/dislike/${groupid}`);