// src/components/RegisterForm.jsx
import React, { useState } from "react";
import Toast from "./Toast";
import { registerUser } from "../services/authService";
import { useAuth } from "./auth/authProvider";

export default function RegisterForm() {
  const { login } = useAuth();             // ⬅️ hämta login från AuthProvider
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", password: "", confirmPassword: ""
  });
  const [toast, setToast] = useState({ message: "", type: "success" });
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setToast({ message: "Lösenorden matchar inte", type: "error" });
      return;
    }

    try {
      setLoading(true);

      // 1) Registrera användaren
      await registerUser({
        // skicka snake/camel obrytt – servern matchar case-insensitive
        firstname: form.firstName,
        lastname: form.lastName,
        email: form.email,
        password: form.password,
        confirmedPassword: form.confirmPassword,
      });

      // 2) Auto-login direkt (sparar tokens i AuthProvider)
      await login(form.email, form.password, true);  // true = "kom ihåg mig" (localStorage)
      setToast({ message: "Konto skapat och inloggad ✅", type: "success" });
    } catch (err) {
      setToast({ message: err.message || "Något gick fel", type: "error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="register-page-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Registrera konto</h2>

        <label className="register-label">Förnamn</label>
        <input className="register-input" name="firstName" value={form.firstName} onChange={handleChange} />

        <label className="register-label">Efternamn</label>
        <input className="register-input" name="lastName" value={form.lastName} onChange={handleChange} />

        <label className="register-label">E-post</label>
        <input className="register-input" name="email" type="email" value={form.email} onChange={handleChange} />

        <label className="register-label">Lösenord</label>
        <input className="register-input" name="password" type="password" value={form.password} onChange={handleChange} />

        <label className="register-label">Bekräfta lösenord</label>
        <input className="register-input" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} />

        <button className="register-button" type="submit" disabled={loading}>
          {loading ? "Registrerar..." : "Registrera"}
        </button>

        <p className="login-link">Är du redan medlem? <a href="/login">Logga in här</a></p>

        <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "" })} />
      </form>
    </div>
  );
}
