import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
    const [user, setUser] = useState({ name: "", email: "", password: "" });
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const storedUser = JSON.parse(localStorage.getItem("user"));
                setUser({
                    name: storedUser?.name || "",
                    email: storedUser?.email || "",
                    password: "",
                });
            } catch (err) {
                console.error("Failed to load user from localStorage", err);
            }
        };  

        fetchUser();
    }, [token]);

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(
                "https://rest-countries-app-backend-production.up.railway.app/users/update-profile",
                user,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            alert("Profile updated successfully");
        } catch (err) {
            alert("Failed to update profile");
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete your account?"))
            return;

        try {
            await axios.delete("https://rest-countries-app-backend-production.up.railway.app/users/delete-profile", {
                headers: { Authorization: `Bearer ${token}` },
            });
            localStorage.clear();
            navigate("/register");
        } catch (err) {
            alert("Failed to delete account");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
    };

    return (
        <div className="flex flex-col min-h-screen">

            {/* Header */}
            <header className="bg-green-900 text-white py-4 px-10 flex justify-between items-center shadow-md fixed top-0 left-0 right-0 z-10">
                <div className="flex items-center space-x-10">
                    <h1
                        className="text-lg sm:text-2xl mr-8 font-bold cursor-pointer hover:text-green-300 transition"
                        onClick={() => navigate("/")}
                    >
                        World Explorer
                    </h1>

                    <nav className="flex space-x-8">
                    <button
                            onClick={() => navigate("/dashboard")}
                            className={`hover:text-green-300 text-base sm:text-lg ${
                                location.pathname === "/"
                                    ? "underline font-bold text-green-300"
                                    : ""
                            }`}
                        >
                            Home
                        </button>
                        <button
                            onClick={() => navigate("/user-countries")}
                            className={`hover:text-green-300 text-base sm:text-lg ${
                                location.pathname === "/countries"
                                    ? "underline font-bold text-green-300"
                                    : ""
                            }`}
                        >
                            All Countries
                        </button>

                        <button
                            onClick={() => navigate("/user-profile")}
                            className={`hover:text-green-300 text-base sm:text-lg ${
                                location.pathname === "/user-profile"
                                    ? "underline font-bold text-green-300"
                                    : ""
                            }`}
                        >
                            User Profile
                        </button>
                    </nav>

                </div>
                <div className="flex space-x-3 mt-1 sm:mt-0">
                    <button
                        onClick={handleLogout}
                        className="bg-green-700 text-white px-6 py-2 rounded-full hover:bg-green-600 transition"
                    >
                        Logout
                    </button>
                </div>
            </header>


            <main className="flex-grow pt-32 pb-20 flex justify-center items-center">
                <div className="w-full max-w-xl p-5 border rounded shadow bg-white">
                    <h2 className="text-2xl font-bold text-green-800 mb-6 text-center">
                        User Profile
                    </h2>
                    <form onSubmit={handleUpdate} className="space-y-4">
                        <input
                            type="text"
                            name="name"
                            value={user.name}
                            onChange={handleChange}
                            placeholder="Name"
                            className="w-full p-3 border rounded"
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            value={user.email}
                            onChange={handleChange}
                            placeholder="Email"
                            className="w-full p-3 border rounded"
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            value={user.password}
                            onChange={handleChange}
                            placeholder="Update to a new password (optional)"
                            className="w-full p-3 border rounded"
                        />
                        <div className="flex gap-4">
                            <button
                                type="submit"
                                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
                            >
                                Update
                            </button>
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition"
                            >
                                Delete Account
                            </button>
                        </div>
                    </form>
                </div>
            </main>


            {/* Footer */}
            <footer className="bg-green-900 text-white text-center py-4 text-sm sm:text-base fixed bottom-0 left-0 right-0">
                © 2025 World Explorer. All rights reserved.
            </footer>
        </div>
    );
};

export default UserProfile;