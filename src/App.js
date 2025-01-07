// src/App.js
import React, { useState, useEffect } from "react";
import GameBoard from "./components/GameBoard";
import Question from "./components/Question";
import "./App.css";

function App() {
  const [selectedClue, setSelectedClue] = useState(null);
  const [showQuestion, setShowQuestion] = useState(false);
  const [clueKey, setClueKey] = useState(null);
  const [q, setQ] = useState(null);
  const [a, setA] = useState(null);
  const [score, setScore] = useState(0);
  const [value, setValue] = useState(0);
  const [clickedClues, addClickedClue] = useState(new Set());
  const [error, setError] = useState(null);
  const [randomCategories, setCategories] = useState([]);
  const [ready, setReady] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/categories?limit=2000');
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        //console.log(data.data);
        const allCategories = data.data;
        if (allCategories.length < 5) {
          return [];
        }
        else {
          const randomIndices = new Set();
          while (randomIndices.size < 5) {
            const randomIndex = Math.floor(Math.random() * allCategories
              .length);
            randomIndices.add(randomIndex);
          }
          const selected = Array.from(randomIndices).map(index => allCategories[index].category);
          setCategories(selected);
          let i = 0;
          let j = 0;
          let fullQ = [];
          let fullA = [];
          for(i = 0; i < 5; i++) {
            let clues = [];
            let responses = [];
              let curQ = await fetch("/clues/random?category="+(selected[i]).toLowerCase()+"&limit=5");
              if (!curQ.ok) {
                throw new Error("Failed to fetch clue");
              }
              const hi = await curQ.json();
              console.log("hi", hi);
              const hiArray = hi.data;
              const hiSort = [...hiArray].sort((a, b) => a.value - b.value); // Ascending
              console.log(hiSort);
              for(j = 0; j < 5; j++) {
                if(hiSort[j] == undefined) {
                  console.log("restarting")
                  return fetchCategories();
                }
                const hii = hiSort[j].clue;
                const r = hiSort[j].response;
                clues.push(hii);
                responses.push(r);
              }
            fullQ.push(clues);
            fullA.push(responses);
          }
          console.log(fullQ);
          setQuestions(fullQ);
          setAnswers(fullA);
          setReady(true);
        }
      } catch (err) {
        console.error("Error fetching:", err);
        setError(err.message);
      }
    };

    fetchCategories();
  },  []);

  if (error) {
    return <div className="error">Error: {error}</div>;
  }


  const handleClueClick = (category, row, value, theQuestion, theAnswer) => {
    setShowQuestion(true);
    setQ(theQuestion);
    setA(theAnswer);
    setValue(value);
    setClueKey(`${category}-${value}`);
    addClickedClue(prev => new Set(prev.add(`${category}-${value}`)));
    console.log(`You selected: ${category}-${row} (${value})`);
  };

  const handleHover = (category, value) => {
    setSelectedClue(`Category: ${category}, Value: ${value}`);
  };

  const handleGoBack = () => {
    setShowQuestion(false); // Example logic to go back
  };

  const removeClickedClue = (parm) => {
    addClickedClue((prev) => {
      const newSet = new Set(prev); // Create a copy of the Set
      newSet.delete(parm);          // Remove the item
      return newSet;                // Return the new Set
    });
  };

  if (!showQuestion) {
    if(ready) {
    return (
      <div className="App-header">
        <h1>Jeopardy Game</h1>
        <h2>Score: {score}</h2>
        <div className="game-board-container">
          <GameBoard onClueClick={handleClueClick} onHover={handleHover} clickedClues={clickedClues} rc={randomCategories} questions = {questions} answers = {answers}/>
        </div>
        {selectedClue && <p>{selectedClue}</p>}
      </div>
    ); }
    else {
      return (
        <p>Loading...</p>
      );}
    
  } else {
    return (
      <div className="App-header">
        <h1>Jeopardy Game</h1>
        <h2>Score: {score}</h2>
        <div className="game-board-container">
          <Question

            clue={selectedClue}
            goBack={handleGoBack}
            theQuestion={q}
            clickedClues={clickedClues}
            theAnswer={a}
            score={score}
            questionValue={value}
            setScore={setScore}
            clueKey={clueKey}
            removeClickedClue={removeClickedClue} />
        </div>
      </div>

    );
  }

}

export default App;
