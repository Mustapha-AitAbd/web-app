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
  const [rentData, setRentData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [clientData, setClientData] = useState([]);
  const [selectedOption, setSelectedOption] = useState('amount');
  const [rentOffer, setrentOffer] = useState([]);
  const [RentToDelete, setRentToDelete] = useState(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_KEY}/rent`,{
      method:'POST',
      headers: {
        'Content-type': 'application/json',
        'authorization':  JSON.parse(localStorage.getItem('login'))?.token
      },
    })
    .then(response => response.json())
    .then(data => setRentData(data));

    fetch(`${process.env.REACT_APP_API_KEY}/client`,{
      method:'POST',
      headers: {
        'Content-type': 'application/json',
        'authorization':  JSON.parse(localStorage.getItem('login'))?.token
      },
    })
      .then(response => response.json())
      .then(data => setClientData(data));

    fetch(`${process.env.REACT_APP_API_KEY}/rentoffer`,{
        method:'POST',
        headers: {
          'Content-type': 'application/json',
          'authorization':  JSON.parse(localStorage.getItem('login'))?.token
        },
      })
        .then(response => response.json())
        .then(data => setrentOffer(data));
  }, []);

  const filteredData = rentData?.filter(z => {
    const searchValue = searchTerm?.toLowerCase();
    const dataValue = z[selectedOption]?.toString()?.toLowerCase();
    return dataValue?.includes(searchValue);
  });

 
  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(rentData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Rent_Data _POGO');
    XLSX.writeFile(workbook, 'Rent_data.xlsx');
  }
  const deleteData = (_id) => {
    fetch(`${process.env.REACT_APP_API_KEY}/rent/delete`, {
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
          title: ' Full Name',
          dataIndex: 'fullName',
          key: 'fullName',
          width: 30,
          render: (text) => <a style={{width: 10}}>{text}</a>
          
        },
        {
          title: ' Phone Number',
          dataIndex: 'phoneNumber',
          key: 'phoneNumber',
          width: 40,
          render: (text) => <a style={{width: 10}}>{text}</a>
          
        },
        {
          title: 'Address',
          dataIndex: 'address',
          key: 'address',
          width: 160,
          
        },
        
      {
        title: 'Amount',
        dataIndex: 'amount',
        width: 20,
        key: 'amount',
      },
      {
        title: 'Rent_Offer',
        dataIndex: 'rentOffer',
        width: 100,
        key: 'rentOffer',
        render: (text) => {
          console.log(rentOffer)
          const filteredData = rentOffer?.filter(item => item._id === text);
          console.log(filteredData)
          return <> <Tag color='blue' key={text}>
           {filteredData[0]?.prix}DH for {filteredData[0]?.maxDistance} Km</Tag>
          </>
        }   
      },
      {
        title: 'Pick up Date',
        dataIndex: 'pickupDate',
        width: 20,
        key: 'pickupDate',
      },
      {
        title: 'Return Date',
        dataIndex: 'returnDate',
        width: 20,
        key: 'returnDate',
      },
        {
            title: 'Order Status',
            dataIndex: 'orderStatus',
            key: 'orderStatus',
            width: 100,
            render: (text) => {
                if(text === 'Processing' || text === 'Delivering'){
                  return <><Tag color='blue' key={text}> {text}</Tag></>
                }
                if(text === 'Arrived' || text === 'Returned'){
                  return <><Tag color='green' key={text}> {text}</Tag></>
                }
                if(text === 'Cancelled'){
                  return <><Tag color='red' key={text}> {text}</Tag></>
                }
              },
        },
        
        {
          title: 'Action',
          dataIndex: '_id',
          key: '_id',
          width: 100,
          render: (text) => (
            <Space size="middle">
              <Link to= {`DetailsRent/${text}`}>Details</Link>
              
              <a onClick={() => setRentToDelete(text)}>Delete</a>
              <Modal
                title="Confirm Deletion"
                visible={RentToDelete === text}
                onOk={() => {
                  deleteData(text);
                  setRentToDelete(null);
                }}
                onCancel={() => setRentToDelete(null)}
                okText="Delete"
                okType="danger"
                cancelText="Cancel"
              >
                <p>Are you sure you want to delete this Rent?</p>
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
          
          <option value="amount">Amount</option>
          <option value="fullName">Full Name</option>
          <option value="pickupDate">pickupDate</option>
          <option value="returnDate">returnDate</option>
          <option value="address">Address</option>
          <option value="rentOffer">rentOffer</option>
          <option value="phoneNumber">phoneNumber</option>
          <option value="orderType">orderType</option>
        </select>
        <Select defaultValue="Action" style={{ width: 190, margin:10 , height:30,border:"1 solid #000" }}>
            <Option value="add"><PlusOutlined style={{color:'blue'}} /><Link to="/CreateRent">Add</Link></Option>
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

