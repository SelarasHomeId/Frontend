import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faEnvelopeOpen, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'
import PropTypes from 'prop-types';
import { apiRequest,handleToken } from '../services/api';

const Header = ({handleMenuClick}) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const dropdownRef = useRef(null);
    const adminDropdownRef = useRef(null);
    const navigate = useNavigate();
    
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
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            })
            .then(response => {
                const data = response.data
                setUnreadCount(data.data.count_unread);
            })
            .catch(error => {
                if (error.response.status!==401){
                    handleToken();
                    fetchNotifications();
                }else if (error.response.status!==422){
                    console.log(error.response.data)
                }else{
                    console.error('Error during get count unread:', error);    
                }
            });

            apiRequest('get', '/api/notification',null,{
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            })
            .then(response => {
                const data = response.data
                setNotifications(data.data);
            })
            .catch(error => {
                if (error.response.status!==401){
                    handleToken();
                    fetchNotifications();
                }else if (error.response.status!==422){
                    console.log(error.response.data)
                }else{
                    console.error('Error during get notifications:', error);    
                }
            });

        };

        fetchNotifications();
    }, []);

    const handleLogout = () => {

        apiRequest('post', '/api/auth/logout',null,{
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        })
        .then(response => {
            console.log(response.data)
            localStorage.clear();
            Swal.fire({
                icon: 'success',
                title: 'Logout Successful',
                text: 'Good Bye!',
            });
            navigate("/");
        })
        .catch(error => {
            if (error.response.status!==401){
                handleToken();
                handleLogout();
            }else if (error.response.status!==422){
                console.log(error.response.data)
            }else{
                console.error('Error during logout:', error);    
            }
        });

    };

    const handleClickNotification = async (id) => {

        apiRequest('patch', `/api/notification/set-read/${id}`,null,{
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        })
        .then(response => {
            console.log(response.data)

            apiRequest('get', '/api/notification/count-unread',null,{
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            })
            .then(response => {
                const data = response.data
                setUnreadCount(data.data.count_unread);

                apiRequest('get', '/api/notification',null,{
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                })
                .then(response => {
                    const data = response.data
                    setNotifications(data.data);
                })
                .catch(error => {
                    if (error.response.status!==401){
                        handleToken();
                        handleClickNotification();
                    }else if (error.response.status!==422){
                        console.log(error.response.data)
                    }else{
                        console.error('Error during get notifications:', error);    
                    }
                });

            })
            .catch(error => {
                if (error.response.status!==401){
                    handleToken();
                    handleClickNotification();
                }else if (error.response.status!==422){
                    console.log(error.response.data)
                }else{
                    console.error('Error during get count unread:', error);    
                }
            });

        })
        .catch(error => {
            if (error.response.status!==401){
                handleToken();
                handleClickNotification();
            }else if (error.response.status!==422){
                console.log(error.response.data)
            }else{
                console.error('Error during get count unread:', error);    
            }
        });
        
        setDropdownOpen(false);
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
};

export default Header;
