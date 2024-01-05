import Advice from './pages/Advice'
import Auth from './pages/Signup'
import Example from './pages/Advice-List'
import { BrowserRouter as Router} from 'react-router-dom';
import ProtectedRoute from './pages/ProtectedRoute';
import ErrorPage from './pages/ErrorPage';
import LandingPage from './pages/LandingPage';
import {Routes, Route} from 'react-router-dom';
import { useState } from 'react';
 
function App() {
  const [user, setUser] = useState(null);
  return (
    <Router>
      <div>
        <section>                              
            <Routes>                                                                        
              <Route path="/adviza" element={<Advice/>}/>
               <Route path="/signup" element={<Auth setUser={setUser}></Auth>}/>
               <Route path='/' element={<LandingPage />} />
               <Route path="/advice-list" element={
               <ProtectedRoute user={user}>
                <Example user={user}/>
                </ProtectedRoute>}/>
                <Route path='*' element={<ErrorPage />} />
            </Routes>                    
        </section>
      </div>
    </Router>
  );
}
 
export default App;
