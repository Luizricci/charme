import styles from './configuracoes.module.css';

export default function Configuracoes() {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Configurações</h1>
            <p className={styles.text}>
                Esta página está em desenvolvimento. Em breve, você poderá personalizar suas preferências e configurações.
            </p>
        </div>
    );
}