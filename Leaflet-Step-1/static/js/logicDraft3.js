// API
var url = "https://opendata.arcgis.com/datasets/d27245a5617f4a1d845060d52260f261_5.geojson";

// Creating map object
var myMap = L.map("map", {
  center: [45.5051, -122.6750],
  zoom: 11
});

// Adding tile layer to the map
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap); 


// Grab the data with d3
d3.json(url).then(function(data) {

  console.log(data);


});
