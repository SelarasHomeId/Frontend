import { useEffect, useState } from 'react';
import Header from '../components/Header';
import SideBar from '../components/SideBar';
import Dashboard from '../components/Dashboard';
import Customer from '../components/Customer';
import Affiliate from '../components/Affiliate';
import ChangePassword from '../components/ChangePassword';
import CustomerDetail from '../components/CustomerDetail';
import AffiliateDetail from '../components/AffiliateDetail';

const Home = () => {
    const [selectedMenu, setSelectedMenu] = useState(null);
    const [selectedContactId, setSelectedContactId] = useState(null);
    const [selectedAffiliateId, setSelectedAffiliateId] = useState(null);

    const handleMenuClick = (menu) => {
        setSelectedMenu(menu);
    }

    const handleViewDetailContact = (contactId) => {
        setSelectedContactId(contactId);
        setSelectedMenu("CustomerDetail");
    }

    const handleViewDetailAffiliate = (affiliateId) => {
        setSelectedAffiliateId(affiliateId);
        setSelectedMenu("AffiliateDetail");
    }

    const handleViewNotificationDetail = (module,dataId) => {
        if (module==="contact"){
            setSelectedContactId(dataId)
            setSelectedMenu("CustomerDetail")
        }else{
            setSelectedAffiliateId(dataId)
            setSelectedMenu("AffiliateDetail")
        }
    }

    useEffect(()=>{
        setSelectedMenu("Dashboard")
    },[]);

    return (
        <>
            <SideBar handleMenuClick={handleMenuClick} selectedMenu={selectedMenu} />
            {/* Menampilkan komponen berdasarkan menu yang dipilih */}
            <div className='absolute w-[1116px] h-[540px] left-[250px] top-[90px] bg-[#eeeeee]'>
                {selectedMenu === "Dashboard" && <Dashboard />}
                {selectedMenu === "Customer" && <Customer onViewDetail={handleViewDetailContact} />}
                {selectedMenu === "Affiliate" && <Affiliate onViewDetail={handleViewDetailAffiliate} />}
                {selectedMenu === "ChangePassword" && <ChangePassword />}
                {selectedMenu === "CustomerDetail" && <CustomerDetail contactId={selectedContactId} />}
                {selectedMenu === "AffiliateDetail" && <AffiliateDetail affiliateId={selectedAffiliateId} />}
            </div>
            <Header handleMenuClick={handleMenuClick} onViewNotificationDetail={handleViewNotificationDetail} />
        </>
    );
}

export default Home;
