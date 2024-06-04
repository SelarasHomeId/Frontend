import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home';
import Article from './pages/Article';
import Projects from './pages/Projects';
import Contact from './pages/Contact';

function App() {
  return(
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/home' element={<Home/>}/>
        <Route path='/article' element={<Article/>}/>
        <Route path='/projects' element={<Projects/>}/>
        <Route path='/contact' element={<Contact/>}/>
      </Routes>
  </BrowserRouter>
  )
}

export default App;
