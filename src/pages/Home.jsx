import { useEffect, useState } from 'react';
import Header from '../components/Header';
import SideBar from '../components/SideBar';
import Dashboard from '../components/Dashboard';
import Customer from '../components/Customer';
import Affiliate from '../components/Affiliate';
import ChangePassword from '../components/ChangePassword';

const Home = () => {
    const [selectedMenu, setSelectedMenu] = useState(null);

    const handleMenuClick = (menu) => {
        setSelectedMenu(menu);
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
                {selectedMenu === "Customer" && <Customer />}
                {selectedMenu === "Affiliate" && <Affiliate />}
                {selectedMenu === "ChangePassword" && <ChangePassword />}
            </div>
            <Header handleMenuClick={handleMenuClick} />
        </>
    );
}

export default Home;
