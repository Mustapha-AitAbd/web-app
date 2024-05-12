import React from 'react'
import "../Styles/Vehicule.css"
import { Select } from 'antd';
import {useState, useEffect} from 'react'
import { Link } from 'react-router-dom';
import {PlusOutlined, DownloadOutlined} from '@ant-design/icons'
import SideMenu from '../components/SideMenu/SideMenu';
import { Space, Table, Tag} from 'antd';
import * as XLSX from 'xlsx'
import { Modal } from 'antd';
import { Navigate } from 'react-router-dom';

const { Option } = Select;


export default function Rent() {
  const [packageData, setPackageData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOption, setSelectedOption] = useState('packageName');
  const [PackageToDelete, setPackageToDelete] = useState(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_KEY}/package`,{
      method:'POST',
      headers: {
        'Content-type': 'application/json',
        'authorization':  JSON.parse(localStorage.getItem('login'))?.token
      },
    })
    .then(response => response.json())
    .then(data => setPackageData(data));

   
  }, []);
  const filteredData = packageData?.filter(client => {
    const searchValue = searchTerm?.toLowerCase();
    const dataValue = client[selectedOption]?.toString()?.toLowerCase();
    return dataValue?.includes(searchValue);
  });
 
  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(packageData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Package_Data _POGO');
    XLSX.writeFile(workbook, 'Package_data.xlsx');
  }
  const deleteData = (_id) => {
    fetch(`${process.env.REACT_APP_API_KEY}/package/delete`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'authorization':  JSON.parse(localStorage.getItem('login'))?.token
      },
      body: JSON.stringify({ id : _id }),
      headers: {
        'Content-type': 'application/json'
      }
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
          title: ' Package Name',
          dataIndex: 'packageName',
          key: 'packageName',
          width: 245,
          
          
        },
        {
          title: 'Credits Offer',
          dataIndex: 'creditsOffer',
          key: 'creditsOffer',
          width: 185,
          
        },
      {
        title: 'Price',
        dataIndex: 'price',
        width: 180,
        key: '',
        render: (text) => {
              return <>
              <Tag color='green' key={text}>{text/100} DH</Tag></>;
           
        }
        },
        {
          title: ' Image',
          dataIndex: 'image',
          key: 'image',
          width: 185,
          render: (text) => (
            <Space size="middle">
              <img src={process.env.REACT_APP_API_KEY+`/${text}`} alt="" height={45} width={60} style={{ border: "1px solid hsl(0, 0%, 80%)" , marginTop: 3}}/>
            </Space>
          ),
      },
        
        {
          title: 'Action',
          dataIndex: '_id',
          key: '_id',
          width: 285,
          render: (text) => (
            <Space size="middle">
              <Link to= {`EditPackage/${text}`}>Edit </Link>
              
              <a onClick={() => setPackageToDelete(text)}>Delete</a>
              <Modal
                title="Confirm Deletion"
                visible={PackageToDelete === text}
                onOk={() => {
                  deleteData(text);
                  setPackageToDelete(null);
                }}
                onCancel={() => setPackageToDelete(null)}
                okText="Delete"
                okType="danger"
                cancelText="Cancel"
              >
                <p>Are you sure you want to delete this Package?</p>
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
      <input  type="text" placeholder= " Search Client" style={{fontSize: 15,width: 213,height: 31,padding: "5px 15px",border: "1px solid hsl(0, 0%, 80%)",borderRadius: 10,marginRight: 10,marginTop: 10,color: "black",display: "flex",justifyContent: "center",alignItems: "center"}}  value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)}/>
        <select value={selectedOption} style={{fontSize: 15,width: 100,height: 31,padding: "5px 15px",border: "1px solid hsl(0, 0%, 80%)",borderRadius: 10,marginRight: 10,marginTop: 10,color: "black",display: "flex",justifyContent: "center",alignItems: "center"}} onChange={(e) => setSelectedOption(e.target.value)}>
          <option value="packageName"> Package Name</option>
          <option value="creditsOffer">Credits Offer</option>
          <option value="price">Price</option>
        </select>
        <Select defaultValue="Action" style={{ width: 190, margin:10 , height:30,border:"1 solid #000" }}>
            <Option value="add"><PlusOutlined style={{color:'blue'}} /><Link to="/CreatePackage">Add One</Link></Option>
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

