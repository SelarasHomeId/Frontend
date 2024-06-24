import axios from 'axios'
import Swal from 'sweetalert2'
import Cookies from 'js-cookie';

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
        if (url != '/api/auth/login' && headers.Authorization != undefined && error.response && error.response.status === 401) {
            console.error(`Error with ${method.toUpperCase()} request to ${url}: Unauthorized (401). Redirecting to login.`);
            localStorage.clear()
            Cookies.remove('token');
            window.location.href = '/';
            document.title = 'Hello Admin!';
            Swal.fire({
                icon: 'info',
                title: 'Your session has expired',
                text: 'Please re-login...',
            });
        } else {
            console.error(`Error with ${method.toUpperCase()} request to ${url}:`, error.message);
            throw error;
        }
    }
};

export { apiRequest }
