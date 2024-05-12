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

export default function Editvehicule() {
    const { _id } = useParams();
    const { token } = theme.useToken();
    const [current, setCurrent] = useState(0);
    const [type, setType] = useState('');
    const [id, set_id] = useState('');
    const [hardware, setHardware] = useState('');
    const [simNumber, setSimNumber] = useState('');
    const [simOperator, setSimOperator] = useState('');
    const [isChecked, setIsChecked] = useState(false);
    const [selectedOptiontype, setSelectedOptiontype] = useState('');
    const [selectedOption, setSelectedOption] = useState('');
    const [IMEI, setIMEI] = useState('');
    const [vehiculeStatus, setVehiculeStatus] = useState('');
    const [hardwareprovider, setHardwareprovider] = useState('');
    const canvasRef = useRef(null);
    const [datacity, setDatacity] = useState([]);
    const [datatypevehicle, setDatatypevehicle] = useState([]);
    const [datathardwareprovider, setDatahardwareprovider] = useState([]);

    useEffect(() => {
        async function fetchDatavehicule(_id) {
            try {
              const response = await fetch(`${process.env.REACT_APP_API_KEY}/vehicule`,{
                method:'POST',
                body: JSON.stringify({ id: _id}),
                headers: {
                  'Content-type': 'application/json',
                  'authorization':  JSON.parse(localStorage.getItem('login'))?.token
                },
               
              });
              const data = await response.json();
              const filteredPositions = data.filter((item) => item._id == _id);
              console.log(filteredPositions[0])
              console.log(filteredPositions[0].idType)
              setHardware(filteredPositions[0].hardware)
              setVehiculeStatus(filteredPositions[0].vehiculeStatus)
              setSelectedOption(filteredPositions[0].city)
              set_id(_id)
              if (filteredPositions.length > 0) {
                const findidType = datatypevehicle.filter((option) => option._id ===filteredPositions[0].idType);
                console.log('valide 1')
                if (findidType) {
                    setSelectedOptiontype(findidType[0]?._id);
                }else{console.log("data findidType empty !")}
              }
              
            
            } catch (error) {
              console.error(error);
            }
          }
          fetchDatavehicule(_id);
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
      
    }, [_id]);

  
     
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
          const filteredPositions = data.filter((item) => item._id === hardware);
          setSimNumber(filteredPositions[0]?.simNumber)
          setIMEI(filteredPositions[0]?._id)
          setSimOperator(filteredPositions[0]?.simOperator)
          setHardwareprovider(filteredPositions[0]?.hardwareProvider)
        } catch (error) {
          console.error(error);
        }
      }
      
   

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
    
    const handleSelectVehiculeStatus = (event) => {
      setVehiculeStatus(event.target.value);
    };
    const handleSelectHardwareprovider = (event) => {
        setHardwareprovider(event.target.value);
      };
    const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked);
      };
    function handleSubmit(event) {
      if( _id === null || _id === '' || hardware === null || hardware === '' || selectedOption === null || selectedOption === '' || selectedOptiontype === null || selectedOptiontype === '' || vehiculeStatus ===null || vehiculeStatus ===''){
        message.error('Please fill all the fields');
        return;
      }

        event.preventDefault();
        
        const data = {
          _id: _id,
          idType: selectedOptiontype,
          hardware: hardware,
          city: selectedOption,
          vehiculeStatus: vehiculeStatus
        };
        console.log(data);
        console.log(_id)
        console.log(selectedOptiontype)
        fetch(`${process.env.REACT_APP_API_KEY}/vehicule/modify`, {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
            'authorization':  JSON.parse(localStorage.getItem('login'))?.token
          },
          
          body: JSON.stringify({id: {_id}, newData :data })

        })
        
        .then((response) =>{ 
          const data = response.text();
          if(response.status === 200){
            message.success(data?.message);
            message.success('Processing complete! Click on the next button');
           console.log('Success:', data?.message);
          }else{
            message.error('error server');
            message.error(data?.message);
            
          }
        })
        .catch((error) => {
          NotificationManager.error(data);
          console.error('Error:', error);
        });
        
      }
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
          
          title: 'Vehicule Details',
          content:
          <>
          <NotificationContainer />
          <form style={{ margin: '0 auto', width: '360px'}} >
          <div style={{ fontSize: 22, margin:20, fontFamily: "'Poppins', sans-serif", color:'blue',fontweight: 'bold'}}>Vehicule Data</div>
          <label className='label-vehiculedetails' >ID Type</label><br />
          <select className="input-vehiculedetails" name='idType' value={selectedOptiontype} onChange={handleSelectChangeType} required>
            {datatypevehicle.map((option) => (
              <option key={option._id} value={option._id} >
                {option.typeName}
              </option>
            ))}
          </select><br /><br />
          
          <label className='label-vehiculedetails'>Vehicule ID</label><br />
              <input className="input-vehiculedetails" type="text"value={_id} onChange={(event) => set_id(event.target.value)} name='_id' required/><br /><br />
          
          <label className='label-vehiculedetails'>Hardware</label><br />
          <input className="input-vehiculedetails" type="text" name='hardware' value={hardware} onChange={(event) => setHardware(event.target.value)} /><br /><br />
          
          <label className='label-vehiculedetails'>City {selectedOption}</label><br />
              <select className="input-vehiculedetails" value={selectedOption} onChange={handleSelectChange}>
                <option>Select ..</option>
                    {datacity?.map((option) => (
                    <option key={option?.zoneName} value={option?.zoneName}>
                        {option?.zoneName}
                    </option>
                    ))}
          </select><br /><br />
          
          <label className='label-vehiculedetails'>vehiculeStatus {vehiculeStatus}</label><br />
          <select className="input-vehiculedetails" value={vehiculeStatus} onChange={handleSelectVehiculeStatus}>
                <option   value='maintenance'> maintenance</option>
                <option  value='active'>active</option>
                <option  value='inactive'>inactive</option>
                <option  value='paused'>paused</option>
          </select><br /><br />
          <div style={{ position: 'relative', marginTop: 10 }}>
          <button type="submit" className='my-button ' style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} onClick={handleSubmit}>Edit</button>
          </div>
          
          </form></>
        },
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
          <AddHardwareProvider />
          <br />
          <label className='p-vehiculedetails'></label><br /><br />
          <div style={{ position: 'relative' }}>
          <button type="submit" className='my-button ' style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} onClick={(event) => {handleSubmitHarware(event)}}>Edit</button>
          </div>
          <NotificationContainer />
          </form> ,
          
        },
       
        {
          title: 'Download QRCode',
          
          content:  <>{
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
      fetchDatavehiculehardware(_id);
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

  

