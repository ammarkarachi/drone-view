import React, { useEffect } from "react";
import { PolylineProps, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-polylinedecorator";
import { IFlightLog } from "../Utils/read_csv";

interface DecoratePolyLineProps extends PolylineProps {
  tooltipContents?: string[];
}
// Creates a Lines with Arrows
export function PolylineDecorator(props: DecoratePolyLineProps) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const { opacity, weight, pathOptions, positions } = props;
    const arrow = [
        {
          repeat: 70,
          offset: 20,
          symbol: L.Symbol.arrowHead({
            pixelSize: 16,
            polygon: false,
            pathOptions: {  stroke: true, color: pathOptions?.color, opacity,  },
          }),
        },
    ];
    const p = L.polyline(positions, {
        color: pathOptions?.color,
        opacity: opacity,
        weight
    }).addTo(map)
    
    .bindPopup(`<div class="chakra-ui-dark">${props.tooltipContents?.join('<br/>')}</div>`)
    console.log(props.tooltipContents)
    const a = L.polylineDecorator(positions as any, {
      patterns: arrow,
    }).addTo(map);
    return () => {
      a.remove();
      p.remove();
    }

  }, [props]);


  return null;
}

// Set selected line bounding box on map
export function SetSelected(props: { flightLog?: IFlightLog }) {
    const map = useMap();
    const { flightLog } = props;
    if (flightLog === undefined) {
      return <></>;
    }
    const latitudes = flightLog.FlightLog.map((log) => log.Latitude);
    const longitudes = flightLog.FlightLog.map((log) => log.Longitude);
    if (latitudes.length === 0 || longitudes.length === 0) {
      // just default to the center of the US
      map.fitBounds([
        [49.3457868, -124.784407],
        [24.7433195, -66.9513812],
      ]);
      return <></>;
    }
    map.fitBounds([
      [Math.min(...latitudes), Math.min(...longitudes)],
      [Math.max(...latitudes), Math.max(...longitudes)],
    ]);
    return <></>;
}

// set bounding box for a bunch of lines
export function SetBounds(props: { flightLogs: IFlightLog[] }) {
    const map = useMap();
    const { flightLogs } = props;
  
    const latitudes = flightLogs.reduce((array, flightLog) => {
      const lats = flightLog.FlightLog.map((log) => log.Latitude);
      return array.concat(lats);
    }, new Array<number>());
  
    const longitudes = flightLogs.reduce((array, flightLog) => {
      const longs = flightLog.FlightLog.map((log) => log.Longitude);
      return array.concat(longs);
    }, new Array<number>());
    if (latitudes.length === 0 || longitudes.length === 0) {
      // just default to the center of the US
      map.fitBounds([
        [49.3457868, -124.784407],
        [24.7433195, -66.9513812],
      ]);
      return <></>;
    }
    map.fitBounds([
      [Math.min(...latitudes), Math.min(...longitudes)],
      [Math.max(...latitudes), Math.max(...longitudes)],
    ]);
    return <></>;
  }