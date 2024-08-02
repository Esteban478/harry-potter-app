import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import Home from './pages/Home';
import Characters from './pages/Characters';
import Spellbook from './pages/Spellbook';
import Auth from './pages/Auth';
import UserProfilePage from './pages/UserProfile';
import ProtectedRoute from './components/ProtectedRoute';
import { AppProvider } from './contexts/AppContext';
import { AuthProvider } from './contexts/AuthContext';
import { UserProvider } from './contexts/UserContext';
import { DataProvider } from './contexts/DataContext';

const App = () => {
  return (
    <AuthProvider>
      <UserProvider>
        <DataProvider>
          <AppProvider>
            <Router>
              <div className="app">
                <NavigationBar />
                <main>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/characters" element={<Characters />} />
                    <Route path="/spellbook" element={<Spellbook />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/profile" element={
                      <ProtectedRoute>
                        <UserProfilePage />
                      </ProtectedRoute>
                    } />
                  </Routes>
                </main>
              </div>
            </Router>
          </AppProvider>
        </DataProvider>
      </UserProvider>
    </AuthProvider>
  );
};

export default App;