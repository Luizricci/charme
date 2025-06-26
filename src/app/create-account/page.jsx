"use client";

import styles from './createAccount.module.css'; 
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function CreateAccount() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isRequesting, setIsRequesting] = useState(false);
    const router = useRouter();

    const handleCreateAccount = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setIsRequesting(true);
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/user/`, {
                name,
                email,
                password,
            });
            setSuccess('Conta criada com sucesso! Faça login.');
            setTimeout(() => router.push('/login'), 1500);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Erro ao criar conta. Tente novamente.';
            setError(errorMessage);
        } finally {
            setIsRequesting(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.loginBox}>
                <h1 className={styles.title}>Criar Conta</h1>
                <form className={styles.form} onSubmit={handleCreateAccount}>
                    <label htmlFor="name" className={styles.label}>Nome Completo</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className={styles.input}
                        required
                    />
                    <label htmlFor="email" className={styles.label}>E-mail</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className={styles.input}
                        required
                    />
                    <label htmlFor="password" className={styles.label}>Senha</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className={styles.input}
                        required
                    />
                    {error && <p className={styles.error}>{error}</p>}
                    {success && <p className={styles.success}>{success}</p>}
                    <button
                        type="submit"
                        className={styles.button}
                        disabled={isRequesting || !name || !email || !password}
                    >
                        Criar Conta
                    </button>
                    <div className={styles.noAccount}>
                        Já tem uma conta?
                        <button
                            className={styles.createAccountBtn}
                            type="button"
                            onClick={() => router.push('/login')}
                        >
                            Entrar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}