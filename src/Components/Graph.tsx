import { Fade, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react"
import { useLiveQuery } from "dexie-react-hooks";
import { getFlightLogs } from "../Utils/db_wrapper";
import { QueryState } from "./QueryBuilder"
import { getDateFromTimestamp, getDurationInMinutes } from '../Utils/date-helper'
import { calculateDistance } from '../Utils/coordinate_helper'
interface TableViewProps {
    queryState: QueryState
}
const ColorComponent =({color}:{color:string})=>{
    return <div style={{width:'10px',height:'10px',backgroundColor:color}}></div>
}
export const TableView = (props: TableViewProps) => {
    const { queryState } = props;

    const { selectedNames, selectedGenerations, startDate, endDate, duration } = queryState;
    const flightLogs = useLiveQuery(() => getFlightLogs(selectedNames, selectedGenerations, startDate, endDate, duration), [props.queryState]) || [];
    return <Fade in > <Table borderLeftColor={'gray.300'} borderLeftWidth='thin' height={'full'} >
        <Thead>
            <Tr>
                <Th></Th>
                <Th>Drone</Th>
                <Th>Generation</Th>
                <Th>Date</Th>
                <Th>Duration (Min.)</Th>
                <Th>Distance (mi)</Th>
            </Tr>
        </Thead>
        <Tbody>
            {flightLogs.sort((a, b)=>  b.Timestamp - a.Timestamp).map(flightLog => {
                return <Tr key={flightLog.FlightIdentifier} >
                    <Td><ColorComponent color={flightLog.Color} /></Td>
                    <Td>{flightLog.Name}</Td>
                    <Td>{flightLog.Generation}</Td>
                    <Td>{getDateFromTimestamp(flightLog.Timestamp).toLocaleDateString()}</Td>
                    <Td>{getDurationInMinutes(flightLog.Duration)}</Td>
                    <Td>{Math.round(calculateDistance(flightLog.FlightLog.map(log => ({ Latitude: log.Latitude, Longitude: log.Longitude }))))}</Td>
                </Tr>}
            )}
        </Tbody>
    </Table>
    </Fade>
}

