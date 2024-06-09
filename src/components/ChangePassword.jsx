import BgFeature from '../assets/bg-feature.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import Swal from 'sweetalert2'
import { apiRequest } from '../services/useApi';

const ChangePassword = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [newPasswordVisible, setNewPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };
    const toggleNewPasswordVisibility = () => {
        setNewPasswordVisible(!newPasswordVisible);
    };
    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!confirmPasswordVisible);
    };

    const handleChangePassword = (id) => {
        if (password==""||newPassword==""||confirmPassword==""){
            Swal.fire({
                icon: 'info',
                title: 'There are still empty fields',
            });
            return;
        }else if (newPassword==password){
            Swal.fire({
                icon: 'info',
                title: 'The new password cannot be the same as the old password',
            });
            return;
        }else if (newPassword!=confirmPassword){
            Swal.fire({
                icon: 'info',
                title: 'Please confirm the new password',
            });
            return;
        }else{
            Swal.fire({
                icon: "warning",
                title: "Password will be changed, confirm action?",
                showCancelButton: true,
                confirmButtonText: "Confirm",
            }).then((result) => {
                if (result.isConfirmed) {

                    apiRequest('post', `/api/auth/change-password/${id}`,{
                        old_password:password,
                        new_password:newPassword
                    },{
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    })
                    .then(response => {
                        console.log(response.data)
                        Swal.fire("Successfully changed the password!", "", "success");
                        setPassword("")
                        setNewPassword("")
                        setConfirmPassword("")
                        setPasswordVisible(false)
                        setNewPasswordVisible(false)
                        setConfirmPasswordVisible(false)
                    })
                    .catch(error => {
                        console.error('Error during change password:', error);    
                        Swal.fire({
                            icon: 'error',
                            title: 'Change password failed',
                            text: error.response.data.meta.message,
                        });
                    });

                }
            });
        }
    }

    return (
        <div>
            <img src={BgFeature} className="absolute w-[1116px] h-[250px] bg-gradient-to-b from-black-opacity-35 to-black-opacity-35" />
            <div className="absolute left-[80px] top-[10px] w-[664px] h-[52px] font-poppins font-bold text-[18px] leading-[36px] flex items-center text-white"><pre>{'Dashboard  >  Change Password'}</pre></div>
            <div className="absolute left-[80px] top-[60px] w-[523px] h-[67px] font-poppins font-bold text-[32px] leading-[60px] flex items-center text-white">CHANGE PASSWORD</div>
            <div className="absolute left-[80px] top-[140px] w-[960px] h-[330px] bg-white border border-black rounded-[25px] box-border">
                <div className='absolute left-7 top-1.5 w-[361px] h-[42px] font-poppins text-[30px] font-bold leading-[54px] flex items-center text-black'>Change Password</div>
                <div className="absolute left-0 top-[50px] w-full h-0 border-t border-black"/>
                <div className="absolute left-10 top-[70px] w-[887px] h-[50px]">
                    <label className='absolute left-0 top-0 w-[278.59px] h-[46.45px] font-poppins font-bold text-[25px] leading-[48px] flex items-center justify-end'><span className='text-red-500'>*</span>Old Password</label>
                    <input onChange={(e) => setPassword(e.target.value)} value={password} required type={passwordVisible ? 'text' : 'password'} placeholder='Old Password' className="absolute left-[300px] top-0 w-[586.5px] h-[45px] border border-black box-border rounded-[15px] px-4 py-2 font-poppins not-italic font-medium text-[20px] leading-[28px] text-gray-700"/>
                    <FontAwesomeIcon
                        icon={passwordVisible ? faEyeSlash : faEye}
                        onClick={togglePasswordVisibility}
                        className="absolute h-[25px] right-2 top-[23px] transform -translate-y-1/2 cursor-pointer text-gray-700"
                    />
                </div>
                <div className="absolute left-10 top-[130px] w-[887px] h-[50px]">
                    <label className='absolute left-0 top-0 w-[278.59px] h-[46.45px] font-poppins font-bold text-[25px] leading-[48px] flex items-center justify-end'><span className='text-red-500'>*</span>New Password</label>
                    <input onChange={(e) => setNewPassword(e.target.value)} value={newPassword} required type={newPasswordVisible ? 'text' : 'password'} placeholder='New Password' className="absolute left-[300px] top-0 w-[586.5px] h-[45px] border border-black box-border rounded-[15px] px-4 py-2 font-poppins not-italic font-medium text-[20px] leading-[28px] text-gray-700"/>
                    <FontAwesomeIcon
                        icon={newPasswordVisible ? faEyeSlash : faEye}
                        onClick={toggleNewPasswordVisibility}
                        className="absolute h-[25px] right-2 top-[23px] transform -translate-y-1/2 cursor-pointer text-gray-700"
                    />
                </div>
                <div className="absolute left-10 top-[190px] w-[887px] h-[50px]">
                    <label className='absolute left-0 top-0 w-[278.59px] h-[46.45px] font-poppins font-bold text-[25px] leading-[48px] flex items-center justify-end'><span className='text-red-500'>*</span>Confirm Password</label>
                    <input onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword} required type={confirmPasswordVisible ? 'text' : 'password'} placeholder='Confirm Password' className="absolute left-[300px] top-0 w-[586.5px] h-[45px] border border-black box-border rounded-[15px] px-4 py-2 font-poppins not-italic font-medium text-[20px] leading-[28px] text-gray-700"/>
                    <FontAwesomeIcon
                        icon={confirmPasswordVisible ? faEyeSlash : faEye}
                        onClick={toggleConfirmPasswordVisibility}
                        className="absolute h-[25px] right-2 top-[23px] transform -translate-y-1/2 cursor-pointer text-gray-700"
                    />
                </div>
                <button className='absolute left-[775px] top-[260px] w-[150px] h-[40px] bg-[#159F1B] rounded-[35px] text-[25px] font-poppins font-medium text-white' onClick={() => handleChangePassword(localStorage.getItem("id"))}>Save</button>
            </div>
        </div>
    )
}

export default ChangePassword