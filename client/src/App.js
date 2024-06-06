import Navbar from './pages/Navbar';
import Login from './pages/Login';
import {Route, Routes, Navigate} from 'react-router-dom'
import Register from './pages/Register';
import Menu from './pages/Menu';
import AddFlower from './pages/AddFlower';
import FlowerDeleteForm from './pages/DeleteFlower';
import ADDelete from './pages/adddelete';
import UpdatePassword from './pages/updatepass';
import SummaryPage from './pages/summary';
function App() {
  return (
    <div >
    <Navbar/>
    <Routes>
      <Route path="/login" element = {<Login/>} />
      <Route path="/register" element = {<Register/>} />
      <Route path="/menu" element = {<Menu/>} />
      <Route path="/addflower" element = {<AddFlower/>} />
      <Route path="/deleteflower" element = {<FlowerDeleteForm/>} />
      <Route path="/addelete" element = {<ADDelete/>} />
      <Route path="/update" element = {<UpdatePassword/>} />
      <Route path="/summary" element={<SummaryPage />} />
       {/* Redirect to login if no matching route is found */}
       <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>

    </div>
  );
}

export default App;
