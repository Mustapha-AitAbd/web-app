import React from 'react'
import { useState } from 'react';
import { Button, message, Steps, theme } from 'antd';
import AddHardwareProvider from '../components/AppButton/AddHardwareProvider';
import QRCode from 'qrcode.react'
import { useRef } from 'react';
import {Link} from 'react-router-dom';
import { useEffect } from 'react';
import { Alert } from 'antd'
import { Space } from 'antd';
import SideMenu from '../components/SideMenu/SideMenu';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { Navigate } from 'react-router-dom';
import { Select } from 'antd';



export default function Createvehicule() {
    const { token } = theme.useToken();
    const [current, setCurrent] = useState(0);
    const [type, setType] = useState('');
    const [_id, set_id] = useState('');
    const [hardware, setHardware] = useState('');
    const [simNumber, setSimNumber] = useState('');
    const [cradpin, setCradpin] = useState('');
    const [simOperator, setSimOperator] = useState('');
    const [isChecked, setIsChecked] = useState(false);
    const [selectedOptiontype, setSelectedOptiontype] = useState('');
    const [selectedOption, setSelectedOption] = useState('');
    const [IMEI, setIMEI] = useState(null);
    const [hardwareprovider, setHardwareprovider] = useState('');
    const canvasRef = useRef(null);
    const [datacity, setDatacity] = useState([]);
    const [datatypevehicle, setDatatypevehicle] = useState([]);
    const [datathardwareprovider, setDatahardwareprovider] = useState([]);
    const [hardwareData, setHardwareData] = useState([]);

    

    useEffect(() => {
      async function fetchDataHardware() {
        const response = await fetch(`${process.env.REACT_APP_API_KEY}/hardware`,{
          method:'POST',
          headers: {
            'Content-type': 'application/json',
            'authorization':  JSON.parse(localStorage.getItem('login'))?.token
          },
        });
        const data = await response.json();
        function transformData (data) {
          return data.map((item) => {
            return {
              value: item._id,
              label: item._id
              
           
            };
          });
        };
        setHardwareData(transformData (data));
        console.log(hardwareData);
      }
      fetchDataHardware();
     
      
      

      async function fetchData() {
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
      fetchData()
      async function fetchIdType() {
        const response = await fetch(`${process.env.REACT_APP_API_KEY}/vehiculeType`,{
          method:'POST',
          headers: {
            'Content-type': 'application/json',
            'authorization':  JSON.parse(localStorage.getItem('login'))?.token
          },
        });
        const data = await response.json();
        setDatatypevehicle(data);
      }
      fetchIdType()
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
      
    }, []);
    const handleInputChangeIMEI = e => {
      setHardware(e);
    };
    
      const downloadQRCode = () => {
        const canvas = canvasRef.current?.querySelector('canvas');
        if (canvas) {
          const url = canvas.toDataURL();
          const a = document.createElement('a');
          a.download = 'QRCode.png';
          a.href = url;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
      }}
    const handleSelectChange = (event) => {
      setSelectedOption(event.target.value);
    };
    const handleSelectChangeType = (event) => {
      setSelectedOptiontype(event.target.value);
    };

    function handleSubmit(event) {

        event.preventDefault();
        if( _id === null || _id === '' || hardware === null || hardware === '' || selectedOption === null || selectedOption === '' || selectedOptiontype === null || selectedOptiontype === ''){
          message.error('Please fill all the fields');
          return;
        }
        
        const data = {
          _id: _id,
          idType: selectedOptiontype,
          hardware: hardware,
          city: selectedOption
        };
        
        console.log(data);
        
        fetch(`${process.env.REACT_APP_API_KEY}/vehicule/create`, {
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
          
          title: 'Vehicule Details',
          content:
          <>
          <NotificationContainer />
          <form style={{ margin: '0 auto', width: '360px'}} >
          
          <div style={{ fontSize: 22, margin:20, fontFamily: "'Poppins', sans-serif", color:'blue',fontweight: 'bold'}}>Vehicule Data</div>
          <label className='label-vehiculedetails'>Vehicle Type *</label><br />
          <select className="input-vehiculedetails" name='idType' value={selectedOptiontype} onChange={handleSelectChangeType} required>
            <option>Select ..</option>
            {datatypevehicle.map((option) => (
              <option key={option._id} value={option._id} >
                {option.typeName}
              </option>
            ))}
          </select><br />
          <label className='p-vehiculedetails'></label><br /><br />
          <label className='label-vehiculedetails'>Vehicle id *</label><br />
          <input type="text" className="input-vehiculedetails" value={_id} onChange={(event) => set_id(event.target.value)} name='_id' required/><br />
          <label className='p-vehiculedetails'>Enter the Vehicle's ID</label><br /><br />
          <label className='label-vehiculedetails'>Hardware </label><br />
          <Select
            className="input-vehiculedetails"
            onChange={handleInputChangeIMEI}
            value={hardware}
            showSearch
            placeholder="Search IMEI"
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label?.toString() ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={hardwareData}
            required
          />
          <label className='p-vehiculedetails'>Is the series number of the vehicle's chassis</label><br /><br />
          <label className='label-vehiculedetails' name='city'>City</label><br />
          <select className="input-vehiculedetails" value={selectedOption} onChange={handleSelectChange}>
          <option>Select ..</option>
            {datacity?.map((option) => (
              <option key={option?.zoneName} value={option?.zoneName}>
                {option?.zoneName}
              </option>
            ))}
          </select><br />
          <label className='p-vehiculedetails'></label><br /><br />
          <div style={{ position: 'relative', marginTop: 10 }}>
          <button type="submit" className='my-button ' style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} onClick={(event) => {handleSubmit(event)}}>submit</button>
          </div>
          <NotificationContainer />
          </form> ,
          </>
        },
        
        {
          title: 'Download QRCode',
          
          content:  <>
          {
            _id === '' ? <Alert message="Please enter the vehicle's ID for Download QR code" type="warning" showIcon /> : 
            <>
           <div style={{ margin: 30, color: 'blue' }}>  Download your QR code </div> <br />
          <div id="myqrcode" ref={canvasRef}>
            <QRCode value={type} style={{ marginBottom: 40, marginLeft: 140 }} /><br />
            <div style={{ position: 'relative' }}>
              <button type="primary" className='my-button ' style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}  onClick={downloadQRCode}>Download</button>
            </div>
             
            </div>
          <p style={{alignContent:'center', margin: 30}} >Are you sure you want to save this information?</p>
            </>
          }
          
         
          </>,
          
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
    <div style={{ marginTop: 24 , marginLeft: 40}}>
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

  

