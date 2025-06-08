'use client';

import React from 'react';
import { CalendarOutlined, SettingOutlined, AppstoreOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Layout, Menu, Avatar } from 'antd';
import { useRouter, usePathname } from 'next/navigation';
import './globals.css';

const { Header, Content, Sider } = Layout;

const menuItems = [
  { icon: <AppstoreOutlined />, label: 'Dashboard', path: '/dashboard' },
  { icon: <CalendarOutlined />, label: 'Agendamentos', path: '/agendamentos' },
  { icon: <SettingOutlined />, label: 'Configurações', path: '/configuracoes' },
  { icon: <VideoCameraOutlined />, label: 'Serviços', path: '/servicos' },
];

export default function RootLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const menuItemsWithClick = menuItems.map((item) => ({
    ...item,
    key: item.path,
    onClick: () => router.push(item.path),
  }));

  const isLoginPage = pathname === '/login';

  return (
    <html lang="pt-br">
      <body>
        {isLoginPage ? (
          children 
        ) : (
          <Layout style={{ minHeight: '100vh' }}>
            <Sider width={240} className="sider">
              <div className="logo">
                <span style={{ marginRight: 8 }}>🌸</span>SALÃO DE BELEZA
              </div>
              <Menu
                mode="inline"
                selectedKeys={[pathname]}
                items={menuItemsWithClick}
                className="menu"
              />
            </Sider>
            <Layout>
              <Header className="header">
                <Avatar src="https://randomuser.me/api/portraits/women/44.jpg" />
                <span style={{ marginLeft: 12, fontWeight: 500 }}>Mariana</span>
              </Header>
              <Content className="content">
                <div className="innerContent">{children}</div>
              </Content>
            </Layout>
          </Layout>
        )}
      </body>
    </html>
  );
}
