import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faEnvelopeOpen, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'
import PropTypes from 'prop-types';
import { apiRequest } from '../services/useApi';
import notifSound from '../assets/notif_sound.ogg'
import Cookies from 'js-cookie';

const Header = ({handleMenuClick,onViewNotificationDetail}) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const dropdownRef = useRef(null);
    const adminDropdownRef = useRef(null);
    const navigate = useNavigate();
    const audioRef = useRef(new Audio(notifSound));
    
    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };
    
    const toggleAdminDropdown = () => {
        setAdminDropdownOpen(!adminDropdownOpen);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setDropdownOpen(false);
        }
        if (adminDropdownRef.current && !adminDropdownRef.current.contains(event.target)) {
            setAdminDropdownOpen(false);
          }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const fetchNotifications = async () => {

            apiRequest('get', '/api/notification/count-unread',null,{
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            })
            .then(response => {
                const data = response.data
                setUnreadCount(data.data.count_unread);

                if (data.data.count_unread > 0) {
                    document.title = `(${data.data.count_unread}) Hello Admin!`;
                    if (audioRef.current) {
                        audioRef.current.play();
                    }
                } else {
                    document.title = 'Hello Admin!';
                }
            })
            .catch(error => {
                console.error('Error during get count unread:', error);    
                Swal.fire({
                    icon: 'error',
                    title: 'Fetch count unread notification error',
                    text: error.response.data.meta.message,
                });
            });

            apiRequest('get', '/api/notification',null,{
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            })
            .then(response => {
                const data = response.data
                setNotifications(data.data);
            })
            .catch(error => {
                console.error('Error during fetch notification:', error);    
                Swal.fire({
                    icon: 'error',
                    title: 'Fetch notification error',
                    text: error.response.data.meta.message,
                });
            });

        };

        fetchNotifications();
    }, []);

    const handleLogout = () => {

        apiRequest('post', '/api/auth/logout',null,{
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        })
        .then(response => {
            console.log(response.data.meta)
            localStorage.clear();
            Cookies.remove('token');
            navigate("/");
            document.title = 'Hello Admin!';
            Swal.fire({
                icon: 'success',
                title: 'Logout Successful',
                text: 'Good Bye!',
            });
        })
        .catch(error => {
            console.error('Error during logout:', error);    
            localStorage.clear();
            Cookies.remove('token');
            navigate("/");
            document.title = 'Hello Admin!';
            Swal.fire({
                icon: 'error',
                title: 'Logout error, please re-login',
                text: error.response.data.meta.message,
            });
        });

    };

    const handleClickNotification = async (id) => {

        apiRequest('patch', `/api/notification/set-read/${id}`,null,{
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        })
        .then(response => {
            console.log(response.data)

            apiRequest('get', '/api/notification/count-unread',null,{
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            })
            .then(response => {
                const data = response.data
                setUnreadCount(data.data.count_unread);

                if (data.data.count_unread > 0) {
                    document.title = `(${data.data.count_unread}) Hello Admin!`;
                } else {
                    document.title = 'Hello Admin!';
                }

                apiRequest('get', '/api/notification',null,{
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                })
                .then(response => {
                    const data = response.data
                    setNotifications(data.data);

                    apiRequest('get', `/api/notification/${id}`,null,{
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    })
                    .then(response => {
                        const data = response.data

                        const module = data.data.module
                        const dataId = data.data.data_id

                        onViewNotificationDetail(module,dataId);
                        
                    })
                    .catch(error => {
                        console.error('Error during get detail notification:', error);    
                        Swal.fire({
                            icon: 'error',
                            title: 'Get Detail Notification failed',
                            text: error.response.data.meta.message,
                        });
                    });

                })
                .catch(error => {
                    console.error('Error during fetch notification:', error);    
                    Swal.fire({
                        icon: 'error',
                        title: 'Fetch notification error',
                        text: error.response.data.meta.message,
                    });
                });

            })
            .catch(error => {
                console.error('Error during get count unread:', error);    
                Swal.fire({
                    icon: 'error',
                    title: 'Fetch count unread notification error',
                    text: error.response.data.meta.message,
                });
            });

        })
        .catch(error => {
            console.error('Error during set-read:', error);    
            Swal.fire({
                icon: 'error',
                title: 'Set read notification error',
                text: error.response.data.meta.message,
            });
        });
        
        setDropdownOpen(false);
    };

    const handleResetPassword = (id) => {

        Swal.fire({
            icon: "warning",
            title: "Password will be reset, confirm action?",
            showCancelButton: true,
            confirmButtonText: "Confirm",
        }).then((result) => {
            if (result.isConfirmed) {

                apiRequest('post', `/api/auth/reset-password/${id}`,null,{
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                })
                .then(response => {
                    console.log(response.data)
                    Swal.fire({
                        icon: 'success',
                        title: 'Successfully reset the password!',
                        text: response.data.data.message,
                    });
                })
                .catch(error => {
                    console.error('Error during reset password:', error);    
                    Swal.fire({
                        icon: 'error',
                        title: 'Reset password failed',
                        text: error.response.data.meta.message,
                    });
                });

            }
        });

    };

    return (
        <div className="absolute w-[1116px] left-[250px] h-[90px] top-0 bg-red-600 flex justify-end items-center px-4">
            <div className="relative" ref={dropdownRef}>
                <div className="relative cursor-pointer" onClick={toggleDropdown}>
                    <FontAwesomeIcon icon={faBell} className={ unreadCount == 0 ? "text-white text-2xl" : "text-white text-2xl animate-shake"} />
                    {unreadCount > 0 && (
                        <span className="absolute bottom-4 left-3 h-5 w-5 bg-blue-500 rounded-full ring-2 ring-white text-xs text-white flex items-center justify-center">
                            {unreadCount}
                        </span>
                    )}
                </div>
                {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-[400px] text-sm max-h-[300px] overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg">
                        <ul className="px -1">
                            {notifications.map(notification => (
                                <li key={notification.id} className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center" onClick={() => handleClickNotification(notification.id)}>
                                    {notification.is_read ? (
                                        <span className="mr-2">
                                            <FontAwesomeIcon icon={faEnvelopeOpen} className="text-green-500 text-3xl" />
                                        </span>
                                    ) : (
                                        <span className="mr-2">
                                            <FontAwesomeIcon icon={faEnvelope} className="text-red-500 text-3xl" />
                                        </span>
                                    )}
                                    <span>
                                        {notification.title}<br/>  
                                        <span className='text-xs'>
                                            {notification.message}
                                        </span>
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
            <div className="relative ml-4">
                <div className="relative text-white py-2 px-4 rounded-lg text-lg font-bold">
                    Hello, {localStorage.getItem("name")}! 
                </div>
                {adminDropdownOpen && (
                    <div className="absolute left-4 mt-2 w-[285px] bg-white border border-gray-200 rounded-lg shadow-lg">
                        <ul className="py-1">
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onMouseDown={() => handleMenuClick("ChangePassword")}>Change Password</li>
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onMouseDown={() => handleResetPassword(localStorage.getItem("id"))}>Reset Password</li>
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onMouseDown={handleLogout}>Logout</li>
                        </ul>
                    </div>
                )}
            </div>
            <div className="relative" ref={adminDropdownRef}>
                <div className="relative cursor-pointer bg-blue-500 text-white text-lg font-bold py-2 px-4 rounded-lg flex items-center justify-center" onClick={toggleAdminDropdown}>{localStorage.getItem("name").charAt(0)}</div>
            </div>
        </div>
    );
};

Header.propTypes = {
    handleMenuClick: PropTypes.func.isRequired,
    onViewNotificationDetail: PropTypes.func.isRequired
};

export default Header;
