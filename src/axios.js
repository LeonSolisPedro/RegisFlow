import axios from "axios";


axios.defaults.baseURL = import.meta.env.VITE_API


const token = localStorage.getItem("token")
if(token)
  axios.defaults.headers.common = {'Authorization': `bearer ${token}`}

axios.interceptors.response.use(
  (response) => response, // If the response is successful, just return it
  (error) => {
    if (error.response && error.response.status === 401 && window.location.pathname !== "/login") {
      // Redirect to login page on 401 error
      window.location.href = '/login'; // Redirect using window.location.href
      axios.defaults.headers.common = {}
      localStorage.clear()
    }
    return Promise.reject(error); // Return the error to be handled elsewhere
  }
);