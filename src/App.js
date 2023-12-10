import './App.css';
import Home from './components/home';
import Product from './components/products';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="App">
      <h1>ANN SYSTEM</h1>
      <Home/>
      <Product/>
    </div>
    
  );
}

export default App;
