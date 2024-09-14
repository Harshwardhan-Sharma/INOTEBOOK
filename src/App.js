import About from './components/About';
import Home from './components/Home';
import Navbar from './components/Navbar';
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";
import NoteState from './context/notes/NoteState';

function App() {
  return (

    <>
      <NoteState>
      <Router>
    <Navbar/>
    <Routes>
      <Route  path='/' element={<Home/>}/>
      <Route  path='/about' element={<About/>}/>
    </Routes>
   </Router>
      </NoteState>
   </>

   

  );
}

export default App;
