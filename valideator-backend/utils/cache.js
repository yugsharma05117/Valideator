const cache = {};

const getCache = (key) => cache[key];

const setCache = (key, value) => {
  cache[key] = value;
};

module.exports = { getCache, setCache };