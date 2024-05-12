import React from 'react'
import { useState } from 'react';
import { Button, message, Steps, theme } from 'antd';
import { useEffect } from 'react';
import {Link} from 'react-router-dom';
import { Space} from 'antd';
import SideMenu from '../components/SideMenu/SideMenu';
import { Navigate } from 'react-router-dom';


export default function CreateUser() {
    const { token } = theme.useToken();
    const [current, setCurrent] = useState(0);
    const [roleData,setRoleData] = useState([])
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [selectedOption, setSelectedOption] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');

    useEffect(() => {
      function RoleData() {
        fetch(`${process.env.REACT_APP_API_KEY}/role`,{
          method:'POST',
          headers: {
            'Content-type': 'application/json',
            'authorization':  JSON.parse(localStorage.getItem('login'))?.token
          },
        })
        .then(response => response.json())
        .then(data => {setRoleData(data);
          console.log(data)
        });
      }
     RoleData()
    },[]);

    
    

    const handleSelectChange = (event) => {
      setSelectedOption(event.target.value);
    };

    
    const steps = [
        {
          title: 'Personal Information',
          content:
          <form style={{margin: 10, width: 340} }>
          <div style={{ fontSize: 22, margin:20, fontFamily: "'Poppins', sans-serif", color:'blue',fontweight: 'bold'}}>Personal Information</div>
          <label className='label-vehiculedetails'>User Name </label><br />
          <input type="text" className="input-vehiculedetails" value={username} onChange={(event) => setUsername(event.target.value)}/><br /><br />
          <label className='label-vehiculedetails'>First Name : </label><br />
          <input type="text" className="input-vehiculedetails" value={firstname} onChange={(event) => setFirstname(event.target.value)}/><br /><br />
          <label className='label-vehiculedetails'>Last Name : </label><br />
          <input type="text" className="input-vehiculedetails" value={lastname} onChange={(event) => setLastname(event.target.value)}/><br /><br />
          <label className='label-vehiculedetails'>Email : </label><br />
          <input type="text" className="input-vehiculedetails" value={email} onChange={(event) => setEmail(event.target.value)}/><br /><br />
          <label className='label-vehiculedetails'>Password : </label><br />
          <input type="password" className="input-vehiculedetails" style={{marginBottom: 20}} value={password} onChange={(event) => setPassword(event.target.value)}/><br />
          <label className='label-vehiculedetails' name='role'>Role</label><br />
          <select className="input-vehiculedetails" value={selectedOption}  onChange={handleSelectChange} >
          <option>Select ..</option>
            {roleData?.map((option) => (
              <option key={option?._id} value={option?._id}>
                {option?.roleName}
              </option>
            ))}
          </select><br /><br />
          <div style={{ position: 'relative' }}>
          <button type="submit" onClick={handleSubmit} className='my-button ' style={{marginTop: 15, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} >submit</button>
          </div>
          </form> ,
        },
       
      ];
      function handleSubmit(event) {

        event.preventDefault();
        if( username === null || username === '' || password === null || password === '' || selectedOption === null || selectedOption === '' || email === null || email === '' || firstname === null || firstname === '' || lastname === null || lastname === ''  ){
          message.error('Please fill all the fields');
          return;
        }
        
        const data = {
          username : username,
          password : password,
          email : email,
          role : selectedOption,
          firstName : firstname,
          lastName : lastname
  
        };
        
        console.log(data);
        
        fetch(`${process.env.REACT_APP_API_KEY}/user/create`, {
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
            
          }
        })
        .catch((error) => {
          message.error(error.message);
          console.error('Error:', error);
        });
       
      }
  
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
        <Link to='/User'>
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

  

