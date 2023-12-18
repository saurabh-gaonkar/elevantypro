module.exports = function (eleventyConfig) {
    // Passthrough copy for static files
    eleventyConfig.addPassthroughCopy('src/static');
    eleventyConfig.addPassthroughCopy('./src/css/');
    eleventyConfig.addWatchTarget('./src/css/');
  
    // Add Nunjucks asynchronous shortcode for fetching location data
    eleventyConfig.addNunjucksAsyncShortcode('getLocationData', async function () {
      try {
        const response = await fetch('https://your-netlify-app/.netlify/functions/getLocation');
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching location:', error);
        return { error: 'Internal Server Error' };
      }
    });
  
    // Other configurations...
    return {
      dir: {
        input: 'src',
        output: 'public'
      }
    };
  };
  