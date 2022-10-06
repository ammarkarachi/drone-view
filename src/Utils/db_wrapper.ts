import { db } from "./db";
import { IFlightLog } from "./read_csv";
import { IFlightLogRecord } from "./db";
import { toTimestamp } from "./date-helper";
import { generateUniqueColor } from "./generate_unique_colors";

export async function getDistinctNames(): Promise<string[]> {
    const names = (await db.flightLog.orderBy('Name').uniqueKeys()).filter((name) => name !== undefined) as string[];
    return names;
}


export async function getDistinctGenerations(): Promise<string[]> {
    const generation = (await db.flightLog.orderBy('Generation').uniqueKeys()).filter((name) => name !== undefined) as string[];
    return generation;
}


export function getFlightLogs(names?: string[], generations?: string[], start?: Date, end?: Date, duration?: number[]): Promise<IFlightLogRecord[]> {
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

    return collection.toArray();
}

// get total count of flight logs
export async function getTotalCount(): Promise<number> {
    return db.flightLog.count();
}



export async function putFlightLogs(flightLogs: IFlightLog[]) {
    const count = await getTotalCount();
    const flightRecords: IFlightLogRecord[] = flightLogs.map((r,index) => {
        const times =   r.FlightLog.map(r => r.DateTime);
        const min = Math.min(...times);
        const max = Math.max(...times);

        return {
            ...r,
            Duration: max - min,
            Timestamp: min,
            Color: generateUniqueColor(count + index + 1)

        }
    });
    await db.flightLog.bulkPut(flightRecords);
}
