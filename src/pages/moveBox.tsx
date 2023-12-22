import { FC, useCallback, useEffect, useMemo, useState } from "react";

type Tuple9<T> = [T, T, T, T, T, T, T, T, T];

type Value = "o" | "x" | "none";

const winContidions: [number, number, number][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function useHistory<T>(init: T) {
  const [history, setHistory] = useState({
    values: [init],
    index: 0,
  });
  const value = useMemo(() => history.values[history.index], [history]);

  const go = useCallback(
    (index: number) => setHistory((h) => ({ ...h, index })),
    []
  );
  const back = useCallback(() => {
    setHistory((h) => ({ ...h, index: Math.max(h.index - 1, 0) }));
  }, []);
  const forward = useCallback(() => {
    setHistory((h) => ({
      ...h,
      index: Math.min(h.index + 1, h.values.length - 1),
    }));
  }, []);

  const set = useCallback((f: (v: T) => T) => {
    setHistory((h) => ({
      values: h.values.concat(f(h.values[h.index])),
      index: h.values.length,
    }));
  }, []);
  const reset = useCallback(() => {
    setHistory((h) => ({
      index: 0,
      values: h.values.slice(h.values.length - 1),
    }));
  }, []);

  return { value, go, back, forward, set, reset, history };
}

const getNextPlayer = (current: Value): Value => (current === "o" ? "x" : "o");

const isWin = (board: Tuple9<Value>) => {
  return !!winContidions.find((w) => {
    const s = (v: "o" | "x") =>
      board[w[0]] === v && board[w[1]] === v && board[w[2]] === v;
    return s("o") || s("x");
  });
};
const isHe = (board: Tuple9<Value>) => {
  return !isWin(board) && !board.find((x) => x === "none");
};

export const MoveableBox = () => {
  const board = useHistory<{ board: Tuple9<Value>; currentPlayer: Value }>({
    board: Array(9).fill("none") as Tuple9<Value>,
    currentPlayer: "none",
  });
  const winner = useMemo(
    () =>
      isWin(board.value.board)
        ? board.value.currentPlayer
        : isHe(board.value.board)
        ? "he"
        : "none",
    [board.value]
  );
  useEffect(() => {
    console.log("value", board.value);
    console.log("history", board.history);
  }, [board]);
  return (
    <div>
      <div>welcome to moveable Boxes</div>
      <button
        onClick={(e) => {
          board.back();
        }}
      >
        back
      </button>
      <button
        onClick={(e) => {
          board.forward();
        }}
      >
        forward
      </button>
      <button
        onClick={(e) => {
          board.reset();
        }}
      >
        reset
      </button>
      <Grid width={300} height={300} rows={3} columns={3}>
        {board.value.board.map((b, i) => (
          <Square
            key={i}
            state={b}
            onClickEvent={() => {
              board.set((v) => ({
                ...v,
                board: v.board.map((s, index) =>
                  index === i ? getNextPlayer(v.currentPlayer) : s
                ) as Tuple9<Value>,
                currentPlayer: getNextPlayer(v.currentPlayer),
              }));
            }}
          ></Square>
        ))}
      </Grid>
      {winner !== "none" ? (
        winner === "he" ? (
          <>good game!he!</>
        ) : (
          <>congratulations {winner}!</>
        )
      ) : (
        <></>
      )}
    </div>
  );
};

const Grid: React.FC<{
  width: number;
  height: number;
  rows: number;
  columns: number;
  children: any;
}> = ({ width, height, rows, columns, children }) => {
  const cellWidth = width / columns;
  const cellHeight = height / rows;

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gridTemplateRows: `repeat(${rows}, 1fr)`,
    width: `${width}px`,
    height: `${height}px`,
  };

  const cellStyle: React.CSSProperties = {
    width: `${cellWidth}px`,
    height: `${cellHeight}px`,
  };

  return (
    <div style={gridStyle}>
      {Array.from({ length: rows * columns }, (_, index) => (
        <div key={index} style={cellStyle}>
          {children && children[index]}
        </div>
      ))}
    </div>
  );
};

const Square: FC<{
  state: Value;
  onClickEvent: () => void;
}> = ({ state, onClickEvent }) => {
  return (
    <button
      onClick={(e) => {
        if (state === "none") {
          onClickEvent();
        }
      }}
    >
      {state === "o" ? "O" : state === "x" ? "X" : "N"}
    </button>
  );
};
