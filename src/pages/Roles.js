import React from 'react'
import "../Styles/Vehicule.css"
import { Select } from 'antd';
import {useState} from 'react'
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {PlusOutlined} from '@ant-design/icons'
import SideMenu from '../components/SideMenu/SideMenu';
import { Space, Table, Tag } from 'antd';
import { Modal } from 'antd';
import { Navigate } from 'react-router-dom';
const { Option } = Select;


export default function Rent() {
  const [roleData, setRoleData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOption, setSelectedOption] = useState('roleName');
  const [RentOfferToDelete, setRentOfferToDelete] = useState(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_KEY}/role`,{
      method:'POST',
      headers: {
        'Content-type': 'application/json',
        'authorization':  JSON.parse(localStorage.getItem('login'))?.token
      },
    })
    .then(response => response.json())
    .then(data =>{
      setRoleData(data);
      console.log(data);
    } );
  }, []);

  const filteredData = roleData?.filter(client => {
    const searchValue = searchTerm?.toLowerCase();
    const dataValue = client[selectedOption]?.toString()?.toLowerCase();
    return dataValue?.includes(searchValue);
  });

 
  const deleteData = (_id) => {
    fetch(`${process.env.REACT_APP_API_KEY}/vehicule/delete`,{
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
          title: 'Role Name',
          dataIndex: 'roleName',
          key: 'roleName',
          width: 200,
          render: (text) => {
            return <> <Tag color='blue'>{text}</Tag>
            </>
          }   
          
        },
        {
          title: 'Roles Description',
          dataIndex: 'description',
          width: 900,
          key: 'rolesDescription',
         
        },
        
     
        {
          title: 'Action',
          dataIndex: '_id',
          key: 'roleName',
          render: (text) => (
            <Space size="middle">
               <Link to= {`EditRole/${text}`}>Edit </Link>
               <a onClick={() => setRentOfferToDelete(text)}>Delete</a>
              <Modal
                title="Confirm Deletion"
                visible={RentOfferToDelete === text}
                onOk={() => {
                  deleteData(text);
                  setRentOfferToDelete(null);
                }}
                onCancel={() => setRentOfferToDelete(null)}
                okText="Delete"
                okType="danger"
                cancelText="Cancel"
              >
                <p>Are you sure you want to delete this Rent Offer?</p>
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
        <select value={selectedOption} style={{fontSize: 15,width: 100,height: 31,padding: "5px 15px",border: "1px solid hsl(0, 0%, 80%)",borderRadius: 10,marginRight: 10,marginTop: 10,color: "black",display: "flex",justifyContent: "center",alignItems: "center"}} onChange={(e) => setSelectedOption(e.target.value)}>
          <option value="description">Description</option>
          <option value="roleName"> Role Name</option>
          
          
        </select>
        <Select defaultValue="Action" style={{ width: 190, margin:10 , height:30,border:"1 solid #000" }}>
            <Option value="add"><PlusOutlined style={{color:'blue'}} /><Link to="/CreateRoles">Add Roles</Link></Option>
           
        </Select>
      </div>
      <Table columns={columns} dataSource={filteredData} scroll={{ x: '100% '}} pagination={{ pageSize: 6 }}/>
      </div>
      </Space>
}
      </>
      
  );
}

