import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Sobre from "./pages/Sobre";
import Servicos from "./pages/Servicos";
import Produtos from "./pages/Produtos";
import Entrar from "./pages/Entrar";
import Contato from "./pages/Contato";


function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/sobre" element={<Sobre />}></Route>
        <Route path="/servicos" element={<Servicos />}></Route>
        <Route path="/produtos" element={<Produtos />}></Route>
        <Route path="/entrar" element={<Entrar />}></Route>
        <Route path="/contato" element={<Contato />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes