import { BrowserRouter as Router, Route } from 'react-router-dom';
import { AuthProvider } from './context/auth';

import { Container } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import './App.css'; // to override some default styles of semantic ui, just in case

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

import MenuBar from './components/MenuBar';
import AuthRoute from './utils/AuthRoute';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Container>
          <MenuBar />
          <Route exact path='/' component={Home} />
          <AuthRoute exact path='/login' component={Login} />
          <AuthRoute exact path='/register' component={Register} />
        </Container>
      </Router>
    </AuthProvider>
  );
};

export default App;
