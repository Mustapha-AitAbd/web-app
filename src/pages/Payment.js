import React from 'react'
import "../Styles/Vehicule.css"
import { Select } from 'antd';
import * as XLSX from 'xlsx'
import {useState, useEffect} from 'react'
import { DownloadOutlined} from '@ant-design/icons'
import { Space, Table, Tag} from 'antd';
import SideMenu from '../components/SideMenu/SideMenu';
import { Navigate } from 'react-router-dom';
const { Option } = Select;


export default function Payment() {
  const [payementData, setPayementData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOption, setSelectedOption] = useState('status');
  const [last_payment, setLast_payment] = useState(undefined);
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_KEY}/user/payments`,{
      method:'POST',
      headers: {
        'Content-type': 'application/json',
        'authorization':  JSON.parse(localStorage.getItem('login'))?.token
      },
      body : JSON.stringify({ lastPayment : last_payment })
    })
    .then(response => response.json())
    .then(data => {setPayementData(data.data);
      console.log(data)
      
    }
    );

  }, []);
  const filteredData = payementData?.filter(client => {
    const searchValue = searchTerm?.toLowerCase();
    const dataValue = client[selectedOption]?.toString()?.toLowerCase();
    return dataValue?.includes(searchValue);
  });

 

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(payementData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Payement_Data_POGO');
    XLSX.writeFile(workbook, 'Payement_data.xlsx');
  }
  
  
    const columns = [
        {
          title: 'Username',
          dataIndex: 'userName',
          width: 140,
          key: 'userName',
        },
        {
            title: 'Full Name',
            dataIndex: 'fullName',
            width: 140,
            key: 'fullName',
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            width: 40,
            key: 'amount',
            render: (text) => {
           
              return <><Tag color='blue' key={text}>
              {text}
            </Tag></>;
          },
        },
        {
          title: 'Date',
          dataIndex: 'date',
          width: 240,
          key: 'date',
      },
        {
          title: 'Status',
          dataIndex: 'status',
          width: 180,
          key: 'status',
          render: (text) => {
           
              return <><Tag color='green' key={text}>
              {text}
            </Tag></>;
          },
      },
        
        {
            title: 'Description ',
            dataIndex: 'description',
            width: 340,
            key: 'description',
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
          <option value="status">status</option>
          <option value="fullName">fullName</option>
          <option value="userName">userName</option>
          <option value="amount">amount</option>
          <option value="date">date</option>
          <option value="description">description</option>
        </select>
        <Select defaultValue="Action" style={{ width: 190, margin:10 , height:30,border:"1 solid #000" }}>
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

