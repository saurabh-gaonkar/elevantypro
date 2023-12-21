export default async (request, context) => {
  const countryName = context.geo?.country?.name || "somewhere in the world";
  const latlng = `${context.geo?.latitude},${context.geo?.longitude}`;
  const getCountryUrl = `https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyDbjIZwTH0ZaRFIyHQuJG7OwAsGU0_HvJo&latlng=${latlng}`;
  const countryRes = await fetch(getCountryUrl);
  const countryVal = await countryRes.json();

  const addressComponents = countryVal.results[0].address_components;
  console.log(addressComponents, "test");

  if (countryName === "IN") {
    const url = new URL("/en-us/home", request.url);

    return Response.redirect(url);
  }

  // For other countries, serve the default HTML page
  const defaultPagePath = "/en-us/index.html"; // Adjust this to your default page path
  const defaultPageUrl = new URL(defaultPagePath, request.url);

  // Fetch the default page content
  const response = await fetch(defaultPageUrl);

  // Return the fetched response
  return response;
};

export const config = {
  path: "/en-us",
};