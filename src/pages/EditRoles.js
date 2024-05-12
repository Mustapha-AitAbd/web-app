import React from 'react'
import { useState,useEffect } from 'react';
import "../Styles/Vehicule.css"
import { Select, message } from 'antd';
import { Space, Table, Tag, Badge} from 'antd';
import { Link } from 'react-router-dom';
import {LeftOutlined} from '@ant-design/icons'
import { Tabs } from 'antd';
import SideMenu from '../components/SideMenu/SideMenu';
import { Descriptions } from 'antd';
import { useParams } from 'react-router-dom';
import { Navigate } from 'react-router-dom';



const { TabPane } = Tabs;

const onChange = (key) => {
  console.log(key);
};


export default function DetailsVehicules() {
 
  const { _id } = useParams();
  const [roleData, setRoleData] = useState([]);
    const [description, setDescription] = useState('');
    const [roleName, setRoleName] = useState('');
    const [priv, setPriv] = useState([]);

    useEffect(() => {   
      async function fetchDataRoles() {
       try {
         const response = await fetch(`${process.env.REACT_APP_API_KEY}/role`, {
           method: 'POST',
           body: JSON.stringify({ id: _id }),
           headers: {
            'Content-type': 'application/json',
            'authorization':  JSON.parse(localStorage.getItem('login'))?.token
          },
         });
         const data = await response.json();
         console.log(data)
         console.log(_id)
         const filteredUsers = data?.filter((item) => item._id === _id);
         setRoleData(filteredUsers);
         console.log(roleData);
         
         setRoleName(filteredUsers[0]?.roleName);
         setDescription(filteredUsers[0]?.description);
         setPriv(filteredUsers[0]?.privileges);
         console.log(priv)
         let inputs = document.querySelectorAll('input[type=checkbox]');
         console.log(inputs)
         for( let e of inputs){
          console.log(e.id)
          if(filteredUsers[0]?.privileges.includes(e.id)){
            e.checked = true;
          }
        };
     
       } catch (error) {
         console.error(error);
       }
     }
     fetchDataRoles();
  }, []);
  
   

    function AddToPrivs(priv){
      setPriv([...priv, priv])
    }
    function RemoveFromPrivs(priv){
      setPriv(priv.filter((p) => p !== priv))
    }   

    function EditRoles(){
      let inputs = document.querySelectorAll('input:checked');
      let privs = [];
      inputs.forEach(element => {
        privs.push(element.id);
      });
      console.log(privs);
      const data = {
        description: description,
        privileges: privs,
        roleName: roleName
      };
      
      fetch(`${process.env.REACT_APP_API_KEY}/role/modify`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          'authorization':  JSON.parse(localStorage.getItem('login'))?.token
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


  const items = [
    {
      key: '1',
      tab: `User Privileges`,
      content: <>
      <from>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        
      <Descriptions title="Vehicles"  style={{ flex: '1' }}>
          <Descriptions.Item style={{ display: 'block' }}><input  type='checkbox'  id ='Get Vehicules' /> Fetch Data of Vehicles</Descriptions.Item>
          <Descriptions.Item  style={{ display: 'block' }}><input  type='checkbox' id ='Add Vehicules' /> Add Vehicles</Descriptions.Item>
          <Descriptions.Item  style={{ display: 'block' }}><input  type='checkbox' id ='Details Vehicules'/> Details Vehicles</Descriptions.Item>
          <Descriptions.Item  style={{ display: 'block' }}><input  type='checkbox' id ='Edit Vehicules' /> Edit Vehicles</Descriptions.Item>
          <Descriptions.Item  style={{ display: 'block' }}><input  type='checkbox' id ='Delete Vehicules' /> Delete Vehicles</Descriptions.Item>
          <Descriptions.Item  style={{ display: 'block' }}><input  type='checkbox' id ='Vehicules Force Action' /> Vehicles Force Action</Descriptions.Item>
        </Descriptions>
        <Descriptions title="Clients"  style={{ flex: '1' }}>
        <Descriptions.Item style={{ display: 'block' }}><input  type='checkbox' id ='Get Clients' /> Fetch Data of Clients</Descriptions.Item>
          <Descriptions.Item  style={{ display: 'block' }}><input  type='checkbox' id ='Add Clients'  /> Add Clients</Descriptions.Item>
          <Descriptions.Item  style={{ display: 'block' }}><input  type='checkbox' id ='Edit Clients'  /> Edit Clients</Descriptions.Item>
          <Descriptions.Item  style={{ display: 'block' }}><input  type='checkbox' id ='Delete Clients'  /> Delete Clients</Descriptions.Item>
        </Descriptions>
        <Descriptions title="Trips"  style={{ flex: '1' }}>
          <Descriptions.Item style={{ display: 'block' }}><input  type='checkbox' id ='Get Trips'  /> Fetch Data of Trips</Descriptions.Item>
          <Descriptions.Item  style={{ display: 'block' }}><input  type='checkbox' id ='Details Trip'  /> Details Trips</Descriptions.Item>

        </Descriptions>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      <Descriptions title="Payments"  style={{ flex: '1' }}>
          <Descriptions.Item style={{ display: 'block' }}><input  type='checkbox' id ='Get Payments'  /> Fetch Data of Payments</Descriptions.Item>
        </Descriptions>
        <Descriptions title="Zones"  style={{ flex: '1' }}>
          <Descriptions.Item style={{ display: 'block' }}><input  type='checkbox' id ='Get Zones'  /> Fetch Data of Zones</Descriptions.Item>
          <Descriptions.Item  style={{ display: 'block' }}><input  type='checkbox' id ='Add Zones'  /> Add Zones</Descriptions.Item>
          <Descriptions.Item  style={{ display: 'block' }}><input  type='checkbox' id ='Edit Zones'  /> Edit Zones</Descriptions.Item>
          <Descriptions.Item  style={{ display: 'block' }}><input  type='checkbox' id ='Delete Zones'  /> Delete Zones</Descriptions.Item>
        </Descriptions>
        <Descriptions title="Rent Offers"  style={{ flex: '1' }}>
          <Descriptions.Item style={{ display: 'block' }}><input  type='checkbox' id ='Get RentOffers'  /> Fetch Data of Rent Offers</Descriptions.Item>
          <Descriptions.Item  style={{ display: 'block' }}><input  type='checkbox' id ='Add RentOffers'  /> Add Rent Offers</Descriptions.Item>
          <Descriptions.Item  style={{ display: 'block' }}><input  type='checkbox' id ='Edit RentOffers'  /> Edit Rent Offers</Descriptions.Item>
          <Descriptions.Item  style={{ display: 'block' }}><input  type='checkbox' id ='Delete RentOffers'  /> Delete Rent Offers</Descriptions.Item>
        </Descriptions>
        
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      <Descriptions title="Rent"  style={{ flex: '1' }}>
      <Descriptions.Item style={{ display: 'block' }}><input type='checkbox' id ='Get Rents'  /> Fetch Data of Rents</Descriptions.Item>
          <Descriptions.Item  style={{ display: 'block' }}><input  type='checkbox' id ='Add Rents'  /> Add Rents</Descriptions.Item>
          <Descriptions.Item  style={{ display: 'block' }}><input  type='checkbox' id ='Details Rents'  /> Details Rents</Descriptions.Item>
          <Descriptions.Item  style={{ display: 'block' }}><input  type='checkbox' id ='Edit Rent'  /> Edit Rent</Descriptions.Item>
          <Descriptions.Item  style={{ display: 'block' }}><input  type='checkbox' id ='Delete Rents'  /> Delete Rents</Descriptions.Item>
        </Descriptions>
        <Descriptions title="Packages"  style={{ flex: '1' }}>
          <Descriptions.Item style={{ display: 'block' }}><input  type='checkbox' id ='Get Packages'  /> Fetch Packages</Descriptions.Item>
          <Descriptions.Item  style={{ display: 'block' }}><input  type='checkbox' id ='Add Packages'  /> Add  Packages</Descriptions.Item>
          <Descriptions.Item  style={{ display: 'block' }}><input  type='checkbox' id ='Edit Packages'  /> Edit Packages</Descriptions.Item>
          <Descriptions.Item  style={{ display: 'block' }}><input  type='checkbox' id ='Delete Packages'  /> Delete Packages</Descriptions.Item>
        </Descriptions>
        <Descriptions title="Roles"  style={{ flex: '1' }}>
          <Descriptions.Item style={{ display: 'block' }}><input  type='checkbox' id ='Get Roles'  /> Fetch Roles</Descriptions.Item>
          <Descriptions.Item  style={{ display: 'block' }}><input  type='checkbox' id ='Add Roles'  /> Add  Roles</Descriptions.Item>
          <Descriptions.Item  style={{ display: 'block' }}><input  type='checkbox' id ='Edit Roles'  /> Edit Roles</Descriptions.Item>
          <Descriptions.Item  style={{ display: 'block' }}><input  type='checkbox' id ='Delete Roles'  /> Delete Roles</Descriptions.Item>
        </Descriptions>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      <Descriptions title="Invoices"  style={{ flex: '1' }}>
      <Descriptions.Item style={{ display: 'block' }}><input  type='checkbox' id ='Get Invoices'  /> Fetch Data of Invoices</Descriptions.Item>
          <Descriptions.Item  style={{ display: 'block' }}><input  type='checkbox' id ='Details invoices'  /> Details invoices</Descriptions.Item>
          <Descriptions.Item  style={{ display: 'block' }}><input  type='checkbox' id ='Manual Payment'  /> Manual Payment</Descriptions.Item>
        </Descriptions>
        <Descriptions title="Users"  style={{ flex: '1' }}>
          <Descriptions.Item style={{ display: 'block' }}><input  type='checkbox' id ='Get User'  /> Fetch User</Descriptions.Item>
          <Descriptions.Item  style={{ display: 'block' }}><input  type='checkbox' id ='Add User'  /> Add User</Descriptions.Item>
          <Descriptions.Item  style={{ display: 'block' }}><input  type='checkbox' id ='Edit Users'  /> Edit Users</Descriptions.Item>
          <Descriptions.Item  style={{ display: 'block' }}><input  type='checkbox' id ='Delete Users'  /> Delete Users</Descriptions.Item>
        </Descriptions>
       
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        <Descriptions title="Description"  style={{ flex: '1' }}>
        <Descriptions.Item label="Role Name" style={{ display: 'block' }}> <input style={{width: 170, height: 30, marginLeft: 40,borderRadius: 20, border: "1px solid hsl(0, 0%, 80%)"}} value ={roleName}  onChange={(event) => setRoleName(event.target.value)}></input></Descriptions.Item>
        <Descriptions.Item label="Description" style={{ display: 'block' }}> <textarea value={description} style={{width: 300, height: 80, marginLeft: 40, marginTop: 10, border: "1px solid hsl(0, 0%, 80%)"}} placeholder="......Description" onChange={(event) => setDescription(event.target.value)}></textarea></Descriptions.Item>
        </Descriptions>
       
        </div>
        <button className='my-button '  onClick={EditRoles} style={{fontSize: 15,width: 200,height: 31,padding: "5px 15px",border: "1px solid hsl(0, 0%, 80%)",borderRadius: 10,marginLeft: '35%',display: "flex",justifyContent: "center",alignItems: "center" }}> Edit Role</button>
        </from>
       
      </>,
    },
    
  ];

  return (
    <>
    {localStorage.getItem('login') === null ? <Navigate to="/login" /> :
    <Space className="SideMenuAndPageContent">
        <SideMenu />
    <div className="PageContent">
    <div className='ContainerGlobale'>
      <div className='content-5'>
      < div className='container-2'style={{marginTop: 10, display:'flex', marginBottom: 30, width: 760, marginLeft: 30}}>
      <Link to="/roles" style={{fontSize: 15,width: 70,height: 31,padding: "5px 15px",border: "1px solid hsl(0, 0%, 80%)",borderRadius: 10,marginRight: 10,marginTop: 10,color: "black",display: "flex",justifyContent: "center",alignItems: "center"}}> <LeftOutlined />Back</Link>
      
        <br />
      </div>
      <div>
     <div style={{border: "1px solid hsl(0, 0%, 80%)" , padding: 10,marginLeft: '20%' }}> 
      <Tabs defaultActiveKey="1" onChange={onChange}>
      {items.map((item) => (
        <TabPane key={item.key} tab={item.tab}>
          {item.content}
        </TabPane>
      ))}
    </Tabs>
    </div>
    </div>  
    </div>
    </div>
    </div>
    </Space>
    }
    </>
  )
}
