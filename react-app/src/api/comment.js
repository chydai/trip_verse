import axios from 'axios';

axios.defaults.withCredentials = true;
const url = process.env.REACT_APP_BASE_URL + '/comment';

export const createComment = (newComment) => {
    return (axios.post(`${url}/${newComment.placeId}`, newComment))
};
export const fetchCommentByPlace = (placeId) => axios.get(`${url}/${placeId}`);
// export const fetchCommentByUser = (userId) => axios.get(`${url}/${userId}`);
export const deleteCommentById = (commentId) => axios.delete(`${url}/${commentId}`)
