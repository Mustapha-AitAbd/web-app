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
    const [prix, setPrix] = useState('');
    const [maxDistance, setMaxDistance] = useState('');
    const [description, setDescription] = useState('');
    const [vehiculeTypeData, setVehiculeTypeData] = useState([]);
    const [vehiculeType, setVehiculeType] = useState([]);
    const [datarentoffer, setDatarentoffer] = useState([]);
    const [period, setPeriod] = useState('');
    const [vehicleDescription, setVehicleDescription] = useState('');
    
    const handleSelectChangeVehiculeType = (event) => {
        setVehiculeType(event.target.value);
    };

      useEffect(() => {
       
          async function fetchDataVehiculeType() {
            const response = await fetch(`${process.env.REACT_APP_API_KEY}/vehiculeType`,{
              method:'POST',
              headers: {
                'Content-type': 'application/json',
                'authorization':  JSON.parse(localStorage.getItem('login'))?.token
              },
            });
            const data = await response.json();
            setVehiculeTypeData(data);
          }
          fetchDataVehiculeType()
        }, []);
        
    function handleSubmitRentoffer(event) {

      event.preventDefault();
      
      const data = {
        prix: prix,
        vehiculeType: vehiculeType,
        maxDistance: maxDistance,
        description: description.split('\n'),
        period: period,
        vehiculeDescription :vehicleDescription.split('\n')
         
      };
      console.log(data);
      
      fetch(`${process.env.REACT_APP_API_KEY}/rentoffer/create`, {
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
          message.success(data.message);
          message.success('Processing complete! Click on the next button');
         console.log('Success:', data.message);
        }else{
          message.error(data.message);
          message.error(data.message);
          
        }
      })
      .catch((error) => {
        message.error(data.message);
        console.error('Error:', error);
      });
     
      
    }
    
    
      
    const steps = [
        {
          title: 'Add One ',
          content:
          
          <form style={{ margin: '0 auto', width: '340px'}} >
          
          <div style={{ fontSize: 22, margin:20, fontFamily: "'Poppins', sans-serif", color:'blue',fontweight: 'bold'}}>Create Rent Offer</div>
          <label className='label-vehiculedetails'>vehicule Type</label><br />
          <select className="input-vehiculedetails" name='rentOffer' value={vehiculeType} onChange={handleSelectChangeVehiculeType} required>
          <option value="">select ..</option>
          
          {vehiculeTypeData.map((option) => (
              <option key={option._id} value={option._id}>
                {option.typeName}
              </option>
            ))}
          </select><br />
          <label className='p-vehiculedetails'></label><br />
          <label className='label-vehiculedetails'>Vehicle Description *</label><br />
          <textarea type="text" className="input-vehiculedetails"name='description'  value={vehicleDescription} onChange={(event) => setVehicleDescription(event.target.value)} required/><br />
          <label className='p-vehiculedetails'></label><br />
          <label className='label-vehiculedetails'>Prix *</label><br />
          <input type="text" className="input-vehiculedetails" name='prix' value={prix} onChange={(event) => setPrix(event.target.value)} required/><br />
          <label className='p-vehiculedetails'></label><br />
          <label className='label-vehiculedetails'>Max Distance *</label><br />
          <input type="text" className="input-vehiculedetails"name='maxDistance' value={maxDistance} onChange={(event) => setMaxDistance(event.target.value)} required/><br />
          <label className='p-vehiculedetails'></label><br /><br />
          <label className='label-vehiculedetails'>Description *</label><br />
          <textarea type="text" className="input-vehiculedetails"name='description' placeholder='You can sperate items by return to next line' value={description} onChange={(event) => setDescription(event.target.value)} required/><br />
          <label className='p-vehiculedetails'></label><br /><br />
          <label className='label-vehiculedetails'>Period *</label><br />
          <input type="text" className="input-vehiculedetails"name='period' value={period} onChange={(event) => setPeriod(event.target.value)}  required/><br />
          <label className='p-vehiculedetails'></label><br /><br />
          <div style={{ position: 'relative' }}>
          <button type="submit" className='my-button ' style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} onClick={handleSubmitRentoffer}>submit</button>
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

  

