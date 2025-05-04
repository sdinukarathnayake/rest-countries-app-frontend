import React from 'react';

const FavouriteCountries = () => {
    const favouriteCountries = [
        { name: 'Japan', population: 126300000 },
        { name: 'Canada', population: 38000000 },
        { name: 'Australia', population: 25690000 },
    ];

    return (
        <div style={{ padding: '20px' }}>
            <h1>Favourite Countries</h1>
            <ul>
                {favouriteCountries.map((country, index) => (
                    <li key={index}>
                        <strong>{country.name}</strong> - Population: {country.population.toLocaleString()}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FavouriteCountries;