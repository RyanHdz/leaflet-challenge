// URL of the data
const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Create a map centered on the geographic center of Earth
let map = L.map('map').setView([0, 0], 3);

// Add OpenStreetMap tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
}).addTo(map);

// Fetch the data
fetch(url)
  .then(response => response.json())
  .then(data => {
    // Function to determine marker size based on magnitude
    const markerSize = (magnitude) => {
      return magnitude * 10000;
    };

    // Function to determine marker color based on depth
    const depthColor = (depth) => {
      return depth > 50 ? '#800026' :
             depth > 30  ? '#BD0026' :
             depth > 10  ? '#E31A1C' :
                           '#FFEDA0';
    };

    // Loop through the data
    data.features.forEach(feature => {
      // Coordinates for the marker
      const coords = feature.geometry.coordinates;

      // Create a circle marker
      let circle = L.circle([coords[1], coords[0]], {
        color: 'black',  // black outline
        weight: 1,  // outline weight
        fillColor: depthColor(coords[2]),
        fillOpacity: 0.8,
        radius: markerSize(feature.properties.mag)
      }).addTo(map);

      // Bind a popup to the marker
      circle.bindPopup(`<h2>${feature.properties.place}</h2><hr><p>${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${coords[2]}</p>`);
    });

    // Add a legend
    let legend = L.control({position: 'bottomright'});
    legend.onAdd = function (map) {
      let div = L.DomUtil.create('div', 'info legend'),
          grades = [0, 10, 30, 50],
          labels = ['0-10', '10-30', '30-50', '50+'];
      // Add a white border to the legend
      div.style.border = '2px solid white';
      div.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
      for (let i = 0; i < grades.length; i++) {
        div.innerHTML += '<i style="background:' + depthColor(grades[i] + 1) + '; width: 18px; height: 18px; float: left; margin-right: 8px; opacity: 0.7"></i> ' +
                         labels[i] + '<br>';
      }
      return div;
    };
    legend.addTo(map);
  })
  .catch(error => console.error('Error:', error));
