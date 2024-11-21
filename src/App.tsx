import { Route, Routes } from "react-router-dom";
import Login from "./components/Auth/Login";
import Navbar from "./components/Layout/Navbar";
import Signup from "./components/Auth/Signup";
import Home from "./components/Layout/Home";
import ProtectedRoute from "./utils/ProtectedRoute";

function App() {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </>
  );
}

export default App;
