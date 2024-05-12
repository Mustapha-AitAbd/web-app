import React from 'react'
import { useState } from 'react';
import { Button, message, Steps, theme } from 'antd';
import AddHardwareProvider from '../components/AppButton/AddHardwareProvider';
import QRCode from 'qrcode.react'
import { useRef } from 'react';
import {Link} from 'react-router-dom';
import { useEffect } from 'react';
import { Alert } from 'antd'
import { useParams } from 'react-router-dom';
import { Space } from 'antd';
import SideMenu from '../components/SideMenu/SideMenu';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { Navigate } from 'react-router-dom';

export default function EditHardware() {
    const { _id } = useParams();
    const { token } = theme.useToken();
    const [current, setCurrent] = useState(0);
    const [hardware, setHardware] = useState('');
    const [simNumber, setSimNumber] = useState('');
    const [simOperator, setSimOperator] = useState('');
    const [IMEI, setIMEI] = useState('');
    const [hardwareprovider, setHardwareprovider] = useState('');
    const [datathardwareprovider, setDatahardwareprovider] = useState([]);

    useEffect(() => {
    
      async function fetchhardwareprovider() {
        const response = await fetch(`${process.env.REACT_APP_API_KEY}/hardwareProvider`,{
          method:'POST',
          headers: {
            'Content-type': 'application/json',
            'authorization':  JSON.parse(localStorage.getItem('login'))?.token
          },
        });
        const data = await response.json();
        setDatahardwareprovider(data);
      }
      fetchhardwareprovider()
      
      async function fetchDatavehiculehardware(_id) {
        try {
          const response = await fetch(`${process.env.REACT_APP_API_KEY}/hardware`,{
            method:'POST',
            body: JSON.stringify({ id: _id}),
            headers: {
              'Content-type': 'application/json',
              'authorization':  JSON.parse(localStorage.getItem('login'))?.token
            },
           
          });
          const data = await response.json();
          console.log(data)
          console.log(_id)
          const filteredPositions = data?.filter((item) => item?._id == _id);
          console.log(filteredPositions[0])
          setSimNumber(filteredPositions[0]?.simNumber)
          console.log(filteredPositions[0]?.simNumber)
          setIMEI(filteredPositions[0]?._id)
          setSimOperator(filteredPositions[0]?.simOperator)
          setHardwareprovider(filteredPositions[0]?.hardwareProvider)
        } catch (error) {
          console.error(error);
        }
       
      }
      fetchDatavehiculehardware(_id)
    }, [_id]);
      
    const handleSelectHardwareprovider = (event) => {
        setHardwareprovider(event.target.value);
      };
 
    
      function handleSubmitHarware(event) {
        if(IMEI === null || IMEI === '' || simNumber === null || simNumber === '' || simOperator === null || simOperator ==='' || hardwareprovider === null || hardwareprovider ===''){
          message.error('Please fill all the fields');
          return;
        }
        event.preventDefault();
        
        const data = {
          _id: IMEI,
          simNumber: simNumber,
          simOperator: simOperator,
          hardwareProvider: hardwareprovider
        };
        console.log(data);
        console.log(IMEI);
        
        fetch(`${process.env.REACT_APP_API_KEY}/hardware/modify`, {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
            'authorization':  JSON.parse(localStorage.getItem('login'))?.token
          },
          body: JSON.stringify({id: IMEI, newData :data })

        })
        
        .then((response) =>{ 
          const data = response.text();
          if(response.status === 200){
            message.success(data?.message);
            message.success('Processing complete! Click on the next button');
           console.log('Success:', data.message);
          }else{
            message.error(data);
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
          title: 'Hardware Configuration',
          content:  <form style={{margin: 10 , width : 440}}>
          <div style={{ fontSize: 22, margin:20, fontFamily: "'Poppins', sans-serif", color:'blue',fontweight: 'bold'}}>Hardware Configuration</div>
          <label className='label-vehiculedetails'>IMEI *</label><br />
          <input type="text" className="input-vehiculedetails" name='_id'  value={IMEI} onChange={(event) => setIMEI(event.target.value)} required /><br />
          <label className='p-vehiculedetails'></label><br /><br />
          <label className='label-vehiculedetails'>Sim Operator *</label><br />
          <input type="text" name='simOperator' className="input-vehiculedetails"  value={simOperator} onChange={(event) => setSimOperator(event.target.value)} required /><br />
          <br />
          <label className='label-vehiculedetails'>Sim Number *</label><br />
          <input type="text" name='simNumber' className="input-vehiculedetails"  value={simNumber} onChange={(event) => setSimNumber(event.target.value)} required /><br />
          <br />
          <label className='label-vehiculedetails'>Hardware Provider *</label><br />
          <select name='hardwareProvider' className="input-vehiculedetails" value={hardwareprovider} onChange={handleSelectHardwareprovider}>
            {datathardwareprovider.map((option) => (
              
              <option key={option._id} value={option._id}>
                {option.HardwareKeyApi}
              </option>
            ))}
          </select><br />
          
          <br />
          <label className='p-vehiculedetails'></label><br /><br />
          <div style={{ position: 'relative' }}>
          <button type="submit" className='my-button ' style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} onClick={(event) => {handleSubmitHarware(event)}}>Edit</button>
          </div>
          <NotificationContainer />
          </form> ,
          
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
      marginLeft: '25%',
      justifyContent: 'center'
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
        <Link to='/vehicules'>
        <Button type="primary" onClick={() => message.success('Processing complete!') }>
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

  

