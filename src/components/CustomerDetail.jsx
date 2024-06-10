import { useEffect, useState } from 'react';
import BgFeature from '../assets/bg-feature.png';
import { apiRequest } from '../services/useApi';
import Swal from 'sweetalert2';
import PropTypes from 'prop-types';
import LoadingSpinner from './LoadingSpinner';

const CustomerDetail = ({ contactId }) => {
    const [contact, setContact] = useState(null);

    useEffect(() => {
        const fetchContactDetail = async () => {
            apiRequest('get', `/api/contact/${contactId}`,null,{
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            })
            .then(response => {
                const data = response.data
                setContact(data.data)
            })
            .catch(error => {
                console.error('Error during get detail contact:', error);    
                Swal.fire({
                    icon: 'error',
                    title: 'Get Detail Contact failed',
                    text: error.response.data.meta.message,
                });
            });
        };

        if (contactId) {
            fetchContactDetail();
        }
    }, [contactId]);

    if (!contact) {
        return <LoadingSpinner/>
    }

    return (
        <div>
            <img src={BgFeature} className="absolute w-[1116px] h-[250px] bg-gradient-to-b from-black-opacity-35 to-black-opacity-35" />
            <div className="absolute left-[80px] top-[10px] w-[664px] h-[52px] font-poppins font-bold text-[18px] leading-[36px] flex items-center text-white"><pre>{'Dashboard  >  Customer  >  Detail'}</pre></div>
            <div className="absolute left-[770px] top-[10px] w-[330px] h-[67px] font-poppins font-bold text-[32px] leading-[60px] text-white">DETAIL MESSAGING</div>
            <div className="absolute left-[15px] top-[80px] w-[1088px] h-[390px] bg-white border border-black rounded-[25px] box-border">
                <div className="p-4">
                    <h2 className="text-xl font-bold">Detail Contact</h2>
                    <p><strong>Name:</strong> {contact.name}</p>
                    <p><strong>Phone:</strong> {contact.phone}</p>
                    <p><strong>Email:</strong> {contact.email}</p>
                    <p><strong>Message:</strong> {contact.message}</p>
                    <p><strong>Date:</strong> {contact.created_at.replace(/[TZ]/g, ' ')}</p>
                </div>
            </div>
        </div>
    );
}

CustomerDetail.propTypes = {
    contactId: PropTypes.number,
};

export default CustomerDetail;
