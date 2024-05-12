import React from 'react'
import { useState,useEffect } from 'react';
import "../Styles/Vehicule.css"
import { Select } from 'antd';
import { Space} from 'antd';
import { Link } from 'react-router-dom';
import {LeftOutlined,PlusOutlined} from '@ant-design/icons'
import { useParams } from 'react-router-dom';
import { Tabs } from 'antd';
import SideMenu from '../components/SideMenu/SideMenu';
import { Descriptions } from 'antd';
import { Navigate } from 'react-router-dom';

const { TabPane } = Tabs;
const { Option } = Select;

const onChange = (key) => {
  console.log(key);
};

export default function DetailsVehicules() {
  const { _id } = useParams();
  const [rentData, setRentData] = useState([]);
  const [vehiculetypeData, setVehiculetypeData] = useState([]);
  const [AllvehiculetypeData , setAllvehiculetypeData] = useState([]);
  const[vehiculetype_Id, setVehiculetype_Id] = useState('');
  const [imageBikeType, setImageBikeType] = useState('');

  useEffect(() => {
    fetchData(_id);
    
  }, []);


    function fetchData(_id) {
      fetch(`${process.env.REACT_APP_API_KEY}/vehiculeType`,{
        method:'POST',
        headers: {
          'Content-type': 'application/json',
          'authorization':  JSON.parse(localStorage.getItem('login'))?.token
        },
      })
      .then(response => response.json())
      .then((data) =>{ 
         console.log(data)
            setAllvehiculetypeData(data);
            console.log(AllvehiculetypeData)  
          })
        .catch(error => console.error(error));
     
        fetch(`${process.env.REACT_APP_API_KEY}/rent/details`,{
          method:'POST',
          body: JSON.stringify({ id: _id}),
          headers: {
            'Content-type': 'application/json',
            'authorization':  JSON.parse(localStorage.getItem('login'))?.token
          },
        })
        .then(response => response.json())
        .then((data) =>{ 
        let allvehiculetypeData = AllvehiculetypeData;
        setVehiculetype_Id(data?.rentOffer?.vehiculeType?.vehicule);
        setRentData(data);
        setVehiculetypeData(AllvehiculetypeData?.filter((item) => item?._id === vehiculetype_Id))
        setImageBikeType(AllvehiculetypeData?.filter((item) => item?._id ===data?.rentOffer?.vehiculeType?.vehicule)[0]?.image);
    
       
        
        
      })
      .catch(error => console.error(error));

      
    }
    
  
  const items = [
    {
      key: '1',
      tab: `Vehicules Details`,
      content: <>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      <Descriptions title="Rent Details 1"  style={{ flex: '1' }}>
          <Descriptions.Item label="ID" style={{ display: 'block' }}>{rentData?._id}</Descriptions.Item>
          <Descriptions.Item label="Address" style={{ display: 'block' }}>{rentData?.city}</Descriptions.Item>
          <Descriptions.Item label="Phone Number" style={{ display: 'block' }}>{rentData?.phoneNumber}</Descriptions.Item>
          <Descriptions.Item label="Pick up Date" style={{ display: 'block' }}>{rentData?.pickupDate}</Descriptions.Item>
          <Descriptions.Item label="Return Date" style={{ display: 'block' }}>{rentData?.returnDate}</Descriptions.Item>
          <Descriptions.Item label="Amount" style={{ display: 'block' }}>{rentData?.amount}</Descriptions.Item>
          <Descriptions.Item label="Account Banned" style={{ display: 'block' }}>{rentData.clientId?.accountBanned+''}</Descriptions.Item>
          <Descriptions.Item label="Account Activated" style={{ display: 'block' }}>{rentData.clientId?.accountActivated+''}</Descriptions.Item>
          <Descriptions.Item label="Order Status" style={{ display: 'block' }}>{rentData?.orderStatus}</Descriptions.Item>
          <Descriptions.Item label="Order Type" style={{ display: 'block' }}>{rentData?.orderType}</Descriptions.Item>
          
          
        </Descriptions>
        <Descriptions title="Rent Details 2"  style={{ flex: '1' }}>
        <Descriptions.Item label="ID" style={{ display: 'block' }}>{rentData.clientId?._id}</Descriptions.Item>
        <Descriptions.Item label="Nom" style={{ display: 'block' }}>{rentData.clientId?.nom}</Descriptions.Item>
        <Descriptions.Item label="Prenom" style={{ display: 'block' }}>{rentData.clientId?.prenom}</Descriptions.Item>
        <Descriptions.Item label="Email" style={{ display: 'block' }}>{rentData.clientId?.email}</Descriptions.Item>
        <Descriptions.Item label="Username" style={{ display: 'block' }}>{rentData.clientId?.username}</Descriptions.Item>
        <Descriptions.Item label="Customer Id" style={{ display: 'block' }}>{rentData.clientId?.customerId}</Descriptions.Item>
        <Descriptions.Item label="City" style={{ display: 'block' }}>{rentData.clientId?.city}</Descriptions.Item>
        <Descriptions.Item label="Solde" style={{ display: 'block' }}>{rentData.clientId?.solde}</Descriptions.Item>
        <Descriptions.Item label="Language" style={{ display: 'block' }}>{rentData.clientId?.language}</Descriptions.Item>
        <Descriptions.Item label="Created At" style={{ display: 'block' }}>{rentData.clientId?.createdAt}</Descriptions.Item>
        <Descriptions.Item label="Created At" style={{ display: 'block' }}>{rentData.clientId?.createdAt}</Descriptions.Item>
        
        </Descriptions>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      <Descriptions title="Rent Offer"  style={{ flex: '1' }}>
          <Descriptions.Item label="ID" style={{ display: 'block' }}>{rentData.rentOffer?._id}</Descriptions.Item>
          <Descriptions.Item label="Prix" style={{ display: 'block' }}>{rentData.rentOffer?.prix}</Descriptions.Item>
          <Descriptions.Item label="Max Distance" style={{ display: 'block' }}>{rentData.rentOffer?.maxDistance}</Descriptions.Item>
          <Descriptions.Item label="Description" style={{ display: 'block' }}>{rentData.rentOffer?.description}</Descriptions.Item>
          <Descriptions.Item label="Vehicule Type" style={{ display: 'block' }}>{AllvehiculetypeData?.filter((item) => item?._id === vehiculetype_Id)[0]?.typeName}</Descriptions.Item>
        </Descriptions>
        
        </div>
       
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
      <div className='content-3'>
      <Link to="/rent" style={{fontSize: 15,width: 70,height: 31,padding: "5px 15px",border: "1px solid hsl(0, 0%, 80%)",borderRadius: 10,marginRight: 10,marginTop: 10,color: "black",display: "flex",justifyContent: "center",alignItems: "center"}}> <LeftOutlined />Back</Link>
      <img src={process.env.REACT_APP_API_KEY+'/'+AllvehiculetypeData?.filter((item) => item?._id === vehiculetype_Id)[0]?.image} alt="" height={300} width={340} style={{ border: "1px solid hsl(0, 0%, 80%)" , marginTop: 45}}/>
      </div>
      <div className='content-4'>
      < div className='container-2'style={{marginTop: 10, display:'flex', marginBottom: 30, width: 760,}}>
      
      <Link to={`EditRent/${_id}`}style={{fontSize: 15,width: 70,height: 31,padding: "5px 15px",border: "1px solid hsl(0, 0%, 80%)",borderRadius: 10,marginRight: 10,marginTop: 10,color: "black",display: "flex",justifyContent: "center",alignItems: "center"}}>Edit</Link>
        <Select defaultValue="Action" style={{ width: 190, margin:10 , height:30,border:"1 solid #000" }}>
            <Option value="add"><PlusOutlined style={{color:'blue'}} /><Link to="/CreateRent">Add</Link></Option>
        </Select>
        <br />
      </div>
      <div>
     <div style={{border: "1px solid hsl(0, 0%, 80%)" , padding: 10}}> 
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
