import React from 'react'
import "../Styles/Vehicule.css"
import { Select } from 'antd';
import {useState, useEffect} from 'react'
import { Link } from 'react-router-dom';
import {PlusOutlined, DownloadOutlined} from '@ant-design/icons'
import { Space, Table,Tag} from 'antd';
import * as XLSX from 'xlsx'
import SideMenu from '../components/SideMenu/SideMenu';
import { Modal } from 'antd';
import { Navigate } from 'react-router-dom';



const { Option } = Select;

export default function Zones() {
  const [zoneData, setZoneData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOption, setSelectedOption] = useState('zoneName');
  const [zoneToDelete, setZoneToDelete] = useState(null);

  const [tableWidth, setTableWidth] = useState(window.innerWidth* 0.85);
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_KEY}/zone`,{
      method:'POST',
      headers: {
        'Content-type': 'application/json',
        'authorization':  JSON.parse(localStorage.getItem('login'))?.token
      },
    })
      .then(response => response.json())
      .then(data => setZoneData(data));
      
  }, []);
  useEffect(() => {
    const handleResize = () => setTableWidth(window.innerWidth* 0.85);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  

  const filteredData = zoneData.filter(zone => {
    return zone[selectedOption].toLowerCase().includes(searchTerm.toLowerCase());
  });
  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(zoneData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Zones_Data_POGO');
    XLSX.writeFile(workbook, 'Zones_data.xlsx');
  }
  const deleteData = (_id) => {
    fetch(`${process.env.REACT_APP_API_KEY}/zone/delete`, {
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
  

  const columns = [    
        {
          title: 'Zone Name',
          dataIndex: 'zoneName',
          key: 'zoneName',
          width: 180,
          render: (text) => {
              return <><Tag color='green' style={{fontSize: 18}} key={text}>
              {text}
            </Tag></>;
            
          },
        },
        {
          title: 'Zone Type',
          dataIndex: 'zoneType',
          key: 'zone Type',
          width: 180,
          render: (text) => <a style={{fontSize: 16}}>{text}</a>,
        },
        
        {
            title: 'Zone Image',
            dataIndex: 'zoneImage',
            key: 'zoneImage',
            width: 160,
            render: (text) => (
              <Space size="middle">
                <img src={process.env.REACT_APP_API_KEY+`/${text}`} alt="" height={45} width={60} style={{ border: "1px solid hsl(0, 0%, 80%)" , marginTop: 3}}/>
              </Space>
            ),
        },
        {
          title: 'Last Modification',
          dataIndex: 'updatedAt',
          key: 'updatedAt',
          width: 240,
         
          
      },
        
        
        {
          title: 'Action',
          dataIndex: '_id',
          width: 280,
          key: 'action',
          render: (text) => (
            <Space size="middle">
              <Link style={{fontSize: 16}} to={`editzone/${text}`}>Edit</Link>
              <a style={{fontSize: 16}} onClick={() => setZoneToDelete(text)}>Delete</a>
              <Modal
                title="Confirm Deletion"
                visible={zoneToDelete === text}
                onOk={() => {
                  deleteData(text);
                  setZoneToDelete(null);
                }}
                onCancel={() => setZoneToDelete(null)}
                okText="Delete"
                okType="danger"
                cancelText="Cancel"
              >
                <p>Are you sure you want to delete this zone?</p>
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
        < div className='container-2'style={{marginTop: 20,float: 'right', display:'flex'}}>
        <input  type="text" placeholder= " Search" style={{fontSize: 15,width: 213,height: 31,padding: "5px 15px",border: "1px solid hsl(0, 0%, 80%)",borderRadius: 10,marginRight: 10,marginTop: 10,color: "black",display: "flex",justifyContent: "center",alignItems: "center"}}  value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)}/>
        <select value={selectedOption} style={{fontSize: 15,width: 127,height: 31,padding: "5px 15px",border: "1px solid hsl(0, 0%, 80%)",borderRadius: 10,marginRight: 10,marginTop: 10,color: "black",display: "flex",justifyContent: "center",alignItems: "center"}}>
          <option value="zoneName">zoneName</option>
          <option value="zoneType">zoneType</option>
          
        </select>
        <Select defaultValue="Action" style={{ width: 190, margin:10 , height:30,border:"1 solid #000" }}>
            <Option value="add"><PlusOutlined style={{color:'blue'}} /><Link to="/Addzone">Add Zones</Link></Option>
            <Option value="download"><DownloadOutlined style={{color:'blue'}} /><button style={{border: "#fff" , backgroundColor: "#fff"}} onClick={downloadExcel}>Download Excel</button></Option>
            
        </Select>
      </div>
      <Table columns={columns} dataSource={filteredData}    pagination={{ pageSize: 12 }}/>
      </div>
        </Space>
        }
      
      </>
  );
}