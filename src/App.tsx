import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { HomeView } from './views/HomeView';
import { AboutView } from './views/AboutView';
import { LoginView } from './views/LoginView';
import { UserDashboardView } from './views/UserDashboardView';
import { AdminDashboardView } from './views/AdminDashboardView';

const MainContent: React.FC = () => {
  const { currentView } = useApp();

  return (
    <main className="flex-1">
      {currentView === 'home' && <HomeView />}
      {currentView === 'about' && <AboutView />}
      {currentView === 'login' && <LoginView />}
      {currentView === 'user-dashboard' && <UserDashboardView />}
      {currentView === 'admin-dashboard' && <AdminDashboardView />}
    </main>
  );
};

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-slate-900 font-sans selection:bg-[#14532D] selection:text-white">
        <Navbar />
        <MainContent />
        <Footer />
        <Toast />
      </div>
    </AppProvider>
  );
}
