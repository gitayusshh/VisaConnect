
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { validateSession } from "../services/api";

function ProtectedRoute({ children, adminOnly = false }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let active = true;

    const checkSession = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        if (active) {
          setAuthenticated(false);
          setIsAdmin(false);
          setLoading(false);
        }
        return;
      }

      try {
        const user = await validateSession(token);

        if (active) {
          localStorage.setItem("user", JSON.stringify(user));
          setAuthenticated(true);
          setIsAdmin(user.role === "admin");
        }
      } catch {
        if (active) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setAuthenticated(false);
          setIsAdmin(false);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    checkSession();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="container section" role="status">
        <p>Checking your login session...</p>
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
