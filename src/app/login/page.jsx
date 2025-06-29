"use client";

import styles from './login.module.css';
import axios from 'axios';
import { useState } from 'react';
import { useRouter } from 'next/navigation';


export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isRequesting, setIsRequesting] = useState(false);
    const router = useRouter();

    const handleLogin = async () => {
        try {
            setIsRequesting(true);
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
                email,
                password,
            });
            const { token } = response.data;
            if (!token) {
                throw new Error('Token não encontrado na resposta');
            }
            console.log('requisição');
            localStorage.setItem('token', token);


            setError(null);
            setSuccess('Login realizado com sucesso!');
            router.push('/agendamentos');
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Erro ao fazer login. Tente novamente.';
            setError(errorMessage);
            setSuccess(null);
        } finally {
            setIsRequesting(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.loginBox}>
                <h1 className={styles.title}>Bem-vinda de volta!</h1>
                <div className={styles.form}>
                    <label htmlFor="username" className={styles.label}>E-mail</label>
                    <input
                        type="text"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className={styles.input}
                        required
                    />
                    <label htmlFor="password" className={styles.label}>Senha</label>
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className={styles.input}
                        required
                    />
                    {error && <p className={styles.error}>{error}</p>}
                    {success && <p className={styles.success}>{success}</p>}
                    <button onClick={handleLogin} className={styles.button} disabled={email === '' || password.length < 1 || isRequesting}>Login</button>
                    <div className={styles.noAccount}>
                        Não tem uma conta?
                        <button
                            className={styles.createAccountBtn}
                            onClick={() => router.push('/create-account')}
                            type="button"
                        >
                            Crie agora
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}