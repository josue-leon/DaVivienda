import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { NotificationProvider } from './contexts/NotificationContext';
import { Layout, NotificationContainer } from './components/common';
import { Home } from './pages/Home';
import { RegistroCliente } from './pages/RegistroCliente';
import { VerRegistros } from './pages/VerRegistros';
import { RecargaBilletera } from './pages/RecargaBilletera';
import { ConsultarSaldo } from './pages/ConsultarSaldo';
import { Pagar } from './pages/Pagar';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#C8102E',
      dark: '#a00d25',
      light: '#e61339',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <NotificationProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/registro" element={<RegistroCliente />} />
              <Route path="/clientes" element={<VerRegistros />} />
              <Route path="/recarga" element={<RecargaBilletera />} />
              <Route path="/consultar-saldo" element={<ConsultarSaldo />} />
              <Route path="/pagar" element={<Pagar />} />
            </Routes>
          </Layout>
          <NotificationContainer />
        </NotificationProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
