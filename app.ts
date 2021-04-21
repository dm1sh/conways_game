type BoardT<T = boolean> = T[][];
type InitBoardReturnT = [HTMLTableElement, BoardT];

const isAlive = <T>(val: T) => {
  if (typeof val === "string") return val === "alive";

  if (typeof val === "boolean") return val ? "alive" : "dead";
};

const createBoard = (root: HTMLElement, size = 16): InitBoardReturnT => {
  const boardHTML = document.createElement("table");
  const board: boolean[][] = [];

  for (let i = 0; i < size; i++) {
    const boardRowHTML = document.createElement("tr");

    board.push([]);

    for (let j = 0; j < size; j++) {
      const boardCellHTML = document.createElement("td");

      board[i].push(false);
      boardCellHTML.className = "dead";

      boardRowHTML.appendChild(boardCellHTML);
    }

    boardHTML.appendChild(boardRowHTML);
  }

  root.appendChild(boardHTML);

  return [boardHTML, board];
};

type BoardOperationsT = {
  setStatus: (x: number, y: number, val: boolean) => void;
  syncStatus: () => void;
  getSize: () => number;
};

const createOperators = (
  boardHTML: HTMLTableElement,
  board: BoardT
): BoardOperationsT => ({
  setStatus: (x, y, val) => {
    board[y][x] = val;

    const boardRowHTML = boardHTML.children.item(y);
    if (boardRowHTML) {
      const cellHTML = boardRowHTML.children.item(x);
      if (cellHTML) {
        cellHTML.className = isAlive(val) as string;
      }
    }
  },
  syncStatus: () => {
    for (let y = 0; y < board.length; y++) {
      const boardRowHTML = boardHTML.children.item(y);

      if (boardRowHTML)
        for (let x = 0; x < board.length; x++) {
          const boardCellHTML = boardRowHTML.children.item(x);

          if (boardCellHTML)
            board[y][x] = isAlive(boardCellHTML.className) as boolean;
        }
    }
  },
  getSize: () => board.length,
});

function* randomBit(amount: number) {
  const bytes = new Uint8Array(amount);
  const QUOTA = 65536;

  for (let i = 0; i < amount; i += QUOTA) {
    crypto.getRandomValues(bytes.subarray(i, i + Math.min(amount - i, QUOTA)));
  }

  let n = 0;

  while (true) {
    if (n >= amount) return false;

    const byteN = Math.floor(n / 8);
    const bitPos = n % 8;

    yield Boolean((bytes[byteN] >> bitPos) & 1);

    n++;
  }
}

const initBoard = (op: BoardOperationsT) => {
  const size = op.getSize();
  const getRandomBit = randomBit(size * size);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const val = getRandomBit.next().value;
      op.setStatus(x, y, val);
    }
  }
};

const countNeighbours = (x: number, y: number, board: BoardT) => {
  let k = 0;

  if (y > 0) {
    if (board[y - 1][x]) k++;
    if (x < board.length && board[y - 1][x + 1]) k++;
    if (x > 0 && board[y - 1][x - 1]) k++;
  }

  if (y < board.length - 1) {
    if (board[y + 1][x]) k++;
    if (x < board.length && board[y + 1][x + 1]) k++;
    if (x > 0 && board[y + 1][x - 1]) k++;
  }

  if (x > 0 && board[y][x - 1]) k++;
  if (x < board.length && board[y][x + 1]) k++;

  return k;
};

const doStep = (op: BoardOperationsT, board: BoardT) => {
  const size = op.getSize();

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const nb = countNeighbours(x, y, board);
      if (board[y][x] && (nb < 2 || nb > 3)) op.setStatus(x, y, false);
      else if (!board[y][x] && nb === 3) op.setStatus(x, y, true);
    }
  }
};

export const initGame = (size: number) => {
  const root = document.getElementById("board");

  if (!root) {
    console.error("Can not find root element");
  } else {
    root.innerHTML = "";

    const [boardHTML, board] = createBoard(root, size);

    const op = createOperators(boardHTML, board);

    initBoard(op);

    for (let t = 750; t < 100000; t += 750)
      setTimeout(() => doStep(op, board), t);
  }
};

const runButton = document.getElementById("run");

if (runButton) {
  runButton.onclick = (e) => {
    e.preventDefault();

    const sizeInput = document.getElementById("size");

    if (sizeInput) {
      const { value } = sizeInput as HTMLInputElement;

      const size = value ? parseInt(value) : 16;

      initGame(size);
    }
  };
}
