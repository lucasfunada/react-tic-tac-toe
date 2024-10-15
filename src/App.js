import { useState } from "react";

function Square({ value, onSquareClick, winObj, squareIndex }) {
  if(winObj)
    for(let i of winObj.winLine)
      if (i === squareIndex)
        return (
          <button className="square square-win" onClick={onSquareClick}>
            {value}
          </button>
        );

  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {

  function handleClick(i) {
    if (squares[i] || calculateWinner(squares))
      return;
    const nextSquares = squares.slice();
    if (xIsNext) 
      nextSquares[i] = "X";
    else
      nextSquares[i] = "O";
    const coordinates = checkCoordinates(i);
    onPlay(nextSquares, coordinates);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner)
    status = "Winner: " + winner.value;
  else if (checkDraw(squares))
    status = "Draw!";
  else
    status = "Next player: " + (xIsNext ? "X" : "O");


  const createSquares = [];
  createSquares.push(<div key={10000} className="status">{status}</div>);
  for(let i = 0; i < 3; i++) {
    createSquares.push(<div key={10001+i} className="board-row"></div>);
    for(let j = 0; j < 3; j++){
      createSquares.push(<Square key={j+i*3} value={squares[j+i*3]} onSquareClick={() => handleClick(j+i*3)} winObj = {winner} squareIndex={j+i*3} />)
    }
  }

  return createSquares;
}

export default function Game() {
  const [history, setHistory] = useState([{squares: Array(9).fill(null), coordinates: ""}]);
  const [currentMove, setCurrentMove] = useState(0);
  const [reverse, setReverse] = useState(false);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove].squares;

  function handlePlay(nextSquares, xy) {
    const nextHistory = [...history.slice(0, currentMove + 1), { squares: nextSquares, coordinates: xy }];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((history, move) => {
    let description;
    if (move > 0) {
      description = `Go to move #${move} (${history.coordinates})`;
    }
    else {
      description = "Go to game start";
    }

    return (
        <li key={move}>
          {
            (currentMove === move) ? `You are at move #${move}` :
            <button onClick={() => jumpTo(move)}>{description}</button>
          }
        </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>
          {
            (reverse) ? moves.toReversed() : moves
          }
        </ol>
      </div>
      <div>
        <button onClick={() => setReverse(!reverse)}>Reverse</button>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let line of lines) {
    const [a, b, c] = line;
    if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      const obj = {
        value: squares[a],
        winLine: line
      };
      return obj;
    }
  }

  return null;
}

function checkDraw(squares) {
  for (let square of squares)
    if (!square)
      return 0;
  return 1;
}

function checkCoordinates(i) {
  if (i <= 2)
    return `1, ${i+1}`;
  else if (i <= 5)
    return `2, ${i-2}`;
  else
    return `3, ${i-5}`;
}