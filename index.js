// import necessary dependencies
const express = require('express');
      axios = require('axios');

// initiate express
const app = express();

// store title ix api endpoints
const CASES_API_URL = "http://projects.chronicle.com/titleix/api/v1/cases/";
const mapData = require('./data/us.json');
const geoData = require('./data/geoLocationData.json');

// host our public & data folder
// app.use(express.static('data'));
app.use(express.static('public'));

// grab data from title ix api, send to 
app.get("/api", async function(request, response) {

  const res = await axios.get(CASES_API_URL);
  let casesData = await res.data;

  casesData = casesData.map(d => {
    return {
      ...d,
      closed: d.closed ? new Date(d.closed) : '', 
      opened: new Date(d.opened),
    }
  })

  console.log(casesData)

  const result = {
    casesData,
    mapData,
    geoData
  }
  // // send json response
  response.json(result);
})

// listener at port 8000
app.listen(8000, () => console.log('something is happening at localhost:8000'))

// catch 404 errors
app.use((request, response, next) => {
  res.status(404).send('sorry can\'t find that!')
});