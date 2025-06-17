import styles from './criar.module.css';
import { Input, Button } from 'antd';

export default function CriarServicos() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Criar Serviços</h1>
      <form className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="serviceName">Nome do Serviço</label>
          <Input type="text" id="serviceName" name="serviceName" required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="serviceDescription">Descrição</label>
          <Input id="serviceDescription" name="serviceDescription" required></Input>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="servicePrice">Preço</label>
          <Input type="number" id="servicePrice" name="servicePrice" required />
        </div>
        <Button type="default" className={styles.submitButton}>Criar Serviço</Button>
      </form>
    </div>
  );
}