import React, { useEffect } from 'react'
import { useState } from 'react';
import { Button, message, Steps, theme } from 'antd';
import {Link} from 'react-router-dom';
import { Space } from 'antd';
import SideMenu from '../components/SideMenu/SideMenu';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { Navigate } from 'react-router-dom';


export default function CreateRent() {
    const { token } = theme.useToken();
    const [current, setCurrent] = useState(0);
    const [city, setcity] = useState('');
    const [clientId, setClientId] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [pickupDate, setPickupDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [amount, setAmount] = useState('');
    const [rentOffer, setRentOffer] = useState('');
    const [selectedOption, setSelectedOption] = useState('Processing');
    const [orderStatus, setOrderStatus] = useState('');
    const [orderType, setOrderType] = useState('instant');
    const [datacity, setDatacity] = useState([]);
    const [datarentoffer, setDatarentoffer] = useState([]);
    const [fullName, setFullName] = useState('');
    const [address, setAdress] = useState('');
    
    const handleSelectChangeRentOffer = (event) => {
        setRentOffer(event.target.value);
    };
    const handleSelectChangeCity = (event) => {
        setcity(event.target.value);
    };
    const handleSelectChangeOrderStatus = (event) => {
        setOrderStatus(event.target.value);
      };
      const handleSelectChangeOrderType = (event) => {
        setOrderType(event.target.value);
      };

      useEffect(() => {
        async function fetchDataRentOffer() {
            const response = await fetch(`${process.env.REACT_APP_API_KEY}/rentoffer`,{
              method:'POST',
              headers: {
                'Content-type': 'application/json',
                'authorization':  JSON.parse(localStorage.getItem('login'))?.token
              },
            });
            const data = await response.json();
            setDatarentoffer(data);
          }
          fetchDataRentOffer()
          async function fetchDataZone() {
            const response = await fetch(`${process.env.REACT_APP_API_KEY}/zone/zones`,{
              method:'POST',
              headers: {
                'Content-type': 'application/json',
                'authorization':  JSON.parse(localStorage.getItem('login'))?.token
              },
            });
            const data = await response.json();
            setDatacity(data);
          }
          fetchDataZone()
        }, []);
    function handleSubmitRent(event) {

      if( address === null || address === '' || pickupDate === null || pickupDate === '' || returnDate === null || returnDate === '' || phoneNumber === null || phoneNumber === '' || amount === null || amount === '' || rentOffer === null || rentOffer === '' || orderType === null || orderType === '' || fullName === null || fullName === '' ){
        message.error('Please fill all the fields');
        return;
      }

      event.preventDefault();
      
      const data = {
        address: address,
        clientId: clientId.length==0? null: clientId,
        pickupDate: pickupDate,
        returnDate: returnDate,
        amount: amount,
        rentOffer: rentOffer,
        orderType: orderType,
        phone: phoneNumber,
        fullName: fullName,
        
      };
      console.log(data);
      
      fetch(`${process.env.REACT_APP_API_KEY}/rent/create`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          'authorization':  JSON.parse(localStorage.getItem('login'))?.token
        },
        body: JSON.stringify(data)

      })
      .then((response) =>{ 
        const data = response.text();
        if(response.status === 200){
          NotificationManager.success(data.message);
          message.success('Processing complete! Click on the next button');
         console.log('Success:', data.message);
        }else{
          NotificationManager.error(data.message);
          
        }
      })
      .catch((error) => {
        NotificationManager.error(error.message);
        console.error('Error:', error);
      });
     
      
    }
    
    
      
    const steps = [
        {
          title: 'Add One ',
          content:
          <form style={{ margin: '0 auto', width: '360px'}}>
          <div style={{ fontSize: 22, margin:20, fontFamily: "'Poppins', sans-serif", color:'blue',fontweight: 'bold'}}>Create One</div>
          <label className='label-vehiculedetails'> Address *</label><br />
          <input type="text" className="input-vehiculedetails" name='address'  value={address} onChange={(event) => setAdress(event.target.value)} required/><br />
          <br />
          <label className='p-vehiculedetails'></label><br /><br />
          <label className='label-vehiculedetails'>client Id *</label><br />
          <input type="text" className="input-vehiculedetails" name='clientId'  value={clientId} onChange={(event) => setClientId(event.target.value)} required/><br />
          <label className='p-vehiculedetails'></label><br /><br />
          <label className='label-vehiculedetails'>Full Name </label><br />
          <input type="text" className="input-vehiculedetails" name='fullName'  value={fullName} onChange={(event) => setFullName(event.target.value)} required/><br />
          <label className='p-vehiculedetails'></label><br /><br />
          <label className='label-vehiculedetails'>Phone Number *</label><br />
          <input type="text" className="input-vehiculedetails"name='phoneNumber'  value={phoneNumber} onChange={(event) => setPhoneNumber(event.target.value)} required/><br />
          <label className='p-vehiculedetails'></label><br /><br />
          <label className='label-vehiculedetails'>Pick up Date *</label><br />
          <input type="date" className="input-vehiculedetails"name='pickupDate'  value={pickupDate} onChange={(event) => setPickupDate(event.target.value)} required/><br />
          <label className='p-vehiculedetails'></label><br /><br />
          <label className='label-vehiculedetails'>Return Date *</label><br />
          <input type="date" className="input-vehiculedetails"name='returnDate'  value={returnDate} onChange={(event) => setReturnDate(event.target.value)} required/><br />
          <label className='p-vehiculedetails'></label><br /><br />
          <label className='label-vehiculedetails'>Amount *</label><br />
          <input type="number" className="input-vehiculedetails"name='amount'  value={amount} onChange={(event) => setAmount(event.target.value)} required/><br />
          <label className='p-vehiculedetails'></label><br /><br />
          <label className='label-vehiculedetails'>Rent Offer</label><br />
          <select className="input-vehiculedetails" name='rentOffer'  value={rentOffer} onChange={handleSelectChangeRentOffer}>
          <option value="instant">select ..</option>
          {datarentoffer?.map((option) => (
              <option key={option._id} value={option._id}>
                Prix : {option.prix} DH , Max Distance : {option.maxDistance}
              </option>
            ))}
          </select><br />
          <label className='p-vehiculedetails'></label><br /><br />
          <label className='label-vehiculedetails'>Order Type</label><br />
          <select className="input-vehiculedetails" name='rentOffer'  value={orderType} onChange={handleSelectChangeOrderType}>
          <option value="">select ..</option>
          <option value="instant">instant</option>
          <option value="onArrival">onArrival</option>
         
          </select><br />
          <label className='p-vehiculedetails'></label><br /><br />
          <div style={{ position: 'relative' }}>
          <button type="submit" className='my-button ' style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} onClick={handleSubmitRent}>submit</button>
          </div>
          <NotificationContainer />
          
          </form> ,
        },
        
        {
          title: 'Last',
          content:  <p style={{alignContent:'center', margin: 30}} >Are you sure you want to save this information?</p>,
        },
      ];
   
  
    const next = () => {
      setCurrent(current + 1);
    };
  
    const prev = () => {
      setCurrent(current - 1);
    };
  
    const items = steps.map((item) => ({ key: item.title, title: item.title }));
  
    const contentStyle: React.CSSProperties = {
      lineHeight: '100%',
      color: token.colorTextTertiary,
      backgroundColor: token.colorFillAlter,
      borderRadius: token.borderRadiusLG,
      border: `1px dashed ${token.colorBorder}`,
      marginTop: 16,
      marginLeft: '25%'
    };
  return (
    <>
    {localStorage.getItem('login') === null ? <Navigate to="/login" /> :
    <Space className="SideMenuAndPageContent">
      <SideMenu />
    <div className="PageContent">
    <Steps current={current} items={items} style={{margin:30, width: 1000}}/>
    <div style={contentStyle}>{steps[current].content}</div>
    <div style={{ marginTop: 24 }}>
      {current < steps.length - 1 && (
        <Button type="primary" onClick={() => next()}>
          Next
        </Button>
      )}
      {current === steps.length - 1 && (
        <Link to="/rent">
        <Button type="primary" onClick={() => message.success('Processing complete!')}>
          Done
        </Button>
        </Link>
      )}
      {current > 0 && (
        <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
          Previous
        </Button>
      )}
    </div>
    </div>
    </Space>
    }
  </>
);
};

  

