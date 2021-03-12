import { BrowserRouter as Router, Route } from 'react-router-dom';
// styles
import { Container } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import './App.css'; // to override some default styles of semantic ui, just in case
// pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
// component
import MenuBar from './components/MenuBar';

const App = () => {
  return (
    <Router>
      <Container>
        <MenuBar />
        <Route exact path='/' component={Home} />
        <Route exact path='/login' component={Login} />
        <Route exact path='/register' component={Register} />
      </Container>
    </Router>
  );
};

export default App;
