
function openAboutPopup() {
    document.getElementById("nav-about-popup").style.display = "block";
    document.getElementById("nav-popup-overlay").style.display = "block";
}

function openMethodsPopup() {
    document.getElementById("nav-methods-popup").style.display = "block";
    document.getElementById("nav-popup-overlay").style.display = "block";
}

function closeAboutPopup() {
    document.getElementById("nav-about-popup").style.display = "none";
    document.getElementById("nav-popup-overlay").style.display = "none";
}

function closeMethodsPopup() {
    document.getElementById("nav-methods-popup").style.display = "none";
    document.getElementById("nav-popup-overlay").style.display = "none";
}

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
                '#757FBD',
                'stable_lowrent',
                '#BDC4E3',
                'disadvantaged',
                '#F89638',
                'equipped',
                '#F9E2B4',
                '#ccc'
            ],
            'fill-opacity': 0.9

        }
    })

    // When a click event occurs on a feature in the states layer,
    // open a popup at the location of the click, with description
    map.on('click', 'map-data-tract-fill', (e) => {
        new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(`
                <h3>${e.features[0].properties.GEOID}</h3>
                    <p>
                     <strong>Median GHG Intensity:</strong> ${e.features[0].properties.mdn_ghg} kgCO2e/ft2<br>
                     <strong>Rent Burden:</strong> Median rent is ${e.features[0].properties.rntbrdE} % of household income <br>
                    </p>
                    `)
            .addTo(map);
    });

    // Change the cursor to a pointer when
    // the mouse is over the states layer.
    map.on('mouseenter', 'map-data-tract-fill', () => {
        map.getCanvas().style.cursor = 'pointer';
    });

    // Change the cursor back to a pointer
    // when it leaves the states layer.
    map.on('mouseleave', 'map-data-tract-fill', () => {
        map.getCanvas().style.cursor = '';
    });

    

})

// Fly to Random "At Risk" Tract
function flyToRandomRisk() {
    // Filter features based on the "risk" category
    const riskFeatures = map.queryRenderedFeatures({
        layers: ['map-data-tract-fill'],
        filter: ['==', ['get', 'qd_2024'], 'disadvantaged'] 
    });

    // Check if there are any features in the "risk" category
    if (riskFeatures.length > 0) {
        // Randomly select one feature from the filtered list
        const randomFeature = riskFeatures[Math.floor(Math.random() * riskFeatures.length)];

        // Fly the map to the selected feature
        map.flyTo({
            center: randomFeature.geometry.coordinates[0][0], // Adjust the coordinates if needed
            zoom: 14, // Adjust the zoom level as desired
            essential: true // ensures the flyTo animation is smooth
        });
    } else {
        console.log("No census tracts found in the 'risk' category.");
    }
}