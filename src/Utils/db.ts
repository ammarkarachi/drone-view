import Dexie, { Table } from "dexie";
import { IFlightLog } from "./read_csv";


export interface IFlightLogRecord extends IFlightLog {
    Duration: number; // how long a flight is
    Timestamp: number; // when the flight was recorded
    Color: string;
}

class DroneFlighLogs extends Dexie {
    flightLog!: Table<IFlightLogRecord>;
    constructor() {
        super('DroneViewer-test-1')
        this.version(1).stores({
            flightLog: 'FlightIdentifier,Name,Generation,Duration'
        })
        
    }

   
}
export const db = new DroneFlighLogs();