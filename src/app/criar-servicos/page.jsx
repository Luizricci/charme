"use client";
import styles from './criar.module.css';
import { useEffect, useState } from 'react';
import { Modal, Button, Input, Form, message } from 'antd';
import axios from 'axios';

export default function CriarServicos() {
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [servicos, setServicos] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchServicos();
  }, []);

  const fetchServicos = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/servicos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServicos(response.data);
    } catch {
      message.error('Erro ao buscar serviços');
    }
  };

  const handleCreate = async (values) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/servicos`, {
        nome: values.nome,
        descricao: values.descricao,
        preco_cents: Math.round(Number(values.preco) * 100),
        duracao_minutos: Number(values.duracao),
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success('Serviço criado com sucesso!');
      setModalOpen(false);
      form.resetFields();
      fetchServicos();
    } catch {
      message.error('Erro ao criar serviço');
    }
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Serviços</h1>
      <Button
        type="primary"
        className={styles.novoServicoBtn}
        onClick={() => setModalOpen(true)}
      >
        Novo Serviço
      </Button>

      <Modal
        title="Criar Novo Serviço"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreate}
        >
          <Form.Item
            label="Nome"
            name="nome"
            rules={[{ required: true, message: 'Digite o nome do serviço' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Preço (R$)"
            name="preco"
            rules={[{ required: true, message: 'Digite o preço' }]}
          >
            <Input type="number" min={0} step="0.01" />
          </Form.Item>
          <Form.Item
            label="Duração (minutos)"
            name="duracao"
            rules={[{ required: true, message: 'Digite a duração' }]}
          >
            <Input type="number" min={1} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Criar Serviço
            </Button>
          </Form.Item>
        </Form>
      </Modal>

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