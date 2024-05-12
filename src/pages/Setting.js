import React from 'react'
import { useState,useEffect } from 'react';
import "../Styles/Vehicule.css"
import { Select } from 'antd';
import { Space} from 'antd';
import { useParams } from 'react-router-dom';
import { Tabs } from 'antd';
import SideMenu from '../components/SideMenu/SideMenu';
import { Descriptions } from 'antd';
import EditButton from '../components/AppButton/EditSupport';
import { Navigate } from 'react-router-dom';

const { TabPane } = Tabs;

const onChange = (key) => {
  console.log(key);
};

export default function DetailsVehicules() {
  const { _id } = useParams();
  const [SettingData, setSettingData] = useState([]);



  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_KEY}/support`,{
      method:'POST',
      headers: {
        'Content-type': 'application/json',
        'authorization':  JSON.parse(localStorage.getItem('login'))?.token
      },
    })
    .then(response => response.json())
    .then(data => {
      setSettingData(data);
      console.log(data);
    });


  }, [_id]);

  
  const items = [
    {
      key: '1',
      tab: `Support Details`,
      content: <>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      <Descriptions title=" Details "  style={{ flex: '1' }}>
          <Descriptions.Item label="ID" style={{ display: 'block' }}>{SettingData?._id}</Descriptions.Item>
          <Descriptions.Item label="Address" style={{ display: 'block' }}>{SettingData?.email}</Descriptions.Item>
          <Descriptions.Item label="Phone Number" style={{ display: 'block' }}>{SettingData?.phoneNumber}</Descriptions.Item>
          <Descriptions.Item label="" style={{ display: 'block' }}><EditButton info={SettingData} /></Descriptions.Item>
           
        </Descriptions>
   
        </div>
      </>,
    },
    {
      key: '2',
      tab: `vehicle Settings`,
      content: <>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      <Descriptions title=" Details "  style={{ flex: '1' }}>
      </Descriptions>
      vehicle Settings
      
   
        </div>
      </>,
    },
    {
      key: '3',
      tab: `Payment Settings`,
      content: <>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      <Descriptions title=" Details "  style={{ flex: '1' }}>
      </Descriptions>
      Payment Settings
   
        </div>
      </>,
    },
    {
      key: '4',
      tab: `Rental Settings`,
      content: <>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      <Descriptions title=" Details "  style={{ flex: '1' }}>
      </Descriptions>
      Rental Settings
        </div>
      </>,
    },
    {
      key: '5',
      tab: `Zones Settings`,
      content: <>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      <Descriptions title=" Details "  style={{ flex: '1' }}>
      </Descriptions>
      Zones Settings
   
        </div>
      </>,
    },
    {
      key: '6',
      tab: `Zones Settings`,
      content: <>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      <Descriptions title=" Details "  style={{ flex: '1' }}>
      </Descriptions>
      Zones Settings
        </div>
      </>,
    },
    {
      key: '7',
      tab: `Credit Packages`,
      content: <>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      <Descriptions title=" Details "  style={{ flex: '1' }}>
      </Descriptions>
      Credit Packages
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
      <div style={{padding: 10}}>
      < div className='container-2'style={{marginTop: 10, display:'flex', marginBottom: 30, width: 760, }}>
     
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
