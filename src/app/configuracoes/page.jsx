"use client";
import { useEffect, useState } from 'react';
import { IoPencil } from "react-icons/io5";
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { Modal, Input } from 'antd';
import axios from 'axios';
import styles from './configuracoes.module.css';

export default function Configuracoes() {
    const router = useRouter();
    const [user, setUser] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editNumero, setEditNumero] = useState('');
    const [editEndereco, setEditEndereco] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = jwtDecode(token);
            const userId = decoded.id;

            axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/user_info/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
                .then(res => {
                    setUser(res.data);
                })
                .catch(() => {
                    setUser({});
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/login');
    };


    const openEditModal = () => {
        setEditNumero(user.numero || '');
        setEditEndereco(user.endereco || '');
        setIsModalOpen(true);
    };

    const handleSave = () => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = jwtDecode(token);
            const userId = decoded.id;
            setUser(prev => ({
                ...prev,
                numero: editNumero,
                endereco: editEndereco
            }));
            setIsModalOpen(false);
            axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/user_info/${user.id}`, {
                numero: editNumero,
                endereco: editEndereco
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                }
            })
        } else {
            console.error("Token não encontrado");
        }

    };

    if (loading) {
        return <div className={styles.container}>Carregando...</div>;
    }

    return (
        <div className={styles.container}>
            <h1 className="page-title">Configurações</h1>
            <div className={styles.profileBox}>
                <img
                    src={user.photo || "https://xsgames.co/randomusers/avatar.php?g=pixel"}
                    alt="Foto do usuário"
                    className={styles.profilePhoto}
                />
                <div className={styles.profileInfo}>
                    <p><strong>Nome:</strong> {user.name}</p>
                    <p><strong>Número:</strong> {user.phone}</p>
                    <p><strong>Endereço:</strong> {user.address}</p>
                </div>
                <IoPencil className={styles.iconPencil} onClick={openEditModal} />
            </div>
            <button className={styles.logoutButton} onClick={handleLogout}>
                Sair
            </button>

            <Modal
                title="Editar dados"
                open={isModalOpen}
                onOk={handleSave}
                onCancel={() => setIsModalOpen(false)}
                okText="Salvar"
                cancelText="Cancelar"
            >
                <div style={{ marginBottom: 16 }}>
                    <label>Número:</label>
                    <Input
                        value={editNumero}
                        onChange={e => setEditNumero(e.target.value)}
                        placeholder="Digite o número"
                    />
                </div>
                <div>
                    <label>Endereço:</label>
                    <Input
                        value={editEndereco}
                        onChange={e => setEditEndereco(e.target.value)}
                        placeholder="Digite o endereço"
                    />
                </div>
            </Modal>
        </div>
    );
}