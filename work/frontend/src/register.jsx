import { useState } from "react";
import axios from "axios";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [dateofbrith, setDateofbrith] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function validate() {
    if (!username.trim()) return "Username is required";
    if (!email.trim()) return "Email is required";
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) return "Please enter a valid email";
    if (!phone.trim()) return "Phone number is required";
    if (!/^\d+$/.test(phone)) return "Phone number must contain only digits";
    if (phone.length < 7) return "Phone number looks too short";
    if (!dateofbrith) return "Date of birth is required";
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return null;
  }

  const handleSubmit = async (e) => {
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
      const res = await axios.post("http://localhost:8000/users", {
        username,
        password,
        email,
        phone,
        dateofbrith,
      });

      setMessage(res.data?.message || "Registration successful!");
      setSuccess(true);
      setPassword("");
      setUsername("");
      setEmail("");
      setPhone("");
      setDateofbrith("");
    } catch (err) {
      setMessage(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wrap">
      <div className="animatedBorder">
        <div className="card">
          <header className="cardHeader">
            <h1 className="brand">Create your account</h1>
            <p className="subtitle">Fast · Secure</p>
          </header>

          <form onSubmit={handleSubmit} className="form" noValidate>
            <div className="field">
              <input
                id="username"
                className="input"
                type="text"
                placeholder=" "
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <label htmlFor="username" className="label">Username</label>
            </div>

            <div className="field">
              <input
                id="email"
                className="input"
                type="email"
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label htmlFor="email" className="label">Email</label>
            </div>

            <div className="row">
              <div className="field small">
                <input
                  id="phone"
                  className="input"
                  type="tel"
                  placeholder=" "
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
                <label htmlFor="phone" className="label">Phone</label>
              </div>

              <div className="field small">
                <input
                  id="dob"
                  className="input"
                  type="date"
                  placeholder=" "
                  value={dateofbrith}
                  onChange={(e) => setDateofbrith(e.target.value)}
                  required
                />
                <label htmlFor="dob" className="label">Date of birth</label>
              </div>
            </div>

            <div className="field">
              <input
                id="password"
                className="input"
                type="password"
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label htmlFor="password" className="label">Password</label>
            </div>

            <button
              className={`btn ${loading ? "loading" : ""} ${success ? "success" : ""}`}
              type="submit"
              disabled={loading}
            >
              {loading ? "Registering..." : success ? "Registered ✓" : "Create account"}
            </button>
          </form>

          {message && <div className={`message ${success ? "msgSuccess" : "msgError"}`}>{message}</div>}

          <div className="footer">
            <p>Already have an account? <a href="/login" className="loginLink">Login</a>.</p>
          </div>
        </div>
      </div>

      <style>{`
        .wrap {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0f0f1f;
          padding: 32px;
          font-family: Inter, sans-serif;
        }

        .animatedBorder {
          position: relative;
          border-radius: 16px;
          padding: 6px;
        }
        .animatedBorder::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 16px;
          background: conic-gradient(#ff3c78, #ffb347, #3c9fff, #8a81ff, #ff3c78);
          filter: blur(12px);
          opacity: 0.7;
          animation: rotate 5s linear infinite;
          z-index: -1;
          transition: filter 0.3s ease, opacity 0.3s ease;
        }
        .animatedBorder:hover::before {
          filter: blur(20px);
          opacity: 1;
        }
        @keyframes rotate { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

        .card {
          position: relative;
          z-index: 1;
          background: #1f2937;
          border-radius: 14px;
          padding: 28px;
          width: 420px;
          box-shadow: 0 0 20px rgba(0,0,0,0.3);
          color: #fff;
        }

        .cardHeader { text-align: center; margin-bottom: 6px; }
        .brand { font-size: 22px; margin: 0; color: #fff; }
        .subtitle { font-size: 14px; color: #cbd5e1; }

        .form { display: grid; gap: 12px; }
        .field { position: relative; display: flex; flex-direction: column; }
        .row { display: flex; gap: 12px; }
        .small { flex: 1; }

        .input {
          padding: 14px 12px 12px;
          font-size: 14px;
          border-radius: 10px;
          border: 1px solid #374151;
          outline: none;
          background: #111827;
          color: #fff;
          transition: 0.3s all;
        }
        .input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 10px #3b82f6, 0 0 20px #7c5cff;
        }

        .label {
          position: absolute;
          top: 14px;
          left: 12px;
          font-size: 13px;
          color: #9ca3af;
          pointer-events: none;
          transition: 0.3s all;
        }
        .input:focus + .label,
        .input:not(:placeholder-shown) + .label {
          top: -6px;
          left: 10px;
          font-size: 12px;
          color: #3b82f6;
          text-shadow: 0 0 4px #3b82f6, 0 0 8px #7c5cff;
        }

        .btn {
          margin-top: 12px;
          width: 100%;
          padding: 14px;
          border: none;
          border-radius: 12px;
          background: linear-gradient(90deg,#3b82f6,#7c5cff);
          color: #fff;
          font-weight: 600;
          cursor: pointer;
          transition: 0.2s all;
        }
        .btn:hover { transform: translateY(-2px); box-shadow: 0 0 12px #7c5cff; }
        .btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .btn.success { background: linear-gradient(90deg,#22c55e,#16a34a); }

        .message { margin-top: 12px; font-size: 14px; }
        .msgSuccess { color: #22c55e; }
        .msgError { color: #f87171; }

        .footer { margin-top: 12px; font-size: 13px; text-align: center; color: #cbd5e1; }
        .loginLink { color: #3b82f6; text-decoration: none; }
        .loginLink:hover { text-decoration: underline; }
      `}</style>
    </div>
  );
}
