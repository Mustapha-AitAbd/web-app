import React, { useEffect } from 'react'
import { useState } from 'react';
import { Button, message, Steps, theme } from 'antd';
import {Link} from 'react-router-dom';
import { Space } from 'antd';
import SideMenu from '../components/SideMenu/SideMenu';
import { useParams } from 'react-router-dom';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { Navigate } from 'react-router-dom';



export default function Createclient() {
    const { _id } = useParams();
    const { token } = theme.useToken();
    const [current, setCurrent] = useState(0);
    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [customerId, setCustomerId] = useState('');
    const [username, setUsername] = useState('');
    const [selectedOption, setSelectedOption] = useState('');
    const [id, set_id] = useState('');
    const [dataclient, setDataclient] = useState([]);
    const[solde, setSolde] = useState('');
    
    const handleSelectChange = (event) => {
      setSelectedOption(event.target.value);
    };
    useEffect(() => {
        async function fetchDataClients(_id) {
            try {
              const response = await fetch(`${process.env.REACT_APP_API_KEY}/client`,{
                method:'POST',
                headers: {
                  'Content-type': 'application/json',
                  'authorization':  JSON.parse(localStorage.getItem('login'))?.token
                },
                body: JSON.stringify({ id: _id}),
                headers: {
                  'Content-Type': 'application/json'
                }  });
              const data = await response.json();
              const filteredClients = data?.filter((item) => item._id == _id);
              setDataclient(filteredClients);
              console.log(filteredClients)
              setNom(filteredClients[0]?.nom)
              setPrenom(filteredClients[0]?.prenom)
              setEmail(filteredClients[0]?.email)
              setPassword(filteredClients[0]?.password)
              setPhoneNumber(filteredClients[0]?.phoneNumber+'')
              setCustomerId(filteredClients[0]?.customerId)
              setUsername(filteredClients[0]?.username)
              setSelectedOption(filteredClients[0]?.language)
              setSolde(filteredClients[0]?.solde)

              set_id(_id)
            } catch (error) {
              console.error(error);
            }
          }
          fetchDataClients(_id);

}, [_id]);



    function handleSubmitClient(event) {
      if(nom === null || nom === '' || prenom === null || prenom === '' || email === null || email ==='' || password === null || password ==='' || username === null || username ==='' || customerId === null || customerId ==='' || selectedOption === null || selectedOption ==='' || phoneNumber === null || phoneNumber ==='' || solde === null || solde ===''){
        message.error('Please fill all the fields');
        return;
      }
      event.preventDefault();
      
      const data = {
        nom: nom,
        prenom: prenom,
        email: email,
        username: username,
        customerId: customerId,
        language: selectedOption,
        phoneNumber: phoneNumber,
        solde: solde,
        
        
      };
      if(password.length > 0){
        data.password = password
        }
      console.log(data);
      
      fetch(`${process.env.REACT_APP_API_KEY}/client/modify`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          'authorization':  JSON.parse(localStorage.getItem('login'))?.token
        },
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({id: _id, newData :data })

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
          <label className='label-vehiculedetails'>First Name *</label><br />
          <input type="text" className="input-vehiculedetails" name='prenom' value={prenom} onChange={(event) => setPrenom(event.target.value)}/><br />
          <label className='p-vehiculedetails'>Please note: The fields marked with an asterisk (*) are required.</label><br /><br />
          <label className='label-vehiculedetails'>Last Name *</label><br />
          <input type="text" className="input-vehiculedetails" name='nom' value={nom} onChange={(event) => setNom(event.target.value)} required/><br />
          <label className='p-vehiculedetails'>Please note: The fields marked with an asterisk (*) are required.</label><br /><br />
          <label className='label-vehiculedetails'>Email *</label><br />
          <input type="text" className="input-vehiculedetails"name='email' value={email} onChange={(event) => setEmail(event.target.value)}/><br />
          <label className='p-vehiculedetails'>Please note: The fields marked with an asterisk (*) are required.</label><br /><br />
          <label className='label-vehiculedetails'>Password *</label><br />
          <input type="text" className="input-vehiculedetails"name='password' value={password} onChange={(event) => setPassword(event.target.value)}/><br />
          <label className='p-vehiculedetails'>write at least 8 characters</label><br /><br />
          <label className='label-vehiculedetails'>Customer Id *</label><br />
          <input type="text" className="input-vehiculedetails"name='customerId' value={customerId} onChange={(event) => setCustomerId(event.target.value)}/><br />
          <label className='p-vehiculedetails'>Please note: The fields marked with an asterisk (*) are required.</label><br /><br />
          <label className='label-vehiculedetails'>Username *</label><br />
          <input type="text" className="input-vehiculedetails"name='username' value={username} onChange={(event) => setUsername(event.target.value)}/><br />
          <label className='p-vehiculedetails'>Please note: The fields marked with an asterisk (*) are required.</label><br /><br />
          <label className='label-vehiculedetails'>language</label><br />
          <input type="text" className="input-vehiculedetails"name='language' value={selectedOption}onChange={(event) => setSelectedOption(event.target.value)}/><br />
          <label className='p-vehiculedetails'></label><br /><br />
          <label className='label-vehiculedetails'>Phone Number</label><br />
          <input type="text" className="input-vehiculedetails" value={phoneNumber} onChange={(event) => setPhoneNumber(event.target.value)}/><br />
          <label className='p-vehiculedetails'></label><br /><br />
          <label className='label-vehiculedetails'>Solde</label><br />
          <input type="text" className="input-vehiculedetails" value={solde} onChange={(event) => setSolde(event.target.value)}/><br />
          <label className='p-vehiculedetails'></label><br /><br />
          <div style={{ position: 'relative', marginTop: 10 }}>
          <button type="submit" className='my-button ' style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}onClick={handleSubmitClient}>Edit</button>
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
        <Link to="/clients">
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

  

