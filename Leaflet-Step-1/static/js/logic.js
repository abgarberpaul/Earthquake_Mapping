// Create a map object
var myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 4
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


// // API  EARTHQUAKE
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson";


function earthQuakeColor (mag){
  if (mag>90)
  return "purple"
  if (mag>70)
  return "red"
  else if (mag>50)
  return "orange"
  else if (mag>30)
  return "yellow"
  else if (mag>10)
  return "white"
  else 
  return "green"
}

// Grab the data with d3
d3.json(link).then(function(data) {
  console.log(data);

  // Build flags
  L.geoJson(data, {
    onEachFeature: function(feature, layer){
      layer.bindPopup(
        feature.properties.place+"<hr> Magnitude: "+
        feature.properties.mag


      )
    },
  
  style: function(feature){
    return {
    color : "black",
    radius : feature.properties.mag*4,
    fillOpacity : 0.5,
    fillColor : earthQuakeColor(feature.geometry.coordinates[2])
  }
  },


  pointToLayer: function(feature, latlng){
    return L.circleMarker(latlng)
  }

  }).addTo(myMap)

  // code for legend
  
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {
  
      var div = L.DomUtil.create('div', 'info legend'),
          magnitudes = [-10, 10, 30, 50, 70, 90],
          labels = [];
  
      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < magnitudes.length; i++) {
          div.innerHTML +=
              '<i style="background:' + earthQuakeColor (magnitudes[i] + 1) + '"></i> ' +
              magnitudes[i] + (magnitudes[i + 1] ? '&ndash;' + magnitudes[i + 1] + '<br>' : '+');
      }
  
      return div;
  };
  
  legend.addTo(myMap);


  // data.forEach(function(data) {
  //   var lat = data.features.geometry.coordinates;
  //   var lng = 
  //   if (location) {
  //     L.marker([location.coordinates[1], location.coordinates[0]]).addTo(myMap);
  //   }
  });



