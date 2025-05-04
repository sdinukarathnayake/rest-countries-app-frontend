import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllCountries } from "../api/ApiEndpoints";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import axios from "axios";

const CountryList = () => {
    const [countries, setCountries] = useState([]);
    const [filteredCountries, setFilteredCountries] = useState([]);
    const [regionFilter, setRegionFilter] = useState("");
    const [languageFilter, setLanguageFilter] = useState("");
    const [currencyFilter, setCurrencyFilter] = useState("");
    const [favoriteCountries, setFavoriteCountries] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    useEffect(() => {
        getAllCountries()
            .then((res) => {
                setCountries(res.data);
                setFilteredCountries(res.data);
            })
            .catch((err) => console.error("Error fetching countries:", err));
    }, []);

    useEffect(() => {
        let tempCountries = [...countries];

        if (regionFilter) {
            tempCountries = tempCountries.filter(
                (country) => country.region === regionFilter
            );
        }

        if (languageFilter) {
            tempCountries = tempCountries.filter((country) =>
                country.languages
                    ? Object.values(country.languages).includes(languageFilter)
                    : false
            );
        }

        if (currencyFilter) {
            tempCountries = tempCountries.filter((country) =>
                country.currencies
                    ? Object.keys(country.currencies).includes(currencyFilter)
                    : false
            );
        }

        setFilteredCountries(tempCountries);
    }, [regionFilter, languageFilter, currencyFilter, countries]);


    useEffect(() => {
        const fetchFavoriteCountries = async () => {
            if (!token) return;
    
            try {
                const response = await axios.get('http://localhost:5000/users/get-favorites', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setFavoriteCountries(response.data.favoriteCountries || []);
            } catch (error) {
                if (error.response?.status !== 404) {
                    console.error("Error fetching favorite countries:", error.response?.data?.message || error.message);
                }
            }
        };
    
        fetchFavoriteCountries();
    }, [token]);
    

    const handleFavoriteClick = async (cca3) => {
        if (!token) {
            alert("You must be logged in to set a favorite country.");
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:5000/users/toggle-favorite",
                { countryCode: cca3 },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );

            setFavoriteCountries(response.data.favoriteCountries);
        } catch (error) {
            console.error("Error updating favorite countries:", error);
        }
    };

    const handleCountryClick = (code) => {
        navigate(`/user-country/${code}`);
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
    };

    return (
        <div className="min-h-screen text-green-900 flex flex-col">
            {/* Header */}
            <header className="bg-green-900 text-white py-4 px-10 flex justify-between items-center shadow-md sticky top-0 z-10">
                <div className="flex items-center space-x-10">
                    <h1
                        className="text-lg sm:text-2xl mr-8 font-bold cursor-pointer hover:text-green-300 transition"
                        onClick={() => navigate("/dashboard")}
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

            {/* Favorite Countries Section */}
            {favoriteCountries.length > 0 && (
    <div className="w-full max-w-6xl mb-10">
        <h2 className="text-2xl font-semibold text-green-700 mb-4">Your Favorite Countries</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {favoriteCountries.map((favCountryCode) => {
                const fav = countries.find(c => c.cca3 === favCountryCode);
                if (!fav) return null;
                return (
                    <div
                        key={fav.cca3}
                        className="border rounded-lg overflow-hidden shadow hover:shadow-lg cursor-pointer bg-yellow-100 hover:scale-105 transform transition duration-300 p-5 flex items-center"
                        onClick={() => handleCountryClick(fav.cca3)}
                    >
                        <img
                            src={fav.flags?.png}
                            alt={fav.name?.common}
                            className="w-20 h-14 object-cover rounded mr-4"
                        />
                        <h2 className="text-xl font-semibold text-green-800">{fav.name?.common}</h2>
                    </div>
                );
            })}
        </div>
    </div>
)}


            {/* Main Content */}
            <main className="flex-grow mx-auto w-full sm:w-4/5 px-4 py-10">
                <h1 className="text-3xl sm:text-4xl font-bold text-center text-green-800 mb-10">
                    All Countries
                </h1>

                {/* Filters */}
                <div className="flex flex-wrap gap-9 justify-center mb-10">
                    <select
                        value={regionFilter}
                        onChange={(e) => setRegionFilter(e.target.value)}
                        className="border p-3 rounded-lg bg-green-100 text-green-900 w-full sm:w-1/4 cursor-pointer hover:bg-green-200 transition"
                    >
                        <option value="">Filter by Region</option>
                        <option value="Africa">Africa</option>
                        <option value="Americas">Americas</option>
                        <option value="Asia">Asia</option>
                        <option value="Europe">Europe</option>
                        <option value="Oceania">Oceania</option>
                        <option value="Antarctic">Antarctic</option>
                    </select>

                    <select
                        value={languageFilter}
                        onChange={(e) => setLanguageFilter(e.target.value)}
                        className="border p-3 rounded-lg bg-green-100 text-green-900 w-full sm:w-1/4 cursor-pointer hover:bg-green-200 transition"
                    >
                        <option value="">Filter by Language</option>
                        <option value="English">English</option>
                        <option value="French">French</option>
                        <option value="Spanish">Spanish</option>
                        <option value="Arabic">Arabic</option>
                        <option value="Portuguese">Portuguese</option>
                        <option value="German">German</option>
                        <option value="Hindi">Hindi</option>
                    </select>

                    <select
                        value={currencyFilter}
                        onChange={(e) => setCurrencyFilter(e.target.value)}
                        className="border p-3 rounded-lg bg-green-100 text-green-900 w-full sm:w-1/4 cursor-pointer hover:bg-green-200 transition"
                    >
                        <option value="">Filter by Currency</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                        <option value="JPY">JPY</option>
                        <option value="LKR">LKR</option>
                        <option value="INR">INR</option>
                    </select>
                </div>

                {/* Country Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredCountries.map((country) => (
                        <div
                            key={country.cca3}
                            className="border rounded-xl overflow-hidden shadow-lg hover:shadow-2xl cursor-pointer bg-green-50 hover:scale-105 transform transition duration-300"
                            onClick={() => handleCountryClick(country.cca3)}
                        >
                            <img
                                src={country.flags?.png}
                                alt={country.name.common}
                                className="w-full h-40 object-cover mb-3 rounded-t-xl"
                            />
                            <div className="px-4 pb-4">
                                <h2 className="text-xl font-bold text-green-800 mb-3 text-center">
                                    {country.name.common}
                                </h2>
                                <p className="text-sm text-green-700">
                                    <span className="font-semibold">
                                        Capital :
                                    </span>{" "}
                                    {country.capital
                                        ? country.capital[0]
                                        : "N/A"}
                                </p>
                                <p className="text-sm text-green-700">
                                    <span className="font-semibold">
                                        Region :
                                    </span>{" "}
                                    {country.region}
                                </p>
                                <p className="text-sm text-green-700">
                                    <span className="font-semibold">
                                        Population :
                                    </span>{" "}
                                    {country.population.toLocaleString()}
                                </p>
                                <p className="text-sm text-green-700">
                                    <span className="font-semibold">
                                        Languages :
                                    </span>{" "}
                                    {country.languages
                                        ? Object.values(country.languages)
                                              .slice(0, 2)
                                              .join(", ")
                                        : "N/A"}
                                </p>
                            </div>

                            {/* Heart Icon */}
                            <button
                                className="absolute top-3 right-3 text-red-500 text-xl z-10 hover:scale-110 transition"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleFavoriteClick(country.cca3);
                                }}
                            >
                                {favoriteCountries.includes(country.cca3) ? (
                                    <FaHeart />
                                ) : (
                                    <FaRegHeart />
                                )}
                            </button>
                        </div>
                    ))}
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-green-900 text-white text-center py-4 mt-10">
                &copy; {new Date().getFullYear()} World Explorer. All rights
                reserved.
            </footer>
        </div>
    );
};

export default CountryList;