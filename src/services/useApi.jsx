import axios from 'axios'
import Swal from 'sweetalert2'

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
        if (error.response && error.response.status === 401) {
            console.error(`Error with ${method.toUpperCase()} request to ${url}: Unauthorized (401). Redirecting to login.`);
            localStorage.clear()
            Swal.fire({
                icon: 'success',
                title: 'Logout Successful',
                text: 'Good Bye!',
            });
            window.location.href = '/';
        } else {
            console.error(`Error with ${method.toUpperCase()} request to ${url}:`, error.message);
        }
        throw error;
    }
};

export { apiRequest }
