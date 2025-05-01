import './App.css';
import { Routes, Route } from 'react-router-dom';
import Poster from './Posterpage/poster';
const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Poster />} />
      </Routes>
    </>
  );
};

export default App;
