import React from 'react'
import { useState,useEffect } from 'react';
import "../Styles/Vehicule.css"
import { Select } from 'antd';
import { EditControl } from 'react-leaflet-draw';
import { Space, Form} from 'antd';
import L from 'leaflet';
import { MapContainer,TileLayer,FeatureGroup } from 'react-leaflet';
import { Tabs } from 'antd';
import { message } from 'antd';
import "leaflet/dist/leaflet.css";
import SideMenu from '../components/SideMenu/SideMenu';
import "leaflet-draw/dist/leaflet.draw.css";
import { Navigate } from 'react-router-dom';

export default function Addzone() {
  const [center, setCenter] = useState({ lat: 30.4205162, lng: -9.5838532 });
  const [mapLayer, setMapLayer] = useState([]);
  const [zoneName,setZoneName]= useState('')
  const [zoneImage,setZoneImage]= useState('')
  const [longitude,setLongitude]= useState('')
  const [latitude,setLatitude]= useState('')
  const [zoneType,setZoneType]= useState('Parking')
  const [form] = Form.useForm();
  useEffect(() => {
    console.log(mapLayer)
  }, [mapLayer])

  const handleSelectVehiculeStatus = (event) => {
    setZoneType(event.target.value);
  };

  const handleSubmit = async (event) => {
    const zonedata = {
      
      zoneName: zoneName,
      zoneType: zoneType,
      longitude: longitude,
      latitude: latitude,
      zone: JSON.stringify(mapLayer),


    };
    var form_data = new FormData();
      for ( var key in zonedata) {
      form_data.append(key, zonedata[key]);
      

    }
    form_data.append('zoneImage', zoneImage);
    console.log(JSON.stringify(mapLayer))
    
    console.log(JSON.stringify(zonedata))
    console.log(form_data)
    try {
      const response = await fetch(`${process.env.REACT_APP_API_KEY}/zone/create`, {
        method: "POST",
        headers: {
          'authorization':  JSON.parse(localStorage.getItem('login'))?.token
        },
        body: form_data,
      });
      
      const data = await response.text();
      message.success(data.message)
      message.success('Zone Added')
    } catch (error) {
      message.error(error)
    }
  };


  const _onCreate = (e) => {
    console.log(e);
    const { layerType, layer } = e;
    if (layerType === "polygon") {
        const mapLayer = layer.getLatLngs()[0].map(({ lat, lng }) => ({
          longitude: lng,
          latitude: lat
        })).map(({ _id, longitude, latitude }) =>  ({"longitude": longitude,  "latitude":latitude}))
        setMapLayer(mapLayer);
        }
        

  };
  
  const _onDeleted = (e) => {
    console.log(e);
  };


  return (
    <>
     {  localStorage.getItem('login') === null ? <Navigate to="/login" /> : 
    <Space className="SideMenuAndPageContent">
        <SideMenu />
      <div className="PageContent">
    <div className='ContainerGlobale'>
      <div className='content-3'>
      
      <div style={{border: "1px solid hsl(0, 0%, 80%)" , padding: 10}}> 
      <h1 style={{textAlign: "center" , marginBottom: 10, padding: 10}}>Add Zone</h1>
      <Form form={form} onFinish={handleSubmit}>
      <label className='label-vehiculedetails'>zone Name *</label>
      <input name="zoneName" className='input-addZone'  value={zoneName} onChange={(event) => setZoneName(event.target.value)}  /><br /><br />
      <label className='label-vehiculedetails'>zone Type *</label>
         <select className='input-addZone'   style={{width : 200}} value={zoneType} onChange={handleSelectVehiculeStatus}> 
                    
          <option  value='cityZone'>cityZone</option>
          <option  value='Parking'>Parking</option>
        </select><br /><br />
        <label className='label-vehiculedetails'>zone Image *</label>
      <input name="zoneImage" className='input-addZone'  type= 'file'  onChange={(event) => setZoneImage(event.target.files[0])}  placeholder='zoneImage'/> <br /><br />
      
      <label className='label-vehiculedetails'>Latitude *</label>
      <input name="latitude" className='input-addZone' value={latitude} onChange={(event) => setLatitude(event.target.value)}  /> <br /><br />
      
      <label className='label-vehiculedetails'>Longitude *</label>
      <input name="longitude" className='input-addZone'  value={longitude} onChange={(event) => setLongitude(event.target.value)} />
      <br /><br />
      <Form.Item>
      <button type="primary" className='my-button ' style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} >submit</button>
        
      </Form.Item>
    </Form>
     
      
    </div>

      </div>
      <div className='content-4'>
     
      <div>
     <div style={{border: "1px solid hsl(0, 0%, 80%)" , padding: 10}}> 
     <MapContainer className='mapcontainer-3' center={center} zoom={5} >
     <FeatureGroup>
          <EditControl position="topright" onCreated={_onCreate}  onDeleted={_onDeleted} draw={{
        rectangle: false,
        circle: false,
        circlemarker: false,
        polyline: false,
        marker: false,
        }}/>
        </FeatureGroup>
        <TileLayer url={process.env.REACT_APP_MAPTILER_URL} attribution={process.env.REACT_APP_MAPTILER_ATTRIBUTION}/>
        
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
