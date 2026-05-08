
import {Map, Marker} from '@vis.gl/react-maplibre';
import 'maplibre-gl/dist/maplibre-gl.css'; // See notes below

function MapA() {
    return (
        <Map
            initialViewState={{
                longitude: -100,
                latitude: 40,
                zoom: 3.5
            }}
            style={{ width: '100%', height: '100%' }}
            mapStyle="https://api.maptiler.com/maps/openstreetmap/style.json?key=qMwjSy8lYbHFysUGYPyX"
        >
            <Marker longitude={-100} latitude={40} anchor='bottom' color='orange' draggable={true} />
        </Map>
    )
}

export default MapA