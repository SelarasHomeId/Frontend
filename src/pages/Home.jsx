import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useEffect, useState } from 'react'

const Home = () => {

    const [value,setValue] = useState(0)
    const [count,setCount] = useState(0)
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

    const handleClickState = () =>{
        setValue(value+1)
        setCount(count-1)
    }

    useEffect(()=>{
        // console.log('Nilai value berubah:', value)
        // localStorage.setItem('value', value);
        fetch('https://ipinfo.io/?token=1aead2134115d3')
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.error('Error:', error));
    })

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
            <button onClick={handleClickState} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4'>Count value is {value} | {count}</button>
        </div>
    </>
  )
}

export default Home
