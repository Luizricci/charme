"use client";

import React from 'react';
import styles from './dashboard.module.css';
import { Card } from 'antd';

const agendamentos = [
  {
    nome: 'Ana Souza',
    servico: 'Corte',
    hora: '14:00',
    profissional: 'Paula Oliveira'
  },
  {
    nome: 'Carla Carvalho',
    servico: 'Manicure',
    hora: '10:30',
    profissional: 'Lucas Ferreira'
  },
  {
    nome: 'Beattiz Lima',
    servico: 'Cobnação',
    hora: '15:00',
    profissional: 'Paula Oliveira'
  }
];

export default function Dashboard() {
  return (
    <>
      <h2 className={styles.title}>Agendamentos de hoje</h2>
      <div className={styles.cardsContainer}>
        {agendamentos.map((ag, idx) => (
          <Card
            key={idx}
            className={styles.card}
            styles={{ body: { padding: 20 } }}
          >
            <div className={styles.nome}>{ag.nome}</div>
            <div className={styles.servico}>{ag.servico}</div>
            <div className={styles.info}>
              <b>{ag.hora}</b>
              <span className={styles.profissional}>{ag.profissional}</span>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}