import { useEffect, useState } from 'react';
import BgFeature from '../assets/bg-feature.png';
import { apiRequest } from '../services/useApi';
import Swal from 'sweetalert2';
import PropTypes from 'prop-types';
import LoadingSpinner from './LoadingSpinner';

const AffiliateDetail = ({ affiliateId,onCloseDetail }) => {
    const [affiliate, setAffiliate] = useState(null);

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

    if (!affiliate) {
        return <LoadingSpinner/>
    }

    return (
        <div>
            <img src={BgFeature} className="absolute w-[1116px] h-[250px] bg-gradient-to-b from-black-opacity-35 to-black-opacity-35" />
            <div className="absolute left-[80px] top-[10px] w-[664px] h-[52px] font-poppins font-bold text-[18px] leading-[36px] flex items-center text-white"><pre>{'Dashboard  >  Affiliate  >  Detail'}</pre></div>
            <div className="absolute left-[770px] top-[10px] w-[330px] h-[67px] font-poppins font-bold text-[32px] leading-[60px] text-white">DETAIL REQUEST</div>
            <div className="absolute left-[15px] top-[80px] w-[1088px] h-[445px] bg-white border border-black rounded-[25px] box-border">
            <div className="absolute left-[15px] top-[25px] w-[1055px] h-[30px] border-black font-poppins text-[18px] text-black leading-[30px] flex justify-between">
                    <span>{`${affiliate.name} <${affiliate.email}>`}</span>
                    <span>{affiliate.created_at.replace(/[TZ]/g, ' ')}</span>
                </div>
                <div className="absolute left-[15px] top-[60px] w-[1055px] h-0 border-t border-black"/>
                <div className="absolute left-[15px] top-[65px] w-[1055px] h-[30px] border-black font-poppins text-[18px] text-black leading-[30px] flex justify-between">
                    <span>{affiliate.phone}</span>
                </div>
                <div className="absolute left-[15px] top-[100px] w-[1055px] h-[310px] bg-[#ececec] border border-black rounded-[25px] box-border">
                    <div className="p-4">
                        <h2 className="text-xl font-bold">Hello admin, someone has requested to join the affiliate!</h2>
                        <br/>
                        <p><strong>Name:</strong> {affiliate.name}</p>
                        <p><strong>Phone:</strong> {affiliate.phone}</p>
                        <p><strong>Email:</strong> {affiliate.email}</p>
                        <p><strong>Instagram:</strong> {affiliate.instagram}</p>
                        <p><strong>TikTok:</strong> {affiliate.tiktok}</p>
                        <p><strong>Date:</strong> {affiliate.created_at.replace(/[TZ]/g, ' ')}</p>
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
