import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './component/Header'
import Footer from './component/Footer'
import Acceuil from './component/Acceuil'
import Liste_des_reuinions from './component/Liste_des_reuinions';
import Liste_des_contrats from './component/Liste_des_contrats';
import ContratDocument from './component/Contrats';
import DashboardAdmin from './component/Dashboard';
import RequireAuth from './component/Auth';


import Login from './component/Login';
import Register from './component/Register_inv';
import Register_enp from './component/Register_enp';
import Poster from './component/Poster_pr';
import Liste_proj from './component/Liste_pro';
import Liste_inv from './component/Liste_pro';
import Liste_des_inv from './Liste_des_inv';
import Liste_des_entrep from './Liste_des_entrep';
import GestProfil from './component/gestprofil';
import BlogDetail from './component/Blogdetail';



function App() {
  return (
    <div className="App">
      <BrowserRouter>

      
          <Header/>
      <Routes >
        <Route path='/' element={<Acceuil/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/Register_inv' element={<Register/>}/>
        <Route path='/Register_enp' element={<Register_enp/>}/>
        <Route path='/Poster' element={<RequireAuth allowedStatuts={['entrepreneur']}><Poster/></RequireAuth>}/>
        <Route path='/Liste_des_entrep' element={<Liste_des_entrep/>}/>
        <Route path='/Liste_des_inv' element={<Liste_des_inv/>}/>
        <Route path='/Liste_proj' element={<Liste_proj/>}/>
        <Route path='/Liste_des_reuinions' element={<RequireAuth><Liste_des_reuinions/></RequireAuth>}/>
        <Route path='/Liste_des_contrats' element={<RequireAuth><Liste_des_contrats/></RequireAuth>}/>
        <Route path='/Contrat/:id' element={<RequireAuth><ContratDocument/></RequireAuth>}/>
        <Route path='/Dashboard_admin' element={<RequireAuth allowedStatuts={['admin']}><DashboardAdmin/></RequireAuth>}/>
        <Route path='/gestprofil' element={<RequireAuth><GestProfil/></RequireAuth>}/>
        <Route path="/blog/:slug" element={<BlogDetail />} />

        
        

        
        


      </Routes>
      <Footer/>
      </BrowserRouter>
    </div>
  );
}

export default App;