import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import { apiRequest } from '../services/useApi';
import LoadingSpinnerDashboard from './LoadingSpinnerDashboard';

const Dashboard = () => {
    const [chartDataSosmed, setChartDataSosmed] = useState({});
    const [chartDataForm, setChartDataForm] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {

            apiRequest('get', '/api/access/count',null,{
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            })
            .then(response => {
                const data = response.data.data
                setChartDataSosmed({
                    labels: [ 'Instagram', 'TikTok', 'Facebook', 'WhatsApp'],
                    datasets: [
                        {
                            label: 'Access Counts',
                            data: [
                                data.count_instagram,
                                data.count_tiktok,
                                data.count_facebook,
                                data.count_whatsapp
                            ],
                            backgroundColor: [ '#FF9F40', '#4BC0C0', '#FFCE56', '#9966FF'],
                            hoverBackgroundColor: [ '#FF9F40', '#4BC0C0', '#FFCE56', '#9966FF'],
                        },
                    ],
                });
                setChartDataForm({
                    labels: ['Contact', 'Affiliate'],
                    datasets: [
                        {
                            label: 'Submit Counts',
                            data: [
                                data.count_contact,
                                data.count_affiliate,
                            ],
                            backgroundColor: ['#36A2EB', '#FF6384'],
                            hoverBackgroundColor: ['#36A2EB', '#FF6384'],
                        },
                    ],
                });
                setLoading(false);
            })
            .catch(error => {
                console.error('Error during get count access:', error);    
                Swal.fire({
                    icon: 'error',
                    title: 'Fetch count access error',
                    text: error.response.data.meta.message,
                });
            });
        };

        fetchData();
    }, []);

    const currentMonthYear = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

    const options = {
        plugins: {
            legend: {
                labels: {
                    font: {
                        size: 11
                    },
                    color: 'gray'
                }
            }
        }
    };

    return (
        <div>
            <h2 className="text-center text-xl font-bold mt-4"><span className='text-blue-500 hover:cursor-pointer hover:underline'><a href='https://selarashome.id/' target='_blank'>SelarasHome.Id</a></span> Access Report</h2>
            <h2 className="text-center text-xl font-bold mt-2">Period: {currentMonthYear}</h2>
            <div className="mt-8 flex justify-center space-x-10">
                {loading ? (
                    <LoadingSpinnerDashboard/>
                ) : (
                    <>
                        <div style={{ width: '37%', height: 'auto' }}>
                            <Pie data={chartDataSosmed} options={options}/>
                        </div>
                        <div style={{ width: '37%', height: 'auto' }}>
                            <Pie data={chartDataForm} options={options}/>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
