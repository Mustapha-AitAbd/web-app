import React from 'react'
import { useState,useEffect } from 'react';
import "../Styles/Vehicule.css"
import { Select } from 'antd';
import { useRef } from 'react';
import { Space} from 'antd';
import L from 'leaflet';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import { Link } from 'react-router-dom';
import {LeftOutlined,PlusOutlined, DownloadOutlined} from '@ant-design/icons'
import { useParams } from 'react-router-dom';
import { Tabs } from 'antd';
import { Descriptions } from 'antd';
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet/dist/leaflet.css";
import SideMenu from '../components/SideMenu/SideMenu';
import "leaflet-routing-machine";
import { useMap } from 'react-leaflet';
import { Navigate } from 'react-router-dom';


const { TabPane } = Tabs;

const { Option } = Select;




export default function TrajectOfVehicule() {
  const { _id } = useParams();
  const [center, setCenter] = useState({ lat: 30.4205162, lng: -9.5838532 });
  const [trajectData, setTrajectData] = useState([]);
  const [trajectDataPolyline, setTrajectDataPolyline] = useState([]);
  const [currentState, setCurrentState] = useState('');
  const [id, setId] = useState('');
  const [clientId, setClientId] = useState('');
  const [vehiculeId, setVehiculeId] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endParking, setEndParking] = useState('');
  const [endTime, setEndTime] = useState('');
  const [startParking, setStartParking] = useState('');
  const [tripImage, setTripImage] = useState('');

 useEffect(() => {
      fetchDataTraject(_id);
}, []);

async function fetchDataTraject(_id) {
  fetch(`${process.env.REACT_APP_API_KEY}/trip`,{
    method:'POST',
     headers: {
      'Content-type': 'application/json',
      'authorization':  JSON.parse(localStorage.getItem('login'))?.token
    },
  })
  .then(response => response.json())
  .then(data => {
    const filteredData = data?.filter(item => item?._id === _id);
    setCurrentState(filteredData[0]?.currentState);
    setId(filteredData[0]?._id);
    setClientId(filteredData[0]?.clientId);
    setVehiculeId(filteredData[0]?.vehiculeId._id);
    setStartTime(filteredData[0]?.startTime);
    setEndParking(filteredData[0]?.endParking);
    setEndTime(filteredData[0]?.endTime);
    setStartParking(filteredData[0]?.startParking);
    setTripImage(filteredData[0]?.tripImage);
    const filter = filteredData[0]?.coords.map(({ longitude, latitude }) => [latitude, longitude])
    setTrajectDataPolyline(filter);
    setCenter({ lat: filteredData[0]?.vehiculeId?.lastCoords[0]?.latitude, lng: filteredData[0]?.vehiculeId?.lastCoords[0]?.longitude })
    setTrajectData(data?.filter((item) => item?._id === _id))
    
  })
  .catch(error => console.error(error));
}

const Routing = () => {
  const map = useMap();

    if (trajectData[0]) {
      const waypoints = trajectData[0]?.coords?.map((position) => {
        const { latitude, longitude } = position;
        return L.latLng(latitude, longitude);
        
      });

      L.Routing.control({
        waypoints: waypoints,
        show: false,
        hide: true,
        createMarker: function (i, waypoint, n) {
          console.log(waypoints);
          return L.marker(waypoint.latLng, {
            draggable: true,
            icon: L.icon({
              iconUrl:
                'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.6.0/images/marker-icon.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
            }),
          });
        },
      }).addTo(map);
    }
  

  return null;
};

 
const item2 = [
    {
      key: '1',
      tab: `Traject Details`,
      content: <>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      <Descriptions title="Traject Informations"  style={{ flex: '1' }}>
      
          <Descriptions.Item label="id" style={{ display: 'block' }}><div >{id}</div></Descriptions.Item>
          <Descriptions.Item label="clientId " style={{ display: 'block' }}>{clientId} </Descriptions.Item>
          <Descriptions.Item label="currentState" style={{ display: 'block' }}>{currentState}</Descriptions.Item>
          <Descriptions.Item label="vehiculeId" style={{ display: 'block' }}>{vehiculeId}</Descriptions.Item>
          <Descriptions.Item label="startTime" style={{ display: 'block' }}>{startTime}</Descriptions.Item>
          <Descriptions.Item label="endTime" style={{ display: 'block' }}>{endTime}</Descriptions.Item>
          <Descriptions.Item label="startParking " style={{ display: 'block' }}>{startParking}</Descriptions.Item>
          <Descriptions.Item label="endParking " style={{ display: 'block' }}>{endParking}</Descriptions.Item>
          
      </Descriptions>
        </div>
        </>,
    },
  ];
  const limeOptions = { color: 'lime' }

  return (
    <>
    {localStorage.getItem('login') === null ? <Navigate to="/login" /> :
    <Space className="SideMenuAndPageContent">
        <SideMenu />
      <div className="PageContent">
    <div className='ContainerGlobale'>
      <div className='content-3'>
      {tripImage &&<img src={`${tripImage}`} alt="Fetched image" height={300} width={340} style={{ border: "1px solid hsl(0, 0%, 80%)" , marginTop: 20}} />}
      
      <div style={{border: "1px solid hsl(0, 0%, 80%)" , padding: 10}}> 
      <Tabs defaultActiveKey="1" >
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
      <Link to="/traject"style={{fontSize: 15,width: 70,height: 31,padding: "5px 15px",border: "1px solid hsl(0, 0%, 80%)",borderRadius: 10,marginRight: 10,marginTop: 10,color: "black",display: "flex",justifyContent: "center",alignItems: "center"}}> <LeftOutlined />Back</Link>
        <Select defaultValue="Action" style={{ width: 190, margin:10 , height:30,border:"1 solid #000" }}>
            <Option value="add"><PlusOutlined style={{color:'blue'}} /><Link to="/createVehicule">Add Vehicles</Link></Option>
            <Option value="download"><DownloadOutlined style={{color:'blue'}} /><button style={{border: "#fff" , backgroundColor: "#fff"}} >Download Excel</button></Option>
        </Select>
        <br />
      </div>
      <div>
     <div style={{border: "1px solid hsl(0, 0%, 80%)" , padding: 10}}> 
     <MapContainer className='mapcontainer-3' center={center} zoom={14} >
     
        <TileLayer url={process.env.REACT_APP_MAPTILER_URL} attribution={process.env.REACT_APP_MAPTILER_ATTRIBUTION}/>
        <Routing  />
        <Polyline pathOptions={limeOptions} positions={trajectDataPolyline} />
    </MapContainer>
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
