import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import Home from './pages/Home';
import Characters from './pages/Characters';
import Spellbook from './pages/Spellbook';
import Potions from './pages/Potions';
import Auth from './pages/Auth';
import UserProfile from './pages/UserProfile';
import ProtectedRoute from './components/ProtectedRoute';
import { AppProvider } from './contexts/AppContext';
import { AuthProvider } from './contexts/AuthContext';
import { UserProvider } from './contexts/UserContext';
import { DataProvider } from './contexts/DataContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <UserProvider>
        <DataProvider>
          <AppProvider>
            <Router>
              <div className="app">
                <div className="background-container"></div>
                <NavigationBar />
                <main>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/characters" element={<Characters />} />
                    <Route path="/spellbook" element={<Spellbook />} />
                    <Route path="/potions" element={<Potions />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/profile" element={
                      <ProtectedRoute>
                        <UserProfile />
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