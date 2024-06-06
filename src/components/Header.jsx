import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faEnvelopeOpen, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'

const Header = () => {
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
            try {
                const responseCount = await axios.get('http://202.10.40.143:3000/api/notification/count-unread',{
                    headers:{
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                    }
                });
                const responseData = await axios.get('http://202.10.40.143:3000/api/notification',{
                    headers:{
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                    }
                });
                setUnreadCount(responseCount.data.data.count_unread);
                setNotifications(responseData.data.data)
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications();
    }, []);

    const handleLogout = () => {
        fetch('http://202.10.40.143:3000/api/auth/logout', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
        })
        .then(response => {
        if (response.ok) {
            localStorage.clear();
            Swal.fire({
                icon: 'success',
                title: 'Logout Successful',
                text: 'Good Bye!',
            });
            navigate("/");
        } else {
            console.error('Failed logout');
        }
        })
        .catch(error => {
            console.error('Error during logout:', error);
        });
    };

    const handleClickNotification = (id) => {
        fetch(`http://202.10.40.143:3000/api/notification/set-read/${id}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
        })
        .then(response => {
        if (response.ok) {
            console.error('Success set read');
        } else {
            console.error('Error set read');
        }
        })
        .catch(error => {
            console.error('Error during set read:', error);
        });
    };

    return (
        <div className="absolute w-[1366px] h-[70px] top-0 bg-red-600 flex justify-end items-center px-4">
            <div className="relative" ref={dropdownRef}>
                <div className="relative cursor-pointer" onClick={toggleDropdown}>
                    <FontAwesomeIcon icon={faBell} className="text-white text-2xl animate-shake" />
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
                <div className="relative text-white py-2 px-4 rounded-lg">
                    Hello, {localStorage.getItem("name")}! 
                </div>
                {adminDropdownOpen && (
                    <div className="absolute left-4 mt-2 w-[210px] bg-white border border-gray-200 rounded-lg shadow-lg">
                        <ul className="py-1">
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Change Password</li>
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

export default Header;
