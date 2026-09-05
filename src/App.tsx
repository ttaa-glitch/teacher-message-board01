import { Routes, Route } from 'react-router-dom';
import MessagePage from './pages/MessagePage';
import AdminPage from './pages/AdminPage';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MessagePage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
