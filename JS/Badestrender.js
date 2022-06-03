
async function getMap(){

    const soreng = await getWetherSorenga ()
    const featuresBikes = getWetherSorenga(weather => {
        return {
            temp: weather.data.instant.details.air_temperature
        }
    });
    const geoStations = {
        type: 'FeatureCollection',
        features: featuresBikes
    }

    /* geoStations.features.forEach(weather => {
        const markerEl = document.createElement('div');
        markerEl.classList.add('marker');   //
        markerEl.innerHTML += (weather.temp);
        console.log(weather)
        
        
       
       
        
    });
 */

    const markerEl = document.createElement('div');
    markerEl.classList.add('marker'); 
    markerEl.innerHTML += (weather.temp)
    
}


// fetching the temprature
const getWetherSorenga = async () => {
    
        const url = 'https://api.met.no/weatherapi/locationforecast/2.0/compact.json?lat=59.9042&lon=10.7623'
        const res = await fetch(url)
        const data = await res.json()
        /* return {
            temp:data.properties.timeseries[0].data.instant.details.air_temperature

        } */

        
        
        const timeNow = data.properties.timeseries[0].data.instant.details.air_temperature

        console.log(timeNow)

    
}







console.log(getWetherSorenga.temp)






getMap()