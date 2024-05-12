import React from 'react'
import "../Styles/Vehicule.css"
import { Select } from 'antd';
import {useState, useEffect} from 'react'
import { Link } from 'react-router-dom';
import { DownloadOutlined} from '@ant-design/icons'
import { Space, Table,Tag} from 'antd';
import * as XLSX from 'xlsx'
import SideMenu from '../components/SideMenu/SideMenu';
import { Navigate } from 'react-router-dom';


const { Option } = Select;

export default function Invoice() {
  const [clientData, setClientData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOption, setSelectedOption] = useState('_id');
  const [getClient, setGetClient] = useState([]);

  useEffect(() => {
   
    function fetchDataOfFacture(){
      fetch(`${process.env.REACT_APP_API_KEY}/user/factures`,{
        method:'POST',
        headers: {
          'Content-type': 'application/json',
          'authorization':  JSON.parse(localStorage.getItem('login'))?.token
        },
      })
        .then(response => response.json())
        .then(data => {
          setClientData(data)
          console.log(data)
        }); 
    }
    fetchDataOfFacture()

    function getClient(){
      fetch(`${process.env.REACT_APP_API_KEY}/client`,{
        method:'POST',
        headers: {
          'Content-type': 'application/json',
          'authorization':  JSON.parse(localStorage.getItem('login'))?.token
        },
      })
        .then(response => response.json())
        .then(data => {
          setGetClient(data)
          console.log(data)
        }); 
    }
    getClient()
      
  }, []);
  

 
  const filteredData = clientData?.filter(client => {
    const searchValue = searchTerm?.toLowerCase();
    const dataValue = client[selectedOption]?.toString().toLowerCase();
    return dataValue?.includes(searchValue);
  });

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(clientData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Client_Factures_POGO');
    XLSX.writeFile(workbook, 'client_Factures.xlsx');
  }

  
  

  const columns = [
        {
          title: 'UserName',
          dataIndex: 'client._id',
          key: '_id',
          width: 200,
          render:  (text, record) => {
            const clientId = record?.client?._id;
            const filteredData = getClient?.filter(item => item._id === clientId);
            console.log(filteredData)
            return <> 
               {filteredData[0]?.username} 
            </>
          }   
          
        },
        {
          title: 'First Name',
          dataIndex: 'client._id',
          key: '_id',
          width: 200,
          render:  (text, record) => {
            const clientId = record?.client?._id;
            const filteredData = getClient?.filter(item => item._id === clientId);
            console.log(filteredData)
            return <> 
               {filteredData[0]?.prenom}
            </>
          }   
          
        },
        {
          title: 'Last Name',
          dataIndex: 'client._id',
          key: '_id',
          width: 200,
          render:  (text, record) => {
            const clientId = record?.client?._id;
            const filteredData = getClient?.filter(item => item._id === clientId);
            console.log(filteredData)
            return <> 
               {filteredData[0]?.nom} 
            </>
          }   
          
        },
        {
          title: 'Latest Input',
          dataIndex: 'latestInput',
          key: 'latestInput',
          width: 300
        },
        {
          title: 'Payement Status',
          dataIndex: 'payementStatus',
          key: 'payementStatus',
          width: 220,
          render: (text) => <a>{text}</a>,
        },
        
  
    {
      title: 'Total cost',
      dataIndex: 'totalcost',
      key: 'totalcost',
       width: 220,
      render: (text) => 
        <Tag color='green' key={text}>
              {parseFloat(text).toFixed(2) + ' DH'}
            </Tag>
    
  },
    
  {
    title: 'Action',
    key: 'action',
    dataIndex: 'client._id',
    width: 220,
    render: (text, record) => {
      const clientId = record?.client?._id;
      return (
        <>
          <Space size="middle">
            <Link to={`invoiceOfClient/${clientId}`}>Trips</Link>
          </Space>
        </>
      );
    },
  },
  {
    title: '',
    key: '_id',
    dataIndex: '_id',
    width: 220,
    render: (text) => {
      
      return (
        <>
          <Space size="middle">
            <Link to={`${process.env.REACT_APP_API_KEY}/user/printFacture/${text}`}>Download</Link>
          </Space>
        </>
      );
    },
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
        <select value={selectedOption} style={{fontSize: 15,width: 125,height: 31,padding: "5px 15px",border: "1px solid hsl(0, 0%, 80%)",borderRadius: 10,marginRight: 10,marginTop: 10,color: "black",display: "flex",justifyContent: "center",alignItems: "center"}} onChange={(e) => setSelectedOption(e.target.value)}>
          <option value="_id">Name</option>
          <option value="latestInput">Date</option>
          <option value="payementStatus">Payement Status</option>
          <option value="totalcost">Cost</option>
      
        </select>
        <Select defaultValue="Action" style={{ width: 190, margin:10 , height:30,border:"1 solid #000" }}>
            <Option value="download"><DownloadOutlined style={{color:'blue'}} /><button style={{border: "#fff" , backgroundColor: "#fff"}} onClick={downloadExcel}>Download Excel</button></Option>
            
        </Select>
      </div>
      <Table columns={columns} dataSource={filteredData}  pagination={{ pageSize: 12 }}/>
      </div>
    </Space>
      }
</>
      
      
  );
}

