import React, { useState, useEffect, useRef } from 'react';
import './Question.css';  // Import the CSS file

const Question = ({ clue, goBack, theQuestion, theAnswer, score, questionValue, setScore, clickedClues, clueKey, removeClickedClue }) => {
    const words = theQuestion.split(' ')
    const [wordIndex, setWordIndex] = useState(0);
    const intervalRef = useRef(null);
    const [wordColors, setWordColors] = useState(new Array(words.length).fill('#0f28c6')); // Default color for all words
    const [canBuzz, setCanBuzz] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [showAnswer, setShowAnswer] = useState(false);
    const inputRef = useRef(null);
    
    const handleSubmit = (e, yourAnswer, correctAnswer) => {
        e.preventDefault();
        setShowAnswer(true);
        if (inputRef.current.value.toLowerCase() === theAnswer.toLowerCase()) {
            setScore(score + questionValue);
        }
        else {
            setScore(score - questionValue);
        }
    }

    const onBuzz = () => {
        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.focus(); // Automatically focus the input field
            }
        }, 0);
        setShowForm(true);
    }

    useEffect(() => {
        // Clear any existing interval
        clearInterval(intervalRef.current);

        const intervalId = setInterval(() => {
            if (wordIndex < words.length) {
                // Update the color of the most recent word
                setWordColors((prevColors) => {
                    const newColors = [...prevColors];
                    newColors[wordIndex] = 'white'; // Change color of the current word
                    return newColors;
                });
                setWordIndex(wordIndex + 1);
            } else {
                clearInterval(intervalId);
                setCanBuzz(true);
            }
        }, 200);

        intervalRef.current = intervalId;

        return () => clearInterval(intervalRef.current);
    }, [words]);

    return (
        <div>
            {/* Clue is now outside the .question-screen div */}
            <h2>{clue}</h2> {/* Display the clue */}

            <div className="question-screen">
                {/* Dynamic text that is displayed word by word */}

                <h2 className="hhh">
                    {words.map((word, index) => (
                        <span
                            key={index}
                            style={{ color: wordColors[index] }} // Default color is black if no color is set
                        >
                            {word}{' '}
                        </span>
                    ))}
                </h2>

                {showAnswer && 
                <>
                <h2 className = "yourAnswer">Your answer: {inputRef.current.value}</h2>
                    <h2 className = "yourAnswer">Correct answer: {theAnswer}</h2>
                    <h2 className = "yourAnswer" data-underline = "y">{inputRef.current.value.toLowerCase() === theAnswer.toLowerCase() ? "Great Job!" : "Incorrect!"}</h2>
                
                </>
                }

                <div className="button-container">
                    <button className="back" onClick={() => {
                        goBack()
                        if(clickedClues.has(clueKey) && !showAnswer) {
                            removeClickedClue(clueKey);
                        }
                    }}
                        >Back</button>
                    <button className="buzzer" onClick={onBuzz} disabled={!canBuzz}>Buzz</button> {/* buzz button */}
                    <div style={{
                        visibility: showForm ? "visible" : "hidden"
                    }}>
                    <form className='formmm' onSubmit={(e) => handleSubmit(e, inputRef.current.value, theAnswer)}>
                        <input type="text" placeholder="Answer:" ref={inputRef}/>
                    </form>
                    </div>

                </div>
            </div>
        </div>
    );
};


export default Question;