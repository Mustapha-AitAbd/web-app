import React from 'react'
import "../Styles/Vehicule.css"
import { Select } from 'antd';
import * as XLSX from 'xlsx'
import {useState, useEffect} from 'react'
import { Link } from 'react-router-dom';
import {PlusOutlined, DownloadOutlined} from '@ant-design/icons'
import { Space, Table, Tag, Badge, Button } from 'antd';
import SideMenu from '../components/SideMenu/SideMenu';
import { Modal } from 'antd';
import { Navigate } from 'react-router-dom';

const { Option } = Select;


export default function Vehicule() {
  const [vehiculeData, setVehiculeData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOption, setSelectedOption] = useState('_id');
  const [VehicleToDelete, setVehicleToDelete] = useState(null);
  const [vehiclesType, setVehiclesType] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_KEY}/vehicule`,{
      method:'POST',
      headers: {
        'Content-type': 'application/json',
        'authorization':  JSON.parse(localStorage.getItem('login'))?.token
      },
    })
    .then(response => response.json())
    .then(data => setVehiculeData(data));

    fetch(`${process.env.REACT_APP_API_KEY}/vehiculeType`,{
      method:'POST',
      headers: {
        'Content-type': 'application/json',
        
      },
    })
    .then(response => response.json())
    .then(data => setVehiclesType(data));
  }, []);

  const filteredData = vehiculeData?.filter(client => {
    const searchValue = searchTerm?.toLowerCase();
    const dataValue = client[selectedOption]?.toString()?.toLowerCase();
    return dataValue?.includes(searchValue);
  });

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(vehiculeData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Vehicle_Data_POGO');
    XLSX.writeFile(workbook, 'Vehicle_data.xlsx');
  }
  const deleteData = (_id) => {
    fetch(`${process.env.REACT_APP_API_KEY}/vehicule/delete`, {
      method: 'POST',
      body: JSON.stringify({ id : _id }),
      headers: {
        'Content-type': 'application/json',
        'authorization':  JSON.parse(localStorage.getItem('login'))?.token
      },
    })
    .then(response => response.json())
    .then(data => {
      console.log(data.message); 
      
    })
    .catch(error => console.error(error));
      window.location.reload();
      alert('You Deleted a Vehicule');
  }
  const detailsFunction =( _id) =>{
    fetch(`${process.env.REACT_APP_API_KEY}/vehicule/details`,{
      method:'POST',
      body: JSON.stringify({ id : _id }),
      headers: {
        'Content-type': 'application/json',
        'authorization':  JSON.parse(localStorage.getItem('login'))?.token
      }
    })
    .then(response => response.json())
    .then(data => console.log(data));
  }

    const columns = [
        {width : 50,
          title: 'Id Type',
          dataIndex: 'idType',
          key: 'Vehicule Type',
          width: 180,
          render: (text) => {
            const filteredData = vehiclesType?.filter(item => item._id === text);
            console.log(filteredData)
            return <> 
              <Tag color='blue' key={text}>{filteredData[0]?.typeName}</Tag>
            </>
          }   
  
            
          },

        {
          title: 'Vehicule id',
          dataIndex: '_id',
          width: 180,
          key: '_id',
        },
        {
            title: 'Hardware id',
            dataIndex: 'hardware',
            width: 180,
            key: 'hardware',
        },
        {
            title: 'City',
            dataIndex: 'city',
            width: 180,
            key: 'city',
        },
        {
            title: 'Fuel Level',
            dataIndex: 'batteryLevel',
            width: 180,
            key: 'batteryLevel',
            render: (text) => {
              if (text > 15 && text < 30) {
                return <><Badge status="warning"/>{text }%</>;
              }if(text >=30 && text < 101){
                return <><Badge status="success"/>{text }%</>;
              }
              if(text <= 15){
                return <><Badge status="error"/>{text }%</>;
              }
            },
          },
        {
            title: 'Vehicle State',
            dataIndex: 'vehiculeStatus',
            width: 180,
            key: 'bikeStatus',
            render: (text) => {
                if (text === 'active') {
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
        
        {
            title: 'Reservation State',
            dataIndex: 'reservation_state',
            width: 180,
            key: 'Vehicle State',
        },
        {
            title: 'last Used Date',
            dataIndex: 'lastUsedDate',
            width: 180,
            key: 'lastUsedDate',
        },
        {
          title: 'Action',
          dataIndex: '_id',
          width: 180,
          key: 'action',
          render: (text) => (
            <Space size="middle">
              
               <Link to= {`DetailsVehicules/${text}`} onClick={() => detailsFunction(text)}>Details</Link> 
               <a onClick={() => setVehicleToDelete(text)}>Delete</a>
              <Modal
                title="Confirm Deletion"
                visible={VehicleToDelete === text}
                onOk={() => {
                  deleteData(text);
                  setVehicleToDelete(null);
                }}
                onCancel={() => setVehicleToDelete(null)}
                okText="Delete"
                okType="danger"
                cancelText="Cancel"
              >
                <p>Are you sure you want to delete this Vehicle?</p>
              </Modal>  
            </Space>
          ),
        },
      ];
      return (
      <>
     {localStorage.getItem('login') === null ? <Navigate to="/login" /> :
     <Space className="SideMenuAndPageContent">
      <SideMenu />
      <div className="PageContent">
      < div style={{marginTop: 20,float: 'right', display:'flex',justifyContent:'space-between'}}>
      <input  type="text" placeholder= " Search" style={{fontSize: 15,width: 200,height: 31,padding: "5px 15px",border: "1px solid hsl(0, 0%, 80%)",borderRadius: 10,marginRight: 10,marginTop: 10,color: "black",display: "flex",justifyContent: "center",alignItems: "center"}}  value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)}/>
        <select value={selectedOption} style={{fontSize: 15,width: 155,height: 31,padding: "5px 15px",border: "1px solid hsl(0, 0%, 80%)",borderRadius: 10,marginRight: 10,marginTop: 10,color: "black",display: "flex",justifyContent: "center",alignItems: "center"}} onChange={(e) => setSelectedOption(e.target.value)}>
        <option value="_id">Vehicule id</option>
          <option value="vehiculeStatus">vehiculeStatus</option>lastUsedDate
          <option value="city">City</option>
          <option value="idType">Id Type</option>
          <option value="hardware">Hardware</option>
          <option value="batteryLevel">Battery Level</option>
          <option value="lastUsedDate">Last Used Date</option>
         
        </select>
        <Select defaultValue="Action" style={{ width: 190, margin:10 , height:30,border:"1 solid #000" }}>
            <Option value="add"><PlusOutlined style={{color:'blue'}} /><Link to="/createVehicule">Add Vehicle</Link></Option>
            <Option value="download"><DownloadOutlined style={{color:'blue'}} /><button style={{border: "#fff" , backgroundColor: "#fff"}} onClick={downloadExcel}>Download Excel</button></Option>
        </Select>
      </div>
      <br />
      <div style={{display:'flex', justifyContent:'space-between' }}>
      <Table columns={columns}  dataSource={filteredData}  pagination={{ pageSize: 10 }}/>
      </div>
      </div>
      </Space>
}
      </>
      
  );
}

