// // API  EARTHQUAKE & TECTONIC PLATES (GeoJSON)
var Quake_link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson";
var Tec_link = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

// Create a map object
var myMap = L.map("map", {
  center: [21.3068, -157.7912],
  zoom: 2.45
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




// controls the colors of the dots (paired to MAG)
function earthQuakeColor (mag){
  if (mag>400)
  return "purple"
  if (mag>250)
  return "DarkRed"
  else if (mag>100)
  return "OrangeRed"
  else if (mag>50)
  return "Gold"
  else if (mag>25)
  return "GreenYellow"
  else if (mag>10)
  return "Green"
  else 
  return "DarkGreen"
}

// Grab the data with d3
d3.json(Quake_link).then(function(data) {
  console.log(data);

  // // Build MARKERS
  // (currently flags only appear when CLICKed)
  
  // code sets text on flag
  // set to display MAG 
  L.geoJson(data, {
    onEachFeature: function(feature, layer){
      var myDate = new Date(feature.properties.time);
      layer.bindPopup(
        feature.properties.place+
        "<hr> Time: "+ myDate.toGMTString()+
        "<br> Magnitude: "+ feature.properties.mag+
        "<br> Depth: "+ feature.geometry.coordinates[2]
      )
    },
  // set FLAG STYLE
  // radius to a multiple of MAG
  // color set to DEPTH
  style: function(feature){
    return {
    color : earthQuakeColor(feature.geometry.coordinates[2]),
    radius : Math.pow(feature.properties.mag, 2)/2,
    fillOpacity : 0.75,
    fillColor : earthQuakeColor(feature.geometry.coordinates[2])
  }
  },


  pointToLayer: function(feature, latlng){
    return L.circleMarker(latlng)
  }

  }).addTo(myMap)


  // Retrieve platesURL (Tectonic Plates GeoJSON Data) with D3
  d3.json(Tec_link, function(Tec_Lines) {
    // Create a GeoJSON Layer the Tec_Lines
    L.geoJson(Tec_Lines, {
        color: "#DC143C",
        weight: 2
    // Add plateData to tectonicPlates LayerGroups 
    }).addTo(tectonicPlates);
    // Add tectonicPlates Layer to the Map
    tectonicPlates.addTo(myMap);
});



  // code for LEGEND
  
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {
  
      var div = L.DomUtil.create('div', 'info legend'),
          depth = [0, 25, 50, 100, 250, 400],
          labels = [];

      div.innerHTML += "<h3>Depth</h3>"
  
      // loop through depth and create legend colors
      for (var i = 0; i < depth.length; i++) {
          div.innerHTML +=
              '<i style="background:' + earthQuakeColor (depth[i] + 1) + '"></i> ' +
              depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
      }
  
      return div;
  };
  
  legend.addTo(myMap);

  });



