import React from 'react'
import "../Styles/Vehicule.css"
import { Select } from 'antd';
import * as XLSX from 'xlsx'
import {useState, useEffect} from 'react'
import { Link } from 'react-router-dom';
import {PlusOutlined, DownloadOutlined} from '@ant-design/icons'
import { Space, Table, Tag} from 'antd';
import SideMenu from '../components/SideMenu/SideMenu';
import { Modal } from 'antd';
import { Navigate } from 'react-router-dom';

const { Option } = Select;


export default function Vehicule() {
  const [UserData, setUserData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOption, setSelectedOption] = useState('username');
  const [VehicleToDelete, setVehicleToDelete] = useState(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_KEY}/user`,{
      method:'POST',
      headers: {
        'Content-type': 'application/json',
        'authorization':  JSON.parse(localStorage.getItem('login'))?.token
      },
    })
    .then(response => response.json())
    .then(data =>{
      setUserData(data)
      console.log(data);
    } );
  }, []);

  const filteredData = UserData?.filter(user => {
    const searchValue = searchTerm?.toLowerCase();
    const dataValue = user[selectedOption]?.toString()?.toLowerCase();
    return dataValue?.includes(searchValue);
  });

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(UserData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'user_Data_POGO');
    XLSX.writeFile(workbook, 'user_data.xlsx');
  }
  const deleteData = (_id) => {
    fetch(`${process.env.REACT_APP_API_KEY}/user/delete`, {
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
        title: 'User Name',
        dataIndex: 'username',
        width: 220,
        key: 'username',
        render: (role) => (
             
          <Tag color="blue" key={role} >
            {role}
          </Tag>
        ),
      },
       
        {
          title: 'First Name ',
          dataIndex: 'firstName',
          width: 220,
          key: 'firstName',
        },
        {
            title: 'Last Name',
            dataIndex: 'lastName',
            width: 200,
            key: 'lastName',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            width: 220,
            key: 'email',
        },
        
        {
            title: 'Role',
            dataIndex: 'role',
            width: 200,
            key: 'role',
            render: (role) => (
             
              <Tag color="green" key={role.roleName} >
                {role.roleName}
              </Tag>
            ),
        },
        
        {
          title: 'Action',
          width: 240,
          dataIndex: '_id',
          key: '_id',
          render: (text) => (
            <Space size="middle">
              
               <Link to= {`EditUser/${text}`} >Edit</Link> 
               
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
        <option value="username">username</option>
        <option value="email">Email</option>
        <option value="firstName">First Name</option>
        <option value="lastName">Last Name</option>
        
         
        </select>
        <Select defaultValue="Action" style={{ width: 190, margin:10 , height:30,border:"1 solid #000" }}>
            <Option value="add"><PlusOutlined style={{color:'blue'}} /><Link to="/createUser">Add User</Link></Option>
            <Option value="download"><DownloadOutlined style={{color:'blue'}} /><button style={{border: "#fff" , backgroundColor: "#fff"}} onClick={downloadExcel}>Download Excel</button></Option>
        </Select>
      </div>
      <br />
      <div style={{display:'flex', justifyContent:'space-between' }}>
      <Table columns={columns}  dataSource={filteredData} scroll={{ x: '100% '}}  pagination={{ pageSize: 10 }}/>
      </div>
      </div>
      </Space>
}
      </>
      
  );
}

