
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import { ADMIN_USERNAME, loginUser } from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const showError = (message) => {
    setError(message);
    toast.error(message);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password) {
      showError("Please enter username and password.");
      return;
    }

    if (loading) return;

    setLoading(true);

    try {
      const data = await loginUser(username.trim(), password);

      if (!data.accessToken) {
        throw new Error("Login failed. No access token received.");
      }

      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data));

      toast.success(
        `Welcome back, ${data.firstName || "User"}! Login successful.`
      );

      navigate(data.role === "admin" ? "/dashboard" : "/");

      // Refresh so the navbar displays the logged-in user.
      // The global toast container remains available after navigation.
      window.dispatchEvent(new Event("storage"));
    } catch (err) {
      showError(
        err.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-icon">
          <LogIn size={30} />
        </div>

        <h2>Welcome Back</h2>

        <p>Login to manage your visa applications.</p>

        {error && (
          <div className="form-error" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-field">
            <label>Username</label>

            <input
              type="text"
              placeholder="Enter username"
              autoComplete="username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError("");
              }}
            />
          </div>

          <div className="form-field">
            <label>Password</label>

            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword ? (
                  <EyeOff size={19} />
                ) : (
                  <Eye size={19} />
                )}
              </button>
            </div>
          </div>

          <button
            className="primary-btn auth-submit"
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="demo-credentials">
          <strong>Admin account</strong>

          <p>Username: {ADMIN_USERNAME}</p>
          <p>Password: the password chosen during signup</p>
          <p>Admin account must be signed up in this browser first.</p>

          
        </div>

        <p className="auth-footer-text">
          Don't have an account?{" "}
          <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
