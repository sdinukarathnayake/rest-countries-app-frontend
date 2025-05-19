import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import {
    getAllCountries,
    getCountriesByCurrency,
    getCountriesByCapital,
} from "../api/ApiEndpoints";
import idToNameMap from "../utils/idToNameMap";

const geoUrl = "https://unpkg.com/world-atlas@2.0.2/countries-110m.json";

const HomePage = () => {
    const [countries, setCountries] = useState([]);
    const [searchMode, setSearchMode] = useState("name");
    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hoveredCountry, setHoveredCountry] = useState("");
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        getAllCountries().then((response) => setCountries(response.data));
    }, []);

    const handleCountryClick = (countryCode) => {
        navigate(`/user-country/${countryCode}`);
    };

    const handleSearchModeChange = (e) => {
        setSearchMode(e.target.value);
        setSearch("");
        setSearchResults([]);
    };

    const handleSearchChange = async (e) => {
        const input = e.target.value;
        setSearch(input);

        if (input.trim() === "") {
            setSearchResults([]);
            return;
        }

        try {
            if (searchMode === "name") {
                const filtered = countries.filter((country) =>
                    country.name.common
                        .toLowerCase()
                        .startsWith(input.toLowerCase())
                );
                setSearchResults(filtered);
            } else if (searchMode === "currency") {
                const response = await getCountriesByCurrency(
                    input.toLowerCase()
                );
                setSearchResults(response.data);
            } else if (searchMode === "capital") {
                const response = await getCountriesByCapital(
                    input.toLowerCase()
                );
                setSearchResults(response.data);
            }
        } catch (error) {
            console.error("Search error:", error);
            setSearchResults([]);
        }

        setLoading(false);
    };

    const getPlaceholder = () => {
        switch (searchMode) {
            case "name":
                return "Type a country name... (e.g : Sri Lanka)";
            case "currency":
                return "Enter currency code... (e.g : USD, EUR)";
            case "capital":
                return "Enter capital city... (e.g : Colombo, Paris)";
            default:
                return "Start your search...";
        }
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
        <div className="flex flex-col min-h-screen w-full">
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
                                location.pathname === "/dashboard"
                                    ? "underline font-bold text-green-300"
                                    : ""
                            }`}
                        >
                            Home
                        </button>
                        <button
                            onClick={() => navigate("/user-countries")}
                            className={`hover:text-green-300 text-base sm:text-lg ${
                                location.pathname === "/user-countries"
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
                                    ? "underline font-bold text-green-300"  : ""
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

            {/* Main Content */}
            <main className="flex-grow w-full">
                <h1 className="text-4xl sm:text-5xl font-extrabold mt-12 mb-6 text-center text-green-900">
                    Discover the World
                </h1>

                {/* Search Section */}
                <div className="flex flex-col sm:flex-row gap-4 mb-5 max-w-4xl mx-auto p-4 items-center">
                    <div className="relative w-full sm:w-48">
                        <select
                            value={searchMode}
                            onChange={handleSearchModeChange}
                            className="appearance-none border p-3 w-full rounded-xl bg-green-700 text-white font-medium text-center focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer shadow-md transition-transform hover:scale-105"
                        >
                            <option
                                value="name"
                                className="bg-green-100 text-green-900"
                            >
                                Name
                            </option>
                            <option
                                value="currency"
                                className="bg-green-200 text-green-900"
                            >
                                Currency
                            </option>
                            <option
                                value="capital"
                                className="bg-green-300 text-green-900"
                            >
                                Capital
                            </option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-white">
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </div>
                    </div>

                    <input
                        type="text"
                        placeholder={getPlaceholder()}
                        className="border p-3 pl-5 rounded-3xl w-full sm:w-3/4 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-green-900 shadow-lg placeholder-green-600 placeholder:font-medium transition"
                        value={search}
                        onChange={handleSearchChange}
                    />
                </div>

                {/* Search Results */}
                {search && (
                    <div className="relative animate-fadeIn mb-8 max-w-6xl mx-auto px-4">
                        {loading && (
                            <div className="absolute inset-0 bg-gray-200 bg-opacity-50 flex flex-col justify-center items-center z-10">
                                <div className="w-10 h-10 border-4 border-green-500 border-t-transparent border-solid rounded-full animate-spin mb-2"></div>
                                <p className="text-gray-700 font-medium animate-fadeInSlide">
                                    Searching...
                                </p>
                            </div>
                        )}

                        <div
                            className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 ${
                                loading ? "blur-sm" : ""
                            }`}
                        >
                            {searchResults.length > 0
                                ? searchResults.map((country) => (
                                      <div
                                          key={country.cca3}
                                          className="border rounded-lg p-5 shadow hover:shadow-lg cursor-pointer transition-transform hover:scale-105 bg-white"
                                          onClick={() =>
                                              handleCountryClick(country.cca3)
                                          }
                                      >
                                          <img
                                              src={country.flags?.png}
                                              alt={country.name.common}
                                              className="w-full h-36 object-cover mb-3 rounded"
                                          />
                                          <h2 className="text-xl font-semibold text-gray-800">
                                              {country.name.common}
                                          </h2>
                                      </div>
                                  ))
                                : !loading && (
                                      <div className="col-span-full flex flex-col items-center text-gray-500 animate-fadeInSlide">
                                          <p className="mt-2">
                                              No countries found
                                          </p>
                                      </div>
                                  )}
                        </div>
                    </div>
                )}

                {/* World Map Section */}
                <div className="bg-white mb-1 max-w-6xl mx-auto w-full">
                    <p className="text-base text-center pt-2 text-green-800">
                        or
                    </p>
                    <p className="text-base text-center mb-2 text-green-800">
                        Select your country from the World Map
                    </p>

                    <div className="relative flex justify-center overflow-x-auto">
                        {hoveredCountry && (
                            <div
                                className="absolute z-50 bg-green-700 text-white text-xs px-3 py-1 rounded shadow-lg pointer-events-none transition-opacity duration-300 opacity-100"
                                style={{
                                    top: mousePosition.y - 110,
                                    left: mousePosition.x - 170,
                                }}
                            >
                                {hoveredCountry}
                            </div>
                        )}

                        <ComposableMap
                            projectionConfig={{ scale: 180 }}
                            width={1000}
                            height={500}
                            style={{ width: "100%", height: "auto" }}
                        >
                            <Geographies geography={geoUrl}>
                                {({ geographies }) =>
                                    geographies.map((geo) => {
                                        const countryCode = geo.id;
                                        return (
                                            <Geography
                                                key={geo.rsmKey}
                                                geography={geo}
                                                onClick={() =>
                                                    handleCountryClick(
                                                        countryCode
                                                    )
                                                }
                                                onMouseEnter={(event) => {
                                                    const id = geo.id;
                                                    const name =
                                                        idToNameMap[id] ||
                                                        "Unknown";
                                                    setHoveredCountry(name);
                                                    setMousePosition({
                                                        x: event.clientX,
                                                        y: event.clientY,
                                                    });
                                                }}
                                                onMouseMove={(event) => {
                                                    setMousePosition({
                                                        x: event.clientX,
                                                        y: event.clientY,
                                                    });
                                                }}
                                                onMouseLeave={() => {
                                                    setHoveredCountry("");
                                                }}
                                                style={{
                                                    default: {
                                                        fill: "#D1FAE5",
                                                        outline: "none",
                                                    },
                                                    hover: {
                                                        fill: "#38A169",
                                                        outline: "none",
                                                        cursor: "pointer",
                                                    },
                                                    pressed: {
                                                        fill: "#2F855A",
                                                        outline: "none",
                                                    },
                                                }}
                                            />
                                        );
                                    })
                                }
                            </Geographies>
                        </ComposableMap>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-green-900 text-white text-center py-4 mt-8 text-sm sm:text-base">
                © 2025 World Explorer. All rights reserved.
            </footer>
        </div>
    );
};

export default HomePage;