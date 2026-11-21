import { useEffect } from 'react'
import { supabase } from './services/supabaseClient'
import './App.css'
import AppRoutes from './routes'

function App() {
  useEffect(() => {
    // Esse bloco roda assim que a página abre para testar a conexão
    async function testarConexao() {
      const { data, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('❌ Erro ao conectar:', error.message)
      } else {
        console.log('✅ Sucesso! Conectado ao Supabase:', data)
      }
    }

    testarConexao()
  }, [])
  
  return (
    <AppRoutes />
  )
}

export default App