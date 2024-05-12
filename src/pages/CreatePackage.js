import React, { useEffect } from 'react'
import { useState } from 'react';
import { Button, message, Steps, theme } from 'antd';
import {Link} from 'react-router-dom';
import { Space } from 'antd';
import SideMenu from '../components/SideMenu/SideMenu';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { Navigate } from 'react-router-dom';


export default function CreateRentOffer() {
    const { token } = theme.useToken();
    const [current, setCurrent] = useState(0);
    const [_id, set_id] = useState('');
    const [packageName, setPackageName] = useState('');
    const [creditsOffer, setCreditsOffer] = useState('');
    const [price, setPrice] = useState('');
 
    function handleSubmitPackage(event) {

      event.preventDefault();
      if( packageName === null || packageName === '' || creditsOffer === null || creditsOffer === '' || price === null || price === '' ){
        message.error('Please fill all the fields');
        return;
      }
      
      const data = {
        packageName: packageName,
        creditsOffer: creditsOffer,
        price: price, 
      };
      console.log(data);
      
      fetch(`${process.env.REACT_APP_API_KEY}/package/create`, {
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
          message.error(data.message);
          NotificationManager.error(data.message);
          
        }
      })
      .catch((error) => {
        NotificationManager.error(data.message);
        console.error('Error:', error);
      });
      
       
    } 
    const steps = [
        {
          title: 'Add One ',
          content:
          <form style={{ margin: '0 auto', width: '340px'}} >
          
          <div style={{ fontSize: 22, margin:20, fontFamily: "'Poppins', sans-serif", color:'blue',fontweight: 'bold'}}>Create One</div>
          <label className='label-vehiculedetails'>Package Name *</label><br />
          <input type="text" className="input-vehiculedetails" name='packageName'  value={packageName} onChange={(event) => setPackageName(event.target.value)} required/><br />
          <label className='p-vehiculedetails'></label><br /><br />
          <label className='label-vehiculedetails'>Credits Offer *</label><br />
          <input type="number" className="input-vehiculedetails"name='creditsOffer'  value={creditsOffer} onChange={(event) => setCreditsOffer(event.target.value)} required/><br />
          <label className='p-vehiculedetails'></label><br /><br />
          <label className='label-vehiculedetails'>Price *</label><br />
          <input type="number" className="input-vehiculedetails"name='price'  value={price} onChange={(event) => setPrice(event.target.value)} required/><br />
          <label className='p-vehiculedetails'></label><br /><br />
          
          <div style={{ position: 'relative' }}>
          <button type="submit" className='my-button ' style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} onClick={handleSubmitPackage}>submit</button>
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
      marginLeft: '30%'
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
        <Link to="/creditpackage">
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

  

