import LogoSelaras from '../assets/logo-selaras.png';
import Swal from 'sweetalert2';
import PropTypes from 'prop-types';

const SideBar = ({ handleMenuClick, selectedMenu }) => {
    const handleClickLogo = () => {
        Swal.fire({
            icon: 'info',
            title: 'Hello Admin!',
            text: 'This is SelarasHome.Id version 1.0',
        });
    }

    return (
        <div className="absolute w-[250px] h-[633px] left-0 top-0 bg-white">
            <img src={LogoSelaras} className="absolute w-[230px] h-[60px] left-3 top-3 mix-blend-darken cursor-pointer" onClick={handleClickLogo} alt="Selaras Logo" />
            <ul className="absolute left-2 top-[100px] w-[100%] mt-2">
                <li className={`py-2 px-4 hover:bg-blue-300 cursor-pointer mb-2 font-bold text-center border-b-2 ${selectedMenu === "Dashboard" ? "border-blue-500 bg-blue-200" : "border-black"}`} onClick={() => handleMenuClick("Dashboard")}>Dashboard</li>
                <li className={`py-2 px-4 hover:bg-blue-300 cursor-pointer mb-2 font-bold text-center border-b-2 ${selectedMenu === "Customer" ? "border-blue-500 bg-blue-200" : "border-black"}`} onClick={() => handleMenuClick("Customer")}>Customer</li>
                <li className={`py-2 px-4 hover:bg-blue-300 cursor-pointer mb-2 font-bold text-center border-b-2 ${selectedMenu === "Affiliate" ? "border-blue-500 bg-blue-200" : "border-black"}`} onClick={() => handleMenuClick("Affiliate")}>Affiliate</li>
            </ul>
        </div>
    );
}

SideBar.propTypes = {
    handleMenuClick: PropTypes.func.isRequired,
    selectedMenu: PropTypes.string
};

export default SideBar;
