import { BrowserRouter, Routes, Route } from "react-router-dom";
import Gallery from "./pages/Gallery";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Upload from "./pages/Upload";
import PrivateRoute from "./PrivateRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Gallery />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/upload" element={
          <PrivateRoute>
            <Upload />
          </PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}