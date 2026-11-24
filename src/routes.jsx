import { BrowserRouter, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Sobre from "./pages/Sobre";
import Servicos from "./pages/Servicos";
import Produtos from "./pages/Produtos";
import Entrar from "./pages/Entrar";
import Contato from "./pages/Contato";
import Administrador from "./pages/Administrador";
import Dashboard from "./pages/Administrador/Dashboard";
import AdminAgendamentos from "./pages/Administrador/AdminAgendamentos";
import AdminServicos from "./pages/Administrador/AdminServicos";
import AdminProdutos from "./pages/Administrador/AdminProdutos";
import AdminCategorias from "./pages/Administrador/AdminCategorias";
import AdminClientes from "./pages/Administrador/AdminClientes";
import AdminPets from "./pages/Administrador/AdminPets";
import AdminMensagens from "./pages/Administrador/AdminMensagens";
import DetalheServico from "./pages/DetalheServico";
import DetalheProduto from "./pages/DetalheProduto";
import NaoEncontrado from "./pages/NaoEncontrado";
import MeusPets from "./pages/MeusPets";
import MeusAgendamentos from "./pages/MeusAgendamentos";
import Proximos from "./pages/MeusAgendamentos/Proximos";
import Historico from "./pages/MeusAgendamentos/Historico";
import MinhaConta from "./pages/MinhaConta";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/servicos" element={<Servicos />} />
        <Route path="/servicos/:id" element={<DetalheServico />} />
        <Route path="/produtos" element={<Produtos />} />
        <Route path="/produtos/:id" element={<DetalheProduto />} />
        <Route path="/entrar" element={<Entrar />} />
        <Route path="/contato" element={<Contato />} />

        {/* Área do cliente (qualquer usuário logado) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/minha-conta" element={<MinhaConta />} />
          <Route path="/meus-pets" element={<MeusPets />} />
          <Route path="/meus-agendamentos" element={<MeusAgendamentos />}>
            <Route index element={<Proximos />} />
            <Route path="historico" element={<Historico />} />
          </Route>
        </Route>

        {/* Rotas exclusivas de administradores */}
        <Route element={<ProtectedRoute apenasAdmin />}>
          <Route path="/administrador" element={<Administrador />}>
            <Route index element={<Dashboard />} />
            <Route path="agendamentos" element={<AdminAgendamentos />} />
            <Route path="servicos" element={<AdminServicos />} />
            <Route path="produtos" element={<AdminProdutos />} />
            <Route path="categorias" element={<AdminCategorias />} />
            <Route path="clientes" element={<AdminClientes />} />
            <Route path="pets" element={<AdminPets />} />
            <Route path="mensagens" element={<AdminMensagens />} />
          </Route>
        </Route>

        {/* Qualquer outro endereço */}
        <Route path="*" element={<NaoEncontrado />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
