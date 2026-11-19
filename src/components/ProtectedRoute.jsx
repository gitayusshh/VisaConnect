
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { validateSession } from "../services/api";

function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    let active = true;

    const checkSession = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        if (active) {
          setAuthenticated(false);
          setLoading(false);
        }
        return;
      }

      try {
        const user = await validateSession(token);

        if (active) {
          localStorage.setItem("user", JSON.stringify(user));
          setAuthenticated(true);
        }
      } catch {
        if (active) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setAuthenticated(false);
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

  return children;
}

export default ProtectedRoute;
