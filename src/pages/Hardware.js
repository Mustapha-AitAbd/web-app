import React from 'react'
import "../Styles/Vehicule.css"
import { Select, message } from 'antd';
import {useState, useEffect} from 'react'
import { Link } from 'react-router-dom';
import {PlusOutlined, DownloadOutlined} from '@ant-design/icons'
import { Space, Table,Tag} from 'antd';
import * as XLSX from 'xlsx'
import SideMenu from '../components/SideMenu/SideMenu';
import { Modal } from 'antd';
import { Navigate } from 'react-router-dom';


const { Option } = Select;

export default function Hardware() {
  const [hardwareData, setHardwareData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOption, setSelectedOption] = useState('simNumber');
  const [hardwareToDelete, setHardwareToDelete] = useState(null);
  const [hardwareProviderData, setHardwareProviderData] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_KEY}/hardware`,{
      method:'POST',
      headers: {
        'Content-type': 'application/json',
        'authorization':  JSON.parse(localStorage.getItem('login'))?.token
      },
    })
      .then(response => response.json())
      .then(data => {
        setHardwareData(data)
        console.log(data);});
    
    function FetchHardwareProvider(){
      fetch(`${process.env.REACT_APP_API_KEY}/hardwareprovider`,{
        method:'POST',
        headers: {
          'Content-type': 'application/json',
          'authorization':  JSON.parse(localStorage.getItem('login'))?.token
        },
      })
        .then(response => response.json())
        .then(data => {
          setHardwareProviderData(data)
          console.log(data);});
    }
    FetchHardwareProvider();
      
  }, []);
  

 
  const filteredData = hardwareData?.filter(e => {
    const searchValue = searchTerm?.toLowerCase();
    const dataValue = e[selectedOption]?.toString().toLowerCase();
    return dataValue?.includes(searchValue);
  });

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(hardwareData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Hardware_Data_POGO');
    XLSX.writeFile(workbook, 'Hardware_data.xlsx');
  }

  const deleteData = (_id) => {
    fetch(`${process.env.REACT_APP_API_KEY}/hardware/delete`, {
      method: 'POST',
      body: JSON.stringify({ id : _id }),
      headers: {
        'Content-type': 'application/json',
        
      },
    })
    .then(response => response.json())
    .then(data => {
      console.log(data.message); 
      message.success(data.message);
      
    })
    .catch(error => message.error(error));
      window.location.reload();
      alert('You Deleted a Hardware');
  }
  

  const columns = [
    {
      title: 'Hardware Provider',
      dataIndex: 'hardwareProvider',
      key: 'hardwareProvider',
      width: 240,
      render:  (text) => {
        const filteredData = hardwareProviderData?.filter(item => item?._id === text);
        console.log(filteredData)
        return <> 
          <Tag color='green' key={text}> {filteredData[0]?.Marque} {filteredData[0]?.Model} </Tag>
        </>
      }   
    },
        {
          title: 'IMEI',
          dataIndex: '_id',
          key: '_id',
            width: 240,
          
        },
        {
          title: 'Sim Number',
          dataIndex: 'simNumber',
          key: 'Vehicule id',
          width: 240,
          render:  (text) => {
            return <> 
            <Tag color='blue' key={text}>{text} </Tag>
           </>
          }
        },
        {
          title: 'Sim Operator',
          dataIndex: 'simOperator',
          key: 'simOperator',
          width: 240,
          render:  (text) => {
            return <> 
            <Tag color='blue' key={text}> {text} </Tag>
          </>
          }
          
        },
        
        
          
        {
          title: 'Action',
          key: 'action',
          dataIndex: '_id',
          width: 240,
          render: (text) => (
            <Space size="middle">
              <Link to= {`EditHardware/${text}`}>Edit </Link>
              <a onClick={() => setHardwareToDelete(text)}>Delete</a>
              <Modal
                title="Confirm Deletion"
                visible={hardwareToDelete === text}
                onOk={() => {
                  deleteData(text);
                  setHardwareToDelete(null);
                }}
                onCancel={() => setHardwareToDelete(null)}
                okText="Delete"
                okType="danger"
                cancelText="Cancel"
              >
                <p>Are you sure you want to delete this Hardware?</p>
              </Modal>
              
            </Space>
          ),
        },
      ];
      return (
         localStorage.getItem('login') === null ? <Navigate to="/login" /> : 
         
        <Space className="SideMenuAndPageContent">
        <SideMenu />
        <div className="PageContent">
        < div className='container-2'style={{marginTop: 20,float: 'right', display:'flex'}}>
        <input  type="text" placeholder= " Search" style={{fontSize: 15,width: 213,height: 31,padding: "5px 15px",border: "1px solid hsl(0, 0%, 80%)",borderRadius: 10,marginRight: 10,marginTop: 10,color: "black",display: "flex",justifyContent: "center",alignItems: "center"}}  value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)}/>
        <select value={selectedOption} style={{fontSize: 15,width: 125,height: 31,padding: "5px 15px",border: "1px solid hsl(0, 0%, 80%)",borderRadius: 10,marginRight: 10,marginTop: 10,color: "black",display: "flex",justifyContent: "center",alignItems: "center"}} onChange={(e) => setSelectedOption(e.target.value)}>
          <option value="simNumber">Sim Number</option>
          <option value="simOperator">Sim Operator</option>
          <option value="hardwareProvider"> Hardware Provider</option>
         
        </select>
        <Select defaultValue="Action" style={{ width: 190, margin:10 , height:30,border:"1 solid #000" }}>
            <Option value="add"><PlusOutlined style={{color:'blue'}} /><Link to="/CreateHardware">Add Hardware</Link></Option>
            <Option value="download"><DownloadOutlined style={{color:'blue'}} /><button style={{border: "#fff" , backgroundColor: "#fff"}} onClick={downloadExcel}>Download Excel</button></Option>
            
        </Select>
      </div>
      <Table columns={columns} dataSource={filteredData} pagination={{ pageSize: 16 }}/>
      </div>
        </Space>
      
        
      
  );
}

