import React, { useState, useRef } from 'react';
import './AudioCapture.css';
import { storage } from '../firebase';
import { ref, getDownloadURL } from 'firebase/storage';
import { fetchOpenAIResponse, fetchSuggestedAnswer } from '../services/openAI';

const FILE_NAME = 'medical_questions_answers.txt'

const AudioCapture = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [detectedQuestion, setDetectedQuestion] = useState('');
    const [suggestedAnswer, setSuggestedAnswer] = useState('');
    const [isLoading, setIsLoading] = useState({
        detectedQuestion: false,
        suggestedAnswer: false,
    });
    const [error, setError] = useState('');
    const recognition = useRef(null);
    const hasNewSpeech = useRef(false);

    if (!recognition.current && 'webkitSpeechRecognition' in window) {
        recognition.current = new window.webkitSpeechRecognition();
        recognition.current.continuous = true;
        recognition.current.interimResults = true;
        recognition.current.lang = 'en-US';
    } else if (!recognition.current) {
        console.warn('Speech recognition is not supported in this browser.');
    }

    const resetStates = () => {
        setTranscript('');
        setDetectedQuestion('');
        setSuggestedAnswer('');
        setIsLoading({
            detectedQuestion: false,
            suggestedAnswer: false,
        });
    };

    const startRecording = () => {
        setIsRecording(true);
        resetStates();
        setError('');
        hasNewSpeech.current = false; // Reset the speech detection flag
        console.log('Recording started.');

        if (recognition.current) {
            recognition.current.start();
            recognition.current.onresult = (event) => {
                let finalTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const result = event.results[i];
                    if (result.isFinal) {
                        finalTranscript += result[0].transcript;
                    }
                }

                if (finalTranscript) {
                    hasNewSpeech.current = true; // Set flag when new speech is detected
                    setTranscript((prevTranscript) => {
                        if (!prevTranscript) {
                            finalTranscript =
                                finalTranscript.charAt(0).toUpperCase() +
                                finalTranscript.slice(1);
                        }
                        return prevTranscript + finalTranscript + ' ';
                    });
                    console.log('Updated transcript:', finalTranscript);
                }
            };

            recognition.current.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                stopRecording();
            };
        }
    };

    const stopRecording = async () => {
        console.log('Stopping recording.');
        setIsRecording(false);

        if (recognition.current) {
            recognition.current.onresult = null;
            recognition.current.onerror = null;
            recognition.current.onend = async () => {
                // Check if we received any new speech during this recording session
                if (!hasNewSpeech.current) {
                    setError('No speech provided. Please try again');
                    resetStates();
                    return;
                }

                console.log('Final Transcript after stopping:', transcript);
                setIsLoading({detectedQuestion: true});

                // Step 1: Extract question from transcript
                const question = await fetchOpenAIResponse(transcript.trim());
                console.log('Detected question from OpenAI:', question);
                
                // Step 2: Fetch the knowledge file from Firebase
                if (question) {
                    const fileRef = ref(
                        storage,
                        FILE_NAME
                    );
                    try {
                        const url = await getDownloadURL(fileRef);
                        const response = await fetch(url, { mode: 'no-cors' });
                        const knowledgeText = await response.text();
                        console.log(
                            'Fetched knowledge text from Firebase:',
                            knowledgeText
                        );
                        setIsLoading({detectedQuestion: false})
                        setDetectedQuestion(question);
                        setIsLoading({suggestedAnswer: true});

                        // Step 3: Send question and knowledge text to OpenAI for a suggested answer
                        const answer = await fetchSuggestedAnswer(
                            question,
                            knowledgeText
                        );
                        setSuggestedAnswer(answer);
                        setIsLoading({suggestedAnswer: false});
                    } catch (error) {
                        console.error(
                            'Error fetching knowledge file:',
                            error
                        );
                        setError('Error fetching knowledge file')
                        setIsLoading({detectedQuestion: false});
                    }
                }
            };
            recognition.current.stop();
            console.log('Recognition stopped');
        }
    };

    return (
        <div className="medical-assistant">
            <header className="header">
                <h1 className="title">Audio Medical Assistant</h1>
            </header>

            <div className="controls">
                <button
                    onClick={startRecording}
                    className="button start-button"
                    disabled={isRecording}
                >
                    Start Recording
                </button>
                <button
                    onClick={stopRecording}
                    className="button stop-button"
                    disabled={!isRecording}
                >
                    Stop Recording
                </button>
            </div>

            {error && (
                <div className="error">
                    {error}
                </div>
            )}

            <div className="section">
                <h2 className="section-title">Transcript</h2>
                <p className="section-content">
                    {transcript}
                </p>
            </div>

            <div className="section">
                <h2 className="section-title">Detected Question</h2>
                {isLoading.detectedQuestion ? (
                    <div className="loading">Analyzing speech...</div>
                ) : (
                    <p className="section-content">
                        {detectedQuestion}
                    </p>
                )}
            </div>

            <div className="section">
                <h2 className="section-title">Suggested Answer</h2>
                {isLoading.suggestedAnswer ? (
                    <div className="loading">Generating answer...</div>
                ) : (
                    <p className="section-content">
                        {suggestedAnswer}
                    </p>
                )}
            </div>
        </div>
    );
}

export default AudioCapture
