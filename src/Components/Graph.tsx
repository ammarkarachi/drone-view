import { Container, Fade, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react"
import { getDateFromTimestamp, getDurationInMinutes } from '../Utils/date-helper'
import React, { useRef } from 'react';
import { IFlightLogRecord } from "../Utils/data/db";

interface TableViewProps {
    flightLogs: IFlightLogRecord[]
}
const ColorComponent =({color}:{color:string})=>{
    return <div style={{width:'10px',height:'10px',backgroundColor:color}}></div>
}
export const TableView = ({ flightLogs }: TableViewProps) => {
    return <Table  borderLeftColor={'gray.300'} >
        <Thead >
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
                return <Tr key={flightLog.FlightIdentifier} height='50px' >
                    <Td><ColorComponent color={flightLog.Color} /></Td>
                    <Td>{flightLog.Name}</Td>
                    <Td>{flightLog.Generation}</Td>
                    <Td>{getDateFromTimestamp(flightLog.Timestamp).toLocaleDateString()}</Td>
                    <Td>{getDurationInMinutes(flightLog.Duration)}</Td>
                    <Td>{Math.round(flightLog.Distance)}</Td>
                </Tr>}
            )}
        </Tbody>
    </Table>
}

