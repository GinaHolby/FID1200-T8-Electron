
const mapBoxKey = 'pk.eyJ1IjoiZ2luYWhvbGJ5IiwiYSI6ImNsMWJ2MjRjcjAxaHUzZG9uMXFoamNnazEifQ.gPLBpXSXWB94ZD4B04DYIA'

  mapboxgl.accessToken = mapBoxKey
  const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/streets-v11', // style URL
  center: [10.7035, 59.9265], // starting position [lng, lat]
  zoom: 12 // starting zoom
  });

 