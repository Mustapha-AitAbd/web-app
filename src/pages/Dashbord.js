import { ClockCircleOutlined,CarOutlined, DollarCircleOutlined, RiseOutlined, LeftOutlined, } from '@ant-design/icons'
import { Card, Space, Statistic, Table, Cascader, Button, } from 'antd'
import React, { useEffect, useState } from 'react'
import Addposition from '../components/AppButton/Addposition';
import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer,useMapEvent } from 'react-leaflet';
import Vehicleinfo from '../components/VehicleInfo/Vehicleinfo';
import { useRef } from 'react';
import "leaflet/dist/leaflet.css";
import BatteryGauge from 'react-battery-gauge'
import MarkerClusterGroup from 'react-leaflet-cluster';
import Myslider from '../components/VehicleInfo/Myslider';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import 'leaflet/dist/leaflet.css';
import SideMenu from '../components/SideMenu/SideMenu';
import { message } from 'antd';
import { Audio } from 'react-loader-spinner'
import { Navigate } from 'react-router-dom';


const marketIcon = new L.Icon({
  iconUrl: require("../images/marker-icon.png"),
  iconSize: [25, 42],
  iconAnchor: [17, 46],
  popupAnchor: [0, -46],
});

function Dashbord() {
  
  const [selectedZone, setSelectedZone] = useState('All Cities');
  const [selectLat, setSelectLat] = useState(32.2359364,);
  const [selectLng, setSelectLng] = useState( -7.953837799999974);
  const [zoom, setZome] = useState(4);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [searchVehicle, SetSearchVehicle] = useState(null);
  const [dataBike, SetDataBike] = useState([]);
  const [center, setCenter] = useState([34.0346534 ,-5.0161926]);
  const [datacity, setDatacity] = useState([]);
  const [city, setCity] = useState('All Cities')
  const [markerposition, setMarkerposition] = useState([])
  const [numberofvehicule, setNumberofvehicule] = useState(0)
  const [numberofvehiculeInactive, setNumberofvehiculeInactive] = useState(0)
  const [numberofvehiculeActive, setNumberofvehiculeActive] = useState(0)
  const [numberofScooters, setNumberofScooters] = useState(0)
  const [numberofTrottinettes, setNumberTrottinettes] = useState(0)
  const [numberofPayment, setNumberPayment] = useState(0)
  const [numberofVehiculeOnPacking, setVehiculeOnPacking] = useState(0)
  const[chartData, setChartData] =useState([]);
  const mapRef = useRef();
  const animateRef = useRef(false)
  const [last_payment, setLast_payment] = useState(undefined);
  const [has_more, setHas_more] = useState(null);
  const [payementData, setPayementData] = useState([]);
  const [isOnline, setIsOnline] = useState(false);
  const [rent, setRent] = useState([]);
  const [numberOfRent, setNumberOfRent] = useState(0);
  const [datavehiculeType, setDatavehiculeType] = useState([]);

  

  useEffect(() => {
    function handleStatusChange() {
      fetch(`${process.env.REACT_APP_API_KEY}`)
      .then(response => {
        console.log(response.status)
        if (response.status === 200 || chartData !== null) {

          setIsOnline(true);
          message.success('Connected to the server');
        } else {
          setIsOnline(false);
          message.error('Error connecting to the server');
        }
      })
      .catch(error => {
        setIsOnline(false);
        message.error('Error connecting to the server');
      });
    }
    handleStatusChange();

   
    fetch(`${process.env.REACT_APP_API_KEY}/vehicule`,{
      method:'POST',
      headers: {
        'Content-type': 'application/json',
        'authorization':  JSON.parse(localStorage.getItem('login'))?.token
      },
    })
    .then(response => response.json())
    .then(data => {
      SetDataBike(data);
      setMarkerposition(data);
   
    console.log(dataBike)}
    )

    async function fetchData() {
      const response = await fetch(`${process.env.REACT_APP_API_KEY}/zone/zones`,{
        method:'POST',
        headers: {
          'Content-type': 'application/json',
          'authorization':  JSON.parse(localStorage.getItem('login'))?.token
        },
      });
      const data = await response.json();
      setDatacity(data);
    }
    fetchData()
    async function fetchDataRent() {
      const response = await fetch(`${process.env.REACT_APP_API_KEY}/rent`,{
        method:'POST',
        headers: {
          'Content-type': 'application/json',
          'authorization':  JSON.parse(localStorage.getItem('login'))?.token
        },
      });
      const data = await response.json();
      const currentDate = new Date();
      setRent(data);
      const numberOfValidRentVehicles = data?.filter(vehicle => {
        const returnDate = new Date(vehicle?.returnDate);
        return returnDate > currentDate; // Filter out vehicles with return dates in the past
      }).length;
      
     setNumberOfRent(numberOfValidRentVehicles);
      
    }
    fetchDataRent()

    function fetchPayment(){
      let date = new Date();
      date =  date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();

    fetch(`${process.env.REACT_APP_API_KEY}/user/searchPayment`,{
      method:'POST',
      headers: {
        'Content-type': 'application/json',
        'authorization':  JSON.parse(localStorage.getItem('login'))?.token
      },
      body : JSON.stringify({ afterDate: date })
    })
    .then(response => response.json())
    .then(data => {
      setNumberPayment(data.amount);
      console.log(data.amount)
    });
  }
    
  
   fetchPayment() 

  }, []);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_KEY}/vehiculeType`,{
      method:'POST',
      headers: {
        'Content-type': 'application/json',
        'authorization':  JSON.parse(localStorage.getItem('login'))?.token
      },
     
    })
    .then(response => response.json())
    .then(data => {
      setDatavehiculeType(data)
    });
    function fetchTypeData() {
      if (Array.isArray(datavehiculeType)) {
        let numberOfScooters = 0;
        let numberOfTrottinettes = 0;
        let vehiculeOnPacking = 0;
    
        datavehiculeType.forEach(e => {
          const filteredBikes = dataBike.filter(item => item?.idType === e?._id);
          const vehiculesOnPackingOfType = filteredBikes.filter(item => item?.vehiculeStatus === 'inactive');
    
          numberOfScooters += filteredBikes.length;
          vehiculeOnPacking += vehiculesOnPackingOfType.length;
        });
    
        setNumberofScooters(numberOfScooters);
        setNumberTrottinettes(numberOfTrottinettes);
        setVehiculeOnPacking(vehiculeOnPacking);
      } else {
        // Handle the case when datavehiculeType is not an array
        console.error("datavehiculeType is not an array.");
      }
    }
    fetchTypeData();

    
    
  }, [dataBike]);
  useEffect(() => {
    async function fetchAllData() {
      if(selectedZone === null || selectedZone === undefined || selectedZone === "All Cities"  ){
        let level1Count = 0;
        let level2Count = 0;
        let level3Count = 0;
        let level4Count = 0;
        dataBike.forEach(item => {
          const batteryLevel = item.batteryLevel;
          if (batteryLevel <= 25) {
            level1Count++;
          } else if (batteryLevel <= 50) {
            level2Count++;
          } else if (batteryLevel <= 75) {
            level3Count++;
          } else {
            level4Count++;
          }
        });
        const response = await fetch(`${process.env.REACT_APP_API_KEY}/vehicule`,{
          method:'POST',
          headers: {
            'Content-type': 'application/json',
            'authorization':  JSON.parse(localStorage.getItem('login'))?.token
          },
        });
        const data = await response.json();
        SetDataBike(data);
        setNumberofvehicule(dataBike.map((item) => item._id).length)
        setNumberofvehiculeActive(dataBike.filter((item) => item.vehiculeStatus == 'active').length);
        setNumberofvehiculeInactive(dataBike.filter((item) => item.vehiculeStatus == 'inactive').length);
        setCity('All Cities')
        setChartData([
          { name: 'less 25', value: level1Count },
          { name: '26-50', value: level2Count },
          { name: '51-75', value: level3Count },
          { name: '76-100', value: level4Count },
        ])
        
    }
  }
     fetchAllData()
     function calculateBatteryLevelCounts(dataBike, city) {
      let level1Count = 0;
      let level2Count = 0;
      let level3Count = 0;
      let level4Count = 0; 
      dataBike.filter(item => item.city === city).forEach(item => {
        const batteryLevel = item.batteryLevel;
        if (batteryLevel <= 25) {
          level1Count++;
        } else if (batteryLevel <= 50) {
          level2Count++;
        } else if (batteryLevel <= 75) {
          level3Count++;
        } else {
          level4Count++;
        }
      });
  
        setChartData([
          { name: 'less 25', value: level1Count },
          { name: '26-50', value: level2Count },
          { name: '51-75', value: level3Count },
          { name: '76-100', value: level4Count },
        ])
  }
  calculateBatteryLevelCounts(dataBike, city)
    
  }, [selectedZone, datacity]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setZome(9);
    console.log(markerposition)
  };
  const handleMarkerClick = (position) => {
    setSelectedPosition(position);

  };

  
  const MyVehicle = () =>{
    const filteredPositions = dataBike.filter(Item =>
      (Item._id+'') === searchQuery)
      console.log(filteredPositions)
      if(searchQuery == ""){
        SetSearchVehicle(null);
      }else if(filteredPositions.length === 0){
        SetSearchVehicle(null);
      }
    else if(filteredPositions.length > 0){
      SetSearchVehicle(filteredPositions[0]);
      {/*setMarkerposition(filteredPositions);*/}
      setCenter([filteredPositions[0].lastCoords.latitude, filteredPositions[0].lastCoords.longitude]);
      setZome(16)
      console.log(searchVehicle);
    }
  }
  const MyVehicle_using_Markers = (id) =>{
    const filteredPositions = dataBike.filter(Item =>
      (Item._id+'').includes(id),);
      SetSearchVehicle(filteredPositions[0]);
    
    
  }
  const SearchEmptyVehicle = () => {
    setSearchQuery("")
    const filteredPositions = dataBike.filter(Item =>
      (Item._id+'').includes(searchQuery),);
      console.log(filteredPositions)
      if(searchQuery == ""){
        SetSearchVehicle(null);
      }else if(filteredPositions.length === 0){
        SetSearchVehicle(null);
      }
    
    
  }


  


  const handleZoneChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedZone(event.target.value);
    setNumberofvehicule( dataBike.filter((item) => ((item.city) == selectedValue)).length)
    setNumberofvehiculeInactive(dataBike.filter(item => item.city === selectedValue && item.vehiculeStatus === 'inactive').length);
    setNumberofvehiculeActive(dataBike.filter(item => item.city === selectedValue && item.vehiculeStatus === 'active').length);
    
    console.log(selectedValue);
    const selectedOption = datacity?.find(option => option.zoneName === selectedValue);
    console.log(selectedOption);
    console.log(center)
    if (selectedOption) {
      setSelectLat(selectedOption.latitude);
      setSelectLng(selectedOption.longitude);
      setCenter([selectedOption.latitude, selectedOption.longitude]);
      setCity(selectedOption.zoneName);
      setZome(11)
    }
    
  };
    function SetViewOnClick({ animateRef }) {
      const map = useMapEvent('click', (e) => {
        if(center === null){
          map.flyTo([32.2359364, -7.953837799999974], 5)
        }else{
          map.flyTo(center, zoom)
        }
       
      })
      return null
    }

  return (
    <>
    {  localStorage.getItem('login') === null ? <Navigate to="/login" /> : 
     <Space className="SideMenuAndPageContent">
     <SideMenu />
    <div className='container'>
    <div className='content-1' >
    <div style={{fontSize: 26, marginBottom:5, padding: 15}}>Mr. {JSON.parse(localStorage.getItem('login'))?.user?.username}</div>
    <div className='card' >
      <DashbordCard 
        icon={
          <DollarCircleOutlined
            style={{  color: "green",
                      fontSize: 24,
                      backgroundColor:"rgba(0,255,0,0.25)",
                      borderRadius: 20,
                      padding: 6,
                       }} 
            />}
          title={"Transactions"} value={numberofPayment} 
      />

      <DashbordCard icon ={<CarOutlined 
          style={{  color: "Blue",
          fontSize: 24,
          backgroundColor:"rgba(0,0,255,0.25)",
          borderRadius: 20,
          padding: 6, }} 
      />} 
        title={"Bikes"} value={numberofScooters} 
      />
      <DashbordCard icon ={<RiseOutlined 
          style={{  color: "Blue",
          fontSize: 24,
          backgroundColor:"rgba(0,0,255,0.25)",
          borderRadius: 20,
          padding: 6, }} 
        />} 
        title={"Rents"} value={numberOfRent} 
      />
      <DashbordCard style={{}} icon={<ClockCircleOutlined 
          style={{  color: "red",
          fontSize: 24,
          backgroundColor:"rgba(255,0,0,0.25)",
          borderRadius: 20,
          padding: 6, }} 
          />} title={"Parking"} value={numberofVehiculeOnPacking} 
      />
    </div> 
    <Space direction="horizontal" style={{fontSize: 26, marginBottom:10, padding: 15}}> 
    <select id="zones"style={{fontSize: 15,width: 180,height: 31,padding: "5px 15px",border: "1px solid hsl(0, 0%, 80%)",borderRadius: 10,marginRight: 10,marginTop: 10,color: "black",display: "flex",justifyContent: "center",alignItems: "center"}}  value={selectedZone} onChange={handleZoneChange}>
      <option key="All Cities" value="All Cities">All Cities</option>
      {datacity?.map((option) => (
        <option key={option?.zoneName} value={option?.zoneName}>
          {option?.zoneName}
        </option>
      ))}
    </select>
    <Addposition />
    </Space>
    <div className='row' >
      <div className='col-maps'>
      
      <MapContainer className='mapcontainer-1' ref={mapRef} center={center} zoom={zoom}>
  <TileLayer url={process.env.REACT_APP_MAPTILER_URL} attribution={process.env.REACT_APP_MAPTILER_ATTRIBUTION} />
  <MarkerClusterGroup>
    {markerposition ? (
      markerposition.map((position) => {
         let markerColor = 'blue'; // Default color
        
        if (position.vehiculeStatus === 'maintenace') {
          markerColor = 'red';
        } else if ( position.batteryLevel < 30) {
          markerColor = 'orange';
        } else if (position.vehiculeStatus === 'active') {
          markerColor = 'green';
        } else if (position.vehiculeStatus === 'inactive' ) {
          markerColor = 'blue';
        }
        return (
          <Marker
            key={position._id}
            position={[position.lastCoords.latitude, position.lastCoords.longitude]}
            icon={L.icon({
              iconUrl: `marker-${markerColor}.png`, // Replace with your marker image URLs
              iconUrl: require(`../images/marker-${markerColor}.png`),
              iconSize: [25, 42],
              iconAnchor: [17, 46],
              popupAnchor: [0, -46],
            })}
            onClick={() => handleMarkerClick(position)}
          >
            <Popup>
              <div>
                <h4>Vehicule_Id: {position._id}</h4>
                <p>City: {position.city}</p>
                <p>Status now: {position.vehiculeStatus}</p>
                <BatteryGauge value={position.batteryLevel} style={{ height: 40, width: 60 }} />
                <br />
                <button className='get_Vehicule' onClick={() => MyVehicle_using_Markers(position._id)}>
                  Search
                </button>
              </div>
            </Popup>
          </Marker>
        );
      })
    ) : (
      <Audio height="80" width="80" radius="9" color="green" ariaLabel="loading" wrapperStyle wrapperClass />
    )}
    <SetViewOnClick animateRef={animateRef} />
  </MarkerClusterGroup>
</MapContainer>

       
      
      </div>
    </div>
    </div>
    <div className='content-2'  >
    <h3 className='titre-1'> {numberofvehicule} vehicles in {city}</h3>
    <Button onClick={SearchEmptyVehicle} >
      <LeftOutlined />
    </Button>

    <input  type="text" placeholder="  Find a vehicle by its ID " style={{marginTop: 15, marginLeft:10,fontSize: 15,width: 220, height: 30,color: "black", border: "1px solid hsl(0, 0%, 80%)",borderRadius: 10 ,justifyContent: "center",alignItems: "center"}} value={searchQuery} onChange={handleSearchChange} />
    
    <input type="button" value="Search" style={{marginLeft:5,fontSize: 15,width: 80, height: 30,color: "black", border: "1px solid hsl(0, 0%, 80%)",borderRadius: 10 ,justifyContent: "center",alignItems: "center"}} onClick={MyVehicle}/>
    {/*<select id="zones"  style={{marginTop: 15,fontSize: 15,width: 60, height: 30, color: "black", border: "1px solid hsl(0, 0%, 80%)",borderRadius: 10 ,justifyContent: "center",alignItems: "center", marginLeft: 5  }}>
      <option value="id">By Id</option>
    </select>*/}
  
     <Vehicleinfo info={searchVehicle}/> 
     
      <Card style={{ width: 390,margin:5, marginTop: 15}}>
        <div style={{ fontSize: 18, marginTop:0, fontFamily: "'Poppins', sans-serif"}}>Vehicules State</div>
        <Myslider />
        <div style={{ fontSize: 15, marginTop:20, fontFamily: "'Poppins', sans-serif"}}>{numberofvehicule} Vehicle in state Vehicle in Total</div>
      </Card>
      <Card style={{ width: 390,margin:5}}>
      <div style={{ fontSize: 18, marginTop:0, fontFamily: "'Poppins', sans-serif"}}>Utilization</div>
      <table>
      <tbody>
        <tr >
          <td className='td-9' >{numberofvehicule-numberofvehiculeActive}</td>
          <td className='td-9'>0</td>
          <td className='td-9'>{numberofvehiculeActive}</td>
          <td className='td-9'>{numberofvehiculeInactive}</td>
        </tr>
        <tr >
          <td className='td-10' >Available</td>
          <td className='td-10'>Pre- Reservation</td>
          <td className='td-10'>Reserved & Open</td>
          <td className='td-10'>Inactive</td>
        </tr>
        
      </tbody>
    </table>
      </Card>
      <Card style={{ width: 390,margin:5}}>
        <div style={{ fontSize: 18, marginTop:0, fontFamily: "'Poppins', sans-serif"}}>Energy level</div>
        <BarChart width={350} height={250} data={chartData }>
          <XAxis dataKey="name" />
          <YAxis />
      
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </Card>
      
    </div>
    </div>
     </Space>
    
  }
    </>
 
  );
}


function DashbordCard({icon, title, value}) {
  return (
    
      <Card style={{ border: "1px solid #B1B1B1", margin: 5, width:250, height:100 }}>
        <Space direction="horizontal">
        {icon}
        <Statistic title={title} value={value} />
        </Space>
      </Card>    
  );
}

export default Dashbord;