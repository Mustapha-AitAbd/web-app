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

export default function Clients() {
  const [clientData, setClientData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOption, setSelectedOption] = useState('username');
  const [ClientToDelete, setClientToDelete] = useState(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_KEY}/client`,{
      method:'POST',
      headers: {
        'Content-type': 'application/json',
        'authorization':  JSON.parse(localStorage.getItem('login'))?.token
      },
    })
      .then(response => response.json())
      .then(data => setClientData(data));
      
  }, []);
  

 
  const filteredData = clientData?.filter(client => {
    const searchValue = searchTerm?.toLowerCase();
    const dataValue = client[selectedOption]?.toString().toLowerCase();
    return dataValue?.includes(searchValue);
  });

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(clientData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Client_Data_POGO');
    XLSX.writeFile(workbook, 'client_data.xlsx');
  }

  const deleteData = (_id) => {
    fetch(`${process.env.REACT_APP_API_KEY}/client/delete`, {
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
      message.success(data.message);
      
    })
    .catch(error => message.error(error));
      window.location.reload();
      alert('You Deleted a Client');
  }
  

  const columns = [
        {
          title: 'User Name',
          dataIndex: 'username',
          key: 'username',
          
        },
        {
          title: 'First Name',
          dataIndex: 'prenom',
          key: 'Vehicule id',
          width: 180
        },
        {
          title: 'Last Name',
          dataIndex: 'nom',
          key: 'First Name',
          width: 180,
          render: (text) => <a>{text}</a>,
        },
        
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'Email',
            width: 180
        },
         
        {
          title: 'Phone Number',
          dataIndex: 'phoneNumber',
          key: 'phoneNumber',
          width: 180,
          render: (text) => <a>{text}</a>
      },
       
        {
          title: 'Account Banned',
          dataIndex: 'accountBanned',
          key: 'accountBanned',
          width: 180,
          render: (text) => <a>{text+''}</a>
      },
      {
        title: 'Account Activated',
        dataIndex: 'accountActivated',
        key: 'accountActivated',
        width: 180,
        render: (text) => <a>{text+''}</a>
    },
    {
      title: 'Solde',
      dataIndex: 'solde',
      key: 'solde',
       width: 180,
      render: (text) => 
        <Tag color='green' key={text}>
              {parseFloat(text).toFixed(2)}
            </Tag>
    
  },
       
        
        {
          title: 'Action',
          key: 'action',
          dataIndex: '_id',
          render: (text) => (
            <Space size="middle">
              <Link to= {`EditClient/${text}`}>Edit </Link>
              <a onClick={() => setClientToDelete(text)}>Delete</a>
              <Modal
                title="Confirm Deletion"
                visible={ClientToDelete === text}
                onOk={() => {
                  deleteData(text);
                  setClientToDelete(null);
                }}
                onCancel={() => setClientToDelete(null)}
                okText="Delete"
                okType="danger"
                cancelText="Cancel"
              >
                <p>Are you sure you want to delete this Client?</p>
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
          <option value="username">User Name</option>
          <option value="prenom">First Name</option>
          <option value="nom">Last Name</option>
          <option value="email">Email</option>
          <option value="accountBanned">Account Banned</option>
          <option value="accountActivated">Account Activated</option>
          <option value="solde">solde</option>
        </select>
        <Select defaultValue="Action" style={{ width: 190, margin:10 , height:30,border:"1 solid #000" }}>
            <Option value="add"><PlusOutlined style={{color:'blue'}} /><Link to="/CreateClient">Add Customer</Link></Option>
            <Option value="download"><DownloadOutlined style={{color:'blue'}} /><button style={{border: "#fff" , backgroundColor: "#fff"}} onClick={downloadExcel}>Download Excel</button></Option>
            
        </Select>
      </div>
      <Table columns={columns} dataSource={filteredData} pagination={{ pageSize: 12 }}/>
      </div>
        </Space>
      
        
      
  );
}

