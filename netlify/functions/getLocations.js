// getLocation.js

module.exports = async function (event, context) {
  try {
    // Assuming you have set up environment variables in Netlify for your API keys
    const GEOLOCATION_KEY = "AIzaSyBdnk37CjZp57OslQ_UZH9m5gjfYm7QWPA";
    const GEOCODING_KEY = "AIzaSyDbjIZwTH0ZaRFIyHQuJG7OwAsGU0_HvJo";

    // Step 1: Get Coordinates
    const getCoordinatesUrl = `https://www.googleapis.com/geolocation/v1/geolocate?key=${GEOLOCATION_KEY}`;
    const coordinatesRes = await fetch(getCoordinatesUrl, { method: "POST" });

    if (coordinatesRes.status === 200) {
      const coordinatesVal = await coordinatesRes.json();

      if (coordinatesVal.location) {
        const { lat, lng } = coordinatesVal.location;
        let latlng = `${lat},${lng}`;

        // Step 2: Get Country
        const getCountryUrl = `https://maps.googleapis.com/maps/api/geocode/json?key=${GEOCODING_KEY}&latlng=${latlng}`;
        const countryRes = await fetch(getCountryUrl);
        const countryVal = await countryRes.json();

        if (countryVal.status === 'OK') {
          const addressComponents = countryVal.results[0].address_components;
          let city, zipcode, country, state, county;

          addressComponents.forEach((item) => {
            if (item.types[0] === 'postal_code') {
              zipcode = item.long_name ? item.long_name : item.short_name;
            } else if (item.types[0] === 'country') {
              country = item.short_name ? item.short_name : item.long_name;
            } else if (item.types[0] === 'locality') {
              city = item.short_name ? item.short_name : item.long_name;
            } else if (item.types[0] === 'administrative_area_level_1') {
              state = item.short_name ? item.short_name : item.long_name;
            } else if (item.types[0] === 'administrative_area_level_2') {
              county = item.short_name ? item.short_name : item.long_name;
            }
          });

          return {
            statusCode: 200,
            body: JSON.stringify({ city, zipcode, country, state, county }),
          };
        }
      }
    }

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Unable to fetch location information' }),
    };
  } catch (error) {
    console.error('Error fetching location:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};
