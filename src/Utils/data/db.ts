import Dexie, { Table } from "dexie";
import { IFlightLog } from "./read-csv";


/**
 * Log Record that is saved to the database
 */
export interface IFlightLogRecord extends IFlightLog {
    Duration: number; // how long a flight is
    Timestamp: number; // when the flight was recorded
    Color: string;
    Distance: number,
}

/**
 * Class represents the Dronview data
 */
class DroneFlighLogs extends Dexie {
    flightLog!: Table<IFlightLogRecord>;
    constructor() {
        super('DroneViewer-test-1')
        this.version(1).stores({
            flightLog: 'FlightIdentifier,Name,Generation,Duration,Distance'
        })
        
    }

   
}
export const db = new DroneFlighLogs();