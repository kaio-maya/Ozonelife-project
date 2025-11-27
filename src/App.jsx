import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/public/Home';
import Ozonoterapia from './pages/public/Ozonoterapia';
import Services from './pages/public/Services';
import Products from './pages/public/Products';
import Contact from './pages/public/Contact';

import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import ManageServices from './pages/admin/ManageServices';
import ManageProducts from './pages/admin/ManageProducts';
import Appointments from './pages/admin/Appointments';
import Calendar from './pages/admin/Calendar';
import ProtectedRoute from './components/layout/ProtectedRoute';



const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="ozonoterapia" element={<Ozonoterapia />} />
            <Route path="servicos" element={<Services />} />
            <Route path="produtos" element={<Products />} />
            <Route path="contato" element={<Contact />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/calendario" element={<Calendar />} />
              <Route path="/gerenciarservicos" element={<ManageServices />} />
              <Route path="/gerenciarprodutos" element={<ManageProducts />} />
              <Route path="/agendamentos" element={<Appointments />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
