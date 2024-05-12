import React, { useEffect } from 'react'
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, message, Steps, theme } from 'antd';
import {Link} from 'react-router-dom';
import { Space } from 'antd';
import SideMenu from '../components/SideMenu/SideMenu';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { Navigate } from 'react-router-dom';


export default function CreateRentOffer() {
    const { _id } = useParams();
    const { token } = theme.useToken();
    const [current, setCurrent] = useState(0);
    const [typeName, setTypeName] = useState('');
    const [costPerMinuteParked, setCostPerMinuteParked] = useState('');
    const [costPerMinuteRide, setCostPerMinuteRide] = useState('');
    const [image, setImage] = useState('');
    const [v100, setV100] = useState('');
    const [v80, setV80] = useState('');
    const [v60, setV60] = useState('');
    const [v40, setV40] = useState('');
    const [v20, setV20] = useState('');

    useEffect(() => {
        async function fetchDatavehicule(_id) {
            try {
              const response = await fetch(`${process.env.REACT_APP_API_KEY}/vehiculeType`,{
                method:'POST',
                body: JSON.stringify({ id: _id}),
                headers: {
                  'Content-type': 'application/json',
                 
                },
               
              });
              const data = await response.json();
              const filteredPositions = data.filter((item) => item._id == _id);
              setTypeName(filteredPositions[0].typeName)
              setCostPerMinuteParked(filteredPositions[0].costPerMinuteParked)
              setCostPerMinuteRide(filteredPositions[0].costPerMinuteRide)
              setImage(filteredPositions[0].image)
              setV100(filteredPositions[0].batteryProfile.v100)
              setV80(filteredPositions[0].batteryProfile.v80)
              setV60(filteredPositions[0].batteryProfile.v60)
              setV40(filteredPositions[0].batteryProfile.v40)
              setV20(filteredPositions[0].batteryProfile.v20)

            
            } catch (error) {
              console.error(error);
            }
          }
          fetchDatavehicule(_id);
        }, [_id]);
     
        
    function handleSubmit(event) {

      event.preventDefault();
      
      const data = {
        typeName: typeName,
        costPerMinuteParked: costPerMinuteParked,
        costPerMinuteRide: costPerMinuteRide,
        batteryProfile: JSON.stringify({
            v100: v100,
            v80: v80,
            v60: v60,
            v40: v40,
            v20: v20
          })
        
      };

      const TypeData = {
        id: _id, newData: JSON.stringify(data)
      }

      console.log(data);
      var form_data = new FormData();
      for ( var key in TypeData) {
      form_data.append(key, TypeData[key]);
      

    }
    form_data.append('image', image);
      
      fetch(`${process.env.REACT_APP_API_KEY}/vehiculeType/modify`, {
        method: 'POST',
       
        body: form_data
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
          
          <label className='p-vehiculedetails'></label><br /><br />
          <label className='label-vehiculedetails'>Type Name *</label><br />
          <input type="text" className="input-vehiculedetails" name='prix' value={typeName} onChange={(event) => setTypeName(event.target.value)} required/><br />
          <label className='p-vehiculedetails'></label><br /><br />
          <label className='label-vehiculedetails'>Cost Per Minute Parked *</label><br />
          <input type="text" className="input-vehiculedetails"name='maxDistance' value={costPerMinuteParked} onChange={(event) => setCostPerMinuteParked(event.target.value)} required/><br />
          <label className='p-vehiculedetails'></label><br /><br />
          <label className='label-vehiculedetails'>Cost Per Minute Parked *</label><br />
          <input type="text" className="input-vehiculedetails"name='description' value={costPerMinuteRide} onChange={(event) => setCostPerMinuteRide(event.target.value)} required/><br />
          <label className='p-vehiculedetails'></label><br /><br />
          <label className='label-vehiculedetails' >zone Image *</label>
          <input name="zoneImage" className="input-vehiculedetails"  type= 'file'  onChange={(event) => setImage(event.target.files[0])}  placeholder='Image'/> <br /><br />
          <label className='p-vehiculedetails'></label><br /><br />
          <label className='label-vehiculedetails'>Battery Profile</label><br /><br />
          <label className='label-vehiculedetails'>V100 *</label><br />
          <input type="text" className="input-vehiculedetails"name='description' value={v100} onChange={(event) => setV100(event.target.value)} required/><br />
          <label className='p-vehiculedetails'></label><br /><br />
          <label className='label-vehiculedetails'>V80 *</label><br />
          <input type="text" className="input-vehiculedetails"name='description' value={v80} onChange={(event) => setV80(event.target.value)} required/><br />
          <label className='p-vehiculedetails'></label><br /><br />
          <label className='label-vehiculedetails'>V60 *</label><br />
          <input type="text" className="input-vehiculedetails"name='description' value={v60} onChange={(event) => setV60(event.target.value)} required/><br />
          <label className='p-vehiculedetails'></label><br /><br />
          <label className='label-vehiculedetails'>V40 *</label><br />
          <input type="text" className="input-vehiculedetails"name='description' value={v40} onChange={(event) => setV40(event.target.value)} required/><br />
          <label className='p-vehiculedetails'></label><br /><br />
          <label className='label-vehiculedetails'>V20 *</label><br />
          <input type="text" className="input-vehiculedetails"name='description' value={v20} onChange={(event) => setV20(event.target.value)} required/><br />
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
        <Link to="/vehiculeType">
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

  

