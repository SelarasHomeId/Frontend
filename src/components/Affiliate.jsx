import { useCallback, useEffect, useState } from 'react'
import BgFeature from '../assets/bg-feature.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faEye, faDownload } from '@fortawesome/free-solid-svg-icons';
import { apiRequest } from '../services/useApi';
import Swal from 'sweetalert2'
import * as XLSX from 'xlsx';
import PropTypes from 'prop-types';

const Affiliate = ({onViewDetail}) => {
    const [keyword, setKeyword] = useState('');
    const [affiliates, setAffiliates] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;
    const [hasNextPage, setHasNextPage] = useState(true);
    const [hasPrevPage, setHasPrevPage] = useState(false);

    const fetchAffiliates = useCallback(async () => {
        try {
            const response = await apiRequest(
                'get',
                `/api/affiliate?page=${currentPage}&page_size=${pageSize}&search=${keyword}`,
                null,
                {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                }
            );
            const data = response.data;
            setAffiliates(data.data);
            setHasNextPage(data.meta.info.more_records);
            setHasPrevPage(currentPage > 1);
        } catch (error) {
            console.error('Error during fetch affiliate:', error);
            Swal.fire({
                icon: 'error',
                title: 'Fetch affiliate error',
                text: error.response.data.meta.message,
            });
        }
    }, [currentPage, keyword]);

    useEffect(() => {
        fetchAffiliates();
        if (keyword!=""){
            setCurrentPage(1);
        }
    }, [fetchAffiliates, keyword]);

    const handleNextPage = () => {
        setCurrentPage(prevPage => prevPage + 1);
    };

    const handlePrevPage = () => {
        setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
    };

    const handleExportData = () => {
        const fieldMap = {
            id: 'Id',
            name: 'Full Name',
            phone: 'Phone Number',
            email: 'Email Address',
            instagram: 'Instagram Account',
            tiktok: 'TikTok Account',
            created_at: 'Date Submited'
        };

        const modifiedAffiliates = affiliates.map(contact => {
            const modifiedContact = {
                ...contact,
                created_at: contact.created_at.replace(/[TZ]/g, ' ')
            };
            
            const renamedContact = {};
            for (const key in modifiedContact) {
                const newKey = fieldMap[key] || key;
                renamedContact[newKey] = modifiedContact[key];
            }
    
            return renamedContact;
        });

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(modifiedAffiliates);
        XLSX.utils.book_append_sheet(wb, ws, 'Data Affiliate Customer');

        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const currentDate = `${year}-${month}-${day}`;

        const exportFileName = `ExportData-Affiliate-Customer_${currentDate}`;

        XLSX.writeFile(wb, `${exportFileName}.xlsx`);
    };

    return (
        <div>
            <img src={BgFeature} className="absolute w-[1116px] h-[250px] bg-gradient-to-b from-black-opacity-35 to-black-opacity-35" />
            <div className="absolute left-[80px] top-[10px] w-[664px] h-[52px] font-poppins font-bold text-[18px] leading-[36px] flex items-center text-white"><pre>{'Dashboard  >  Affiliate'}</pre></div>
            <div className="absolute left-[80px] top-[60px] w-[523px] h-[67px] font-poppins font-bold text-[32px] leading-[60px] flex items-center text-white">AFFILIATE (Request)</div>
            <div className="absolute left-[15px] top-[140px] w-[1088px] h-[390px] bg-white border border-black rounded-[25px] box-border">
                <input onChange={(e) => setKeyword(e.target.value)} value={keyword} type='text' placeholder='Search' className="absolute left-[10px] top-[10px] w-[350px] h-[40px] border border-black box-border rounded-[15px] px-4 py-2 font-poppins not-italic font-medium text-[20px] leading-[28px] text-gray-700"/>
                <div className="absolute left-[318.5px] top-[10px] w-[40px] h-[40px] flex items-center justify-center text-black rounded-[15px]">
                    <FontAwesomeIcon icon={faSearch} />
                </div>
                <button className='absolute right-[10px] top-[10px] w-[160px] h-[40px] bg-[#159F1B] rounded-[35px] text-[20px] font-poppins font-medium text-white' onClick={handleExportData}>
                    {"Export Data"}
                    <FontAwesomeIcon icon={faDownload} className='h-[20px] ml-2' />
                </button>
                <div className="absolute left-[10px] top-[60px] w-[1068px] h-[250px] mt-2">
                    <table className="min-w-full text-center">
                        <thead className='bg-blue-300'>
                            <tr>
                                <th className="py-2 px-4 border-b-2 border-blue-200">No</th>
                                <th className="py-2 px-4 border-b-2 border-blue-200">Name</th>
                                <th className="py-2 px-4 border-b-2 border-blue-200">Phone</th>
                                <th className="py-2 px-4 border-b-2 border-blue-200">Email</th>
                                <th className="py-2 px-4 border-b-2 border-blue-200">Date</th>
                                <th className="py-2 px-4 border-b-2 border-blue-200">Option</th>
                            </tr>
                        </thead>
                        <tbody className='bg-blue-100'>
                            {affiliates.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="py-2 px-4 border-b border-blue-200">Data Not found</td>
                                </tr>
                            ) : (
                                affiliates.map((affiliate, index) => (
                                    <tr key={affiliate.id}>
                                        <td className="py-2 px-4 border-b border-blue-200">{(currentPage - 1) * pageSize + index + 1}</td>
                                        <td className="py-2 px-4 border-b border-blue-200">{affiliate.name}</td>
                                        <td className="py-2 px-4 border-b border-blue-200">{affiliate.phone}</td>
                                        <td className="py-2 px-4 border-b border-blue-200">{affiliate.email}</td>
                                        <td className="py-2 px-4 border-b border-blue-200">{affiliate.created_at.replace(/[TZ]/g, ' ')}</td>
                                        <td className="py-2 px-4 border-b border-blue-200"><FontAwesomeIcon icon={faEye} className='hover:cursor-pointer h-[20px]' onClick={() => onViewDetail(affiliate.id)} /></td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {hasPrevPage && (
                    <button className='absolute left-[10px] bottom-[10px] w-[130px] h-[40px] bg-[#161a6e] rounded-[35px] text-[20px] font-poppins font-medium text-white' onClick={handlePrevPage}>{"<< Prev"}</button>
                )}
                {hasNextPage && (
                    <button className='absolute right-[10px] bottom-[10px] w-[130px] h-[40px] bg-[#161a6e] rounded-[35px] text-[20px] font-poppins font-medium text-white' onClick={handleNextPage}>{"Next >>"}</button>
                )}
            </div>
        </div>
    )
}

Affiliate.propTypes = {
    onViewDetail: PropTypes.func.isRequired,
};

export default Affiliate
