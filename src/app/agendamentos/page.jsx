'use client';
import styles from './agendamento.module.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Card, Empty, Modal, DatePicker, Button, Select, ConfigProvider } from 'antd';
import ptBR from 'antd/locale/pt_BR';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Agendamentos() {
    const [agendamentos, setAgendamentos] = useState([]);
    const [profissionalAgendamentos, setProfissionalAgendamentos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [data, setData] = useState(null);
    const [hora, setHora] = useState(null);
    const [servico, setServico] = useState('');
    const [profissional, setProfissional] = useState('');
    const [servicos, setServicos] = useState([]);
    const [profissionais, setProfissionais] = useState([]);
    const [userType, setUserType] = useState(null);

    const horariosPermitidos = [
        "09:00:00", "10:00:00", "11:00:00", "12:00:00",
        "13:00:00", "14:00:00", "15:00:00", "16:00:00",
        "17:00:00", "18:00:00", "19:00:00"
    ];

    useEffect(() => {
        const fetchAgendamentos = async () => {
            try {
                const token = localStorage.getItem('token');
                let userId = null;
                if (token) {
                    const decoded = jwtDecode(token);
                    userId = decoded.id;
                    setUserType(decoded.tipo);
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
                setError('Erro ao carregar agendamentos');
            } finally {
                setLoading(false);
            }
        };
        fetchAgendamentos();
    }, []);

    useEffect(() => {
        if (userType === "profissional") {
            const fetchProfissionalAgendamentos = async () => {
                try {
                    const token = localStorage.getItem('token');
                    const decoded = jwtDecode(token);
                    const userId = decoded.id;
                    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/agendamentos/profissional/${userId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setProfissionalAgendamentos(response.data);
                } catch (error) {
                    console.error('Erro ao carregar agendamentos do profissional:', error);
                }
            }
            fetchProfissionalAgendamentos();
        }
    }, [userType]);

    useEffect(() => {
        const fetchServicos = async () => {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/servicos`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setServicos(response.data);
        };
        const fetchProfissionais = async () => {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/user`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfissionais(response.data);
        };
        fetchServicos();
        fetchProfissionais();
    }, []);

    const handleCreate = async () => {
        if (!data || !hora || !servico || !profissional) {
            toast.error('Preencha todos os campos!', {
                position: "top-right",
                theme: "colored",
                style: {
                    background: "#fff0f3",
                    color: "#c9184a",
                    fontWeight: 600,
                    borderRadius: "8px",
                    fontSize: "1rem"
                }
            });
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const decoded = jwtDecode(token);
            const cliente_id = decoded.id;
            const dataFormatada = `${data.year()}-${data.month() + 1}-${data.date()}`;
            const horaFormatada = hora;

            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/agendamentos`, {
                data: dataFormatada,
                hora: horaFormatada,
                cliente_id,
                servico_id: servico,
                profissional_id: profissional,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setAgendamentos(prev => [...prev, response.data]);
            toast.success('Agendamento criado com sucesso!', {
                position: "top-right",
                theme: "colored",
                style: {
                    background: "#e0ffe0",
                    color: "#22223b",
                    fontWeight: 600,
                    borderRadius: "8px",
                    fontSize: "1rem"
                }
            });
        } catch (error) {
            console.error('Erro ao criar agendamento:', error);
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message, {
                    position: "top-right",
                    autoClose: 4000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    style: {
                        background: "#fff0f3",
                        color: "#c9184a",
                        fontWeight: 600,
                        borderRadius: "8px",
                        fontSize: "1rem"
                    }
                });
            } else {
                toast.error('Erro ao criar agendamento', {
                    position: "top-right",
                    theme: "colored"
                });
            }
        }
        setIsModalOpen(false);
        setData(null);
        setHora(null);
        setServico('');
        setProfissional('');
    };

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

    const renderCards = (lista) =>
        lista.length === 0 ? (
            <Empty
                description="Nenhum agendamento encontrado"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                style={{ margin: '40px auto' }}
            />
        ) : (
            [...lista].reverse().map((ag, idx) => {
                const date = ag.data ? new Date(ag.data) : null;
                const time = ag.hora ? new Date(`1970-01-01T${ag.hora}`) : null;

                let agDateTime = null;
                if (date && time) {
                    agDateTime = new Date(
                        date.getFullYear(),
                        date.getMonth(),
                        date.getDate(),
                        time.getHours(),
                        time.getMinutes(),
                        time.getSeconds()
                    );
                }
                const now = new Date();
                const isPast = agDateTime && agDateTime < now;

                const formattedDate = date ? date.toLocaleDateString('pt-BR') : 'Data inválida';
                const formattedTime = time ? time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : 'Hora inválida';

                return (
                    <Card
                        key={idx}
                        className={`${styles.card} ${isPast ? styles.cardPast : ''}`}
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
        );

    return (
    <ConfigProvider locale={ptBR}>
        <div className={styles.container}>
            <h1 className="page-title">
                {userType === "profissional" ? "Serviços Por Vir" : "Agendamentos"}
            </h1>
            {userType !== "profissional" && (
                <Button type="primary" onClick={() => setIsModalOpen(true)} style={{ marginBottom: 24 }}>
                    Novo Agendamento
                </Button>
            )}
            <div className={styles.cardsContainer}>
                {userType === "profissional"
                    ? renderCards(profissionalAgendamentos)
                    : renderCards(agendamentos)}
            </div>
            <Modal
                title="Novo Agendamento"
                open={isModalOpen}
                onOk={handleCreate}
                onCancel={() => setIsModalOpen(false)}
                okText="Agendar"
                cancelText="Cancelar"
            >
                <div style={{ marginBottom: 16 }}>
                    <label>Serviços:</label>
                    <Select
                        value={servico}
                        onChange={value => setServico(value)}
                        placeholder="Selecione o serviço"
                        options={servicos.map(s => ({ label: s.nome, value: s.id }))}
                        style={{ width: '100%' }}
                    />
                </div>
                <div style={{ marginBottom: 16 }}>
                    <label>Data:</label>
                    <DatePicker
                        value={data}
                        onChange={setData}
                        style={{ width: '100%' }}
                        format="DD/MM/YYYY"
                        disabledDate={current => current && current < new Date().setHours(0, 0, 0, 0)}
                    />
                </div>
                <div style={{ marginBottom: 16 }}>
                    <label>Hora:</label>
                    <div className={styles.horariosGrid}>
                        {horariosPermitidos.map(horario => (
                            <button
                                key={horario}
                                type="button"
                                className={`${styles.horarioBtn} ${hora === horario ? styles.selected : ''}`}
                                onClick={() => setHora(horario)}
                            >
                                {horario.slice(0, 5)}
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                    <label>Profissional:</label>
                    <Select
                        value={profissional}
                        onChange={value => setProfissional(value)}
                        placeholder="Selecione o profissional"
                        options={profissionais
                            .filter(p => p.tipo === 'profissional')
                            .map(p => ({ label: p.name, value: p.id }))}
                        style={{ width: '100%' }}
                    />
                </div>
            </Modal>
            <ToastContainer />
        </div>
    </ConfigProvider>
);
}