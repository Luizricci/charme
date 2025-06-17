"use client";
import styles from './servicos.module.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Servicos() {
    const [servicos, setServicos] = useState([]);

    useEffect(() => {
        const fetchServicos = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/servicos`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log('Serviços:', response.data);
                setServicos(response.data);
            } catch (error) {
                console.error('Erro ao buscar serviços:', error);
            }
        };

        fetchServicos();
    }, []);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Serviços Disponíveis</h1>
            <div className={styles.servicosList}>
                {servicos.map((servico) => {
                    const precoFormatado = (servico.preco_cents / 100).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                        minimumFractionDigits: 2,
                    });
                    const horas = Math.floor(servico.duracao_minutos / 60);
                    const minutos = servico.duracao_minutos % 60;
                    let duracaoFormatada = '';
                    if (horas > 0) {
                        duracaoFormatada = `${horas}h${minutos > 0 ? ` ${minutos}min` : ''}`;
                    } else {
                        duracaoFormatada = `${minutos}min`;
                    }

                    return (
                        <div key={servico.id} className={styles.servicoCard}>
                            <h2 className={styles.servicoTitle}>{servico.nome}</h2>
                            <p className={styles.duracaoMinutos}>Duração: {duracaoFormatada}</p>
                            <p className={styles.servicoPrice}>Preço: {precoFormatado}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}