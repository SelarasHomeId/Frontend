import { useEffect, useState } from 'react';
import BgFeature from '../assets/bg-feature.png';
import { apiRequest } from '../services/useApi';
import Swal from 'sweetalert2';
import PropTypes from 'prop-types';
import LoadingSpinner from './LoadingSpinner';
import withReactContent from 'sweetalert2-react-content'
import { SiGmail } from "react-icons/si";
import { FaCopy,FaWhatsapp } from 'react-icons/fa';

const CustomerDetail = ({ contactId,onCloseDetail }) => {
    const [contact, setContact] = useState(null);
    const [copyMessagePhone, setCopyMessagePhone] = useState('');
    const [copyMessageEmail, setCopyMessageEmail] = useState('');
    const MySwal = withReactContent(Swal)

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

    const formatPhoneNumber = (number) => {
        let cleanNumber = number.replace(/[^0-9+]/g, '');
        if (cleanNumber.startsWith('0')) {
            cleanNumber = '+62' + cleanNumber.substring(1);
        }
        if (!cleanNumber.startsWith('+')) {
            cleanNumber = '+62' + cleanNumber;
        }
        cleanNumber = cleanNumber.replace(/\+/g, '');
        return cleanNumber;
    }

    const createWhatsAppLink = (number) => {
        const formattedNumber = formatPhoneNumber(number);
        return `https://wa.me/${formattedNumber}`;
    }

    const validateAndFormatEmail = (email) => {
        email = email.trim();
        email = email.toLowerCase();
        email = email.replace(/\s+/g, '');
        const commonDomains = {
            'gmal.com': 'gmail.com',
            'gmai.com': 'gmail.com',
            'gmial.com': 'gmail.com',
            'gnail.com': 'gmail.com',
            'hotmial.com': 'hotmail.com',
            'hotmai.com': 'hotmail.com',
            'yahho.com': 'yahoo.com',
            'yaho.com': 'yahoo.com',
        };
        const parts = email.split('@');
        if (parts.length === 2) {
            const domain = parts[1];
            if (commonDomains[domain]) {
                email = parts[0] + '@' + commonDomains[domain];
            }
        }
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(email)) {
            throw new Error("Alamat email tidak valid");
        }
        return email;
    }
    
    const createMailtoLink = (email) => {
        const formattedEmail = validateAndFormatEmail(email);
        return `mailto:${formattedEmail}`;
    }

    const handleClickReply = () => {
        MySwal.fire({
            title: 'Do you want to reply with?',
            html: (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <a href={createMailtoLink(contact.email)} target="_blank" style={{ color: '#DB4437' }}>
                        <SiGmail size={60} style={{ margin: '0 30px' }} />
                    </a>
                    <a href={createWhatsAppLink(contact.phone)} target="_blank" style={{ color: '#25D366' }}>
                        <FaWhatsapp size={60} style={{ margin: '0 30px' }} />
                    </a>
                </div>
            ),
            showConfirmButton: false,
            customClass: {
                container: 'rounded-lg'
            }
        });
    }

    const handleCopyPhone = () => {
        const textArea = document.createElement("textarea");
        textArea.value = contact.phone;
        textArea.style.position = "fixed";
        textArea.style.top = 0;
        textArea.style.left = 0;
        textArea.style.width = "2em";
        textArea.style.height = "2em";
        textArea.style.padding = 0;
        textArea.style.border = "none";
        textArea.style.outline = "none";
        textArea.style.boxShadow = "none";
        textArea.style.background = "transparent";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            const successful = document.execCommand('copy');
            if (successful) {
                setCopyMessagePhone('Copied!');
                setTimeout(() => {
                    setCopyMessagePhone('');
                }, 2000);
            } else {
                console.error('Failed to copy text.');
            }
        } catch (err) {
            console.error('Fallback: Oops, unable to copy', err);
        }

        document.body.removeChild(textArea);
    }

    const handleCopyEmail = () => {
        const textArea = document.createElement("textarea");
        textArea.value = contact.email;
        textArea.style.position = "fixed";
        textArea.style.top = 0;
        textArea.style.left = 0;
        textArea.style.width = "2em";
        textArea.style.height = "2em";
        textArea.style.padding = 0;
        textArea.style.border = "none";
        textArea.style.outline = "none";
        textArea.style.boxShadow = "none";
        textArea.style.background = "transparent";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            const successful = document.execCommand('copy');
            if (successful) {
                setCopyMessageEmail('Copied!');
                setTimeout(() => {
                    setCopyMessageEmail('');
                }, 2000);
            } else {
                console.error('Failed to copy text.');
            }
        } catch (err) {
            console.error('Fallback: Oops, unable to copy', err);
        }

        document.body.removeChild(textArea);
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
                <div className="absolute left-[25px] top-[25px] w-[1035px] h-[30px] border-black font-poppins text-[18px] text-black leading-[30px] flex justify-between">
                <span className='flex items-center'>
                        {`${contact.name} <${contact.email}>`}
                        <FaCopy onClick={handleCopyEmail} className="cursor-pointer ml-2" />
                        {copyMessageEmail && <span className="text-green-500 ml-2">{copyMessageEmail}</span>}
                    </span>
                    <span>{contact.created_at.replace(/[TZ]/g, ' ')}</span>
                </div>
                <div className="absolute left-[25px] top-[60px] w-[1035px] h-0 border-t border-black"/>
                <div className="absolute left-[25px] top-[65px] w-[1035px] h-[30px] border-black font-poppins text-[18px] text-black leading-[30px] flex justify-between">
                    <span className='flex items-center'>
                        {contact.phone}
                        <FaCopy onClick={handleCopyPhone} className="cursor-pointer ml-2" />
                        {copyMessagePhone && <span className="text-green-500 ml-2">{copyMessagePhone}</span>}
                    </span>
                </div>
                <div className="absolute left-[15px] top-[100px] w-[1055px] h-[310px] bg-[#ececec] border border-black rounded-[25px] box-border">
                    <div className="absolute left-[20px] top-[18px] w-[1013px] h-[250px] overflow-auto font-poppins text-[18px] text-justify text-black leading-[30px]">
                        {contact.message.replace(/<br \/>/g, '\n').split('\n').map((line, index) => (
                            <div key={index}>{line}</div>
                        ))}
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
