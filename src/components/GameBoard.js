// src/components/GameBoard.js
import React, { useState, useEffect } from "react";
import "./GameBoard.css";

const categories = ["History", "Science", "Literature", "Math", "Movies"];
const clues = [
    [200, 200, 200, 200, 200],
    [400, 400, 400, 400, 400],
    [600, 600, 600, 600, 600],
    [800, 800, 800, 800, 800],
    [1000, 1000, 1000, 1000, 1000]
];

const myQuestions = [
    // Row 1 (questions for $200)
    ["In what year did the Titanic sink?",
        "What is the chemical symbol for water?",
        "Who wrote '1984'?",
        "What is the sum of 7 and 9?",
        "Who directed the movie 'Jurassic Park'?"],

    // Row 2 (questions for $400)
    ["Who was the first emperor of China?",
        "What planet is known as the Red Planet?",
        "In which book would you find the character 'Frodo Baggins'?",
        "What is the square root of 64?",
        "Which movie won the Oscar for Best Picture in 1994?"],

    // Row 3 (questions for $600)
    ["Who wrote the Declaration of Independence?",
        "Who developed the theory of relativity?",
        "Who wrote 'Pride and Prejudice'?",
        "What is the formula for the area of a circle?",
        "Who starred as 'The Terminator' in the 1984 movie?"],

    // Row 4 (questions for $800)
    ["Which country hosted the 2016 Summer Olympics?",
        "What gas do plants absorb from the atmosphere during photosynthesis?",
        "What is the title of the first Harry Potter book?",
        "In geometry, how many sides does a hexagon have?",
        "What is the highest-grossing movie of all time?"],

    // Row 5 (questions for $1000)
    ["Who was the first woman to fly solo across the Atlantic?",
        "What element has the atomic number 1?",
        "Who wrote 'The Catcher in the Rye'?",
        "What is the value of Pi to two decimal places?",
        "Which actor played the character of Jack Dawson in Titanic?"]
];


const myAnswers = [
    // Row 1 (answers for $200)
    [
        "1912",
        "H2O",
        "George Orwell",
        "16",
        "Steven Spielberg"
    ],

    // Row 2 (answers for $400)
    [
        "Qin Shi Huang",
        "Mars",
        "The Lord of the Rings",
        "8",
        "Forrest Gump"
    ],

    // Row 3 (answers for $600)
    [
        "Thomas Jefferson",
        "Albert Einstein",
        "Jane Austen",
        "πr²",
        "Arnold Schwarzenegger"
    ],

    // Row 4 (answers for $800)
    [
        "Brazil",
        "Carbon dioxide",
        "Harry Potter and the Philosopher's Stone",
        "6",
        "Avatar"
    ],

    // Row 5 (answers for $1000)
    [
        "Amelia Earhart",
        "Hydrogen",
        "J.D. Salinger",
        "3.14",
        "Leonardo DiCaprio"
    ]
];

const GameBoard = ({ onClueClick, onHover, clickedClues, rc, questions, answers, score }) => {

    return (
        <div className="game-board">
            {/* categories */}
            <div className="categories">
                {rc.map((category, index) => (
                    <div key={index} className="category">
                        {category}
                    </div>
                ))}
            </div>

            {/* clues */}
            <div className="clues">
                {clues.map((row, rowIndex) =>
                    row.map((value, colIndex) => (
                        <div
                            key={`${rowIndex}-${colIndex}`}
                            className={clickedClues.has(`${rc[colIndex]}-${(rowIndex + 1) * 200}`) ? "clue clicked" : "clue"}
                            onClick={(e) => {
                                if (!clickedClues.has(`${rc[colIndex]}-${(rowIndex + 1) * 200}`)) {
                                    onClueClick(rc[colIndex], rowIndex, value, questions[rowIndex][colIndex], answers[rowIndex][colIndex]   );
                                }
                            }}
                            onMouseOver={() => {
                                if (!clickedClues.has(`${rc[colIndex]}-${(rowIndex + 1) * 200}`)) {
                                onHover(rc[colIndex], value)}
                                }
                            }
                        >
                            {value}
                        </div>
                    ))
                )}
            </div>

            {/* score */}
            <div className="score">
               <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', textAlign: 'center', marginTop: '1rem', marginBottom: '1rem' }}>
    Score: {score}
  </h1>
            </div>

        </div>
    );
};

export default GameBoard;
