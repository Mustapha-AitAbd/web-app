import React from 'react'
import "../Styles/Vehicule.css"
import { Select } from 'antd';
import {useState, useEffect} from 'react'
import { Link } from 'react-router-dom';
import {PlusOutlined, DownloadOutlined} from '@ant-design/icons'
import SideMenu from '../components/SideMenu/SideMenu';
import { Space, Table, Tag, Badge, Button } from 'antd';
import * as XLSX from 'xlsx'
import { Modal } from 'antd';
import { Navigate } from 'react-router-dom';
const { Option } = Select;


export default function Rent() {
  const [rentOfferData, setRentOfferData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [vehiculeTypeData, setVehiculeTypeData] = useState([]);
  const [id, setId] = useState('');
  const [selectedOption, setSelectedOption] = useState('prix');
  const [RentOfferToDelete, setRentOfferToDelete] = useState(null);
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_KEY}/rentoffer`,{
      method:'POST',
      headers: {
        'Content-type': 'application/json',
        'authorization':  JSON.parse(localStorage.getItem('login'))?.token
      },
    })
    .then(response => response.json())
    .then(data => {setRentOfferData(data);
      console.log(data)
    });

    fetch(`${process.env.REACT_APP_API_KEY}/vehiculeType`,{
      method:'POST',
      headers: {
        'Content-type': 'application/json',
        'authorization':  JSON.parse(localStorage.getItem('login'))?.token
      },
    })
      .then(response => response.json())
      .then(data => setVehiculeTypeData(data));
  }, []);

  const filteredData = rentOfferData?.filter(client => {
    const searchValue = searchTerm?.toLowerCase();
    const dataValue = client[selectedOption]?.toString()?.toLowerCase();
    return dataValue?.includes(searchValue);
  });

  
  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(rentOfferData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Rentoffer_Data _POGO');
    XLSX.writeFile(workbook, 'Rentoffer_data.xlsx');
    
  }
  const deleteData = (_id) => {
    fetch(`${process.env.REACT_APP_API_KEY}/rentoffer/delete`, {
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
      alert(' Deleted with success');
  }

    const columns = [
       
        {
          title: 'Prix',
          dataIndex: 'prix',
          key: 'prix',
          width: 120,
          render: (text) => {
            return <>
            <Tag color='green' key={text}>
              {text +' DH'}
            </Tag>
            </>
          }
          
        },
        {
          title: 'Max Distance',
          dataIndex: 'maxDistance',
          width: 180,
          key: 'maxDistance',
          render: (text) => {
            return <>
            <Tag color='blue' key={text}>
              {text +' km'}
            </Tag>
            </>
          }
         
        },
        
      {
        title: 'Description',
        dataIndex: 'description',
        width: 380,
        key: 'description',
      },
      {
        title: 'Period',
        dataIndex: 'period',
        width: 180,
        key: 'period',
        render: (text) => {
          return <>
          <Tag color='purple' key={text}>
            {text + ' Days'}
          </Tag>
          </>
        }
       
      },
      {
        title: 'vehiculeType',
        dataIndex: 'vehiculeType',
        width: 180,
        key: '',
        render: (text) => {
            const filterVehiculetypeData = vehiculeTypeData?.filter((item) => item?._id == text?.vehicule?._id);
           
              return <><Tag color='blue' key={text}>
                
                {filterVehiculetypeData[0]?.typeName}
            </Tag></>;
           
            }
        },
      
       
        {
          title: 'Action',
          dataIndex: '_id',
          key: '_id',
          render: (text) => (
            <Space size="middle">
               <Link to= {`EditRentoffer/${text}`}>Edit </Link>
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
        <option value="prix">Prix </option>
          <option value="period">Period</option>
          <option value="description">Description</option>
          <option value="maxDistance"> Max Distance</option>
          <option value="prix">Prix </option>
          
        </select>
        <Select defaultValue="Action" style={{ width: 190, margin:10 , height:30,border:"1 solid #000" }}>
            <Option value="add"><PlusOutlined style={{color:'blue'}} /><Link to="/CreateRentOffer">Add</Link></Option>
            <Option value="download"><DownloadOutlined style={{color:'blue'}} /><button style={{border: "#fff" , backgroundColor: "#fff"}} onClick={downloadExcel}>Download Excel</button></Option>
           
        </Select>
      </div>
      <Table columns={columns} dataSource={filteredData} pagination={{ pageSize: 6 }}/>
      </div>
      </Space>
}
      </>
      
  );
}

