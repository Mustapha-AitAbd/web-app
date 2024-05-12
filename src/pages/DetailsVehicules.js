import React from 'react'
import { useState,useEffect } from 'react';
import "../Styles/Vehicule.css"
import { Select } from 'antd';
import { useRef } from 'react';
import { Space, Table, Tag, Badge} from 'antd';
import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer, useMapEvent } from 'react-leaflet';
import { Link } from 'react-router-dom';
import {RightOutlined,LeftOutlined,PlusOutlined, DownloadOutlined} from '@ant-design/icons'
import {  Button } from 'antd';
import MarkerClusterGroup from 'react-leaflet-cluster';
import BatteryGauge from 'react-battery-gauge'
import { useParams } from 'react-router-dom';
import QRCode from 'qrcode.react'
import { Tabs } from 'antd';
import SideMenu from '../components/SideMenu/SideMenu';
import * as XLSX from 'xlsx'
import { Descriptions } from 'antd';
import { Navigate } from 'react-router-dom';

const { TabPane } = Tabs;

const { Option } = Select;

const onChange = (key) => {
  console.log(key);
};
const marketIcon = new L.Icon({
  iconUrl: require("../images/marker-icon.png"),
  iconSize: [25, 42],
  iconAnchor: [17, 46],
  popupAnchor: [0, -46],
});

