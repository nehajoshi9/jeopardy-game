import React, { useState, useEffect, useRef } from 'react';
import './Question.css';

const Question = ({ clue, goBack, theQuestion, theAnswer, score, questionValue, setScore, clickedClues, clueKey, removeClickedClue }) => {
  const [words, setWords] = useState([]);
  const [wordColors, setWordColors] = useState([]);
  const intervalRef = useRef(null);
  const wordIndexRef = useRef(0); // useRef instead of state
  const [canBuzz, setCanBuzz] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    console.log((typeof theQuestion))
    if (typeof theQuestion === 'string') {
        console.log("String!!!")
      const newWords = theQuestion.split(' ');
      setWords(newWords);
      setWordColors(new Array(newWords.length).fill('#0f28c6'));
      wordIndexRef.current = 0;
      setCanBuzz(false);
      setShowForm(false);
      setShowAnswer(false);
    }
  }, [theQuestion]);

  useEffect(() => {
    if (!words.length) return;

    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      const i = wordIndexRef.current;
      if (i < words.length) {
        setWordColors(prevColors => {
          const newColors = [...prevColors];
          newColors[i] = 'white';
          return newColors;
        });
        wordIndexRef.current += 1;
      } else {
        clearInterval(intervalRef.current);
        setCanBuzz(true);
      }
    }, 200);

    return () => clearInterval(intervalRef.current);
  }, [words]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowAnswer(true);
    const answer = inputRef.current.value.toLowerCase();
    if (answer === theAnswer.toLowerCase()) {
      setScore(score + questionValue);
    } else {
      setScore(score - questionValue);
    }
  };

  const onBuzz = () => {
    setTimeout(() => inputRef.current?.focus(), 0);
    setShowForm(true);
  };

  return (
    <div>
      <h2>{clue}</h2>

      <div className="question-screen">
        <h2 className="hhh">
          {words.map((word, index) => (
            <span
              key={index}
              style={{ color: wordColors[index] || '#0f28c6' }}
            >
              {word}{' '}
            </span>
          ))}
        </h2>

        {showAnswer && (
          <>
            <h2 className="yourAnswer">Your answer: {inputRef.current.value}</h2>
            <h2 className="yourAnswer">Correct answer: {theAnswer}</h2>
            <h2 className="yourAnswer" data-underline="y">
              {inputRef.current.value.toLowerCase() === theAnswer.toLowerCase()
                ? 'Great Job!'
                : 'Incorrect!'}
            </h2>
          </>
        )}

        <div className="button-container">
          <button
            className="back"
            onClick={() => {
              goBack();
              if (clickedClues.has(clueKey) && !showAnswer) {
                removeClickedClue(clueKey);
              }
            }}
          >
            Back
          </button>
          <button className="buzzer" onClick={onBuzz} disabled={!canBuzz}>
            Buzz
          </button>

          <div style={{ visibility: showForm ? 'visible' : 'hidden' }}>
            <form className="formmm" onSubmit={handleSubmit}>
              <input type="text" placeholder="Answer:" ref={inputRef} />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Question;
