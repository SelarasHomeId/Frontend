import { useCallback, useEffect, useState } from 'react'
import BgFeature from '../assets/bg-feature.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faEye, faDownload } from '@fortawesome/free-solid-svg-icons';
import { apiRequest } from '../services/useApi';
import Swal from 'sweetalert2'

const Affiliate = () => {
    const [keyword, setKeyword] = useState('');
    const [affiliates, setAffiliates] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;
    const [hasNextPage, setHasNextPage] = useState(true);

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

    return (
        <div>
            <img src={BgFeature} className="absolute w-[1116px] h-[250px] bg-gradient-to-b from-black-opacity-35 to-black-opacity-35" />
            <div className="absolute left-[80px] top-[10px] w-[664px] h-[52px] font-poppins font-bold text-[18px] leading-[36px] flex items-center text-white"><pre>{'Dashboard  >  Affiliate'}</pre></div>
            <div className="absolute left-[80px] top-[60px] w-[523px] h-[67px] font-poppins font-bold text-[32px] leading-[60px] flex items-center text-white">AFFILIATE (Request)</div>
            <div className="absolute left-[15px] top-[140px] w-[1088px] h-[390px] bg-white border border-black rounded-[25px] box-border">
                <input onChange={(e) => setKeyword(e.target.value)} value={keyword} type='text' placeholder='Search' className="absolute left-[10px] top-[10px] w-[350px] h-[40px] border border-black box-border rounded-[15px] px-4 py-2 font-poppins not-italic font-medium text-[20px] leading-[28px] text-gray-700"/>
                <div className="absolute left-[318.5px] top-[10px] w-[40px] h-[40px] flex items-center justify-center text-white bg-blue-500 rounded-[15px]">
                    <FontAwesomeIcon icon={faSearch} />
                </div>
                <button className='absolute right-[10px] top-[10px] w-[160px] h-[40px] bg-[#159F1B] rounded-[35px] text-[20px] font-poppins font-medium text-white'>
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
                            {affiliates.map((affiliate, index) => (
                                <tr key={affiliate.id}>
                                    <td className="py-2 px-4 border-b border-blue-200">{(currentPage - 1) * pageSize + index + 1}</td>
                                    <td className="py-2 px-4 border-b border-blue-200">{affiliate.name}</td>
                                    <td className="py-2 px-4 border-b border-blue-200">{affiliate.phone}</td>
                                    <td className="py-2 px-4 border-b border-blue-200">{affiliate.email}</td>
                                    <td className="py-2 px-4 border-b border-blue-200">{affiliate.created_at.replace(/[TZ]/g, ' ')}</td>
                                    <td className="py-2 px-4 border-b border-blue-200"><FontAwesomeIcon icon={faEye} className='hover:cursor-pointer h-[20px]' /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <button className='absolute left-[10px] bottom-[10px] w-[130px] h-[40px] bg-[#161a6e] rounded-[35px] text-[20px] font-poppins font-medium text-white' onClick={handlePrevPage}>{"<< Prev"}</button>
                <button className={`absolute right-[10px] bottom-[10px] w-[130px] h-[40px] bg-[#161a6e] rounded-[35px] text-[20px] font-poppins font-medium text-white ${hasNextPage ? '' : 'hidden'}`} onClick={handleNextPage}>{"Next >>"}</button>
            </div>
        </div>
    )
}

export default Affiliate
