
import assert from 'assert';
export interface IFlightLog {
    Name: string;
    Generation: string;
    FlightIdentifier: string;
    DroneIdentifier: string;
    FlightLog: Array<{ Latitude: number;
    Longitude: number;
    DateTime: number;}>;
}

const headers = ['Name','Generation','FlightIdenitifier','DroneIdentifier','Latitude','Longitude','Timestamp'];

export function ReadCSV(data: string): {
    flightLogs: Array<IFlightLog>
    errors: Array<string>,
    rows: number
} {
    const errors: string[] = [];
    
    const split_lines = data.split('\n');
    const rows = split_lines.length;
    const csv_headers_map: any = split_lines[0].split(',').reduce((map, val, idx) => {
        map.set(val, idx);
        return map;
    }, new Map<string, number>());

    headers.forEach((header) => {
        if (!csv_headers_map.has(header)) {
            throw new Error(`Missing header ${header}`);
        }
    });
    const flightIdenitifierMapType = split_lines.slice(1)
        .reduce((map, val, index) => {

            let flightLog: IFlightLog | undefined = undefined;
            const fileValues = val.split(',')
            const identifierLocation = csv_headers_map.get('FlightIdenitifier');
            if (identifierLocation === undefined){
                errors.push(`Missing FlightIdenitifier at row ${index + 1}`);
                return map;
            }
            const id =  fileValues[identifierLocation];
            const generation = fileValues[csv_headers_map.get('Generation')];
            const name = fileValues[csv_headers_map.get('Name')];
            const droneIdentifier = fileValues[csv_headers_map.get('DroneIdentifier')];
            const latitude = Number(fileValues[csv_headers_map.get('Latitude')]);
            const longitude = Number(fileValues[csv_headers_map.get('Longitude')]);
            const timestamp = Number(fileValues[csv_headers_map.get('Timestamp')]);
            if(id === undefined){
                return map;
            }
            if (latitude >= 90 || latitude <= -90){
                errors.push(`Latitude out of range ${latitude} for row ${index + 1}`);
                return map;
            }
                
            if(longitude >= 180 || longitude <= -180) {
                errors.push(`Longitude out of range ${longitude} for row ${index + 1}`);
                return map;
            }

            if (timestamp < 0 || timestamp > new Date().getTime()){
                errors.push(`Timestamp out of range ${timestamp} for row ${index + 1}`);
                return map;
            }
            if (Number(generation) < 0 || Number(generation) > 26){
                errors.push(`Generation out of range ${generation} for row ${index + 1}`);
                return map;
            }

            if (!map.has(id)){
               map.set(id, {
                    FlightIdentifier: id,
                    Generation: generation,
                    Name: name,
                    DroneIdentifier: droneIdentifier,
                    FlightLog: []
               });
            } else {
                flightLog = map.get(id);
                assert(flightLog !== undefined);
            }

            flightLog?.FlightLog.push({
                Latitude: latitude,
                Longitude: longitude,
                DateTime: timestamp,
            })
            return map;
        }, new Map<string, IFlightLog>())

    const flightLogs = Array.from(flightIdenitifierMapType.values())
    return {
        flightLogs,
        errors,
        rows,
    }

}



