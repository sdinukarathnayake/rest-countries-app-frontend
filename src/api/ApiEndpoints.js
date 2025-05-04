import axios from 'axios';

const BASE_URL = 'https://restcountries.com/v3.1';

// used by HomePage
export const getCountriesByCurrency = (currency) => axios.get(`${BASE_URL}/currency/${currency}`);
export const getCountriesByCapital = (capital) => axios.get(`${BASE_URL}/capital/${capital}`);

// used  by CountryList and HomePage
export const getAllCountries = () => axios.get(`${BASE_URL}/all`); 

// used by CountryDetails.jsx
export const getCountryByCode = (code) => axios.get(`${BASE_URL}/alpha/${code}`);



export const getCountryByName = (name) => axios.get(`${BASE_URL}/name/${name}`);
export const getCountriesByRegion = (region) => axios.get(`${BASE_URL}/region/${region}`);