export default function DetailsVehicules() {
  const { _id } = useParams();
  const [datavehicule, setDatavehicule] = useState([]);
  const [isclean, setIsclean] = useState('false');
  const [dataBikeType, setDataBikeType] = useState([]);
  const [vehiculeType, setVehiculeType]= useState('');
  const [center, setCenter] = useState({ lat: 33.527605, lng: -5.107408 });
  const animateRef = useRef(false);
  const canvasRef = useRef(null);
  const [trajectData, setTrajectData] = useState([]);
  const [cityData, setCityData] = useState([]);

  

  useEffect(() => {
    console.log(_id)
    fetch(`${process.env.REACT_APP_API_KEY}/vehiculeType`,{
      method:'POST',
      headers: {
        'Content-type': 'application/json',
        'authorization':  JSON.parse(localStorage.getItem('login'))?.token
      },
    })
      .then(response => response.json())
      .then(data => setDataBikeType(data))
      .catch(error => console.error(error));
      
    async function fetchData(_id) {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_KEY}/vehicule/details`,{
          method:'POST',
          body: JSON.stringify({ id: _id}),
          headers: {
            'Content-type': 'application/json',
            'authorization':  JSON.parse(localStorage.getItem('login'))?.token
          },
         
        });
        const data = await response.json();
        setDatavehicule(data);
        setIsclean(data.isClean);
        setVehiculeType(data.idType?.typeName);
        setCenter({ lat: data.lastCoords?.latitude, lng: data.lastCoords?.longitude});
      } catch (error) {
        console.error(error);
      }
    }
    fetchData(_id);
    async function fetchDataTraject(id) {
      fetch(`${process.env.REACT_APP_API_KEY}/trip`,{
        method:'POST',
        body: JSON.stringify({filter:
          {vehiculeId:id
          }}),
          headers: {
            'Content-type': 'application/json',
            'authorization':  JSON.parse(localStorage.getItem('login'))?.token
          },
      })
      .then(response => response.json())
      .then(data => {
        setTrajectData(data);
      })
      .catch(error => console.error(error));
    }
    fetchDataTraject(_id);
    async function fetchDataCity() {
      fetch(`${process.env.REACT_APP_API_KEY}/client`,{
        method:'POST',
        headers: {
          'Content-type': 'application/json',
          'authorization':  JSON.parse(localStorage.getItem('login'))?.token
        }
      })
      .then(response => response.json())
      .then(data => {
        const findUserName = data.find(option => option.id === datavehicule.lastUser)
        setCityData(findUserName);
      })
      .catch(error => console.error(error));
    }
    fetchDataCity();
  }, [_id]);
  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(datavehicule);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Details_vehicule _POGO');
    XLSX.writeFile(workbook, 'Details_vehicule.xlsx');
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

  const columns = [
    {
      title: 'Traject ID',
      dataIndex: '_id',
      key: '_id',
      
      
    },
    {
      title: 'ID',
      dataIndex: 'vehiculeId._id',
      key: 'Vehicule ID',
      
    },
    {
        title: 'Start Time',
        dataIndex: 'startTime',
        
        key: 'startTime',
    },
    {
        title: 'End Time',
        dataIndex: 'endTime',
        width: 180,
        key: 'endTime',
    },
    {
        title: 'Current State',
        dataIndex: 'currentState',
        key: 'currentState',
        render: (text) => {
            if (text === 'Ended') {
              return <><Tag color='green' key={text}>
              {text}
            </Tag></>;
            }else{
                return <><Tag color='yellow' key={text}>
                {text}
              </Tag></>;
            }
            
          },
    },
    {
      title: 'Action',
      dataIndex: '_id',
      key: '_id',
      render: (text) => (
        <Space size="middle">
          <Link to= {`TrajectOfVehicule/${text}`}><RightOutlined /></Link>
        </Space>
      ),
    },
  ];


  const item2 = [
    {
      key: '1',
      tab: `Vehicules Details`,
      content: <>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      <Descriptions title="Street"  style={{ flex: '1' }}>
          <Descriptions.Item label="Street" style={{ display: 'block' }}>{datavehicule.city}</Descriptions.Item>
      </Descriptions>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      <Descriptions title="Key Informations"  style={{ flex: '1' }}>
      
          <Descriptions.Item label="Location" style={{ display: 'block' }}><div >{datavehicule.city}</div></Descriptions.Item>
          <Descriptions.Item label="Vehicule State " style={{ display: 'block' }}>{datavehicule.vehiculeStatus} </Descriptions.Item>
          <Descriptions.Item label="Fuel Level " style={{ display: 'block' }}>{datavehicule.batteryLevel}%</Descriptions.Item>
          <Descriptions.Item label="IOT baterry level " style={{ display: 'block' }}>-NA-</Descriptions.Item>
          
      </Descriptions>
        </div>
        </>,
    },
  ];
  
  const items = [
    {
      key: '1',
      tab: `Vehicules Details`,
      content: <>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      <Descriptions title="Status"  style={{ flex: '1' }}>
          <Descriptions.Item label="Vehicule Is Clear" style={{ display: 'block' }}>{isclean +''}</Descriptions.Item>
          <Descriptions.Item label="Vehicule State" style={{ display: 'block' }}>{datavehicule.vehiculeStatus}</Descriptions.Item>
          <Descriptions.Item label="Baterry level " style={{ display: 'block' }}>{datavehicule.batteryLevel}%</Descriptions.Item>
        </Descriptions>
        <Descriptions title="Location"  style={{ flex: '1' }}>
        <Descriptions.Item label="City" style={{ display: 'block' }}>{datavehicule.city}</Descriptions.Item>
          <Descriptions.Item label="Latitude" style={{ display: 'block' }}>{datavehicule.lastCoords?.latitude}</Descriptions.Item>
          <Descriptions.Item label="Longtitude" style={{ display: 'block' }}>{datavehicule.lastCoords?.longitude}</Descriptions.Item>
        </Descriptions>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      <Descriptions title="Details"  style={{ flex: '1' }}>
          <Descriptions.Item label="Vehicule id" style={{ display: 'block' }}>{datavehicule?._id}</Descriptions.Item>
          <Descriptions.Item label="Resvation Pre Auth Amount" style={{ display: 'block' }}>0.00د.م</Descriptions.Item>
          <Descriptions.Item label="Vehicule Type" style={{ display: 'block' }}>{datavehicule.idType?.typeName}</Descriptions.Item>
          <Descriptions.Item label="last User" style={{ display: 'block' }}>{cityData?.nom}</Descriptions.Item>
          <Descriptions.Item label="last Used Date" style={{ display: 'block' }}>{datavehicule?.lastUsedDate}</Descriptions.Item>
          <Descriptions.Item label="Rentable in Locations" style={{ display: 'block' }}>{datavehicule?.city}</Descriptions.Item>
        </Descriptions>
        <Descriptions title="Hardware configuration"  style={{ flex: '1' }}>
        <Descriptions.Item label="Hardware id " style={{ display: 'block' }}>{datavehicule.hardware?._id}</Descriptions.Item>
          <Descriptions.Item label="SIM Number"style={{ display: 'block' }}>{datavehicule.hardware?.simNumber}</Descriptions.Item>
          <Descriptions.Item label="SIM Operator" style={{ display: 'block' }}>{datavehicule.hardware?.simOperator}</Descriptions.Item>
          <Descriptions.Item label="id Hardware Provider" style={{ display: 'block' }}>{datavehicule.hardware?.hardwareProvider._id}</Descriptions.Item>
          <Descriptions.Item label="HardwareKeyApi" style={{ display: 'block' }}>{datavehicule.hardware?.hardwareProvider.HardwareKeyApi}</Descriptions.Item>
          <Descriptions.Item label="Model" style={{ display: 'block' }}>{datavehicule.hardware?.hardwareProvider.Model}</Descriptions.Item>
          <Descriptions.Item label=" Marque" style={{ display: 'block' }}>{datavehicule.hardware?.hardwareProvider.Marque}</Descriptions.Item>
        </Descriptions>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      <Descriptions title="Parking"  style={{ flex: '1' }}>
          <Descriptions.Item label="last Parking id"style={{ display: 'block' }}>{datavehicule?.lastParking}</Descriptions.Item>
         
        </Descriptions>
        <Descriptions title= "QRCode" style={{ flex: '1' }}>
        <Descriptions.Item label="" style={{ display: 'block' }}></Descriptions.Item>
          <Descriptions.Item label="QRCode" style={{ display: 'block' }}>
          <div id="myqrcode" ref={canvasRef}>
            <QRCode value={_id} style={{ marginBottom: 16, marginLeft: 30 }} /><br />
              <Button type="primary" onClick={downloadQRCode} style={{marginLeft: 42, borderRadius : 12, backgroundColor: '#fff', color: 'black' ,border: '1px solid #000', marginTop: 2, fontSize:14}}>
                Download
              </Button>
            </div>
          </Descriptions.Item>
        
        </Descriptions>
        </div>
       
      </>,
    },
    {
      key: '2',
      tab: `Trips`,
      content: <>
      <Table columns={columns} style={{maxWidth: 200}} dataSource={trajectData}  pagination={{ pageSize: 10 }}/>;
      </>
    },
  
  ];
  function SetViewOnClick({ animateRef }) {
    const map = useMapEvent('click', (e) => {
        map.flyTo(center, 17)
    })
    return null
  }


  return (
    <>
    {localStorage.getItem('login') === null ? <Navigate to="/login" /> :
    <Space className="SideMenuAndPageContent">
        <SideMenu />
    <div className="PageContent">
    <div className='ContainerGlobale'>
      <div className='content-3'>
      <img src={process.env.REACT_APP_API_KEY+'/'+datavehicule?.idType?.image} alt="" height={300} width={340} style={{ border: "1px solid hsl(0, 0%, 80%)" , marginTop: 20}}/>
      <MapContainer className='mapcontainer-2' center={center} zoom={5}>
        <TileLayer url={process.env.REACT_APP_MAPTILER_URL} attribution={process.env.REACT_APP_MAPTILER_ATTRIBUTION}/>
        <MarkerClusterGroup>
            <Marker key="1" position={center} icon={marketIcon} >
            <Popup>
                <div>
                  <h4>Id : {_id}</h4>
                  <p>{datavehicule.city}</p>
                  <BatteryGauge value={datavehicule.batteryLevel} style={{height: 40, width: 60}}/>
                </div>
            </Popup>
            </Marker>
            <SetViewOnClick animateRef={animateRef} />
        </MarkerClusterGroup>
      </MapContainer>
      <div style={{border: "1px solid hsl(0, 0%, 80%)" , padding: 10}}> 
      <Tabs defaultActiveKey="1" onChange={onChange}>
      {item2.map((item) => (
        <TabPane key={item.key} tab={item.tab}>
          {item.content}
        </TabPane>
      ))}
    </Tabs>
    </div>

      </div>
      <div className='content-4'>
      < div className='container-2'style={{marginTop: 10, display:'flex', marginBottom: 30, width: 760,}}>
      <Link to="/" style={{fontSize: 15,width: 70,height: 31,padding: "5px 15px",border: "1px solid hsl(0, 0%, 80%)",borderRadius: 10,marginRight: 10,marginTop: 10,color: "black",display: "flex",justifyContent: "center",alignItems: "center"}}> <LeftOutlined />Back</Link>
      <Link to={`Editvehicule/${_id}`}style={{fontSize: 15,width: 70,height: 31,padding: "5px 15px",border: "1px solid hsl(0, 0%, 80%)",borderRadius: 10,marginRight: 10,marginTop: 10,color: "black",display: "flex",justifyContent: "center",alignItems: "center"}}>Edit</Link>

        <Select defaultValue="Action" style={{ width: 190, margin:10 , height:30,border:"1 solid #000" }}>
            <Option value="add"><PlusOutlined style={{color:'blue'}} /><Link to="/createVehicule">Add Vehicules</Link></Option>
            <Option value="download"><DownloadOutlined style={{color:'blue'}} /><button style={{border: "#fff" , backgroundColor: "#fff"}} onClick={downloadExcel}>Download Excel</button></Option>
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
