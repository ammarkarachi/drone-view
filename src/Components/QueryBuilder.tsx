import React from 'react'
import { FormControl, FormLabel, VStack, Text, Center, RangeSliderTrack, RangeSliderThumb, RangeSliderFilledTrack, RangeSlider, RangeSliderMark } from '@chakra-ui/react';
import { Select } from 'chakra-react-select';
import { getDistinctNames, getDistinctGenerations, getMaxDistance } from '../Utils/data/db-wrapper'
import { SingleDatepicker } from 'chakra-dayzed-datepicker';
import { useLiveQuery } from 'dexie-react-hooks';
import { RadioViewButton, RadioViewButtonProps } from './RadioCard';

export interface QueryState  {
    selectedNames: string[],
    selectedGenerations: string[],
    startDate: Date,
    endDate: Date,
    duration: number[],
    distance: number[],
}

export interface QueryProps{
    state: QueryState,
    onChange: (state: Partial<QueryState>) => void
    radioViewProps: RadioViewButtonProps
}

export function Querier (props: QueryProps)  {
    const names = useLiveQuery(() => getDistinctNames(), []);
    const generations = useLiveQuery(() => getDistinctGenerations(), []);
    const { state, onChange  } = props;
    const { duration, endDate, startDate, distance} = state;
    return <VStack>
    <RadioViewButton view={props.radioViewProps.view} onChange={props.radioViewProps.onChange} />
    <FormControl p={4}>
        <FormLabel>
            Select Name
        </FormLabel>
        <Select
            focusBorderColor='teal.400'
            isMulti
            isClearable
            isSearchable
            name="Name"
            size='sm'
            options={names?.map(r => ({ value: r, label: r })) || []}
            placeholder="Drones"
            closeMenuOnSelect={false}
            onChange={e => onChange({ selectedNames : e.map(r => r.value) })}
        />
    </FormControl>
    <FormControl p={4}>
        <FormLabel>
            Select Generation
        </FormLabel>
        <Select
            focusBorderColor='teal.400'
            isMulti
            size='sm'
            name="Generation"
            options={generations?.map(r => ({ value: r, label: r })) || []}
            placeholder="Generation"
            closeMenuOnSelect={false}
            onChange={(e) => onChange({ selectedGenerations: e.map(r => r.value) })}
        />
    </FormControl>

    <FormControl p={4} colorScheme={'teal'}>
        <FormLabel>
            Select Date Range
        </FormLabel>
        <SingleDatepicker
            date={startDate}
            onDateChange={(e) => {
                onChange({ startDate: e })
            }}
            propsConfigs={{
                dateNavBtnProps:{
                    size: 'sm'
                },
                inputProps:{
                    size: 'sm',
                    focusBorderColor: 'teal.400'
                },              
            }}
            configs={{
                dateFormat: 'MM/dd/YYY',

            }}

        />
        <Center><Text>To</Text></Center>
        <SingleDatepicker date={endDate}

            configs={{
                dateFormat: 'MM/dd/YYY'
            }}

            propsConfigs={{
                dateNavBtnProps:{
                    size: 'sm'
                },
                inputProps:{
                    size: 'sm',
                    focusBorderColor: 'teal.400'
                },              
            }}
            onDateChange={(e) => {
                onChange({ endDate: e })
            }} />
    </FormControl >
    <FormControl p={4}>
        <FormLabel>
            Flight Duration (Min.)
        </FormLabel>
        <RangeSlider 
                colorScheme={'teal'}
                onChange={(e) => onChange({ duration: e })}
                value={duration} max={30} >
            <RangeSliderTrack >
                <RangeSliderFilledTrack   />
            </RangeSliderTrack>
            <RangeSliderThumb boxSize={4} index={0} >
                <Text fontSize={'xs'} color={'blackAlpha.700'} >{duration[0]}</Text>
            </RangeSliderThumb>
            <RangeSliderThumb boxSize={4} index={1} >
                <Text fontSize={'xs'} color={'blackAlpha.700'} >{duration[1]}</Text>
            </RangeSliderThumb>
            {Array.from(new Array(31), (_, i) => i).map((i) => 
             <RangeSliderMark key={i} value={i} fontSize={ i % 10 === 0 ? '1xs' : '3xs'} >
                {i % 10 === 0 ? i : ''}
            </RangeSliderMark>)}
 
        </RangeSlider>
    </FormControl >
    <FormControl p={4}>
        <FormLabel>
            Flight Distance (Mi.)
        </FormLabel>
        <RangeSlider 
                colorScheme={'teal'}
                onChange={(e) => onChange({ distance: e })}
                min={0}
                value={distance} 
                max={100} >
            <RangeSliderTrack >
                <RangeSliderFilledTrack   />
            </RangeSliderTrack>
            <RangeSliderThumb boxSize={4} index={0} >
                <Text fontSize={'xs'} color={'blackAlpha.700'} >{distance[0]}</Text>
            </RangeSliderThumb>
            <RangeSliderThumb boxSize={4} index={1} >
                <Text fontSize={'xs'} color={'blackAlpha.700'} >{distance[1]}</Text>
            </RangeSliderThumb>
            {Array.from(new Array(100), (_, i) => i).map((i) => 
             <RangeSliderMark key={i} value={i} fontSize={ i % 20 === 0 ? '1xs' : '3xs'} >
                {i % 20 === 0 ? i : ''}
            </RangeSliderMark>)}
        </RangeSlider>
    </FormControl >
</VStack>
}