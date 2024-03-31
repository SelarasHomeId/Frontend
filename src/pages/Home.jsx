import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

const Home = () => {

    const navigate = useNavigate()

    const handleClickHome = () =>{
        navigate('/')
    }

    const handleClickAbout = () =>{
        navigate('/about')
    }

    const handleClickContact = () =>{
        navigate('/contact')
    }

    const handleClickArticle = () =>{
        navigate('/article')
    }

    const handleClickProjects = () =>{
        navigate('/project')
    }

  return (
    <>
        <div className='flex justify-center items-center'>
            <Navbar/>
        </div>
        <div className='flex justify-center items-center'>
            <button onClick={handleClickHome} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4'>Home</button>
            <button onClick={handleClickAbout} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4'>About</button>
            <button onClick={handleClickContact} className='btn btn-primary mr-3'>Contact</button>
            <button onClick={handleClickArticle} className='btn btn-primary mr-3'>Article</button>
            <button onClick={handleClickProjects} className='btn btn-primary mr-3'>Projects</button>
            {/* <button onClick={handleClickState} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4'>Count value is {value}</button> */}
        </div>
    </>
  )
}

export default Home
