import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card } from 'antd'
import {LockOutlined,LoadingOutlined,ImportOutlined,PlusSquareOutlined,BorderOuterOutlined,BorderOutlined,UnlockOutlined,ExpandOutlined,BulbOutlined,BellOutlined,SwapRightOutlined,ApiOutlined ,ScheduleOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useState } from 'react'
import { message } from 'antd'
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

export default function Vehicleinfo(props) {
  const [isLocked, setIsLocked] = useState(false);
  const [_id, set_id] = useState('');
  const [simNumber, setSimNumber]= useState('')
  const [simOperator, setSimOperator]= useState('')
  const [vehiculeStatus, setVehiculeStatus]= useState('')
  const[city, setCity]= useState('')
  const [isloading, setIsloading] = useState(false);
  const [isloadingUnlock, setIsloadingUnlock] = useState(false);
  const[myprops, setMyprops]= useState(props.info)
  const [colorStart , setColorStart] = useState('')
  const [colorStop , setColorstop] = useState('')
  const [datavehicule, setDatavehicule] = useState([]);
  const [imei, setImei] = useState('');


  useEffect(() => {
    set_id(props.info)
   
  },[] );
  
  useEffect(() => {
    if (props.info) {
      fetch(`${process.env.REACT_APP_API_KEY}/vehicule/details`,{
        method:'POST',
        body: JSON.stringify({ id : props.info }),
        headers: {
          'Content-type': 'application/json',
          'authorization':  JSON.parse(localStorage.getItem('login'))?.token
        },
        
      })
        .then(response => response.json())
        .then(data => {
          setDatavehicule(data)
          setSimNumber(data?.hardware.simNumber ?? 'no data');
          setSimOperator(data?.hardware.simOperator  ?? 'no data');
          setImei(data?.hardware._id  ?? 'no data');
          
          setVehiculeStatus(data?.vehiculeStatus  ?? 'no data');
          setCity(data.city  ?? 'no data');
          if(data?.vehiculeStatus === 'active'){
            setColorStart('green')
            setColorstop('black')
          }else{
            setColorStart('black')
            setColorstop('green')
          }
        })
        .catch(error => {
          console.log('Error fetching vehicle details:', error);
          
        });
    } 
  }, [props.info, props.info?._id]);
  
  const detailsFunction =( _id) =>{
    fetch(`${process.env.REACT_APP_API_KEY}/vehicule/details`,{
      method:'POST',
      headers: {
        'Content-type': 'application/json',
        'authorization':  JSON.parse(localStorage.getItem('login'))?.token
      },
      body: JSON.stringify({ id : _id }),
    })
    .then(response => response.json())
    .then(data => console.log(data));
  }
  const handleAction = async (action) => {
    set_id(props.info)
    console.log(_id)
    setIsloading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_KEY}/vehicule/adminAction`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          'authorization':  JSON.parse(localStorage.getItem('login'))?.token
        },
        body: JSON.stringify({id: _id, action : action }),
      });
      const data = await response.json();
      if(response.status === 200){ 
        setIsLocked( true )
        console.log(isLocked)
        setIsloading(false);
        message.success(data.message);
        setColorStart('black')
        setColorstop('green')
      }else{
        message.error(data.message);
        setIsloading(false);
      }
    
      
    } catch (error) {
      message.error(error.message);
      console.log(error);
      setIsloading(false);
    }
  };


  const handleAction1 = async (action) => {
    set_id(props.info)
    console.log(_id)
    setIsloadingUnlock(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_KEY}/vehicule/adminAction`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          'authorization':  JSON.parse(localStorage.getItem('login'))?.token
        },
        body: JSON.stringify({id: _id, action : action }),
      });
      const data = await response.json();
      if(response.status === 200){ 
        setIsloadingUnlock(false);
        message.success(data.message);
        setColorStart('green')
        setColorstop('black')
      }else{
        setIsloadingUnlock(false);
        message.error(data.message);
      }
      console.log(data)
      
    } catch (error) {
      message.error(error.message);
      console.log(error);
      setIsloadingUnlock(false);
    }
   
     
   
  };
  
    if(props.info === null || props.info === undefined || props.info === ""){
       return(
        <Card style={{ width: 390,margin:5, marginTop: 15}}>
        <div style={{ fontSize: 18, marginTop:0, fontFamily: "'Poppins', sans-serif", color: "#888"}}>No vehicle Selected</div>
      </Card>)
    }
    else{
  return (
    <div className='row'>
    <table>
      <tbody>
        <tr>
          <td className='td-1'><BorderOuterOutlined /></td>
          <td className='td-2'><br />{datavehicule?.idType?.typeName}</td>
          <td className='td-3'> <Link to= {`vehicules/DetailsVehicules/${props.info._id}`} onClick={() => detailsFunction(props.info._id)}>Details</Link></td>
        </tr>
        <tr>
          <td className='td-4'><img src={process.env.REACT_APP_API_KEY+'/'+datavehicule?.idType?.image}alt="image" border="0"  style={{height: 100, width: 100}}/> </td>
          <td className='td-5'><strong>vehicle {props.info._id}</strong></td>
        </tr>
      </tbody>
    </table>
    <div style={{fontSize: 15, marginTop:10, marginLeft:10 }}>Current vehicule this.state.</div>
    <div className='td-7'>
    <div style={{fontSize: 17, marginTop:10, marginLeft:10 , color: 'blue' }}>IMEI</div>
        <div style={{fontSize: 15, marginTop:10, marginLeft:10 }}> {imei}</div>
    <div style={{fontSize: 17, marginTop:10, marginLeft:10 , color: 'blue' }}>SIM Number.</div>
        <div style={{fontSize: 15, marginTop:10, marginLeft:10 }}> {simNumber}</div>
    <div style={{fontSize: 17, marginTop:10, marginLeft:10, color: 'blue' }}>SIM Operator.</div>
        <div style={{fontSize: 15, marginTop:10, marginLeft:10 }}> {simOperator}</div>
    </div>
    <div style={{fontSize: 17, marginTop:22, marginLeft:10 }}>IoT device information </div>
    <table style={{fontSize: 15, marginTop:20, marginLeft:10, padding : 10, marginBottom : 20}}>
      <tbody>
        <tr style={{marginLeft: 10, marginBottom:10}}>
          <td className='td-8' style={{marginLeft: 10, marginRight: 20}}><ApiOutlined />{props.info.batteryLevel} %</td>
          <td className='td-8'><SwapRightOutlined style={{marginRight: 8}}/>{city}</td>
          <td className='td-8'><ScheduleOutlined  style={{marginRight: 8}}/>{vehiculeStatus}</td>
        </tr>
      </tbody>
    </table>
    <nav>
          <ul>
            <li><a href="#">Hardware</a></li>
            <li><a href="#">Tasks</a></li>
            <li><a href="#">Notes</a></li>
            <li><a href="#">Tags</a></li>
          </ul>
    </nav>
    <div style={{backgroundColor:"#FFD1AE",marginTop:5, height: 30, padding:2}}><BulbOutlined />  Tap and hold perform an action</div>
    <div class="links">
    <Button className='LinksButton' onClick={() => handleAction('stop') } >{isloading ? (<LoadingOutlined  style={{fontSize:26, marginBottom: 5}} />) : (<LockOutlined style={{fontSize:26, marginBottom: 5,color: colorStop}} />)}<br /> Lock </Button>
    <NotificationContainer />
      <Button className='LinksButton' onClick={() => handleAction1('start')} >{isloadingUnlock ? (<LoadingOutlined  style={{fontSize:26, marginBottom: 5}} />) : (<UnlockOutlined style={{fontSize:26, marginBottom: 5,color: colorStart}} />)}<br />Unlock</Button>
      <Button className='LinksButton'><BorderOuterOutlined style={{fontSize:24, marginBottom: 3}} /><br />Mobilize</Button>
      <Button  className='LinksButton'><PlusSquareOutlined style={{fontSize:24, marginBottom: 3}} /><br /><div style={{fontSize: 10}}>Mobilize</div></Button>
      <Button className='LinksButton'><BellOutlined style={{fontSize:24, marginBottom: 5}} /><br /> Honk</Button>
      <Button className='LinksButton'><BorderOutlined style={{fontSize:24, marginBottom: 5}} /><br />Lock-B</Button>
      <Button className='LinksButton'><ExpandOutlined style={{fontSize:24, marginBottom: 5}} /><br />Unlock-B</Button>
      <Button className='LinksButton'><ImportOutlined style={{fontSize:24, marginBottom: 5}} /><br /> Open</Button>
    </div>

    </div>
  )
}   
}
