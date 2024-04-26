mapboxgl.accessToken = 'pk.eyJ1IjoiY3ByZWVsZHVtYXMiLCJhIjoiY2x1bHZ0dGJ0MGw4bTJpbGxwdm5jZmQ4cyJ9.ZusuHjH6O73kH4F2RmenWA';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v11', // dark basemap
    center: [-73.96143, 40.73941], // starting position [lng, lat]
    zoom: 10, // starting zoom
});


map.addControl(new mapboxgl.NavigationControl());

// when the map is finished it's initial load, add sources and layers.
map.on('load', function () {

    // add a geojson source for the borough boundaries
    map.addSource('map-data-tract', {
        type: 'geojson',
        data: 'data/map_data_tract.geojson',
    })

    // first add the fill layer, using a match expression to give each a unique color based on its boro_code property
    map.addLayer({
        id: 'map-data-tract-fill',
        type: 'fill',
        source: 'map-data-tract',
        paint: {
            'fill-color': [
                'match',
                ['get', 'qd_2024'],
                'stable_highrent',
                '#F9E2B4',
                'stable_lowrent',
                '#BDC4E3',
                'disadvantaged',
                '#F89638',
                'equipped',
                '#8884FF',
                '#ccc'
            ],
            'fill-opacity': 0.9 
            
        }
    })


})