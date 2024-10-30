import React, { useState, useRef } from 'react';
import './AudioCapture.css';
import { storage } from '../firebase';
import { ref, getDownloadURL } from 'firebase/storage';
import { fetchOpenAIResponse, fetchSuggestedAnswer } from '../services/openAI';

const FILE_NAME = 'medical_questions_answers.txt'

const AudioCapture = () => {
    
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
