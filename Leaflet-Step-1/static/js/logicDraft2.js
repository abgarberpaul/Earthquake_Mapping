// add url for data [DATA SET = M2.5+ Earthquakes past 30 Days; found in https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php]
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson";

// Create a map object
var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 4
  });
  
  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  }).addTo(myMap);
  
  // Define a markerSize function that will give each city a different radius based on its population
  function markerSize(population) {
    return population / 40;
  }
  
  // Each city object contains the city's name, location and population
  var cities = [
    {
      name: "New York",
      location: [40.7128, -74.0059],
      population: 8550405
    },
    {
      name: "Chicago",
      location: [41.8781, -87.6298],
      population: 2720546
    },
    {
      name: "Houston",
      location: [29.7604, -95.3698],
      population: 2296224
    },
    {
      name: "Los Angeles",
      location: [34.0522, -118.2437],
      population: 3971883
    },
    {
      name: "Omaha",
      location: [41.2524, -95.9980],
      population: 446599
    }
  ];
  
  // Loop through the cities array and create one marker for each city object
  cities.forEach(function(city) {
    L.circle(city.location, {
      fillOpacity: 0.75,
      color: "white",
      fillColor: "blue",
      // Setting our circle's radius equal to the output of our markerSize function
      // This will make our marker's size proportionate to its population
      radius: markerSize(city.population)
    }).bindPopup("<h1>" + city.name + "</h1> <hr> <h3>Population: " + city.population + "</h3>").addTo(myMap);
  })

  // LOOKING FOR feature.mag; geometry.coordinates.longitude, geometry.coordinates.latitude, geometry.coordinates.depth

  