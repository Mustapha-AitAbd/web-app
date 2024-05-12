import React from 'react'
import "../Styles/Vehicule.css"
import { Select } from 'antd';
import { message } from 'antd';
import {useState, useEffect} from 'react'
import { Link } from 'react-router-dom';
import { DownloadOutlined} from '@ant-design/icons'
import SideMenu from '../components/SideMenu/SideMenu';
import { Space, Table, Tag} from 'antd';
import { Modal } from 'antd';
import * as XLSX from 'xlsx'
import { Navigate } from 'react-router-dom';
const { Option } = Select;


export default function Traject() {
  const [trajectData, setTrajectData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOption, setSelectedOption] = useState('clientId');
  const [tripToDelete, settripToDelete] = useState(null);
  const [clientData, setClientData] = useState([]);
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_KEY}/trip`,{
      method:'POST',
      headers: {
        'Content-type': 'application/json',
        'authorization':  JSON.parse(localStorage.getItem('login'))?.token
      },
    })
    .then(response => response.json())
    .then(data => setTrajectData(data));

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

  const deleteData = (_id) => {
    fetch(`${process.env.REACT_APP_API_KEY}/trip/delete`, {
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
      alert('You Deleted a Hardware');
  }
  

  const filteredData = trajectData?.filter(client => {
    return client[selectedOption].toLowerCase().includes(searchTerm.toLowerCase());
  });
  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(trajectData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Trajact_Data _POGO');
    XLSX.writeFile(workbook, 'client_data.xlsx');
  }

    const columns = [
    
        {
          title: 'Vehicle ID',
          dataIndex: 'vehiculeId',
          key: 'Vehicle ID',
          width: 180,
          render: (text) => {
            const vehicle = text;
            return <> <Tag color='blue'>{vehicle?.idType?.typeName}</Tag>
             <Tag color='green'>ID: {vehicle?._id} </Tag>
            </>
          }   
        },
        {
          title: 'Client Name',
          dataIndex: 'clientId',
          width: 180,
          key: 'clientId ',
          render: (text) => {
            const filteredData = clientData?.filter(item => item._id === text);
            console.log(filteredData)
            return <> 
               {filteredData[0]?.nom} {filteredData[0]?.prenom}
            </>
          }   
        },
        {
            title: 'Start Time',
            dataIndex: 'startTime',
            width: 180,
            key: 'startTime',
        },
        {
            title: 'End Time',
            dataIndex: 'endTime',
            width: 180,
            key: 'endTime',
        },
        {
            title: 'Current State',
            dataIndex: 'currentState',
            key: 'currentState',
            render: (text) => {
                if (text === 'Ended') {
                  return <><Tag color='green' key={text}>
                  {text}
                </Tag></>;
                }else{
                    return <><Tag color='yellow' key={text}>
                  {text}
                  </Tag></>;
                }
                
              },
        },
        {
          title: 'Payment Status',
          dataIndex: 'paymentStatus',
          width: 180,
          key: 'paymentStatus',
          render: (text) => {
            if (text === 'Pending') {
              return <><Tag color='red' key={text}>
              {text}
            </Tag></>;
            }else{
                return <><Tag color='yellow' key={text}>
              {text}
              </Tag></>;
            }
            
          },
      },
        {
          title: 'Total cost',
          dataIndex: 'totalcost',
          width: 180,
          key: 'endTime',
          render: (text) => 
          <Tag color='green' key={text}>
                {parseFloat(text).toFixed(2) + ' DH'}
              </Tag>
      },
    
        {
          title: 'Action',
          dataIndex: '_id',
          key: '_id',
          
          render: (text) => (
            <Space size="middle">
              <Link to= {`TrajectOfVehicule/${text}`}> Details</Link>
              
              <a onClick={() => settripToDelete(text)}>Delete</a>
              <Modal
                title="Confirm Deletion"
                visible={tripToDelete === text}
                onOk={() => {
                  deleteData(text);
                  settripToDelete(null);
                }}
                onCancel={() => settripToDelete(null)}
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
        <>
        {localStorage.getItem('login') === null ? <Navigate to="/login" /> :
      <Space className="SideMenuAndPageContent">
        <SideMenu />
      <div className="PageContent">
      < div className='container-2'style={{marginTop: 20,float: 'right', display:'flex'}}>
      <input  type="text" placeholder= " Search" style={{fontSize: 15,width: 213,height: 31,padding: "5px 15px",border: "1px solid hsl(0, 0%, 80%)",borderRadius: 10,marginRight: 10,marginTop: 10,color: "black",display: "flex",justifyContent: "center",alignItems: "center"}}  value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)}/>
        <select value={selectedOption} style={{fontSize: 15,width: 100,height: 31,padding: "5px 15px",border: "1px solid hsl(0, 0%, 80%)",borderRadius: 10,marginRight: 10,marginTop: 10,color: "black",display: "flex",justifyContent: "center",alignItems: "center"}} onChange={(e) => setSelectedOption(e.target.value)}>
          <option value="paymentStatus">Payment Status</option>
          <option value="currentState">Current State</option>
          <option value="startTime">Start Time</option>
          <option value="endTime">End Time</option>
          <option value="totalcost">Total cost</option>
        </select>
        <Select defaultValue="Action" style={{ width: 190, margin:10 , height:30,border:"1 solid #000" }}>
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

