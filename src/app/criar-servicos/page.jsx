"use client";
import styles from './criar.module.css';
import { useEffect, useState } from 'react';
import { Modal, Button, Input, Form, message } from 'antd';
import { IoPencil } from "react-icons/io5";
import axios from 'axios';

export default function CriarServicos() {
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [servicos, setServicos] = useState([]);
  const [form] = Form.useForm();
  const [editingServico, setEditingServico] = useState(null);

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

  const handleCreateOrEdit = async (values) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (editingServico) {
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/servicos/${editingServico.id}`, {
          nome: values.nome,
          preco_cents: Math.round(Number(values.preco) * 100),
          duracao_minutos: Number(values.duracao),
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        message.success('Serviço atualizado com sucesso!');
      } else {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/servicos`, {
          nome: values.nome,
          preco_cents: Math.round(Number(values.preco) * 100),
          duracao_minutos: Number(values.duracao),
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        message.success('Serviço criado com sucesso!');
      }
      setModalOpen(false);
      setEditingServico(null);
      form.resetFields();
      fetchServicos();
    } catch {
      message.error('Erro ao salvar serviço');
    }
    setLoading(false);
  };

  const openEditModal = (servico) => {
    setEditingServico(servico);
    form.setFieldsValue({
      nome: servico.nome,
      preco: (servico.preco_cents / 100).toFixed(2),
      duracao: servico.duracao_minutos,
    });
    setModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingServico(null);
    form.resetFields();
    setModalOpen(true);
  };

  return (
    <div className={styles.container}>
      <h1 className="page-title">Criar Serviços</h1>
      <Button
        type="primary"
        className={styles.novoServicoBtn}
        onClick={openCreateModal}
      >
        Novo Serviço
      </Button>

      <Modal
        title={editingServico ? "Editar Serviço" : "Criar Novo Serviço"}
        open={modalOpen}
        onCancel={() => { setModalOpen(false); setEditingServico(null); }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateOrEdit}
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
              {editingServico ? "Salvar Alterações" : "Criar Serviço"}
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
              <button
                className={styles.pencil}
                title="Editar serviço"
                onClick={() => openEditModal(servico)}
              >
                <IoPencil size={20} />
              </button>
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