import { Space, Badge } from 'antd'
import { MailOutlined, BellFilled } from '@ant-design/icons';
import React from 'react'

export default function Header() {
  return (
    <div className="Header" style={{height: 70, backgroundColor: '#6DF873' }}>
     <img width={150} style={{marginTop: 10, marginBottom: 10}} src="/images/logo.svg" alt="Logo" />
      
    </div>
  )
}
