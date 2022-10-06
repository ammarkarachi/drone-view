import { Button, Divider, FormControl, Text, HStack, VStack, Grid, Center, Icon, FormLabel, Input, GridItem, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, useToast } from '@chakra-ui/react';
import { SingleDatepicker } from 'chakra-dayzed-datepicker';
import React from 'react';
import { BsSave } from 'react-icons/bs'
import { putFlightLogs } from '../Utils/db_wrapper';
import { v4 } from 'uuid';
import { getTimestamp, getTimeStampFromTime } from '../Utils/date-helper';
import { IFlightLog, ReadCSV } from '../Utils/read_csv';
import UploadFile from './Upload';
import { readFile } from '../Utils/file_helper';

interface LocationProps {
    Location: LocationEntryType;
    addLocation: (location: LocationEntryType, index: number) => void
    removeLocation: (location: LocationEntryType, index: number) => void,
    updateLocation: (location: Partial<LocationEntryType>, index: number) => void,
    index: number
}

interface LocationEntryType {
    Latitude: string,
    Longitude: string,
    Time: string,
}




const Location: React.FC<LocationProps> = (props) => {
    const { addLocation, removeLocation, updateLocation, index } = props;
    return <><GridItem colStart={1}  >
        <FormControl>
            <Input type={'time'} size={'xs'} value={props.Location.Time}
                onChange={(e) => updateLocation({ Time: e.target.value }, index)} />
        </FormControl>
    </GridItem>
        <GridItem colStart={2} >
            <FormControl>
                <NumberInput size={'xs'} >
                    <NumberInputField  value={props.Location.Latitude} min={-90} max={90} onChange={e => updateLocation({
                        Latitude: e.target.value,
                    }, index)} />
                </NumberInput>
            </FormControl>
        </GridItem>
        <GridItem>
            <FormControl>
                <NumberInput size={'xs'} >
                    <NumberInputField value={props.Location.Longitude} min={-180} max={180} onChange={e => updateLocation({
                        Longitude: e.target.value,
                    }, index)} />
                </NumberInput>
            </FormControl>

        </GridItem>
        <GridItem>
            <HStack >
                <Button size={'xs'} variant={'ghost'} disabled={index === 0} onClick={e => removeLocation(props.Location, index)} >-</Button>
                <Button size={'xs'} variant={'ghost'} onClick={e => addLocation(props.Location, index)}>+</Button>
            </HStack>
        </GridItem> </>


}
export const CreateLog: React.FC<{}> = (props: {}) => {
    const [name, nameChanged] = React.useState('');
    const [generation, generationChanged] = React.useState(1);
    const [date, onDateChange] = React.useState<Date>(new Date());
    const [location, locationChanged] = React.useState<LocationEntryType[]>([{ Latitude: '32', Longitude: '117', Time: '12:00' }]);
    const [isNameValid, setNameValid] = React.useState(false);
    const [isLoading, setLoading] = React.useState(false);
    const [isBusy, setBusy] = React.useState(false);
    const toast = useToast();

    const addLocation = (loc: LocationEntryType, index: number) => {
        const newLocations = [...location];
        const previousLocation = newLocations[index];;        
        newLocations.splice(index + 1, 0, { ...previousLocation });
        locationChanged(newLocations);
    }
    const removeLocation = (loc: LocationEntryType, index: number) => {
        locationChanged(location.filter((_, i) => i !== index))
    }

    const updateLocation = (loc: Partial<LocationEntryType>, index: number) => {
        const newLocations = [...location];
        newLocations[index] = { ...newLocations[index], ...loc };
        locationChanged(newLocations);
    }

    const save = async () => {
        const baseTs = getTimestamp(date);
        const log: IFlightLog[] = [{
            Name: name,
            Generation: generation.toString(),
            DroneIdentifier: `${name}-${generation}`,
            FlightIdentifier: v4(),
            FlightLog: location.map(l => ({ Latitude: parseFloat(l.Latitude), Longitude: parseFloat(l.Longitude), DateTime: baseTs + getTimeStampFromTime(l.Time) }))
        }]
        setLoading(true);
        await putFlightLogs(log);
        nameChanged('');
        generationChanged(1);
        locationChanged([{ Latitude: '32', Longitude: '117', Time: '12:00' }]);
        onDateChange(new Date());
        toast({
            title: "Flight log saved",
            status: "success",
            duration: 9000,
            isClosable: true,
        })
        setLoading(false);
    }
    const uploadFile = async (file: File) => {
        setBusy(true);
        const fileContent = await readFile(file);
        try {
            const {
                errors,
                flightLogs,
                rows
            } = ReadCSV(fileContent);
            if (errors.length > 0) {
                toast({
                    title: 'Warning',
                    description: errors.join('\n'),
                    status: 'warning',
                    duration: 5000,
                    isClosable: true,
                })
            } else {
                toast({
                    title: 'Success',
                    description: `Successfully read ${rows} rows`,
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                })
            }
    
            await putFlightLogs(flightLogs);
        } catch (e: any) {
            toast({
                title: "Error",
                description: e.message,
                status: "error",
                duration: 9000,
                isClosable: true,
            })
            setBusy(false);
            return;
        }

        setBusy(false);
    }

    return <VStack>
        <UploadFile onFileAccepted={uploadFile} busy={isBusy} />
        <Grid templateColumns='repeat(3, 1fr)' gap={5}>
            <Center>
                <Divider w={'full'} />
            </Center>
            <Text>
                Or
            </Text>
            <Center>
                <Divider w={'full'} />
            </Center>
        </Grid>
        <VStack >
            <Grid templateColumns='repeat(6, 1fr)' >
                <GridItem colSpan={4}  >
                    <FormControl isRequired  >
                        <FormLabel>Name</FormLabel>
                        <Input type={'text'}
                         borderRightRadius={'none'} 
                         size='sm' 
                         value={name} 
                         isInvalid={!isNameValid}
                         onChange={(e) => {
                            setNameValid(e.target.value.length > 0);
                            nameChanged(e.target.value)
                            }} />
                    </FormControl>
                </GridItem>
                <GridItem colStart={5} colSpan={2}  >
                    <FormControl isRequired  >
                        <FormLabel>Gen</FormLabel>
                        <NumberInput borderLeftRadius={'none'} size='sm'
                            keepWithinRange
                            value={generation}
                            onChange={(value) => generationChanged(Number(value))}
                            min={1} max={26}>
                            <NumberInputField />
                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                        </NumberInput>
                    </FormControl>
                </GridItem>
            </Grid>
            <FormControl >
                <FormLabel>Date</FormLabel>
                <SingleDatepicker configs={{
                    dateFormat: 'MM/dd/yyyy',
                }}
                    propsConfigs={{
                        dateNavBtnProps: {
                            size: 'sm'
                        },
                        inputProps: {
                            size: 'sm'
                        },
                    }}
                    date={date} onDateChange={(e) => onDateChange(e)} />
            </FormControl>
            <Grid templateColumns='repeat(4, 1fr)' gap={'1'} overflow={'hidden'} overflowY={'scroll'} maxHeight={360} >
                <GridItem colStart={1} >
                    <FormControl>
                        <FormLabel>Time</FormLabel>
                    </FormControl>
                </GridItem>
                <GridItem colStart={2} >
                    <FormControl>
                        <FormLabel>Latitude</FormLabel>
                    </FormControl>
                </GridItem>
                <GridItem>
                    <FormControl>
                        <FormLabel size={'sm'} >Longitude</FormLabel>
                    </FormControl>
                </GridItem>
                {location.map((loc, index) => <Location
                    Location={{
                        Latitude: loc.Latitude,
                        Longitude: loc.Longitude,
                        Time: loc.Time
                    }}
                    key={index}
                    index={index}
                    updateLocation={updateLocation}
                    removeLocation={removeLocation}
                    addLocation={addLocation}
                />)}

            </Grid>

        </VStack>
        <Divider w={'full'} borderColor={'green.800'} shadow={'dark-lg'} />
        <HStack>
            <Button 
                isLoading={isLoading} 
                leftIcon={<Icon as={BsSave} />} 
                variant={'outline'} 
                onClick={save}
                isDisabled={!isNameValid || location.length === 0}
                >
                    Save
            </Button>
        </HStack>
    </VStack>

}
