import LogoSelaras from '../assets/logo-selaras.png';
import Swal from 'sweetalert2';

const Dashboard = () => {
  const handleClickLogo = () => {
    Swal.fire({
        icon: 'info',
        title: 'Hello Admin!',
        text: 'This is SelarasHome.Id version 1.0',
    });
}

  return (
    <img src={LogoSelaras} className="absolute w-[430px] h-[100px] left-[360px] top-[200px] mix-blend-darken cursor-pointer" onClick={handleClickLogo} alt="Selaras Logo" />
  )
}

export default Dashboard