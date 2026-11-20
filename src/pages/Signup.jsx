
import { useState } from "react";
import { Link } from "react-router-dom";
import { UserPlus, CheckCircle, Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import { ADMIN_USERNAME, registerUser } from "../services/api";

function Signup() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const update = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setError("");
  };

  const showError = (message) => {
    setError(message);
    toast.error(message);
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (Object.values(form).some((value) => !value.trim())) {
      showError("Please fill in all required fields.");
      return;
    }

    if (!/^[A-Za-z\s'-]{2,50}$/.test(form.firstName.trim())) {
      showError("Please enter a valid first name.");
      return;
    }

    if (!/^[A-Za-z\s'-]{2,50}$/.test(form.lastName.trim())) {
      showError("Please enter a valid last name.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      showError("Please enter a valid email address.");
      return;
    }

    if (!/^[a-zA-Z0-9_]{3,20}$/.test(form.username.trim())) {
      showError(
        "Username must contain 3–20 letters, numbers or underscores."
      );
      return;
    }

    if (form.password.length < 6) {
      showError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await registerUser({
        ...form,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        username: form.username.trim(),
      });

      setSuccess(true);

      toast.success("Demo registration successful!");
    } catch (err) {
      showError(
        err.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-card auth-success">
          <CheckCircle size={55} color="#16a34a" />

          <h2>Account Created!</h2>

          <p>
            Your account has been saved in this browser.
          </p>

          <p>
            Log in with your signup details to continue. Only the
            admin account ({ADMIN_USERNAME}) can access the Dashboard.
          </p>

          <div className="details-note">
            Your account is available only in this browser on this device.
          </div>

          <Link to="/login" className="primary-btn">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-icon">
          <UserPlus size={30} />
        </div>

        <h2>Create Account</h2>

        <p>Get started with your visa journey.</p>

        {error && (
          <div className="form-error" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup}>
          <div className="form-grid">
            <div className="form-field">
              <label>First Name *</label>

              <input
                type="text"
                autoComplete="given-name"
                value={form.firstName}
                onChange={(e) =>
                  update("firstName", e.target.value)
                }
                placeholder="First name"
              />
            </div>

            <div className="form-field">
              <label>Last Name *</label>

              <input
                type="text"
                autoComplete="family-name"
                value={form.lastName}
                onChange={(e) =>
                  update("lastName", e.target.value)
                }
                placeholder="Last name"
              />
            </div>
          </div>

          <div className="form-field">
            <label>Email Address *</label>

            <input
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(e) =>
                update("email", e.target.value)
              }
              placeholder="Email address"
            />
          </div>

          <div className="form-field">
            <label>Username *</label>

            <input
              type="text"
              autoComplete="username"
              value={form.username}
              onChange={(e) =>
                update("username", e.target.value)
              }
              placeholder="Choose username"
            />
          </div>

          <div className="form-field">
            <label>Password *</label>

            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={form.password}
                onChange={(e) =>
                  update("password", e.target.value)
                }
                placeholder="Minimum 6 characters"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
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
            type="submit"
            className="primary-btn auth-submit"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="auth-footer-text">
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </p>

        <p className="details-note">
          Demo accounts are stored in this browser and can be
          used to sign in on this device. Use username {ADMIN_USERNAME}
          for admin access.
        </p>
      </div>
    </div>
  );
}

export default Signup;
