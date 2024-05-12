import React, { useEffect } from 'react'
import { useState } from 'react';
import { Button, message, Steps, theme } from 'antd';
import {Link} from 'react-router-dom';
import { Space } from 'antd';
import SideMenu from '../components/SideMenu/SideMenu';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { useParams } from 'react-router-dom';
import { Navigate } from 'react-router-dom';


export default function CreateProvider() {
    const { _id } = useParams();
    const { token } = theme.useToken();
    const [current, setCurrent] = useState(0);;
    const [HardwareKeyApi,setHardwareKeyApi]= useState('')
    const [Model,setModel]= useState('')
    const [Marque,setMarque]= useState('')
    const [baseUri,setBaseUri]= useState('')

    useEffect(() => {
        async function fetchDatavehicule(_id) {
            try {
              const response = await fetch(`${process.env.REACT_APP_API_KEY}/hardwareprovider`,{
                method:'POST',
                body: JSON.stringify({ id: _id}),
                headers: {
                  'Content-type': 'application/json',
                  'authorization':  JSON.parse(localStorage.getItem('login'))?.token
                },
               
              });
              const data = await response.json();
              const filteredPositions = data.filter((item) => item._id == _id);
              setHardwareKeyApi(filteredPositions[0].HardwareKeyApi)
              setModel(filteredPositions[0].Model)
              setMarque(filteredPositions[0].Marque)
              setBaseUri(filteredPositions[0].BaseUri)
            
            } catch (error) {
              console.error(error);
            }
          }
          fetchDatavehicule(_id);
        }, [_id]);


     
   

  const handleSubmit = async (event) => {
    if( HardwareKeyApi === null || HardwareKeyApi === '' || Model === null || Model === '' || Marque === null ||  Marque === ''  ){
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
    
    console.log(_id)
    try {
      const response = await fetch( `${process.env.REACT_APP_API_KEY}/hardwareprovider/modify`, {
        method: "POST",
        headers: {
          'Content-type': 'application/json',
          'authorization':  JSON.parse(localStorage.getItem('login'))?.token
        },
        body: JSON.stringify({id: _id, newData :HardwareProviderdata })
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
          title: 'Edit One ',
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
          <button type="submit" className='my-button ' style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} onClick={handleSubmit}>Edit</button>
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

  

