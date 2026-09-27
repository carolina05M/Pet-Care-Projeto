import { Link } from 'react-router-dom'
import styles from './Header.module.css'

function Header() {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>PetCare</h1>
    
      <nav className={styles.nav}>
        <Link to="/">Home</Link>
        <Link to="/servicos">Serviços</Link>
        <Link to="/produtos">Produtos</Link>
        <Link to="/sobre">Sobre</Link>
        <Link to="/contato">Contato</Link>
        <Link to="/entrar">Entrar</Link>
      </nav>
    </header>
  )
}
 export default Header