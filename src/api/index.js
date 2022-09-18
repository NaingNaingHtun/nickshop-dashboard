import axios from "axios";
const api = axios.create({
  baseURL: "https://stark-cove-80514.herokuapp.com/api",
  // baseURL: "http://192.168.100.15:5000/api",
});
export default api;
