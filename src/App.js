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
    const fetchCategoriesAndClues = async () => {
      try {
        const response = await fetch('https://corsproxy.io/?https://jepp.app/api/category?random=true&limit=5');
        if (!response.ok) throw new Error("Failed to fetch categories");

        const data = await response.json();
        setCategories(data.map(item => item.name));

        const allQuestions = [];
        const allAnswers = [];

        for (const category of data) {
          const clueRes = await fetch(`https://corsproxy.io/?https://jepp.app/api/clue?random=true&category=${category.categoryId}&limit=5`);
          if (!clueRes.ok) throw new Error(`Failed to fetch clues for category ${category.name}`);

          const clues = await clueRes.json();
          if (clues.length < 5) {
            console.log(`Not enough clues for ${category.name}, retrying...`);
            return fetchCategoriesAndClues();
          }

          const sortedClues = clues.sort((a, b) => a.value - b.value);
          allQuestions.push(sortedClues.map(clue => clue.question));
          allAnswers.push(sortedClues.map(clue => clue.answer));
        }

        setQuestions(allQuestions);
        setAnswers(allAnswers);
        setReady(true);
        console.log(allQuestions);
        console.log(allAnswers)
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {}
    };

    fetchCategoriesAndClues();
  }, []); 

return (
  
  <div className="App">
    {error && <div className="error">Error HERE: {error}</div>}

    {!ready && !showQuestion && <div>Loading...</div>}

    {ready && !showQuestion && (
      <GameBoard
        onClueClick={(category, rowIndex, value, question, answer) => {
          setQ(question);
          setA(answer);
          setValue(value);
          setSelectedClue(category);
          setShowQuestion(true);
          const clueKey = `${category}-${value}`;
          addClickedClue(prev => new Set(prev).add(clueKey));
          setClueKey(clueKey);
        }}
        onHover={(category, value) => {}}
        clickedClues={clickedClues}
        rc={randomCategories}
        questions={questions}
        answers={answers}
        score={score}
      />
      
    )}

    {showQuestion && (
      <Question
        clue={selectedClue}
        goBack={() => setShowQuestion(false)}
        theQuestion={q}
        theAnswer={a}
        score={score}
        questionValue={value}
        setScore={setScore}
        clickedClues={clickedClues}
        clueKey={clueKey}
        removeClickedClue={(keyToRemove) => {
          addClickedClue(prev => {
            const newSet = new Set(prev);
            newSet.delete(keyToRemove);
            return newSet;
          });
        }}
      />
    )}

    
  </div>

);
}
export default App;