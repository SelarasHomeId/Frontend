import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Logo from '../assets/bg-login.png'
import LogoSelaras from '../assets/logo-selaras.png'
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Login = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleSignIn = async () => {
        try {
            const response = await fetch('https://202.10.40.143:3000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('access_token', data.data.access_token);
                localStorage.setItem('refresh_token', data.data.refresh_token);
                localStorage.setItem('id', data.data.id);
                localStorage.setItem('name', data.data.name);
                localStorage.setItem('email', data.data.email);
                localStorage.setItem('username', data.data.username);
                Swal.fire({
                    icon: 'success',
                    title: 'Login Successful',
                    text: 'Welcome!',
                });
                navigate("/home");
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Login Failed',
                    text: 'Invalid username or password!',
                });
            }
        } catch (error) {
            console.error('Error during login:', error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong! Please try again later.',
            });
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSignIn();
        }
    };

  return (
    <>
        <img src={Logo} className="absolute w-[690px] h-[632px] left-[675px] top-0"/>
        <div className='absolute w-[675px] right-[690px] h-[632px] top-0'>
            <img src={LogoSelaras} className="absolute w-[310px] h-[80px] left-[190px] top-[40px] mix-blend-darken"/>
            <div className="absolute w-[492px] h-[55px] left-[185px] top-[130px] font-poppins not-italic font-semibold text-[26px] leading-[48px] flex items-center text-center text-black">
                Administrator Login Page
            </div>
            <div className="absolute w-[500px] h-[395px] left-[90px] top-[200px] bg-[rgba(202,30,20,0.58)] rounded-[35px]">
                <div className="absolute w-[450px] h-[90px] left-[26px] top-[50px]">
                    <label className='absolute w-[200px] h-[50px] left-[5px] top-[-10px] font-poppins not-italic font-semibold text-[24px] leading-[48px] flex items-center text-white'>Username</label>
                    <input type='text' id='username' className='absolute w-[445px] h-[50px] left-[0px] top-[35px] rounded-[15px] px-4 py-2 font-poppins not-italic font-medium text-[20px] leading-[28px] text-gray-700' value={username} onChange={(e) => setUsername(e.target.value)} onKeyPress={handleKeyPress}/>
                </div>
                <div className="absolute w-[450px] h-[90px] left-[26px] top-[160px]">
                    <label className='absolute w-[200px] h-[50px] left-[5px] top-[-10px] font-poppins not-italic font-semibold text-[24px] leading-[48px] flex items-center text-white'>Password</label>
                    <div className='relative'>
                        <input
                            type={passwordVisible ? 'text' : 'password'}
                            value={password} className="absolute w-[445px] h-[50px] left-[0px] top-[35px] rounded-[15px] px-4 py-2 font-poppins not-italic font-medium text-[20px] leading-[28px] text-gray-700"
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                        <FontAwesomeIcon
                            icon={passwordVisible ? faEyeSlash : faEye}
                            onClick={togglePasswordVisibility}
                            className="absolute h-[25px] right-5 top-[60px] transform -translate-y-1/2 cursor-pointer text-gray-700"
                        />
                    </div>
                </div>
                <button className='absolute w-[200px] h-[50px] left-[150px] top-[300px] bg-white rounded-[35px] text-[20px] font-poppins font-medium text-black' onClick={handleSignIn}>Sign In</button>
            </div>
        </div>
    </>
  )
}

export default Login