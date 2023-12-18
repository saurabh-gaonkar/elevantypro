const axios = require('axios');

exports.handler = async function (event, context) {
  try {
    // Google API keys
    const geolocationApiKey = 'AIzaSyBdnk37CjZp57OslQ_UZH9m5gjfYm7QWPA';
    const geocodeApiKey = 'AIzaSyDbjIZwTH0ZaRFIyHQuJG7OwAsGU0_HvJo';

    // Step 1: Get the user's IP address (Netlify-specific headers)
    const userIpAddress =
      event.headers['client-ip'] ||
      event.headers['x-real-ip'] ||
      event.headers['x-forwarded-for'] ||
      event.ip;

    // Step 2: Use Google Geolocation API to get coordinates
    const geolocationUrl = `https://www.googleapis.com/geolocation/v1/geolocate?key=${geolocationApiKey}`;
    const geolocationResponse = await axios.post(geolocationUrl, {
      considerIp: true,
      wifiAccessPoints: [],
    });
    const { location } = geolocationResponse.data;

    // Step 3: Use Google Geocoding API to get detailed location information
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat},${location.lng}&key=${geocodeApiKey}`;
    const geocodeResponse = await axios.get(geocodeUrl);
    const detailedLocation = geocodeResponse.data.results[0];

    // Step 4: Determine the redirect URL based on the user's location
    let redirectUrl = '/'; // Default redirect URL

    // Example: Redirect users in the United States to a specific page
    if (detailedLocation && detailedLocation.address_components) {
      const countryComponent = detailedLocation.address_components.find(
        (component) => component.types.includes('country')
      );

      if (countryComponent && countryComponent.short_name === 'US') {
        redirectUrl = '/us-specific-page';
      }
    }

    // Step 5: Return the redirect URL in the response
    return {
      statusCode: 302, // 302 Found (Temporary Redirect)
      headers: {
        Location: redirectUrl,
      },
      body: '',
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};