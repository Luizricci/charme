'use client';

import React, { useState, useEffect } from 'react';
import { CalendarOutlined, SettingOutlined, AppstoreOutlined, VideoCameraOutlined, PlusOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { useRouter, usePathname } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import './globals.css';

const { Header, Content, Sider } = Layout;

const adminMenu = [
  { icon: <AppstoreOutlined />, label: 'Dashboard', path: '/dashboard' },
  { icon: <CalendarOutlined />, label: 'Agendamentos', path: '/agendamentos' },
  { icon: <VideoCameraOutlined />, label: 'Serviços', path: '/servicos' },
  { icon: <SettingOutlined />, label: 'Configurações', path: '/configuracoes' },
  { icon: <PlusOutlined />, label: 'Criar Serviços', path: '/criar-servicos' },
];

const userMenu = [
  { icon: <CalendarOutlined />, label: 'Agendamentos', path: '/agendamentos' },
  { icon: <VideoCameraOutlined />, label: 'Serviços', path: '/servicos' },
  { icon: <SettingOutlined />, label: 'Configurações', path: '/configuracoes' },
];

export default function RootLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [menuItems, setMenuItems] = useState([]);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserType(decoded.tipo);
        if (decoded.tipo === 'admin') {
          setMenuItems(adminMenu);
        } else {
          setMenuItems(userMenu);
        }
      } catch (e) {
        setMenuItems([]);
        setUserType(null);
      }
    } else {
      setMenuItems([]);
      setUserType(null);
    }
  }, []);

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
