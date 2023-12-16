const axios = require('axios');
require('dotenv').config();

const githubService = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

module.exports = githubService;
