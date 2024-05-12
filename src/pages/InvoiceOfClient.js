import React from 'react'
import "../Styles/Vehicule.css"
import { Select, message } from 'antd';
import {useState, useEffect} from 'react'
import { Space, Table,Tag} from 'antd';
import SideMenu from '../components/SideMenu/SideMenu';
import { Navigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';


const { Option } = Select;

export default function InvoiceOfClient() {
  const [facturesData, setFacturesData] = useState([]);
  const [facturesDataTrips, setFacturesDataTrips] = useState([]);
  const [username, setUsername] = useState('');
  const [myid, setMyid] = useState('');
  const { _id } = useParams();


  useEffect(() => {
    function fetchDataOfFacture() {
      fetch(`${process.env.REACT_APP_API_KEY}/user/factures`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          'authorization':  JSON.parse(localStorage.getItem('login'))?.token
        },
      })
        .then(response => response.json())
        .then(data => {
          
          const filteredData = data?.filter(facture => facture?.client?._id === _id);
          setFacturesData(filteredData);
          setUsername(filteredData[0]?.client?.username);
          setMyid(filteredData[0]?._id);
          
          console.log(filteredData);
          
          setFacturesDataTrips(filteredData[0]?.trips);
          console.log(facturesDataTrips);
        });
    }
  
    fetchDataOfFacture();
  }, []);
  
  function Facture(){
    console.log(myid);
    fetch(`${process.env.REACT_APP_API_KEY}/user/processFacture`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'authorization':  JSON.parse(localStorage.getItem('login'))?.token
      },
      body: JSON.stringify({ id : myid })
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        message.success(data.message)

      })
      .catch((err) => {
        console.log(err);
        message.error('An error occured, please try again later', err)
      })

  }
  

  

  
  

  const columns = [
    {
        title: 'Vehicle Id',
        dataIndex: 'vehiculeId',
        key: 'VehicleId',
        width: 110,
        render: (text) => (
          <Tag color='blue' key={text}>
                  {text}
                </Tag>
        ),
        
        
      },
      
        { title: 'Start Time',
          dataIndex: 'startTime',
          key: 'startTime',
          width: 280,
          
       
     },
      { title: 'End Time',
       dataIndex: 'endTime',
        key: 'endTime',
        width: 280,
        
      },
      {
        title: 'Current State',
        dataIndex: 'currentState',
        key: 'currentState',
        width: 180,
        render: (text) => (
          <Tag color='blue' key={text}>
                  {text}
                </Tag>
        ),
       
      },
      {
        title: 'Payment Status',
        dataIndex: 'paymentStatus',
        key: 'paymentStatus',
        width: 180,
        render: (text) => {
          if (text === 'Succeeded') {
            return <><Tag color='green' key={text}>
            {text}
          </Tag></>;
          }else{
              return <><Tag color='red' key={text}>
              {text}
            </Tag></>;
          }
          
        },
       
      },
      { title: 'Cost',
       dataIndex: 'totalcost',
        key: 'totalcost',
        width: 180,
        render: (text) => 
        <Tag color='green' key={text}>
              {parseFloat(text).toFixed(2) + ' DH'}
            </Tag>
        },
     

      
      ];

      return (
         localStorage.getItem('login') === null ? <Navigate to="/login" /> : 
        <Space className="SideMenuAndPageContent">
        <SideMenu />
        <div className="PageContent">
        < div className='container-2'style={{marginTop: 20,float: 'right', display:'flex'}}>
        <div style={{fontSize: 26, marginBottom:5, padding: 15, color: 'blue'}}>Mr. {username ? username : "no invoice for this customer"}</div>
        <div><button className='my-button ' style={{fontSize: 15,width: 200,height: 31,padding: "5px 15px",border: "1px solid hsl(0, 0%, 80%)",borderRadius: 10,marginRight: 10,marginTop: 15,display: "flex",justifyContent: "center",alignItems: "center", position: "absolute", right : '5%'}} onClick={Facture}> Manual Payment</button></div>
       
       
      </div>
      <Table columns={columns} dataSource={facturesDataTrips} pagination={{ pageSize: 12 }}/>
      </div>
        </Space>
      
        
      
  );
}

