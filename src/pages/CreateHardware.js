import React, { useEffect } from 'react'
import { useState } from 'react';
import { Button, message, Steps, theme } from 'antd';
import {Link} from 'react-router-dom';
import { Space } from 'antd';
import SideMenu from '../components/SideMenu/SideMenu';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { Navigate } from 'react-router-dom';
import AddHardwareProvider from '../components/AppButton/AddHardwareProvider';


export default function Createclient() {
    const { token } = theme.useToken();
    const [current, setCurrent] = useState(0);
    const [_id, set_id] = useState('');
    const [simNumber, setSimNumber] = useState('');
    const [simOperator, setSimOperator] = useState('');
    const [hardwareprovider, setHardwareprovider] = useState('');
    const [selectedOption, setSelectedOption] = useState('');
    const [datathardwareprovider, setDatahardwareprovider] = useState([]);

    const handleSelectHardwareprovider = (event) => {
        setHardwareprovider(event.target.value);
      };

    useEffect(() => {
        fetchhardwareprovider()
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
        fetchhardwareprovider();
        }, []);
    
    
    function handleSubmitHarware(event) {
       

        event.preventDefault();
        if(_id === null || _id === '' || simNumber === null || simNumber === '' || simOperator === null || simOperator ==='' || hardwareprovider === null || hardwareprovider ===''){
          message.error('Please fill all the fields');
          return;
        }
        const data = {
          _id: _id,
          simNumber: simNumber,
          simOperator: simOperator,
          hardwareProvider: hardwareprovider
        };
        console.log(data);
        
        fetch(`${process.env.REACT_APP_API_KEY}/hardware/create`, {
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
          title: 'Create Customer ',
          content:
          <form style={{margin: 10}}>
          
          <div style={{ fontSize: 22, margin:20, fontFamily: "'Poppins', sans-serif", color:'blue',fontweight: 'bold'}}>Create Customer</div>
          <label className='label-vehiculedetails'>IMEI *</label><br />
          <input type="text" className="input-vehiculedetails" name='_id' required value={_id} onChange={(event) => set_id(event.target.value)}/><br />
          <label className='p-vehiculedetails'></label><br /><br />
          <label className='label-vehiculedetails'>Sim Number *</label><br />
          <input type="text" className="input-vehiculedetails" name='simNumber' value={simNumber} onChange={(event) => setSimNumber(event.target.value)} required/><br />
          <label className='p-vehiculedetails'></label><br /><br />
          <label className='label-vehiculedetails'>Sim Operator *</label><br />
          <input type="text" className="input-vehiculedetails"name='simOperator'required value={simOperator} onChange={(event) => setSimOperator(event.target.value)}/><br />
          <label className='p-vehiculedetails'></label><br /><br />
          <label className='label-vehiculedetails'>hardware provider *</label><br />
          <select name='hardwareProvider' className="input-vehiculedetails" value={hardwareprovider} onChange={handleSelectHardwareprovider}>
            <option>Select ...</option>
            {datathardwareprovider.map((option) => (
              
              <option key={option._id} value={option._id}>
                {option.Marque} {option.Model}
              </option>
            ))}
          </select>
          <br />
          <AddHardwareProvider />
          <br /><br />
          <div style={{ position: 'relative', marginTop: 10 }}>
          <button type="submit" className='my-button ' style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} onClick={handleSubmitHarware}>submit</button>
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
        <Link to="/hardware">
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

  

