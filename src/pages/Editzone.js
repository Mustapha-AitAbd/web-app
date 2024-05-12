import React from 'react'
import { useState,useEffect } from 'react';
import "../Styles/Vehicule.css"
import { EditControl } from 'react-leaflet-draw';
import { Space} from 'antd';
import { MapContainer, TileLayer, Polygon, useMapEvent,FeatureGroup } from 'react-leaflet';
import { useParams } from 'react-router-dom';
import { message } from 'antd';
import "leaflet/dist/leaflet.css";
import SideMenu from '../components/SideMenu/SideMenu';
import "leaflet-draw/dist/leaflet.draw.css";
import { Navigate } from 'react-router-dom';


export default function EditZone() {
  const { _id } = useParams();
  const [center, setCenter] = useState({ lat: 30.4205162, lng: -9.5838532 });
  const [mapLayer, setMapLayer] = useState([]);
  const [zoneData, setZoneData] = useState([]);
  const [zoneName,setZoneName]= useState('')
  const [zoneImage,setZoneImage]= useState(null)
  const [longitude,setLongitude]= useState('')
  const [latitude,setLatitude]= useState('')
  const [zoneType,setZoneType]= useState('')
  
  const [dataEmtpy, setDataEmpty] = useState([]);
  const [polygon, setPolygon] = useState([]);
 


  const handleSelectVehiculeStatus = (event) => {
    setZoneType(event.target.value);
  };

  useEffect(() => {
    console.log(_id)
    async function fetchData(_id) {
        try {
          const response = await fetch(`${process.env.REACT_APP_API_KEY}/zone`,{
            method:'POST',
            body: JSON.stringify({ id: _id}),
            headers: {
              'Content-type': 'application/json',
              'authorization':  JSON.parse(localStorage.getItem('login'))?.token
            },
           
          });
          const data = await response.json();
          const filteredPositions = data.filter((item) => item._id == _id);
            
            setZoneData(filteredPositions[0]);
            setZoneName(filteredPositions[0].zoneName)
            setZoneType(filteredPositions[0].zoneType)
            setLongitude(filteredPositions[0].longitude)
            setLatitude(filteredPositions[0].latitude) 
            const filtermapLayer = filteredPositions[0].zone.map(({ longitude, latitude }) => [latitude, longitude])
            setMapLayer(filtermapLayer)
        } catch (error) {
          console.error(error);
        }
      }
      fetchData(_id);
     
  }, [_id, dataEmtpy])
  

  const _onEdited = (e) => {
    const { layers } = e;
    layers.eachLayer(layer => {
      // Get the edited shape's coordinates
      const coords = layer.getLatLngs()[0].map(({ lat, lng }) => ({
        longitude: lng,
        latitude: lat
      })).map(({ _id, longitude, latitude }) =>  ({"longitude": longitude,  "latitude":latitude}))
      setPolygon(coords)
      console.log(polygon)
      // Do something with the edited shape
    });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
   
    
    const zonedata = {
      zoneName: zoneName,
      zoneType: zoneType,
      longitude: longitude,
      latitude: latitude,
      zone: JSON.stringify(polygon) ,
    };
   
  let dataZone = JSON.stringify(zonedata)
  let EditData= { id: _id, newData: dataZone}
  var form_data = new FormData();

  for ( var key in EditData) {
  form_data.append(key, EditData[key]);
  }

  if(zoneImage !== null){
  form_data.append('zoneImage', zoneImage);
  console.log(JSON.stringify(polygon))
  }
      const response = await fetch(`${process.env.REACT_APP_API_KEY}/zone/modify`, {
        method: "POST",
        headers: {
        
          'authorization':  JSON.parse(localStorage.getItem('login'))?.token
        },
        body: form_data,
      })
      .then(response => response.text())
      .then(data => {
        message.success(data);
        console.log('Success:', data);
        
      })
      .catch((error) => {
        console.error('Error:', error);
      });
     
  };
  const _onCreate = (e) => {
    console.log(e);
    const { layerType, layer } = e;
    if (layerType === "polygon") {
        const mapLayer = layer.getLatLngs()[0].map(({ lat, lng }) => ({
          longitude: lng,
          latitude: lat
        })).map(({ _id, longitude, latitude }) =>  ({"longitude": longitude,  "latitude":latitude}))
        setPolygon(mapLayer);
        }
       

  };
  
  const _onDeleted = (e) => {
    console.log(e);
    const { layers: { _layers } } = e;
    Object.values(_layers).map(({ _leaflet_id}) => {
        setMapLayer((layers) =>
            layers.filter((l) => l.id !== _leaflet_id)
        );
        }
    );
  }
  function SetViewOnClick({ animateRef }) {
    const map = useMapEvent('click', (e) => {
      if(center === null){
        map.flyTo([32.2359364, -7.953837799999974], 5)
      }else{
        map.flyTo(center, 14)
      }
     
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
      
      <div style={{border: "1px solid hsl(0, 0%, 80%)" , padding: 10}}> 
      <h1 style={{textAlign: "center" , marginBottom: 10, padding: 10}}>Edit Zone</h1>
      <form  className="my-form">
            <label className='label-form-edit'>
                Name:
                <input
                className='input-form-edit'
                type="text"
                name="zoneName"
                value={zoneName}
                onChange={(event) => setZoneName(event.target.value)}
                />
            </label>
            <label className='label-form-edit'>
                zoneType:
                <select className='input-form-edit'   style={{width : 200}} value={zoneType} onChange={handleSelectVehiculeStatus}>
                    
                    <option  value='cityZone'>cityZone</option>
                    <option  value='Parking'>Parking</option>
                </select>
                
            </label>
            <label className='label-form-edit' style={{width: 200}}>
                zoneImage:
                <input
                className='input-form-edit'
                type="file"
                name="zoneImage"
                
                onChange={(event) => setZoneImage(event.target.files[0])}
                />
            </label>
            <label className='label-form-edit'>
                latitude:
                <input
                className='input-form-edit'
                type="text"
                name="latitude"
                value={latitude}
                onChange={(event) => setLatitude(event.target.value)}
                />
            </label>
            <label className='label-form-edit'>
                longitude:
                <input
                className='input-form-edit'
                type="text"
                name="longitude"
                value={longitude}
                onChange={(event) => setLongitude(event.target.value)}
                />
            </label>
            <input type="submit" value='Edit Vehicule'className='my-button' style={{marginLeft: 18, borderRadius : 12,padding:9, backgroundColor: '#fff', color: 'black' ,border: '1px solid #000', marginTop: 2, fontSize:14}} onClick={handleSubmit} />
            </form>

     
      
    </div>

      </div>
      <div className='content-4'>
     
      <div>
     <div style={{border: "1px solid hsl(0, 0%, 80%)" , padding: 10}}> 
     
     <MapContainer className='mapcontainer-3' center={center} zoom={5} >
     <FeatureGroup>
          <EditControl position="topright" onCreated={_onCreate}  onEdited={_onEdited} onDeleted={_onDeleted} draw={{
            rectangle: false,
            circle: false,
            circlemarker: false,
            polyline: false,
            marker: false,
        }}/>
        <Polygon pathOptions={{ color: 'purple' }} positions={mapLayer}></Polygon>
    
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
  );
}