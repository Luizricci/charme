'use client';

import React, { useState, useEffect } from 'react';
import { CalendarOutlined, SettingOutlined, AppstoreOutlined, VideoCameraOutlined, PlusOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { useRouter, usePathname } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import './globals.css';

const { Content, Sider } = Layout;

const allMenu = [
  { icon: <AppstoreOutlined />, label: 'Dashboard', path: '/dashboard', allowed: ['admin'] },
  { icon: <CalendarOutlined />, label: 'Agendamentos', path: '/agendamentos', allowed: ['admin', 'profissional', 'cliente'] },
  { icon: <VideoCameraOutlined />, label: 'Serviços', path: '/servicos', allowed: ['admin', 'profissional', 'cliente'] },
  { icon: <PlusOutlined />, label: 'Criar Serviços', path: '/criar-servicos', allowed: ['admin', 'profissional'] },
  { icon: <SettingOutlined />, label: 'Configurações', path: '/configuracoes', allowed: ['admin', 'profissional', 'cliente'] },
];

const allowedRoutes = {
  admin: ['/dashboard', '/agendamentos', '/servicos', '/criar-servicos', '/configuracoes'],
  profissional: ['/agendamentos', '/servicos', '/criar-servicos', '/configuracoes'],
  cliente: ['/agendamentos', '/servicos', '/configuracoes'],
};

export default function RootLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true); 

  const isLoginPage = pathname === '/login';

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setUserType(null);
        setLoading(false);
        if (!isLoginPage) {
          router.replace('/login');
        }
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const tipo = decoded?.tipo;

        setUserType(tipo);


        const permittedRoutes = allowedRoutes[tipo] || [];

        if (!permittedRoutes.includes(pathname) && !isLoginPage) {
          router.replace('/agendamentos');
        }
      } catch (err) {
        console.error('Token inválido:', err);
        localStorage.removeItem('token');
        setUserType(null);
        if (!isLoginPage) {
          router.replace('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [pathname, router]);

  const menuItems = allMenu
    .filter(item => userType && item.allowed.includes(userType))
    .map(item => ({
      ...item,
      key: item.path,
      onClick: () => router.push(item.path),
    }));

  if (loading && !isLoginPage) {
    return <div style={{ padding: 20 }}>Carregando...</div>;
  }

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
                items={menuItems}
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
