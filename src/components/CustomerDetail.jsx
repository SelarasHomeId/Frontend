import { useEffect, useState } from 'react';
import BgFeature from '../assets/bg-feature.png';
import { apiRequest } from '../services/useApi';
import Swal from 'sweetalert2';
import PropTypes from 'prop-types';
import LoadingSpinner from './LoadingSpinner';

const CustomerDetail = ({ contactId,onCloseDetail }) => {
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

    const handleClickDelete = (id) => {

        Swal.fire({
            icon: "warning",
            title: "Messaging will be deleted, confirm action?",
            showCancelButton: true,
            confirmButtonText: "Confirm",
        }).then((result) => {
            if (result.isConfirmed) {

                apiRequest('delete', `/api/contact/${id}`,null,{
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                })
                .then(response => {
                    console.log(response.data)
                    Swal.fire({
                        icon: 'success',
                        title: 'Successfully delete messaging!',
                    });
                    onCloseDetail("Customer");
                })
                .catch(error => {
                    console.error('Error during delete messaging:', error);    
                    Swal.fire({
                        icon: 'error',
                        title: 'Delete Messaging failed',
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

    if (!contact) {
        return <LoadingSpinner/>
    }

    return (
        <div>
            <img src={BgFeature} className="absolute w-[1116px] h-[250px] bg-gradient-to-b from-black-opacity-35 to-black-opacity-35" />
            <div className="absolute left-[80px] top-[10px] w-[664px] h-[52px] font-poppins font-bold text-[18px] leading-[36px] flex items-center text-white"><pre>{'Dashboard  >  Customer  >  Detail'}</pre></div>
            <div className="absolute left-[770px] top-[10px] w-[330px] h-[67px] font-poppins font-bold text-[32px] leading-[60px] text-white">DETAIL MESSAGING</div>
            <div className="absolute left-[15px] top-[80px] w-[1088px] h-[445px] bg-white border border-black rounded-[25px] box-border">
                <div className="absolute left-[15px] top-[25px] w-[1055px] h-[30px] border-black font-poppins text-[18px] text-black leading-[30px] flex justify-between">
                    <span>{`${contact.name} <${contact.email}>`}</span>
                    <span>{contact.created_at.replace(/[TZ]/g, ' ')}</span>
                </div>
                <div className="absolute left-[15px] top-[60px] w-[1055px] h-0 border-t border-black"/>
                <div className="absolute left-[15px] top-[65px] w-[1055px] h-[30px] border-black font-poppins text-[18px] text-black leading-[30px] flex justify-between">
                    <span>{contact.phone}</span>
                </div>
                <div className="absolute left-[15px] top-[100px] w-[1055px] h-[310px] bg-[#ececec] border border-black rounded-[25px] box-border">
                    <div className="absolute left-[20px] top-[18px] w-[1013px] h-[250px] overflow-auto font-poppins text-[18px] text-justify text-black leading-[30px]">
                        {contact.message}
                    </div>
                </div>
                <button className='absolute left-[35px] bottom-[15px] w-[130px] h-[40px] bg-[#ececec] rounded-[35px] text-[20px] font-poppins font-medium text-black border border-black box-border' onClick={() => onCloseDetail("Customer")}>Close</button>
                <button className='absolute right-[190px] bottom-[15px] w-[130px] h-[40px] bg-[#af2424] rounded-[35px] text-[20px] font-poppins font-medium text-white' onClick={() => handleClickDelete(contact.id)} >Delete</button>
                <button className='absolute right-[35px] bottom-[15px] w-[130px] h-[40px] bg-[#159F1B] rounded-[35px] text-[20px] font-poppins font-medium text-white' onClick={handleClickReply}>Reply</button>
            </div>
        </div>
    );
}

CustomerDetail.propTypes = {
    onCloseDetail:PropTypes.func.isRequired,
    contactId: PropTypes.number,
};

export default CustomerDetail;
