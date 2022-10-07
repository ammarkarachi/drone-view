import React from "react";
import { IFlightLog } from "../Utils/read_csv";
import {
  chakra,
  Checkbox,
  Heading,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { MapContainer, Polyline, TileLayer, useMap,Polygon } from "react-leaflet";
import { QueryState } from "./QueryBuilder";
import { useLiveQuery } from "dexie-react-hooks";
import { getFlightLogs } from "../Utils/db_wrapper";
import { IFlightLogRecord } from "../Utils/db";
import { useEffect, useState } from "react";
import { PolylineDecorator, SetBounds, SetSelected, } from "./MapComponents";
import { getDateFromTimestamp, getDurationInMinutes } from "../Utils/date-helper";
import { calculateDistance } from "../Utils/coordinate_helper";
const ChakraMapContainer = chakra(MapContainer, {
  baseStyle: {
    h: "full",
    w: "full",
  },
});
interface MapProps {
  queryState: QueryState;
}


export function Map(props: MapProps) {
  const { queryState } = props;

  const {
    selectedNames,
    selectedGenerations,
    startDate,
    endDate,
    duration,
  } = queryState;
  const [isAnnotated, setAnnotation] = useState(false);
  const flightLogs =
    useLiveQuery(
      () =>
        getFlightLogs(
          selectedNames,
          selectedGenerations,
          startDate,
          endDate,
          duration
        ),
      [props.queryState]
    ) || [];
  const [selectedFlightLog, changeSelectedFlighLog] = useState<
    IFlightLog | undefined
  >(undefined);
  useEffect(() => {
    changeSelectedFlighLog(undefined);
  }, [flightLogs]);

  return (
    <> 
      <ChakraMapContainer zIndex={1} key={"map"} maxZoom={20}>
        {isAnnotated ? (
          <TileLayer
            key={"annotated"}
            attribution={
              "Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC"
            }
            url={
              "https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}"
            }
          />
        ) : (
          <TileLayer
            key={"plain"}
            attribution={
              "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
            }
            url={
              "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            }
          />
        )}
   
        {flightLogs.map((r: IFlightLogRecord) => (
          <PolylineDecorator
            opacity={0.65}
            weight={5}
            tooltipContents={[
              `Name: ${r.DroneIdentifier}`,
              `Distance: ${Math.round(calculateDistance(r.FlightLog.map(log => ({ Latitude: log.Latitude, Longitude: log.Longitude }))))} Mi.`,
              `Duration: ${getDurationInMinutes(r.Duration)} Min.`,
              `Date: ${getDateFromTimestamp(r.Timestamp).toLocaleDateString()}`
            ]}
            key={r.FlightIdentifier}
            pathOptions={{ color: r.Color }}
            positions={r.FlightLog.map((g) => [g.Latitude, g.Longitude])}
          />
        ))}
        <SetBounds flightLogs={flightLogs} />
        <SetSelected flightLog={selectedFlightLog} />
      </ChakraMapContainer>
      <VStack
        zIndex={5}
        position="sticky"
        bottom={"20"}
        width={"50"}
        align="flex-start"
        padding={"1"}
      >
        {flightLogs
          .sort((a, b) => b.Timestamp - a.Timestamp)
          .map((log: IFlightLogRecord, index: number) => (
            <HStack
              backgroundColor={selectedFlightLog === log ? "blue.500" : "none"}
              padding="0.5"
              key={log.FlightIdentifier + log.FlightIdentifier}
              cursor={"pointer"}
              onClick={(e) => {
                changeSelectedFlighLog(log);
              }}
            >
              <ColorComponent color={log.Color} />
              <Heading fontSize={"2xs"}>{log.DroneIdentifier}</Heading>
            </HStack>
          ))}
        <Checkbox
          isChecked={isAnnotated}
          size='sm'
          padding={'1'}
          backgroundColor={'blackAlpha.500'}
          onChange={(e) => {
            setAnnotation(e.target.checked);
          }}
        >
          Show Map Labels
        </Checkbox>
      </VStack>
    </>
  );
}

const ColorComponent = ({ color }: { color: string }) => {
  return (
    <div
      style={{ width: "10px", height: "10px", backgroundColor: color }}
    ></div>
  );
};
