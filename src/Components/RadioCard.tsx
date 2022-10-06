import { Box, HStack, useRadio, useRadioGroup, Icon } from "@chakra-ui/react"
import { BsList, BsMap } from 'react-icons/bs'

function RadioCard(props:any) {
    const { getInputProps, getCheckboxProps } = useRadio(props)
  
    const input = getInputProps()
    const checkbox = getCheckboxProps()
  
    return (
      <Box as='label'>
        <input {...input} />
        <Box
          {...checkbox}
          cursor='pointer'
          borderWidth='1px'
          borderRadius='sm'
          boxShadow='sm'
          _checked={{
            bg: 'teal.600',
            color: 'white',
            borderColor: 'teal.600',
          }}
          _focus={{
            boxShadow: 'outline',
          }}
          px={2}
          py={1}
        
        >
          {props.children}
        </Box>
      </Box>
    )
  }
  export interface RadioViewButtonProps {
    onChange: (view: string) => void;
    view: string;
  }

  export function RadioViewButton(props: RadioViewButtonProps) {
    const options = [{
        key: 'map',
        value: <Icon key='map' as={BsMap} />}, 
        { key: 'list', value: <Icon key='list' as={BsList} />}
    ];
  
    const { getRootProps, getRadioProps } = useRadioGroup({
      name: 'framework',
      value: props.view,
      onChange: props.onChange,
    })
  
    const group = getRootProps()
  
    return (
      <HStack {...group}>
        {options.map((option) => {
          const radio = getRadioProps({ value: option.key })
          return (
            <RadioCard key={option.key} {...radio}>
              {option.value}
            </RadioCard>
          )
        })}
      </HStack>
    )
  }
  