"use client";
import styles from './landing-page.module.css';

export default function LandingPage() {
  return (
    <div className={styles.landingContainer}>
      <header className={styles.header}>
        <span className={styles.logo}>🌸 Charme Salão</span>
        <nav className={styles.nav}>
          <a href="/login" className={styles.loginBtn}>Entrar</a>
          <a href="/create-account" className={styles.createBtn}>Criar Conta</a>
        </nav>
      </header>
      <main className={styles.main}>
        <section className={styles.hero}>
          <h1>Charme Salão de Beleza</h1>
          <p>
            Gerencie seus agendamentos, serviços e equipe de forma simples, rápida e moderna.<br />
            O Charme é uma plataforma completa para salões de beleza, profissionais e clientes.
          </p>
          <a href="/create-account" className={styles.ctaBtn}>Comece Agora</a>
        </section>
        <section className={styles.features}>
          <div className={styles.featureCard}>
            <h2>Para Clientes</h2>
            <ul>
              <li>Agende serviços com poucos cliques</li>
              <li>Visualize seus agendamentos em um calendário</li>
              <li>Receba notificações e lembretes</li>
            </ul>
          </div>
          <div className={styles.featureCard}>
            <h2>Para Profissionais</h2>
            <ul>
              <li>Veja sua agenda de atendimentos</li>
              <li>Gerencie horários disponíveis</li>
              <li>Controle de clientes e histórico</li>
            </ul>
          </div>
          <div className={styles.featureCard}>
            <h2>Para Administradores</h2>
            <ul>
              <li>Cadastre e edite serviços</li>
              <li>Gerencie toda a equipe</li>
              <li>Acompanhe o movimento do salão</li>
            </ul>
          </div>
        </section>
        <section className={styles.about}>
          <h2>Sobre o Projeto</h2>
          <p>
            O Charme Salão foi desenvolvido para facilitar o dia a dia de salões de beleza, trazendo organização, praticidade e tecnologia para todos os envolvidos. 
            Com uma interface intuitiva, o sistema permite que clientes agendem horários, profissionais acompanhem suas agendas e administradores tenham controle total do negócio.
          </p>
          <p>
            <b>Principais recursos:</b> <br />
            - Cadastro de serviços e profissionais <br />
            - Agendamento online com confirmação <br />
            - Calendário visual e responsivo <br />
            - Painel administrativo <br />
            - Notificações e lembretes <br />
            - Segurança e privacidade dos dados
          </p>
        </section>
      </main>
      <footer className={styles.footer}>
        © {new Date().getFullYear()} Charme Salão. Todos os direitos reservados.
      </footer>
    </div>
  );
}