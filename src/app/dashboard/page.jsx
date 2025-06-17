"use client";

import { useEffect, useState } from 'react';
import { Card, Button, Modal, Select } from 'antd';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './dashboard.module.css';
import axios from 'axios';

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [novoTipo, setNovoTipo] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Erro ao buscar Users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = async () => {
    if (!selectedUser || !novoTipo) {
      toast.error('Selecione o tipo de usuário.');
      return;
    }
    const token = localStorage.getItem('token');
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/user/alterar-tipo`, {
        id: selectedUser.id,
        novoTipo: novoTipo
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('Usuário atualizado com sucesso!');
      setIsModalOpen(false);
      setSelectedUser(null);
      setNovoTipo('');
      fetchUsers();
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      toast.error('Erro ao atualizar usuário.');
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <h2 className={styles.dashboardTitle}>Painel de Administrador</h2>
      <div className={styles.userCardsGrid}>
        {loading ? (
          <p className={styles.loadingText}>Carregando usuários...</p>
        ) : (
          users.map((user) => (
            <Card
              key={user.id}
              className={styles.userCard}
            >
              <div className={styles.userInfo}>
                <p className={styles.userName}><strong>Nome:</strong> {user.name}</p>
                <p className={styles.userEmail}><strong>Email:</strong> {user.email}</p>
                <p className={styles.userType}><strong>Tipo:</strong> {user.tipo} </p>
              </div>
              <div className={styles.userActions}>
                <Button
                  type="primary"
                  className={styles.editButton}
                  onClick={() => {
                    setSelectedUser(user);
                    setNovoTipo(user.tipo);
                    setIsModalOpen(true);
                  }}
                >
                  Editar
                </Button> 
              </div>
            </Card>
          ))
        )}
      </div>
      <Modal
        title="Editar Usuário"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setSelectedUser(null);
          setNovoTipo('');
        }}
        footer={null}
      >
        <div className={styles.modalContent}>
          <label className={styles.modalLabel}>Selecione o tipo de usuário:</label>
          <Select
            className={styles.modalSelect}
            placeholder="Selecione um tipo"
            value={novoTipo}
            onChange={setNovoTipo}
            options={[
              { value: 'admin', label: 'Administrador' },
              { value: 'profissional', label: 'Profissional' },
              { value: 'cliente', label: 'Cliente' },
            ]}
          />
          <Button
            type="default"
            className={styles.saveButton}
            onClick={handleEditUser}
          >
            Salvar
          </Button>
        </div>
      </Modal>
      <ToastContainer />
    </div>
  );
}