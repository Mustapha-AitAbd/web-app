import React, { useEffect } from 'react'
import { useState } from 'react';
import { Button, message, Steps, theme } from 'antd';
import {Link} from 'react-router-dom';
import { Space } from 'antd';
import SideMenu from '../components/SideMenu/SideMenu';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { Navigate } from 'react-router-dom';


export default function CreateProvider() {
    const { token } = theme.useToken();
    const [current, setCurrent] = useState(0);
    const [_id, set_id] = useState('');
    const [HardwareKeyApi,setHardwareKeyApi]= useState('')
    const [Model,setModel]= useState('')
    const [Marque,setMarque]= useState('')
    const [baseUri,setBaseUri]= useState('')


     
   

  const handleSubmit = async (event) => {
    if( HardwareKeyApi === null || HardwareKeyApi === '' || Model === null || Model === '' || Marque === null ||  Marque === '' || baseUri === '' || baseUri === null  ){
        message.error('Please fill all the fields');
        return;
      }

      event.preventDefault();
    const HardwareProviderdata = {
      HardwareKeyApi: HardwareKeyApi,
      Model: Model,
      Marque: Marque,
      BaseUri: baseUri
    };
    

    try {
      const response = await fetch( `${process.env.REACT_APP_API_KEY}/hardwareprovider/create`, {
        method: "POST",
        headers: {
          'Content-type': 'application/json',
         
        },
        body: JSON.stringify(HardwareProviderdata),
      });
      
      const data = await response.json();
     
      console.log(data); // handle response data here
    } catch (error) {
      console.error(error);
      
    }
    message.success('Processing complete!')
  };
    
    
      
    const steps = [
        {
          title: 'Add One ',
          content:
          
          <form style={{ margin: '0 auto', width: '340px'}} >
          
          <label className='p-vehiculedetails'></label><br /><br />
          <label className='label-vehiculedetails'>Hardware Key Api *</label><br />
          <input type="text" className="input-vehiculedetails" name='prix' value={HardwareKeyApi} onChange={(event) => setHardwareKeyApi(event.target.value)} required/><br />
          <label className='p-vehiculedetails'></label><br /><br />
          <label className='label-vehiculedetails'>Base Uri *</label><br />
          <input type="text" className="input-vehiculedetails"name='maxDistance' value={baseUri} onChange={(event) => setBaseUri(event.target.value)} required/><br />
          <label className='p-vehiculedetails'></label><br /><br />
          <label className='label-vehiculedetails'>Model *</label><br />
          <input type="text" className="input-vehiculedetails"name='description' value={Model} onChange={(event) => setModel(event.target.value)} required/><br />
          <label className='p-vehiculedetails'></label><br /><br />
          <label className='label-vehiculedetails' >Marque *</label>
          <input type="text" className="input-vehiculedetails"name='description' value={Marque} onChange={(event) => setMarque(event.target.value)} required/><br />
          <label className='p-vehiculedetails'></label><br /><br />
          <div style={{ position: 'relative' }}>
          <button type="submit" className='my-button ' style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} onClick={handleSubmit}>submit</button>
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
        <Link to="/rentoffer">
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

  

