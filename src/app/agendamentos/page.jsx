'use client';
import styles from './agendamento.module.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Card, Empty } from 'antd';

export default function Agendamentos() {
    const [agendamentos, setAgendamentos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAgendamentos = async () => {
            try {
                const token = localStorage.getItem('token');
                let userId = null;
                if (token) {
                    const decoded = jwtDecode(token);
                    userId = decoded.id;
                }
                if (userId) {
                    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/agendamentos/${userId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setAgendamentos(response.data); 
                } else {
                    throw new Error('Usuário não autenticado');
                }
            } catch (error) {
                console.error('Erro ao carregar agendamentos:', error);
                setError('Erro ao carregar agendamentos');
            } finally {
                setLoading(false);
            }
        };
        fetchAgendamentos();
    }, []);

    if (loading) {
        return <p>Carregando...</p>;
    }

    if (error) {
        return (
            <div className={styles.container}>
                <Empty
                    description={error}
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    style={{ margin: '40px auto' }}
                />
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Agendamentos</h1>
            <div className={styles.cardsContainer}>
                {agendamentos.length === 0 ? (
                    <Empty
                        description="Nenhum agendamento encontrado"
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        style={{ margin: '40px auto' }}
                    />
                ) : (
                    agendamentos.map((ag, idx) => {
                        const date = ag.data ? new Date(ag.data) : null;
                        const time = ag.hora ? new Date(`1970-01-01T${ag.hora}`) : null;

                        const formattedDate = date ? date.toLocaleDateString('pt-BR') : 'Data inválida';
                        const formattedTime = time ? time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : 'Hora inválida';

                        return (
                            <Card
                                key={idx}
                                className={styles.card}
                                styles={{ body: { padding: 20 } }}
                            >
                                <div className={styles.servico}>{ag.servico_nome}</div>
                                <div className={styles.info}>
                                    <b>{formattedTime} às {formattedDate}</b>
                                    <span className={styles.profissional}>{ag.profissional_nome}</span>
                                </div>
                            </Card>
                        );
                    })
                )}
            </div>
        </div>
    );
}