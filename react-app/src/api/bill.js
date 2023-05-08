import axios from 'axios';

axios.defaults.withCredentials = true;
const url = process.env.REACT_APP_BASE_URL + '/bill';

export const createBill = (newBill) => {
    const { datePlanId, ...body } = newBill;
    return (axios.post(`${url}/${datePlanId}`, body))
  };
  
  export const getAllBillbyChannel = (channelId) => axios.get(`${url}/all?channelId=${channelId}`)
  export const getAllBillbyDatePlan = (datePlanId) => axios.get(`${url}/all?datePlanId=${datePlanId}`)
  export const getBill = (billId) => axios.get(`${url}/${billId}`)
  export const updateBill = (updatedBill) => axios.put(`${url}/${updatedBill._id}`, updatedBill)
  export const deleteBill = (billId) => axios.delete(`${url}/${billId}`)
