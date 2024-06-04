import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Home = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const dummyUserData = {
          username: localStorage.getItem("username"),
          email: localStorage.getItem("email"),
    };
    setUserData(dummyUserData);
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
        console.error('Gagal logout');
      }
    })
    .catch(error => {
      console.error('Error during logout:', error);
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong! Please try again later.',
        });
    });
  };

  return (
    <div className="text-center mb-4 text-lg font-bold">
        <h1>Hello!</h1>
        {userData && (
            <div>
                <p>Username: {userData.username}</p>
                <p>Email: {userData.email}</p>
            </div>
        )}
        <button className="btn btn-danger mt-3" onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default Home
