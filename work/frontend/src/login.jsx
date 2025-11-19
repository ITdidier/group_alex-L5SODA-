import { useState } from "react";
import axios from "axios";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function validate() {
    if (!identifier.trim()) return "Username or email is required";
    if (!password) return "Password is required";
    return null;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setSuccess(false);

    const error = validate();
    if (error) {
      setMessage(error);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:8000/login",
        { identifier, password }
      );
      setMessage(res.data.message || "Login successful!");
      setSuccess(true);

      if (res.data.user) localStorage.setItem("user", JSON.stringify(res.data.user));
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wrap">
      <div className="card">
        <header className="cardHeader">
          <h1 className="brand">Welcome Back</h1>
          <p className="subtitle">Login with your username or email</p>
        </header>

        <form onSubmit={handleLogin} className="form" noValidate>
          <div className="field">
            <input
              type="text"
              className="input"
              placeholder=" "
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
            <label className="label">Username or Email</label>
          </div>

          <div className="field">
            <input
              type="password"
              className="input"
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label className="label">Password</label>
          </div>

          <button
            type="submit"
            className={`btn ${loading ? "loading" : ""} ${success ? "success" : ""}`}
            disabled={loading}
          >
            {loading ? "Logging in..." : success ? "Logged in ✓" : "Login"}
          </button>
        </form>

        {message && (
          <div className={`message ${success ? "msgSuccess" : "msgError"}`}>
            {message}
          </div>
        )}

        <div className="footer">
          <p>
            Don't have an account?{" "}
            <a className="loginLink" href="/register">
              Create one
            </a>
          </p>
        </div>
      </div>

      <style>{`
        .wrap {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(180deg,#0f0c29,#302b63,#24243e);
          padding: 32px;
          font-family: Inter, system-ui, sans-serif;
        }

        /* Neon glowing border around the card */
        .card {
          width: 420px;
          max-width: 96%;
          background: #111;
          border-radius: 14px;
          padding: 28px;
          overflow: hidden;
          position: relative;
          box-shadow: 0 0 20px rgba(102,178,255,0.6);
        }

        .card::before {
          content: '';
          position: absolute;
          top: -2px; left: -2px; right: -2px; bottom: -2px;
          border-radius: 16px;
          background: linear-gradient(45deg, #66b2ff, #8a81ff, #22c55e, #facc15);
          z-index: -1;
          filter: blur(6px);
          animation: neonGlow 3s linear infinite;
        }

        @keyframes neonGlow {
          0% { background-position: 0 0; }
          50% { background-position: 400% 0; }
          100% { background-position: 0 0; }
        }

        .cardHeader { text-align: center; margin-bottom: 12px; }
        .brand { color: #66b2ff; font-size: 22px; margin: 0; }
        .subtitle { color: #a0aec0; font-size: 13px; margin: 4px 0 14px; }

        .form { display: grid; gap: 14px; }

        .field { position: relative; }
        .input {
          width: 100%;
          padding: 14px 12px;
          font-size: 14px;
          border-radius: 10px;
          border: 1px solid #444;
          background: rgba(0,0,0,0.6);
          color: #fff;
          outline: none;
          transition: 0.3s;
        }
        .input:focus {
          border-color: #66b2ff;
          box-shadow: 0 0 10px #66b2ff;
        }

        .label {
          position: absolute;
          left: 12px;
          top: 14px;
          color: #888;
          pointer-events: none;
          font-size: 13px;
          transition: 0.2s;
        }
        .input:focus + .label,
        .input:not(:placeholder-shown) + .label {
          top: -8px;
          left: 10px;
          color: #66b2ff;
          font-size: 11px;
        }

        .btn {
          width: 100%;
          padding: 14px;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          font-size: 15px;
          color: #fff;
          background: linear-gradient(90deg,#66b2ff,#8a81ff);
          cursor: pointer;
          box-shadow: 0 0 20px rgba(102,178,255,0.6);
          transition: 0.2s;
        }
        .btn:hover { box-shadow: 0 0 30px #66b2ff; transform: scale(1.02); }
        .btn.loading { opacity: 0.8; pointer-events: none; }
        .btn.success { background: linear-gradient(90deg,#22c55e,#16a34a); }

        .message {
          margin-top: 14px;
          padding: 10px;
          border-radius: 8px;
          font-size: 14px;
        }
        .msgSuccess { background: #064e3b; color: #a7f3d0; }
        .msgError { background: #7f1d1d; color: #fecaca; }

        .footer { margin-top: 12px; text-align: center; font-size: 13px; color: #a0aec0; }
        .loginLink { color: #66b2ff; text-decoration: none; font-weight: 600; }
        .loginLink:hover { text-decoration: underline; }
      `}</style>
    </div>
  );
}
