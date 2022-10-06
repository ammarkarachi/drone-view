import parse from "date-fns/parse";
import { getTimezoneOffset } from 'date-fns-tz';

// converts datetime object to timestamp
export function toTimestamp(datetime: Date): number {
    return Math.floor(datetime.getTime() / 1000);
}

// parse time string to get time stamp
export function parseTime(time: string): number {
    const datetime = parse(time, "yyyy-MM-dd HH:mm:ss", new Date());
    return toTimestamp(datetime);
}


// get time stamp from date time object without time
export const getTimestamp = (datetime: Date) : number => {
    const date = new Date(datetime);
    date.setHours(0, 0, 0, 0);
    return toTimestamp(date);
}

export const getTimeStampFromTime = (time: string) : number => {
    const splitTime = time.split(":");
    const offset = getTimezoneOffset(Intl.DateTimeFormat().resolvedOptions().timeZone);
    return Number(splitTime[0]) * 60 * 60  + Number(splitTime[1]) * 60 + offset;
}

//get date for a given timestamp
export const getDateFromTimestamp = (timestamp: number) : Date => {
    return new Date(timestamp * 1000);
}

// get duration in minutes from seconds
export const getDurationInMinutes = (duration: number) : number => {
    return duration / 60;
}