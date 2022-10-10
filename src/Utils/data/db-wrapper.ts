import { db } from "./db";
import { IFlightLog } from "./read-csv";
import { IFlightLogRecord } from "./db";
import { toTimestamp } from "../date-helper";
import { generateUniqueColor } from "../generate-unique-colors";
import { calculateDistance } from "../coordinate-helper";

/**
 * return distinc list of drone names in the database
 * @returns {string[]} of drone names
 */
export async function getDistinctNames(): Promise<string[]> {
    const names = (await db.flightLog.orderBy('Name').uniqueKeys()).filter((name) => name !== undefined) as string[];
    return names;
}

/**
 * returns distinct list of drone generations
 * @returns {string[]} of generation
 */
export async function getDistinctGenerations(): Promise<string[]> {
    const generation = (await db.flightLog.orderBy('Generation').uniqueKeys()).filter((name) => name !== undefined) as string[];
    return generation;
}

/**
 * Queries the database and return the flight records
 * @param names 
 * @param generations 
 * @param start 
 * @param end 
 * @param duration 
 * @returns {IFlightLogRecord[]}
 */
export function getFlightLogs(names?: string[], generations?: string[], start?: Date, end?: Date, duration?: number[], distance?: number[]): Promise<IFlightLogRecord[]> {
    const defaultDuration = duration?.length === 2 ? duration.map(r => r*60)  : [0, 30*60];
    let collection = db.flightLog.where('Duration')
    .between(defaultDuration[0], defaultDuration[1], true, true)
    if(names && names.length > 0) {
        collection = collection.and((log) => names.includes(log.Name));
    }

    if(generations && generations.length > 0) {
        collection = collection.and((log) => generations.includes(log.Generation));
    }

    if(start && end) {
        collection = collection.and((log) => log.Timestamp >= toTimestamp(start) && log.Timestamp <= toTimestamp(end));
    }

    if(distance && distance.length > 1) {
        collection = collection.and((log) => log.Distance >= distance[0] && log.Distance <= distance[1]);
    }
    
    

    return collection.toArray();
}

// get total count of flight logs
export async function getTotalCount(): Promise<number> {
    return db.flightLog.count();
}
/**
 * get max distance
 * @returns {number} max current distance 
 */
export async function getMaxDistance(): Promise<number> {
    const max = await db.flightLog.orderBy('Distance').last();
    if (max){
        return max.Distance
    }
    return 30;
}


/**
 * 
 * @param flightLogs 
 * @returns {IFlightLogRecord[]}
 */
export async function putFlightLogs(flightLogs: IFlightLog[]): Promise<IFlightLogRecord[]> {
    const flightRecords: IFlightLogRecord[] = await transformFlightLogToRecord(flightLogs);
    await db.flightLog.bulkPut(flightRecords);
    return flightRecords;
}

/**
 * Transform flight log to record
 * @param flightLogs 
 * @returns {IFlightLogRecord[]}
 */
async function transformFlightLogToRecord(flightLogs: IFlightLog[]) {
    const count = await getTotalCount();
    const flightRecords: IFlightLogRecord[] = flightLogs.map((r, index) => {
        const times = r.FlightLog.map(r => r.DateTime);
        const min = Math.min(...times);
        const max = Math.max(...times);
        const coordinates = r.FlightLog.map(log => ({ Latitude: log.Latitude, Longitude: log.Longitude }));
        console.log(calculateDistance(coordinates));
        return {
            ...r,
            Duration: max - min,
            Timestamp: min,
            Color: generateUniqueColor(count + index + 1),
            Distance: calculateDistance(coordinates)
        };
    });
    return flightRecords;
}

