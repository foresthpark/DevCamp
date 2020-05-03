const NodeGeoCoder = require("node-geocoder");

const options = {
  provider: process.env.GEOCODER_PROVIDER,
  httpAdapter: "https",
  apiKey: process.env.GEOCODER_KEY,
  formatter: null,
};

const GeoCoder = NodeGeoCoder(options);

module.exports = GeoCoder;
