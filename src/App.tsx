import './App.css'
import Header from './components/common/Header'
import Footer from './components/common/Footer'
import { useLocation, Outlet } from 'react-router-dom'

function AppContent() {
  const location = useLocation();
  const isChannelPage = location.pathname === '/channels';
  const isLoginPage = location.pathname === '/login';
  const isRegisterPage = location.pathname === '/register';
  const isProfilePage = location.pathname === '/profile';

  return (
    <div className="app-container min-h-screen flex flex-col" style={{ height: '100vh' }}>
      {!isLoginPage && !isRegisterPage && <Header />}
      {/* Main content: Routes */}
      <main className="main-content flex-1 bg-[#111]">
        <Outlet />
      </main>
      {!isChannelPage && !isLoginPage && !isRegisterPage && !isProfilePage && <Footer />}
    </div>
  );
}

function App() {
  return <AppContent />
}

export default App
