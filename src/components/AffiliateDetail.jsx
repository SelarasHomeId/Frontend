import { useEffect, useState } from 'react';
import BgFeature from '../assets/bg-feature.png';
import { apiRequest } from '../services/useApi';
import Swal from 'sweetalert2';
import PropTypes from 'prop-types';
import LoadingSpinner from './LoadingSpinner';

const AffiliateDetail = ({ affiliateId }) => {
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

    if (!affiliate) {
        return <LoadingSpinner/>
    }

    return (
        <div>
            <img src={BgFeature} className="absolute w-[1116px] h-[250px] bg-gradient-to-b from-black-opacity-35 to-black-opacity-35" />
            <div className="absolute left-[80px] top-[10px] w-[664px] h-[52px] font-poppins font-bold text-[18px] leading-[36px] flex items-center text-white"><pre>{'Dashboard  >  Affiliate  >  Detail'}</pre></div>
            <div className="absolute left-[770px] top-[10px] w-[330px] h-[67px] font-poppins font-bold text-[32px] leading-[60px] text-white">DETAIL REQUEST</div>
            <div className="absolute left-[15px] top-[80px] w-[1088px] h-[390px] bg-white border border-black rounded-[25px] box-border">
                <div className="p-4">
                    <h2 className="text-xl font-bold">Detail Affiliate</h2>
                    <p><strong>Name:</strong> {affiliate.name}</p>
                    <p><strong>Phone:</strong> {affiliate.phone}</p>
                    <p><strong>Email:</strong> {affiliate.email}</p>
                    <p><strong>Instagram:</strong> {affiliate.instagram}</p>
                    <p><strong>TikTok:</strong> {affiliate.tiktok}</p>
                    <p><strong>Date:</strong> {affiliate.created_at.replace(/[TZ]/g, ' ')}</p>
                </div>
            </div>
        </div>
    );
}

AffiliateDetail.propTypes = {
    affiliateId: PropTypes.number,
};

export default AffiliateDetail;
