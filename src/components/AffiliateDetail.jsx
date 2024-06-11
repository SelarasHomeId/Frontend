import { useEffect, useState } from 'react';
import BgFeature from '../assets/bg-feature.png';
import { apiRequest } from '../services/useApi';
import Swal from 'sweetalert2';
import PropTypes from 'prop-types';
import LoadingSpinner from './LoadingSpinner';
import { FaCopy } from 'react-icons/fa';

const AffiliateDetail = ({ affiliateId,onCloseDetail }) => {
    const [affiliate, setAffiliate] = useState(null);
    const [copyMessagePhone, setCopyMessagePhone] = useState('');
    const [copyMessageEmail, setCopyMessageEmail] = useState('');
    const [copyMessageInstagram, setCopyMessageInstagram] = useState('');
    const [copyMessageTikTok, setCopyMessageTikTok] = useState('');

    useEffect(() => {
        const fetchAffiliateDetail = async () => {
            apiRequest('get', `/api/affiliate/${affiliateId}`,null,{
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            })
            .then(response => {
                const data = response.data
                setAffiliate(data.data)
            })
            .catch(error => {
                console.error('Error during get detail affiliate:', error);    
                Swal.fire({
                    icon: 'error',
                    title: 'Get Detail Affiliate failed',
                    text: error.response.data.meta.message,
                });
            });
        };

        if (affiliateId) {
            fetchAffiliateDetail();
        }
    }, [affiliateId]);

    const handleClickDelete = (id) => {

        Swal.fire({
            icon: "warning",
            title: "Request will be deleted, confirm action?",
            showCancelButton: true,
            confirmButtonText: "Confirm",
        }).then((result) => {
            if (result.isConfirmed) {

                apiRequest('delete', `/api/affiliate/${id}`,null,{
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                })
                .then(response => {
                    console.log(response.data)
                    Swal.fire({
                        icon: 'success',
                        title: 'Successfully delete request!',
                    });
                    onCloseDetail("Affiliate");
                })
                .catch(error => {
                    console.error('Error during delete request:', error);    
                    Swal.fire({
                        icon: 'error',
                        title: 'Delete Request failed',
                        text: error.response.data.meta.message,
                    });
                });

            }
        });

    }

    const handleClickReply = () => {
        Swal.fire({
            icon: 'info',
            title: 'This feature on progress',
        });
    }

    const handleCopyPhone = () => {
        navigator.clipboard.writeText(affiliate.phone).then(() => {
            setCopyMessagePhone('Copied!');
            setTimeout(() => {
                setCopyMessagePhone('');
            }, 2000);
        });
    }

    const handleCopyEmail = () => {
        navigator.clipboard.writeText(affiliate.email).then(() => {
            setCopyMessageEmail('Copied!');
            setTimeout(() => {
                setCopyMessageEmail('');
            }, 2000);
        });
    }

    const handleCopyInstagram = () => {
        navigator.clipboard.writeText(affiliate.instagram).then(() => {
            setCopyMessageInstagram('Copied!');
            setTimeout(() => {
                setCopyMessageInstagram('');
            }, 2000);
        });
    }

    const handleCopyTiktok = () => {
        navigator.clipboard.writeText(affiliate.tiktok).then(() => {
            setCopyMessageTikTok('Copied!');
            setTimeout(() => {
                setCopyMessageTikTok('');
            }, 2000);
        });
    }

    if (!affiliate) {
        return <LoadingSpinner/>
    }

    return (
        <div>
            <img src={BgFeature} className="absolute w-[1116px] h-[250px] bg-gradient-to-b from-black-opacity-35 to-black-opacity-35" />
            <div className="absolute left-[80px] top-[10px] w-[664px] h-[52px] font-poppins font-bold text-[18px] leading-[36px] flex items-center text-white"><pre>{'Dashboard  >  Affiliate  >  Detail'}</pre></div>
            <div className="absolute left-[770px] top-[10px] w-[330px] h-[67px] font-poppins font-bold text-[32px] leading-[60px] text-white">DETAIL REQUEST</div>
            <div className="absolute left-[15px] top-[80px] w-[1088px] h-[445px] bg-white border border-black rounded-[25px] box-border">
                <div className="absolute left-[25px] top-[25px] w-[1035px] h-[30px] border-black font-poppins text-[18px] text-black leading-[30px] flex justify-between">
                    <span className='flex items-center'>
                        {`${affiliate.name} <${affiliate.email}>`}
                        <FaCopy onClick={handleCopyEmail} className="cursor-pointer ml-2" />
                        {copyMessageEmail && <span className="text-green-500 ml-2">{copyMessageEmail}</span>}
                    </span>
                    <span>{affiliate.created_at.replace(/[TZ]/g, ' ')}</span>
                </div>
                <div className="absolute left-[25px] top-[60px] w-[1035px] h-0 border-t border-black"/>
                <div className="absolute left-[25px] top-[65px] w-[1035px] h-[30px] border-black font-poppins text-[18px] text-black leading-[30px]">
                    <span className='flex items-center'>
                        {affiliate.phone}
                        <FaCopy onClick={handleCopyPhone} className="cursor-pointer ml-2" />
                        {copyMessagePhone && <span className="text-green-500 ml-2">{copyMessagePhone}</span>}
                    </span>
                </div>
                <div className="absolute left-[15px] top-[100px] w-[1055px] h-[310px] bg-[#ececec] border border-black rounded-[25px] box-border">
                    <div className="p-4">
                        <h2 className="text-xl font-bold">Hello admin, someone has requested to join the affiliate!</h2>
                        <table className='mt-3.5' border="1" cellPadding="5" cellSpacing="0">
                            <tbody>
                                <tr>
                                    <td><strong>Full Name:</strong></td>
                                    <td>{affiliate.name}</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td><strong>Phone Number:</strong></td>
                                    <td>{affiliate.phone}</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td><strong>Email Address:</strong></td>
                                    <td>{affiliate.email}</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td><strong>Instagram Account:</strong></td>
                                    <td><a href={affiliate.instagram} target='_blank' className='hover:cursor-pointer hover:underline'>{affiliate.instagram}</a></td>
                                    <td>
                                        <span className='flex items-center'>
                                            <FaCopy onClick={handleCopyInstagram} className="cursor-pointer ml-2" />
                                            {copyMessageInstagram && <span className="text-green-500 ml-2">{copyMessageInstagram}</span>}
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td><strong>TikTok Account:</strong></td>
                                    <td><a href={affiliate.tiktok} target='_blank' className='hover:cursor-pointer hover:underline'>{affiliate.tiktok}</a></td>
                                    <td>
                                        <span className='flex items-center'>
                                            <FaCopy onClick={handleCopyTiktok} className="cursor-pointer ml-2" />
                                            {copyMessageTikTok && <span className="text-green-500 ml-2">{copyMessageTikTok}</span>}
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td><strong>Date Submitted:</strong></td>
                                    <td>{affiliate.created_at.replace(/[TZ]/g, ' ')}</td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <button className='absolute left-[35px] bottom-[15px] w-[130px] h-[40px] bg-[#ececec] rounded-[35px] text-[20px] font-poppins font-medium text-black border border-black box-border' onClick={() => onCloseDetail("Affiliate")}>Close</button>
                <button className='absolute right-[190px] bottom-[15px] w-[130px] h-[40px] bg-[#af2424] rounded-[35px] text-[20px] font-poppins font-medium text-white' onClick={() => handleClickDelete(affiliate.id)} >Delete</button>
                <button className='absolute right-[35px] bottom-[15px] w-[130px] h-[40px] bg-[#159F1B] rounded-[35px] text-[20px] font-poppins font-medium text-white' onClick={handleClickReply}>Reply</button>
            </div>
        </div>
    );
}

AffiliateDetail.propTypes = {
    onCloseDetail: PropTypes.func.isRequired,
    affiliateId: PropTypes.number,
};

export default AffiliateDetail;
