import axios from 'axios';

axios.defaults.withCredentials = true;
const url = process.env.REACT_APP_BASE_URL + '/auth';
// new
// export const createUser = (newUser) => axios.post(`${url}/signup`, newUser);
export const createUser = async (newUser) => {
    return axios.post(`${url}/signup`, newUser)
        .catch(error => {
            throw new Error(error.response.data.message);
        });
};

export const logInUser = async (newUser) => {
    return axios.post(`${url}/signin`, newUser)
        .catch(error => {
            throw new Error(error.response.data.message);
        });
};
