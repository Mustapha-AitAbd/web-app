import React from 'react'
import { Menu } from 'antd';
import {SettingOutlined,BorderOutlined,FullscreenExitOutlined,PayCircleOutlined,DollarOutlined,LogoutOutlined, AppstoreAddOutlined,IdcardOutlined,CreditCardOutlined, UsergroupAddOutlined,HomeOutlined , CarOutlined,AimOutlined, ShoppingOutlined, BranchesOutlined, UserSwitchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

export default function SideMenu() {
  function handlerLogout(){
    localStorage?.clear();
    window.location.reload();
  }
  const navigate = useNavigate()
  return (
    <div className="SideMenu">
      <Menu style={{fontSize: 19, marginBottom:20, padding: 2, color: "#888",}}
      onClick={(items)=>{
        navigate(items.key);
      }}
      items={[
        {
          label: "Dashboard",
          icon: <HomeOutlined style={{color: "#7451f8"}}/>,
          key:"/"
        },
        {
          label: "vehicles",
          icon: <CarOutlined style={{color: "#7451f8"}}/>,
          key:"/vehicules"
        },
        {
          label: "Hardware",
          icon: <FullscreenExitOutlined  style={{color: "#7451f8"}}/>,
          key:"/hardware"
        },
        {
          label: "vehicles Type",
          icon: <CarOutlined style={{color: "#7451f8"}}/>,
          key:"/vehiculeType"
        },
        {
          label: "Provider",
          icon: <BorderOutlined style={{color: "#7451f8"}}/>,
          key:"/hardwareprovider"
        },
        {
          label: "Clients",
          icon: <UserSwitchOutlined style={{color: "#7451f8"}}/>,
          key:"/clients"
        },
        {
          label: "Trips",
          icon: <AppstoreAddOutlined style={{color: "#7451f8"}}/>,
          key:"/traject"
        },
        {
          label: "Payments",
          icon: <DollarOutlined style={{color: "#7451f8"}}/>,
          key:"/paiements"
        },
        {
          label: "Invoices",
          icon: <PayCircleOutlined  style={{color: "#7451f8"}}/>,
          key:"/invoice"
        },
        {
          label: "Zones",
          icon: <AimOutlined style={{color: "#7451f8"}}/>,
          key:"/Zones"
        },
        {
          label: "Rent vehicles",
          icon: <ShoppingOutlined style={{color: "#7451f8"}}/>,
          key:"/rent"
        },
        {
          label: "Rent Offers",
          icon: <CreditCardOutlined style={{color: "#7451f8"}}/>,
          key:"/rentoffer"
        },
        {
          label: "Credit Packages",
          icon: <IdcardOutlined style={{color: "#7451f8"}}/>,
          key:"/creditpackage"
        },
        {
          label: "Roles",
          icon: <BranchesOutlined style={{color: "#7451f8"}}/>,
          key:"/roles"
        },
        {
          label: "Users",
          icon: <UsergroupAddOutlined style={{color: "#7451f8"}}/>,
          key:"/User"
        },
        {
          label: "Settings",
          icon: <SettingOutlined style={{color: "#7451f8"}}/> ,
          key:"/setting"
        },
        {
          label: "Logout",
          icon: <LogoutOutlined  style={{ color: "#7451f8" }} />,
          key: "/login",
          onClick: handlerLogout
          
        }

      ]}>

      </Menu>
    </div>
  )
}
