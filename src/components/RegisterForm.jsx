import React from 'react'
import { useState } from "react";
// import { registerUser } from "../services/authService"
import Toast from "./Toast";

export default function RegisterForm() {
    const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", confirmPassword: ""});
    const [toast, setToast] = useState({ message: "", type: "success"});
    const [loading, setLoading] = useState(false);

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value})
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if(form.password !== form.confirmPassword) {
            setToast({ message: "Lösenorden matchar inte", type: "error"});
            return;
        }

        try {
            setLoading(true);
            const res = await registerUser(form);
            setToast({ message: res.messagem, type: "success"})
        } catch (err) {
            setToast({ message: err.message, type: "error"})
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
                className="register-input"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                />

                <label className="register-label">Efternamn</label>
                <input
                className="register-input"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                />

                <label className="register-label">E-post</label>
                <input
                className="register-input"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                />

                <label className="register-label">Lösenord</label>
                <input
                className="register-input"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                />

                <label className="register-label">Bekräfta lösenord</label>
                <input
                className="register-input"
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                />

                <button className='register-button' type="submit" disabled={loading}>
                {loading ? "Registrerar..." : "Registrera"}
                </button>

                <Toast
                message={toast.message}
                type={toast.type}
                onClose={() => setToast({ message: "" })}
                />
            </form>
        </div>
    )
}
