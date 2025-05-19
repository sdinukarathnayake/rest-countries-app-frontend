import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCountryByCode } from "../api/ApiEndpoints";

const languageNames = {
    eng: "English",
    fra: "French",
    spa: "Spanish",
    deu: "German",
    ita: "Italian",
    jpn: "Japanese",
    zho: "Chinese",
    rus: "Russian",
    kor: "Korean",
};

const CountryDetails = () => {
    const { code } = useParams();
    const [country, setCountry] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }
    
        getCountryByCode(code)
            .then((response) => setCountry(response.data[0]))
            .catch((err) => console.error("Error fetching country:", err));
    }, [code, navigate]);
    

    if (!country) {
        return (
            <div className="text-center mt-10 text-green-500">
                Loading country data...
            </div>
        );
    }

    const currencyKey = Object.keys(country.currencies || {})[0];
    const languageList = Object.values(country.languages || {}).join(", ");
    const isUNMember = country.unMember ? "Yes" : "No";
    const translations = country.translations || {};
    
    const topLanguages = [
        "eng",
        "fra",
        "spa",
        "deu",
        "ita",
        "jpn",
        "zho",
        "rus",
        "kor",
    ];

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
    };

    return (
        <div>
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

            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left side */}
                <div className="lg:col-span-2 space-y-4 flex flex-col justify-between">
                    <div>
                        <h1 className="text-3xl sm:text-5xl font-bold text-green-800 break-words">
                            {country.name.common}
                        </h1>
                        <h2 className="text-lg sm:text-xl font-semibold text-green-700 mt-4">
                            Capital : {country.capital?.[0]}
                        </h2>
                        <p className="text-base sm:text-lg font-semibold text-green-700 mt-2">
                            Continent : {country.continents?.join(", ")}
                        </p>
                        <p className="text-base sm:text-lg font-semibold text-green-700 mt-2 mb-4">
                            Region : {country.region}
                        </p>

                        <div className="space-y-2 text-green-900 text-sm sm:text-base bg-green-50 p-3 sm:p-4 rounded shadow-sm">
                            <p>
                                <strong>Currency :</strong> {currencyKey} -{" "}
                                {country.currencies?.[currencyKey]?.name} (
                                {country.currencies?.[currencyKey]?.symbol})
                            </p>
                            <p>
                                <strong>Languages :</strong> {languageList}
                            </p>
                            <p>
                                <strong>TLD :</strong> {country.tld?.join(", ")}
                            </p>
                            <p>
                                <strong>Population :</strong>{" "}
                                {country.population.toLocaleString()}
                            </p>
                            <p>
                                <strong>Area :</strong>{" "}
                                {country.area.toLocaleString()} km²
                            </p>
                            <p>
                                <strong>Latitude & Longitude :</strong>{" "}
                                {country.latlng?.join(", ")}
                            </p>
                            <p>
                                <strong>Land Locked :</strong>{" "}
                                {country.landlocked ? "Yes" : "No"}
                            </p>
                            <p>
                                <strong>UN Member :</strong> {isUNMember}
                            </p>
                        </div>

                        <hr className="my-6 border-green-300" />

                        <h2 className="text-xl sm:text-2xl font-semibold text-green-700 mt-6 mb-2">
                            Translations
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full mt-2 bg-green-50 border border-green-200 text-xs sm:text-sm">
                                <thead>
                                    <tr>
                                        <th className="border px-2 sm:px-4 py-2 text-left">
                                            Language
                                        </th>
                                        <th className="border px-2 sm:px-4 py-2 text-left">
                                            Common
                                        </th>
                                        <th className="border px-2 sm:px-4 py-2 text-left">
                                            Official
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(translations)
                                        .filter(([lang]) =>
                                            topLanguages.includes(lang)
                                        )
                                        .map(([lang, trans]) => (
                                            <tr key={lang}>
                                                <td className="border px-2 sm:px-4 py-2">
                                                    {languageNames[lang] ||
                                                        lang}
                                                </td>
                                                <td className="border px-2 sm:px-4 py-2">
                                                    {trans.common}
                                                </td>
                                                <td className="border px-2 sm:px-4 py-2">
                                                    {trans.official}
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right side */}
                <div className="space-y-6">
                    <div>
                        <img
                            src={country.flags?.svg}
                            alt="Flag"
                            className="w-full max-w-[400px] md:max-w-[400px] mx-auto border rounded shadow"
                        />
                    </div>

                    <div>
                        <h3 className="text-base sm:text-lg font-semibold text-green-700 mb-2">
                            Map View
                        </h3>
                        <iframe
                            title="OpenStreetMap"
                            src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                                country.latlng[1] - 1
                            }%2C${country.latlng[0] - 1}%2C${
                                country.latlng[1] + 1
                            }%2C${country.latlng[0] + 1}&layer=mapnik`}
                            className="w-full h-48 sm:h-80 md:h-80 border rounded mx-auto"
                            loading="lazy"
                        />
                        <a
                            href={country.maps?.openStreetMaps}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block mt-2 text-center bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 transition w-full"
                        >
                            View Larger Map
                        </a>
                    </div>
                    {country.coatOfArms?.png && (
                        <div>
                            <h3 className="text-base sm:text-lg font-semibold text-green-700 mb-2">
                                Coat of Arms
                            </h3>
                            <img
                                src={country.coatOfArms?.svg}
                                alt="Coat of Arms"
                                className="w-full max-w-[200px] md:max-w-[200px] mx-auto"
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-green-900 text-white text-center py-4 mt-8 text-sm sm:text-base">
                © 2025 World Explorer. All rights reserved.
            </footer>
        </div>
    );
};

export default CountryDetails;