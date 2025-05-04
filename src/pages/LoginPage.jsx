import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                "http://localhost:5000/users/login",
                { email, password }
            );

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <header className="bg-green-900 text-white py-4 px-10 flex justify-between items-center shadow-md sticky top-0 z-10">
                <div className="flex items-center space-x-10">
                    <h1
                        className="text-lg sm:text-2xl mr-8 font-bold cursor-pointer hover:text-green-300 transition"
                        onClick={() => navigate("/")}
                    >
                        World Explorer
                    </h1>
                    <nav className="flex space-x-8">
                        <button
                            onClick={() => navigate("/")}
                            className={`hover:text-green-300 text-base sm:text-lg ${
                                location.pathname === "/"
                                    ? "underline font-bold text-green-300"
                                    : ""
                            }`}
                        >
                            Home
                        </button>
                        <button
                            onClick={() => navigate("/countries")}
                            className={`hover:text-green-300 text-base sm:text-lg ${
                                location.pathname === "/countries"
                                    ? "underline font-bold text-green-300"
                                    : ""
                            }`}
                        >
                            All Countries
                        </button>
                    </nav>
                </div>
                <div className="flex space-x-3 mt-1 sm:mt-0">
                    <button
                        onClick={() => navigate("/login")}
                        className="bg-green-700 w-[100px] py-3 rounded-full text-sm sm:text-base hover:bg-green-600 transition"
                    >
                        Login
                    </button>
                    <button
                        onClick={() => navigate("/register")}
                        className="bg-green-700 w-[100px] py-1.5 rounded-full text-sm sm:text-base hover:bg-green-600 transition"
                    >
                        Register
                    </button>
                </div>
            </header>

            {/* Content */}
            <div className="flex-grow flex items-center justify-center bg-green-50 py-8 px-4">
                <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
                    <h2 className="text-2xl sm:text-3xl font-bold text-green-800 mb-6 text-center">
                        Login to World Explorer
                    </h2>

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="block text-green-700 font-semibold mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                                className="w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>

                        <div>
                            <label className="block text-green-700 font-semibold mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                                className="w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-green-700 text-white py-3 rounded hover:bg-green-600 transition"
                        >
                            Login
                        </button>
                    </form>

                    <p className="mt-4 text-center text-sm text-gray-600">
                        Don't have an account?{" "}
                        <a
                            href="/register"
                            className="text-green-700 font-medium hover:underline"
                        >
                            Register here
                        </a>
                    </p>
                </div>
            </div>
            {/* Footer */}
            <footer className="bg-green-900 text-white text-center py-4 text-sm sm:text-base">
                © 2025 World Explorer. All rights reserved.
            </footer>
        </div>
    );
};

export default LoginPage;