import './App.css';
import { Routes, Route } from 'react-router-dom';
import ListeDesApplications from './pages/liste-des-applications';
import GbcRoutes from './gbc/gbc-routes';
import PageNotFound from './pages/page-not-found';
import GrhRoutes from './grh/grh-routes';
import GimRoutes from './gim/gim-routes';


function App() { 
  return (
    <Routes>
      <Route index element={<ListeDesApplications/>} />

      <Route path="/grh/*" element={<GrhRoutes />} />
      <Route path="/gbc/*" element={<GbcRoutes />} />
      <Route path="/gim/*" element={<GimRoutes />} />

      <Route path="*" element={<PageNotFound />} />
    </Routes>    
  );
}

export default App;
