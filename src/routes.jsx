import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Sobre from "./pages/Sobre";
import Servicos from "./pages/Servicos";
import Produtos from "./pages/Produtos";
import Entrar from "./pages/Entrar";
import Contato from "./pages/Contato";
import Administrador from "./pages/Administrador";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/servicos" element={<Servicos />} />
        <Route path="/produtos" element={<Produtos />} />
        <Route path="/entrar" element={<Entrar />} />
        <Route path="/contato" element={<Contato />} />
        <Route path="/dashboard" element={<Administrador />} />
        <Route path="/administrador" element={<Administrador />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;