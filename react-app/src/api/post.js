import axios from 'axios';

axios.defaults.withCredentials = true;
const url = process.env.REACT_APP_BASE_URL + '/post';

export const fetchRandomPosts = () => axios.get(`${url}/random`);
export const fetchCurPost = (postid) => axios.get(`${url}/${postid}`);
export const fetchMyOwnedPosts = () => axios.get(`${url}/owned`);

export const createPost = (newPost) => {
    const { userid, ...body } = newPost;
    return (axios.post(`${url}`, body))
    // /${userid}
};

export const deletePost = (postid) => axios.delete(`${url}/${postid}`);
