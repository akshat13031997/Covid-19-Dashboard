import React from 'react'
import {Map as LeafletMap, TileLayer} from 'react-leaflet';
import "./Map.css";
import {showdataonmap} from "./util";
function Map({countries,casesType,center,zoom}) {
    return (
        <div className='map'>
            <LeafletMap center={center} zoom={zoom}>
                <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribute='&copy;<a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
            {showdataonmap(countries,casesType)}
            </LeafletMap>
        </div>
    )
}

export default Map
