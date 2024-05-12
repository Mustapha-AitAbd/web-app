import React from 'react'
import { useState } from 'react';
import { Button, message, Steps, theme } from 'antd';
import { useEffect } from 'react';
import {Link} from 'react-router-dom';
import { Space} from 'antd';
import { useParams } from 'react-router-dom';
import SideMenu from '../components/SideMenu/SideMenu';
import { Navigate } from 'react-router-dom';


export default function CreateUser() {
    const { _id } = useParams();
    const { token } = theme.useToken();
    const [current, setCurrent] = useState(0);
    const [roleData,setRoleData] = useState([])
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [selectedOption, setSelectedOption] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');

    const handleSelectChange = (event) => {
      setSelectedOption(event.target.value);
    }; 

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
   async function fetchDataClients(_id) {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_KEY}/user`, {
        method: 'POST',
        body: JSON.stringify({ id: _id }),
        headers: {
          'Content-type': 'application/json',
          'authorization':  JSON.parse(localStorage.getItem('login'))?.token
        },
      });
      const data = await response.json();
      const filteredUsers = data?.filter((item) => item._id === _id);
      setRoleData(filteredUsers);
      setLastname(filteredUsers[0]?.lastName);
      setFirstname(filteredUsers[0]?.firstName);
      setEmail(filteredUsers[0]?.email);
      setPassword(filteredUsers[0]?.password);
      setUsername(filteredUsers[0]?.username);
      setSelectedOption(filteredUsers[0]?.role);
  
    } catch (error) {
      console.error(error);
    }
  }
  fetchDataClients(_id);
    }, [_id]);
   
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
          <input type="password" className="input-vehiculedetails" style={{marginBottom: 20}} onChange={(event) => setPassword(event.target.value)}/><br />
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
          <button type="submit" onClick={handleSubmit} className='my-button ' style={{marginTop: 15, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} >Edit</button>
          </div>
          </form> ,
        },
       
      ];
      function handleSubmit(event) {

        event.preventDefault();
        if( username === null || username === ''  || selectedOption === null || selectedOption === '' || email === null || email === '' || firstname === null || firstname === '' || lastname === null || lastname === ''  ){
          message.error('Please fill all the fields');
          return;
        }
      
        
        const data = {
          username : username,
         
          email : email,
          role : selectedOption,
          firstName : firstname,
          lastName : lastname
  
        };
        if(password !== null && password !== ''){
          data.password = password;
        }
        
        console.log(data);
        
        fetch(`${process.env.REACT_APP_API_KEY}/user/modify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({id: _id, newData :data })

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

  

