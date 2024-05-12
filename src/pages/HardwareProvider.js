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


export default function HardwareProvider() {
  const [hardwareproviderData, setHardwareproviderData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOption, setSelectedOption] = useState('Model');
  const [VehicleToDelete, setVehicleToDelete] = useState(null);
  

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_KEY}/hardwareprovider`,{
      method:'POST',
      headers: {
       'Content-type': 'application/json', 
      },
    })
    .then(response => response.json())
    .then(data => setHardwareproviderData(data));
  }, []);

  const filteredData = hardwareproviderData?.filter(HardwareProvider => {
    const searchValue = searchTerm?.toLowerCase();
    const dataValue = HardwareProvider[selectedOption]?.toString()?.toLowerCase();
    return dataValue?.includes(searchValue);
  });

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(hardwareproviderData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'hardwareprovider_Data_POGO');
    XLSX.writeFile(workbook, 'hardwareprovider_data.xlsx');
  }
  const deleteData = (_id) => {
    fetch(`${process.env.REACT_APP_API_KEY}/hardwareprovider/delete`, {
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
          title: 'Hardware Key Api',
          dataIndex: 'HardwareKeyApi',
          key: 'HardwareKeyApi',
          width: 220,
          render: (text) => {
            return <>
            <Tag color='blue' key={text}>{text}</Tag>
            </>
          }
 
        },
        
        {
            title: 'BaseUri',
            dataIndex: 'BaseUri',
            width: 200,
            key: 'BaseUri',
            render: (text) => {
                return <>
                <Tag color='green' key={text}>{text}</Tag>
                </>
              }
        },
       
        {
            title: 'Model',
            dataIndex: 'Model',
            width: 180,
            key: 'Model',
        },
        
        {
            title: 'Marque',
            dataIndex: 'Marque',
            width: 180,
            key: 'Marque',
           
        },
        {
          title: 'Action',
          dataIndex: '_id',
          width: 180,
          key: '_id',
          render: (text) => (
            <Space size="middle">
              
               <Link to= {`EditProvider/${text}`} >Edit</Link> 
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
       
          <option value="Model">Model</option>lastUsedDate
          <option value="Marque">Marque</option>
          <option value="BaseUri">BaseUri</option>
          <option value="HardwareKeyApi">HardwareKeyApi</option>
          
         
        </select>
        <Select defaultValue="Action" style={{ width: 190, margin:10 , height:30,border:"1 solid #000" }}>
            <Option value="add"><PlusOutlined style={{color:'blue'}} /><Link to="/CreateProvider">Add Provider</Link></Option>
            <Option value="download"><DownloadOutlined style={{color:'blue'}} /><button style={{border: "#fff" , backgroundColor: "#fff"}} onClick={downloadExcel}>Download Excel</button></Option>
        </Select>
      </div>
      <br />
      <div style={{display:'flex', justifyContent:'space-between' }}>
      <Table columns={columns}  dataSource={filteredData}  pagination={{ pageSize: 10 }}  />
      </div>
      </div>
      </Space>
}
      </>
      
  );
}

