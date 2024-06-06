import Swal from 'sweetalert2'
import axios from 'axios'

const BASE_URL = 'http://202.10.40.143:3000'

const apiRequest = async (method, url, data, headers) => {
    try {
        var config = {
            method: method,
            url: `${BASE_URL}${url}`,
            data: data,
            headers: headers
        };

        const response = await axios(config);
        return response;
    } catch (error) {
        console.error(`Error with ${method.toUpperCase()} request to ${url}:`, error.message);
        throw error;
    }
};

const handleToken = async () => {
    apiRequest('post', '/api/auth/refresh-token', {
        access_token:localStorage.getItem("access_token"),
        refresh_token:localStorage.getItem("refresh_token")
    },{
        "Content-Type": "application/json",
        Authorization : `Bearer ${localStorage.getItem("access_token")}`
    })
    .then(response => {
        const data = response.data
        localStorage.setItem('access_token', data.data.access_token);
        localStorage.setItem('refresh_token', data.data.refresh_token);
    })
    .catch(error => {
        if(error.response.status===401){
            console.log(error.response.data)
            localStorage.clear();
            Swal.fire({
                icon: 'error',
                title: 'Your session has expired',
                text: 'please relogin',
            });
            window.location.href = '/';
        }else{
            console.error('Error during refresh token:', error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong! Please try again later.',
            });
        }
    });
}

export { handleToken, apiRequest };