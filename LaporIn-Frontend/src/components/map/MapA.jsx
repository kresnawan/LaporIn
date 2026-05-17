
import { Map, Marker } from '@vis.gl/react-maplibre';
import 'maplibre-gl/dist/maplibre-gl.css'; // See notes below
import { useCallback, useState } from 'react';

function MapA({ markerPos, setMarkerPos }) {

    const onMarkerDrag = (event) => {
        const { lng, lat } = event.lngLat;
        setMarkerPos({
            ...markerPos,
            long: lng,
            lat: lat
        });
    };
    return (
        <Map
            initialViewState={{
                longitude: 112.61449064408748,
                latitude: -7.9542136389446085,
                zoom: 13
            }}
            style={{ width: '100%', height: '100%' }}
            mapStyle="https://api.maptiler.com/maps/openstreetmap/style.json?key=qMwjSy8lYbHFysUGYPyX"
        >
            <Marker
                longitude={markerPos.long}
                latitude={markerPos.lat}
                anchor='center'
                color='orange'
                draggable={true}
                onDrag={onMarkerDrag}
            />
        </Map>
    )
}

export default MapA