

import { IFlightLog } from '../Utils/read_csv'
import { chakra, Heading, HStack, VStack } from '@chakra-ui/react';
import { MapContainer, Polyline, TileLayer, useMap } from 'react-leaflet';
import { QueryState } from './QueryBuilder'
import { useLiveQuery } from 'dexie-react-hooks';
import { getFlightLogs } from '../Utils/db_wrapper';
import { IFlightLogRecord } from '../Utils/db';
import { useEffect, useState } from 'react';
import React from 'react';
const ChakraMapContainer = chakra(MapContainer, {
  baseStyle: {
    h: "full",
    w: "full",
  }
});
interface MapProps {
  queryState: QueryState
}
function SetBounds(props: { flightLogs: IFlightLog[] }) {
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
    map.fitBounds([[49.3457868, -124.784407], [24.7433195, -66.9513812]]);
    return <></>
  }
  map.fitBounds([[Math.min(...latitudes), Math.min(...longitudes)], [Math.max(...latitudes), Math.max(...longitudes)]])
  return <></>;
}

function SetSelected(props: { flightLog?: IFlightLog }) {
  const map = useMap();
  const { flightLog } = props;
  if (flightLog === undefined) {
    return <></>
  }
  const latitudes = flightLog.FlightLog.map((log) => log.Latitude);
  const longitudes = flightLog.FlightLog.map((log) => log.Longitude);
  if (latitudes.length === 0 || longitudes.length === 0) {
    // just default to the center of the US
    map.fitBounds([[49.3457868, -124.784407], [24.7433195, -66.9513812]]);
    return <></>
  }
  map.fitBounds([[Math.min(...latitudes), Math.min(...longitudes)], [Math.max(...latitudes), Math.max(...longitudes)]])
  return <></>;
}

export function Map(props: MapProps) {
  const { queryState } = props;

  const { selectedNames, selectedGenerations, startDate, endDate, duration } = queryState;
  const flightLogs = useLiveQuery(() => getFlightLogs(selectedNames, selectedGenerations, startDate, endDate, duration), [props.queryState]) || [];
  const [selectedFlightLog, changeSelectedFlighLog] = useState<IFlightLog | undefined>(undefined)
  useEffect(() => {
    changeSelectedFlighLog(undefined);
  }, [flightLogs])

  return <><ChakraMapContainer zIndex={1} key={'map'}  >
    <TileLayer

      attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
      url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
    />

    {flightLogs.map((r: IFlightLogRecord) => <Polyline opacity={0.65} weight={5} key={r.FlightIdentifier} pathOptions={{ color: r.Color }} positions={r.FlightLog.map(g => [g.Latitude, g.Longitude])} />)}
    <SetBounds flightLogs={flightLogs} />
    <SetSelected flightLog={selectedFlightLog} />
  </ChakraMapContainer>
    <VStack zIndex={5} position='sticky' bottom={'20'}  width={'50'} align='flex-start' padding={'1'}  >
      {flightLogs.sort((a, b) => b.Timestamp - a.Timestamp).map((log: IFlightLogRecord, index: number) => <HStack
      backgroundColor={selectedFlightLog === log ? 'blue.500' : 'none'}
      padding='0.5'
        key={log.FlightIdentifier} cursor={'pointer'} onClick={e => {
          changeSelectedFlighLog(log)
        }}>
        <ColorComponent color={log.Color} />
        <Heading fontSize={'2xs'} >{log.DroneIdentifier}</Heading>
      </HStack>)}
    </VStack>
  </>
}

const ColorComponent = ({ color }: { color: string }) => {
  return <div style={{ width: '10px', height: '10px', backgroundColor: color }}></div>
}