import { BrowserRouter as Router } from 'react-router-dom';
import Header from './Header';
import Login from './Login';
import Signup from './Signup';

function App() {
  return (
    <Router>
      <div>
        <Header />
        {/* <Login /> */}
        <Signup />
      </div>
    </Router>
  );
}

export default App;
