
import { Routes, Route, Link } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Countries from "./pages/Countries";
import CountryDetails from "./pages/CountryDetails";
import ApplyVisa from "./pages/ApplyVisa";
import TrackApplication from "./pages/TrackApplication";
import Consultation from "./pages/Consultation";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Contact from "./pages/Contact";
import Users from "./pages/Users";
// import AdminApplications from "./pages/AdminApplications";


function App() {
  return (
    <>
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/countries" element={<Countries />} />

          <Route
            path="/countries/:id"
            element={<CountryDetails />}
          />

          <Route path="/apply" element={<ApplyVisa />} />

          <Route
            path="/track"
            element={<TrackApplication />}
          />

          <Route
            path="/consultation"
            element={<Consultation />}
          />

          <Route path="/contact" element={<Contact />} />

          <Route path="/login" element={<Login />} />

          <Route path="/signup" element={<Signup />} />

          <Route path="/users" element={<Users />} />
{/* 
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminApplications />
              </ProtectedRoute>
            }
          /> */}

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="*"
            element={
              <div className="container section">
                <h2>Page not found</h2>
                <p>The page you requested does not exist.</p>
                <Link to="/" className="primary-btn">
                  Return to Home
                </Link>
              </div>
            }
          />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default App;

