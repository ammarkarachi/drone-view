import { useCallback } from 'react';
import { Center, useColorModeValue, Spinner } from '@chakra-ui/react';
import { useDropzone } from 'react-dropzone';
/**
 * 
 * @param props 
 * @returns 
 */
export default function UploadFile(props: { onFileAccepted: (file: File) => void, busy: boolean }) {
  const onDrop = useCallback((acceptedFiles: File[] ) => {
    props.onFileAccepted(acceptedFiles[0]);
  }, [props]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept:  { 'text/csv': ['.csv'] } , maxFiles: 1, multiple: false,
  });

  const dropText = isDragActive ? 'Drop the files here ...' : 'Drag \'n\' drop .csv file here, or click to browse';

  const activeBg = useColorModeValue('gray.100', 'gray.600');
  const borderColor = useColorModeValue(
    isDragActive ? 'teal.300' : 'gray.300',
    isDragActive ? 'teal.500' : 'gray.500',
  );

  return (
    <Center
      p={10}
      cursor="pointer"
      bg={isDragActive ? activeBg : 'transparent'}
      _hover={{ bg: activeBg }}
      transition="background-color 0.2s ease"
      borderRadius={4}
      border="3px dashed"
      borderColor={borderColor}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      {props.busy ? <Spinner/> : <p>{dropText}</p>}
    </Center>
  );
}