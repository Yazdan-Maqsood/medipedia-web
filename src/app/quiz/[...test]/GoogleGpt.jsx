'use client'
import { useState, useEffect } from 'react';
//  import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import '../../components/modal.css';
import Ai from '../../components/Ai';
import Link from 'next/link';

export default function GoogleGpt(props) {
    const [gpt, setGpt] = useState(false);
    const [google, setGoogle] = useState(false);
    const [frame, setframe] = useState(false);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [response, setResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const onGptModal = () => {

        fetchResponse()

    }
    const onGoogleModal = () => {
        setGoogle(true);

    }

    const onCloseGpt = () => setGpt(false);
    const onCloseGoogle = () => setGoogle(false);

    const fetchData = async () => {
        try {
            const apiKey = 'AIzaSyBL4c8q63-Tuq0f5JWgXVRZEkD0iIRX9H4';
            const searchEngineId = '74ef92dbf72f04cfd';
            const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(props.Ques)}`;

            const response = await fetch(url);
            const data = await response.json();

            if (data.items) {
                setResults(data.items);
            } else {
                setResults([]);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchData();
    }, []);


    const fetchResponse = async () => {
        setIsLoading(true);
        const requestBody = {
            "prompt": {
                "messages": [{ "content": props.Ques }]
            },
            "temperature": 0.25,
            "candidateCount": 1,
            "topP": 1,
            "topK": 1
        }

        try {
            const response = await fetch('https://generativelanguage.googleapis.com/v1beta2/models/chat-bison-001:generateMessage?key=AIzaSyAO8MAGludzlMvzk8X6NCum0z8K7PoZvcg', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            //console.log(data.candidates[0].content)
            setResponse(data.candidates[0].content); // Adjust according to the actual response structure
            setGpt(true);
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            setResponse('Failed to fetch data.');
        } finally {
            setIsLoading(false);
        }
    };




    return (
        <>
            <div style={{ float: 'left' }}>
                <img onClick={onGptModal} data-bs-toggle="tooltip" title="Generate Answer with AI" style={{ width: '50px', cursor: 'pointer' }} src='/assets/images/chatgpt-logo.jpg' alt="ChatGPT Logo"></img>
            </div>
            <div style={{ float: 'left' }}>
                <img onClick={onGoogleModal} data-bs-toggle="tooltip" title="Generate Answer with Google" style={{ width: '50px', cursor: 'pointer' }} src='/assets/images/google-logo.png' alt="Google Logo"></img>
            </div>
            {isLoading ? <div style={{ textAlign: "center" }}>Generating AI based answer......</div> : null}
            <Modal open={gpt} onClose={onCloseGpt} center>
                <div style={{ padding: '15px' }} >
                    <br></br>
                    {!isLoading ? (
                        <div style={{ padding: '15px' }} >
                            <b>AI Generated Answer:</b>
                            <p style={{ textAlign: 'justify' }} >{response}</p>
                        </div>
                    ) : (
                        <></>
                    )}
                </div>
            </Modal>
            <Modal open={google} onClose={onCloseGoogle} center>
                <div style={{ padding: '20px' }} className="search-results">
                    <b>Google base answer:</b>
                    {results.map((item, index) => (
                        <div key={index} className="search-result">
                            <Link target='_blank' href={item.link} className="result-title">{item.title}</Link>
                            <p className="result-snippet">{item.snippet}</p>
                        </div>
                    ))}
                </div>
            </Modal>
            {/* <Modal open={frame} onClose={onCloseframe} center>
                <iframe src="https://skillalfa.com/" height="800" width="100%" title="Iframe Example"></iframe>
            </Modal> */}
        </>
    );
}
