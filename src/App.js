import React from 'react';
import Header from './components/AppHeader/Header';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashbord from './pages/Dashbord';
import CreateUser from './pages/CreateUser';
import Clients from './pages/Clients';
import Payment from './pages/Payment';
import Vehicule from './pages/Vehicule';
import CreateVehicule from './pages/Createvehicule';
import CreateClient from './pages/Createclient';
import Traject from './pages/Traject';
import DetailsVehicules from './pages/DetailsVehicules';
import TrajectOfVehicule from './pages/TrajectOfVehicule';
import LoginPage from './pages/LoginPage';
import AddZone from './pages/Addzone';
import Zones from './pages/Zones';
import EditZone from './pages/Editzone';
import Editvehicule from './pages/Editvehicule';
import Rent from './pages/Rent';
import CreditPackage from './pages/CreditPackage';
import Setting from './pages/Setting'
import DetailsRent from './pages/DetailsRent';
import CreateRent from './pages/CreateRent';
import Rentoffer from './pages/Rentoffer';
import CreateRentOffer from './pages/CreateRentOffer';
import CreatePackage from './pages/CreatePackage';
import EditPackage from './pages/EditPackage';
import EditRentoffer from './pages/EditRentoffer';
import EditRent from './pages/EditRent';
import EditClient from './pages/EditClient';
import Invoice from './pages/Invoice';
import InvoiceOfClient from './pages/InvoiceOfClient';
import Roles from './pages/Roles';
import CreateRoles from './pages/CreateRoles';
import EditRoles from './pages/EditRoles';
import User from './pages/User';
import EditUser from './pages/EditUser';
import VehiculeType from './pages/VehiculeType';
import CreateVehicleType from './pages/CreateVehicleType';
import EditVehicleType from './pages/EditVehicleType';
import HardwareProvider from './pages/HardwareProvider';
import CreateProvider from './pages/CreateProvider';
import EditProvider from './pages/EditProvider';
import ForgotPassword from './pages/ForgotPassword';
import EditPasswordForLogin from './pages/EditPasswordForLogin';
import Hardware from './pages/Hardware';
import CreateHardware from './pages/CreateHardware';
import EditHardware from './pages/EditHardware';


function App() {
  console.log(process.env.REACT_APP_API_KEY);
  return (
    <div className="App">
     <Header />
     <Routes>
        <Route path="/" element={<Dashbord />} />
        <Route path="/invoice/invoiceOfClient/:_id" element={<InvoiceOfClient />} />
        <Route path="/invoice" element={<Invoice />} />
        <Route path="/createUser" element={<CreateUser />} />
        <Route  path="/User/EditUser/:_id" element={<EditUser />} />
        <Route path="/User" element={<User/>} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/clients/EditClient/:_id" element={<EditClient />} />
        <Route path="/invoice/EditClient/:_id" element={<EditClient />} />
        <Route path="/paiements" element={<Payment />} />
        <Route path="/vehicules" element={<Vehicule />} />
        <Route path="/traject" element={<Traject />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path='/createVehicule' element={<CreateVehicule />} />
        <Route path='/CreateClient' element={<CreateClient />} />
        <Route path='/addzone' element={<AddZone />} />
        <Route path='/Zones/editzone/:_id' element={<EditZone />} />
        <Route path='/Zones' element={<Zones />} />
        <Route path='vehicules/DetailsVehicules/:_id' element={<DetailsVehicules />} />
        <Route path='traject/TrajectOfVehicule/:_id' element={<TrajectOfVehicule />} />
        <Route path='vehicules/DetailsVehicules/TrajectOfVehicule' element={<TrajectOfVehicule />} />
        <Route path='vehicules/DetailsVehicules/:id/TrajectOfVehicule/:_id' element={<TrajectOfVehicule />} />
        <Route path='vehicules/DetailsVehicules/:id/Editvehicule/:_id' element={<Editvehicule />} />
        <Route path='/rent' element={<Rent />} />
        <Route path='/rent/DetailsRent/:_id' element={<DetailsRent />} />
        <Route path='/rent/DetailsRent/:id/EditRent/:_id' element={<EditRent />} />
        <Route path='/creditpackage/EditPackage/:_id' element={<EditPackage />} />
        <Route path='/creditpackage' element={<CreditPackage />} />
        <Route path='/CreatePackage' element={<CreatePackage />} />
        <Route path='/rent/DetailsRent/:id/CreateRent' element={<CreateRent />} />
        <Route path='/CreateRent' element={<CreateRent />} />
        <Route path='/rentoffer' element={<Rentoffer />} />
        <Route path='/rentoffer/EditRentoffer/:_id' element={<EditRentoffer />} />
        <Route path='/Setting' element={<Setting />} />
        <Route path='/CreateRentOffer' element={<CreateRentOffer />} />
        <Route path='/roles' element={<Roles />} />
        <Route path='/CreateRoles' element={<CreateRoles />} />
        <Route path='/roles/EditRole/:_id' element={<EditRoles />} />
        <Route path='/vehiculeType' element={<VehiculeType />} />
        <Route path='/CreateVehicleType' element={<CreateVehicleType />} />
        <Route path='/vehiculeType/EditVehicleType/:_id' element={<EditVehicleType />} />
        <Route path='/hardwareprovider' element={<HardwareProvider />} />
        <Route path='/CreateProvider' element={<CreateProvider />} />
        <Route path='/hardwareprovider/EditProvider/:_id' element={<EditProvider />} />
        <Route path='/forgotpassword' element={<ForgotPassword />} />
        <Route path='/editpassword' element={<EditPasswordForLogin />} />
        <Route path='/hardware' element={<Hardware />} />
        <Route path='/CreateHardware' element={<CreateHardware />} />
        <Route path='/hardware/EditHardware/:_id' element={<EditHardware />} />
        <Route path='*' element={<h1>404 Not Found</h1>} />
        

      </Routes>
     
     
    </div>
  );
}

export default App;
