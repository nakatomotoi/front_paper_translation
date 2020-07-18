import React, {useCallback, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import { Document, Page } from 'react-pdf';

function TestPdfUpload() {
    const [base64, setBase64] = useState();
    const [fileName, setFileName] = useState();
    const [test, setTest] = useState(0);
    let reader = new FileReader();
    let data = null;
    const onDrop = useCallback((acceptedFiles) => {
        setTest(prev => prev+1);
        acceptedFiles.forEach((file) => {
            setTest(2);
            reader.readAsDataURL(file);

            reader.onabort = () => console.log('file reading was aborted');
            reader.onerror = () => console.log('file reading has failed');
            reader.onload = () => {
                // Do whatever you want with the file contents
                data = reader.result;
                console.debug(data);
                setBase64(data);
                setFileName(reader.name);
                setTest(1);
                console.debug(base64);
                console.debug(fileName);
                console.debug(test);
            };
        })

    }, []);
    const {getRootProps, getInputProps} = useDropzone({onDrop});

    return (
        <>
            <button onClick={() => {
                setTest(4);
                console.debug(test);
                console.debug(reader.result);
                console.debug(data);
            }}>
            click
            </button>
            <div {...getRootProps()}>
                <input {...getInputProps()} />
                <p>Drag 'n' drop some files here, or click to select files</p>
                <Document
                    file={reader.result}
                />
            </div>
        </>
    )
}

export default TestPdfUpload;
