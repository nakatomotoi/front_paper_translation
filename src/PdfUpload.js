import React from 'react'
import axios from 'axios';
import styled from 'styled-components'
import { Button } from '@material-ui/core';
import { Document, Page, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const url = 'http://127.0.0.1:5000/translation';

export default class PdfUpload extends React.Component {
    constructor (props) {
        super(props);
        this.state = {page: 1, base64: null, name: null, loadSuccess: false, data: []}
    }

    handleChange (e) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
            this.setState({
                base64: reader.result,
                name: file.name,
            });
            const res = await axios.post(url, file, {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                }
            }).catch(err => err.response);
            console.debug(res);
            this.setState({
               data: res.data.data
            });
        };
    }

    async handleDocumentLoad ({ numPages }) {
        this.setState({
            numPages,
            loadSuccess: true,
        });
    }

    handleButtonClick (page) {
        this.setState({page})
    }

    render () {
        const {numPages, page, base64, name, data, loadSuccess} = this.state;
        const translationSuccess = numPages === data.length;
        const pageData = translationSuccess ? data[page - 1] : {};
        const text = pageData['translated_text'] ? pageData['translated_text'] : '翻訳できませんでした';

        return(
            <div className="component">
                PDFを添付してください:
                <Button component="label" variant="contained" color="primary">
                    ファイル選択
                    <StyledInput type="file" onChange={this.handleChange.bind(this) } />
                </Button>
                <Container>
                    <Document
                        file={base64} style={{border: 'dotted 1px #aaa'}}
                        onLoadSuccess={this.handleDocumentLoad.bind(this)}
                        onLoadError={console.error}
                    >
                        <Page
                            pageNumber={page}
                            style={{border: 'solid 2px #000', height: 300}}
                            renderAnnotationLayer={false}
                        />
                    </Document>
                    {loadSuccess ? <TextContainer>{translationSuccess ? text : '翻訳時にエラーが起きました'}</TextContainer> : null}
                </Container>
                {loadSuccess ? (
                    <>
                        <NameContainer>{name}</NameContainer>
                        <Button
                            disabled={page <= 1}
                            color='inherit'
                            onClick={() => this.handleButtonClick(page - 1)}
                        >Prev</Button>
                        {page || 1} / {numPages || '-'}
                        <Button
                            disabled={page >= numPages || !numPages}
                            color='inherit'
                            onClick={() => this.handleButtonClick(page + 1)}
                        >Next</Button>
                    </>
                ) : null}
            </div>
        )
    }
}

const Container = styled.div`
  display: flex;
  margin: 50px 50px 10px 50px;
`;

const TextContainer = styled.div`
  width: 300px;
`

const NameContainer = styled.div`
  text-align: center;
`

const StyledInput = styled.input`
  opacity: 0;
  appearance: none;
  position: absolute;
`