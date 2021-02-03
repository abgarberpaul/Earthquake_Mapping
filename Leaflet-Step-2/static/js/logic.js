// // API  EARTHQUAKE & TECTONIC PLATES (GeoJSON)
var Quake_link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson";
var Tec_link = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

// // SET UP: define LayersGroups

var quakes = new L.LayerGroup();
var plates = new L.LayerGroup();

// // SET UP: define variables for layers

var standardMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

var grayMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/light-v9",
  accessToken: API_KEY
});

var geoMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/satellite-v9",
  accessToken: API_KEY
});

// Create a base map object to hold base layer variables
var baseMaps = {
  "Standard" : standardMap,
  "Gray": grayMap,
  "Satellite" : geoMap
};

// Overlay Object (holds over layers)
 var mapLayers = {
   "Earthquakes": quakes,
   "Tectonic Plate Lines": plates
 }

// Create Map, pass in standard layers for default setting
var myMap = L.map("map", {
  center: [21.3068, -157.7912],
  zoom: 2.45,
  layers: [standardMap, quakes]
});

// Create a Layer Control + Pass in baseMaps and overlayMaps + Add the Layer Control to the Map
L.control.layers(baseMaps, mapLayers).addTo(myMap);

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

// Grab the QUAKE data with d3
d3.json(Quake_link).then(function(data) {
  console.log(data);

  // // Build MARKERS
  // (currently flags only appear when CLICKed)
  
  // code sets text on flag
  // set to display TIME, MAG, DEPTH
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

  }).addTo(quakes);
  quakes.addTo(myMap);

//  // QUAKE layer
// Create a variable for the new data set
  var plateData

  // Grab plate data with d3
  d3.json(Tec_link).then(function(tec_data) {
    console.log(tec_data);
    L.geoJson(tec_data).addTo(plates);

    // Add Layer to the Map
    plates.addTo(myMap)
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



