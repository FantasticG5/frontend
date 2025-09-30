import React, { useState, useEffect } from "react";
import { registerUser } from "../services/authService";
import Toast from "./Toast";

export default function RegisterForm() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ message: "", type: "success" });
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }
// Used some help from ChatGPT-4o generating some of the validation, mostly in getting the email and password-regex to work as wished.
// Also getting the useEffect to work.
  useEffect(() => {
    const newErrors = {};

    if (!form.firstName || form.firstName.trim().length < 2) {
      newErrors.firstName = "Förnamn måste vara minst 2 tecken.";
    }

    if (!form.lastName || form.lastName.trim().length < 2) {
      newErrors.lastName = "Efternamn måste vara minst 2 tecken.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email || !emailRegex.test(form.email)) {
      newErrors.email = "Ogiltig e-postadress.";
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,20}$/;
    if (!form.password || !passwordRegex.test(form.password)) {
      newErrors.password =
        "Lösenordet måste vara 6–20 tecken, innehålla minst en stor bokstav och en siffra.";
    }

    if (form.confirmPassword !== form.password) {
      newErrors.confirmPassword = "Lösenorden matchar inte.";
    }

    setErrors(newErrors);
  }, [form]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (Object.keys(errors).length > 0) return; 

    try {
      setLoading(true);
      await registerUser({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        confirmedPassword: form.confirmPassword,
      });
      setToast({ message: "Användare skapad!", type: "success" });
    } catch (err) {
      setToast({ message: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  }

  return (
        <div className="register-page-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Registrera konto</h2>

        <label className="register-label">Förnamn</label>
        <input
          type="text"
          placeholder="John"
          className={`register-input ${errors.firstName ? "input-error" : ""}`}
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
        />
        {errors.firstName && <p className="error-message">{errors.firstName}</p>}

        <label className="register-label">Efternamn</label>
        <input
          type="text"
          placeholder="Doe"
          className={`register-input ${errors.lastName ? "input-error" : ""}`}
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
        />
        {errors.lastName && <p className="error-message">{errors.lastName}</p>}

        <label className="register-label">E-post</label>
        <input
          className={`register-input ${errors.email ? "input-error" : ""}`}
          name="email"
          type="email"
          placeholder="John@Doe.com"
          value={form.email}
          onChange={handleChange}
        />
        {errors.email && <p className="error-message">{errors.email}</p>}

        <label className="register-label">Lösenord</label>
        <input
          className={`register-input ${errors.password ? "input-error" : ""}`}
          name="password"
          type="password"
          placeholder="Abc123"
          value={form.password}
          onChange={handleChange}
        />
        {errors.password && <p className="error-message">{errors.password}</p>}

        <label className="register-label">Bekräfta lösenord</label>
        <input
          className={`register-input ${errors.confirmPassword ? "input-error" : ""}`}
          name="confirmPassword"
          type="password"
          placeholder="Abc123"
          value={form.confirmPassword}
          onChange={handleChange}
        />
        {errors.confirmPassword && (
          <p className="error-message">{errors.confirmPassword}</p>
        )}

        <button className="register-button" type="submit" disabled={loading || Object.keys(errors).length > 0}>
          {loading ? "Registrerar..." : "Registrera"}
        </button>

        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: "" })}
        />
      </form>
    </div>
  );
}
