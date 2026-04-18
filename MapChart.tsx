'use client'

import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from 'react-simple-maps'

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

const markers = [
  { name: 'New York', coordinates: [-74.006, 40.7128] },
  { name: 'London', coordinates: [-0.1276, 51.5074] },
  { name: 'Tokyo', coordinates: [139.6917, 35.6895] },
  { name: 'Singapore', coordinates: [103.8198, 1.3521] },
  { name: 'Sydney', coordinates: [151.2093, -33.8688] },
]

export default function MapChart() {
  return (
    <div className="map-container">
      <ComposableMap>
        <ZoomableGroup center={[0, 20]} zoom={1}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  className="rsm-geography"
                />
              ))
            }
          </Geographies>
          {markers.map(({ name, coordinates }) => (
            <Marker key={name} coordinates={coordinates}>
              <circle r={6} fill="#F00" stroke="#fff" strokeWidth={2} />
              <text
                textAnchor="middle"
                y={-12}
                style={{
                  fill: '#fff',
                  fontSize: '12px',
                  fontWeight: 'bold',
                }}
              >
                {name}
              </text>
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>
    </div>
  )
}
