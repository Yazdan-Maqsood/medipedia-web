"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function Login() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams?.get("callbackUrl") || "/";
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false); // ← Added this

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const result = await signIn("credentials", {
                email: email,
                password: password,
                redirect: false,
            });

            if (result?.ok && !result?.error) {
                toast.success("Login successful!");
                // router.refresh() first so the server components pick up the
                // freshly-set session cookie before we navigate.
                router.refresh();
                router.push(callbackUrl);
            } else {
                const message = result?.error || "Invalid email or password";
                setError(message);
                toast.error(message);
            }
        } catch (error) {
            console.error("Login error:", error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // ← Added toggle function
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <form className="form-wrap" onSubmit={handleSubmit}>
            <div className="form-floating form-group">
                <input
                    type="email"
                    className="form-control mb-1"
                    id="emailAddress"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <label htmlFor="emailAddress" className="form-label">
                    Email
                </label>
            </div>

            {/* ← Updated Password Field with Show/Hide */}
            <div className="form-floating form-group position-relative">
                <input
                    type={showPassword ? 'text' : 'password'} // ← Changed here
                    className="form-control mb-1"
                    id="password-field1"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <label htmlFor="password-field1" className="form-label">
                    Password
                </label>
                {/* ← Added Show/Hide toggle */}
                <span 
                    style={{ 
                        position: 'absolute', 
                        right: '29px', 
                        top: '50%', 
                        transform: 'translateY(-50%)',
                        cursor: 'pointer',
                        zIndex: 10
                    }} 
                    onClick={togglePasswordVisibility} 
                    className="fs-6 me-2"
                >
                    <strong>{showPassword ? "Hide" : "Show"}</strong>
                </span>
            </div>

            <div className="submit-btn">
                <button type="submit" className="main-btn border-0" disabled={loading}>
                    <span>
                        {loading ? (
                            <div className="spinner-border" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        ) : (
                            "Submit"
                        )}
                    </span>
                </button>
            </div>

            {error && <p style={{ color: 'red' }} className="error-message">{error}</p>}

            <p className="already">
                <Link href="/forgot-password" className="text-decoration-none">
                    Forgot Password? <br />
                </Link>
                Don't have an account?
                <Link href="/register" className="text-decoration-none ms-1">
                    Click here!
                </Link>
            </p>
        </form>
    );
}