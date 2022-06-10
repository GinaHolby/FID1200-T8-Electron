const mapbox_key = 'pk.eyJ1IjoiZ2luYWhvbGJ5IiwiYSI6ImNsMWJ2MjRjcjAxaHUzZG9uMXFoamNnazEifQ.gPLBpXSXWB94ZD4B04DYIA';




async function getMap(){

    mapboxgl.accessToken = mapbox_key;

    //* getting and marging the to arrays 
    const bikeStations = await getStations();
    const stationData = await getStationData();
    
    function mergeArrayObjects(bikeStations,stationData){   //merging the arrays
        return bikeStations.map((item,i)=>{
        if(item.station_id === stationData[i].station_id){
            return Object.assign({},item,stationData[i])
        }})}
    
    const bikeDataCombined = mergeArrayObjects(bikeStations,stationData)

    
    //* changing the array to create a message and writing the cordinates in a easy to read way
    const featuresBikes = bikeDataCombined.map(station => {
        return {
            type: 'Feature',
            properties: {
                message: station.name + '\nAdresse: '+station.address + '\nAntall ledige sykler: ' + station.num_bikes_available
                + '\nAntall ledige parkeringsplasser: ' + station.num_docks_available,
                bikesAvailable: station.num_bikes_available + ' | ' + station.num_docks_available,
                bikesAtStation: station.num_bikes_available,
                docksAtStation: station.num_docks_available,
                },
            geometry: {
                type: 'Point',
                coordinates: [station.lon, station.lat],
                lon: [station.lon],
                lat: [station.lat]
                }
            }
    });
   

    //* declearing the location of the activity
    const location = {
        target: {
            lon: 10.7035,
            lat: 59.9265
        }}

    //* ask the server to get acces to current position
    navigator.geolocation.getCurrentPosition(success, error); 

    //* this funtion is runned if the server gets access to current location
    function success(pos) {
    
        const locationCurrentLat = pos.coords.latitude
        const locationCurrentLon = pos.coords.longitude

        // calculate what the center of the map should be
        const midLocation = [(locationCurrentLon +location.target.lon)/2, (locationCurrentLat +location.target.lat)/2]

        // *calculating the distance between markers and adjusting the zoom
        let mapZoom     
            // The magic number in this equation (log(magic nuber/locationDistance)/log(2)=desired zoom) that gived the desired zoo. calculate: magic number = locationDistance * 2^exampel zoom
            const PARAMETER_ZOOM = 120;  
            //get the absolute (positive) number of the distance 
            let locationDistanceLon = Math.abs(locationCurrentLon - location.target.lon)
            let locationDistanceLat = Math.abs(locationCurrentLat - location.target.lat)
            // calculate the perfect zoom
            if (locationDistanceLat < locationDistanceLon) {
                mapZoom = Math.log(PARAMETER_ZOOM/locationDistanceLon)/Math.log(2);
            } else {
                mapZoom = Math.log(PARAMETER_ZOOM/locationDistanceLat)/Math.log(2);
            }

        const currentPositionRecieved = true

        buildMap(locationCurrentLat,locationCurrentLon, midLocation, mapZoom, currentPositionRecieved)
    }
    
    //* this funtion is runned if the server does not get access to current location
    function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);

        const locationCurrentLat = 59.9265
        const locationCurrentLon = 10.7035
        const midLocation = [10.735933, 59.911491]
        const mapZoom  = 10.5   
        const currentPositionRecieved = false

        buildMap(
            locationCurrentLat,
            locationCurrentLon, 
            midLocation, 
            mapZoom, 
            currentPositionRecieved)
    }
    

    
    function buildMap (
        locationCurrentLat, 
        locationCurrentLon, 
        midLocation,
         mapZoom, 
         currentPositionRecieved
         ){

        // filter out the closest bikes if the current position is recieved  
        let closestBikes
        if (currentPositionRecieved == true){
            // filtering out the closest bikestatins
            closestBikes = featuresBikes.filter(stations => {
                return ((stations.geometry.lon- locationCurrentLon) < 0.008 && (stations.geometry.lon- locationCurrentLon) > -0.008 
                && (stations.geometry.lat - locationCurrentLat) > -0.0025 && (stations.geometry.lat - locationCurrentLat) < 0.0025)  
                ||
                ((stations.geometry.lon- location.target.lon) < 0.011  && (stations.geometry.lon- location.target.lon) > -0.011 
                && (stations.geometry.lat - location.target.lat) > -0.005 && (stations.geometry.lat - location.target.lat) < 0.005)
            })
        } else { closestBikes = featuresBikes }


        const geoStations = {
            type: 'FeatureCollection',
            features: closestBikes
            }

        // build the map 
        const map = new mapboxgl.Map({
                container: 'map', // container ID
                style: 'mapbox://styles/mapbox/streets-v11', // style URL
                center: [midLocation[0], midLocation[1]], // starting position [lng, lat]
                zoom: mapZoom, // starting zoom
                // pitch: 60, // 3d
                bearing: 0, // 3d
                antialias: true
            });
        
        //* add a marker for each station, add the number of bikes and parkingspaces available and add color based on availability
        geoStations.features.forEach(station => {
            const markerEl = document.createElement('div');
            markerEl.classList.add('marker');
    
            markerEl.innerHTML += (station.properties.bikesAvailable);
                if (station.properties.bikesAtStation < 3 || station.properties.docksAtStation < 3 ) {
                    markerEl.style.backgroundColor = 'orange'; } 
                if (station.properties.bikesAtStation < 1 || station.properties.docksAtStation < 1 ) {
                    markerEl.style.backgroundColor = 'red'; }
                else {}
    
            markerEl.addEventListener('click', () => {
                alert(station.properties.message);   });
    
            new mapboxgl.Marker(markerEl)
            .setLngLat(station.geometry.coordinates)
            .addTo(map);
        });
        
        const markerCurrentLocation = new mapboxgl.Marker({ color: 'black' })
        .setLngLat([locationCurrentLon, locationCurrentLat])
        .addTo(map);

        
    
        
        const markerTargetLocation = new mapboxgl.Marker({ color: 'blue' })
        .setLngLat(location.target)
        .addTo(map);
            
    }


};


const getStations = async () => {
    try {
        const url = 'https://gbfs.urbansharing.com/oslobysykkel.no/station_information.json'
        const res = await fetch(url)
        const data = await res.json()
        return data.data.stations
        
    } catch (err) {
        console.error(err)   
    }
}

const getStationData = async () => {
    try {
        const url = 'https://gbfs.urbansharing.com/oslobysykkel.no/station_status.json'
        const res = await fetch(url)
        const data = await res.json()
        return data.data.stations
        
    } catch (err) {
        console.error(err)   
    }
}


getMap();

