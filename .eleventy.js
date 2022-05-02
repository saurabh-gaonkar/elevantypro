// require("nunjucks");

module.exports = function(eleventyconfig) {

    eleventyconfig.addPassthroughCopy("./src/css/");
    eleventyconfig.addWatchTarget("./src/css/");
    return {
        dir: {
            input: "src",
            output: "public"
        }
    }
  };