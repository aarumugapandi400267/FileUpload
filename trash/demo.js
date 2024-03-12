// const axios = require('axios');
import axios from 'axios'

async function geocodeAddress(address) {
    const apiKey = 'Pff1PmF0PtXXx2zwMLGWdUwMj7nLXWvvHVhhPCSM0hA';
    const url = `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(address)}&apiKey=${apiKey}`;

    try {
        const response = await axios.get(url);
        console.log(response.data['items']); // Handle the response data
    } catch (error) {
        console.error('Error geocoding address:', error);
    }
}

geocodeAddress('1600 Amphitheatre Parkway, Mountain View, CA');