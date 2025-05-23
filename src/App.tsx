import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import AuthGuard from './components/ui/AuthGuard';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import TemplatesPage from './pages/TemplatesPage';
import RecipesPage from './pages/RecipesPage';
import PasswordPrompt from './components/ui/PasswordPrompt';

function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <PasswordPrompt />
        <AuthGuard>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="templates" element={<TemplatesPage />} />
                <Route path="recipes" element={<RecipesPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthGuard>
      </AuthProvider>
    </AppProvider>
  );
}

export default App;