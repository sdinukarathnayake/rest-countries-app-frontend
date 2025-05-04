import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllCountries } from "../api/ApiEndpoints";

const CountryList = () => {
    const [countries, setCountries] = useState([]);
    const [filteredCountries, setFilteredCountries] = useState([]);
    const [regionFilter, setRegionFilter] = useState("");
    const [languageFilter, setLanguageFilter] = useState("");
    const [currencyFilter, setCurrencyFilter] = useState("");

    const navigate = useNavigate();

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

    const handleCountryClick = (code) => {
        navigate(`/country/${code}`);
    };

    return (
        <div className="min-h-screen text-green-900 flex flex-col">
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
                    <button className="bg-green-700 w-[100px] py-3 rounded-full text-sm sm:text-base hover:bg-green-600 transition">
                        Login
                    </button>
                    <button className="bg-green-700 w-[100px] py-1.5 rounded-full text-sm sm:text-base hover:bg-green-600 transition">
                        Register
                    </button>
                </div>
            </header>

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
                            onClick={() =>
                                handleCountryClick(country.cca3)
                            }
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
                                    <span className="font-semibold">Capital :</span>{" "}
                                    {country.capital
                                        ? country.capital[0]
                                        : "N/A"}
                                </p>
                                <p className="text-sm text-green-700">
                                    <span className="font-semibold">Region :</span>{" "}
                                    {country.region}
                                </p>
                                <p className="text-sm text-green-700">
                                    <span className="font-semibold">Population :</span>{" "}
                                    {country.population.toLocaleString()}
                                </p>
                                <p className="text-sm text-green-700">
                                    <span className="font-semibold">Languages :</span>{" "}
                                    {country.languages
                                        ? Object.values(country.languages)
                                              .slice(0, 2)
                                              .join(", ")
                                        : "N/A"}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-green-900 text-white text-center py-4 mt-10">
                &copy; {new Date().getFullYear()} World Explorer. All rights reserved.
            </footer>
        </div>
    );
};

export default CountryList;