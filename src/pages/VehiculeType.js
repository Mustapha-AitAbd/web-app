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
  const [selectedOption, setSelectedOption] = useState('typeName');
  const [VehicleToDelete, setVehicleToDelete] = useState(null);
  

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_KEY}/VehiculeType`,{
      method:'POST',
      headers: {
        'Content-type': 'application/json',
      },
    })
    .then(response => response.json())
    .then(data => setVehiculeData(data));
  }, []);

  const filteredData = vehiculeData?.filter(VehiculeType => {
    const searchValue = searchTerm?.toLowerCase();
    const dataValue = VehiculeType[selectedOption]?.toString()?.toLowerCase();
    return dataValue?.includes(searchValue);
  });

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(vehiculeData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'VehicleType_Data_POGO');
    XLSX.writeFile(workbook, 'VehicleType_data.xlsx');
  }
  const deleteData = (_id) => {
    fetch(`${process.env.REACT_APP_API_KEY}/VehiculeType/delete`, {
      method: 'POST',
      body: JSON.stringify({ id : _id }),
      headers: {
        'Content-type': 'application/json',
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
 

    const columns = [
        {
          title: 'Type Name',
          dataIndex: 'typeName',
          key: 'typeName',
          width: 220,
          render: (text) => {
            return <>
            <Tag color='blue' key={text}>{text}</Tag>
            </>
          }
 
        },
        
        {
            title: 'cost Per Minute Parked',
            dataIndex: 'costPerMinuteParked',
            width: 200,
            key: 'costPerMinuteParked',
            render: (text) => {
                return <>
                <Tag color='green' key={text}>{text}</Tag>
                </>
              }
        },
        {
            title: 'Cicost Per Minute Ridety',
            dataIndex: 'costPerMinuteRide',
            width: 180,
            key: 'costPerMinuteRide',
            render: (text) => {
                return <>
                <Tag color='green' key={text}>{text}</Tag>
                </>
              }
        },
       
        {
            title: 'created At',
            dataIndex: 'createdAt',
            width: 180,
            key: 'createdAt',
        },
        
        {
            title: 'Image',
            dataIndex: 'image',
            width: 180,
            key: 'image',
            render: (text) => (
                <Space size="middle">
                  <img src={process.env.REACT_APP_API_KEY+`/${text}`} alt="" height={45} width={60} style={{ border: "1px solid hsl(0, 0%, 80%)" , marginTop: 3}}/>
                </Space>
              ),
        },
        {
          title: 'Action',
          dataIndex: '_id',
          width: 180,
          key: 'action',
          render: (text) => (
            <Space size="middle">
              
               <Link to= {`EditVehicleType/${text}`} >Edit</Link> 
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
       
          <option value="typeName">Type Name</option>lastUsedDate
          <option value="costPerMinuteParked">costPerMinuteParked</option>
          <option value="hardware">costPerMinuteRide</option>
          <option value="createdAt">createdAt</option>
          
         
        </select>
        <Select defaultValue="Action" style={{ width: 190, margin:10 , height:30,border:"1 solid #000" }}>
            <Option value="add"><PlusOutlined style={{color:'blue'}} /><Link to="/CreateVehicleType">Add Type</Link></Option>
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

