class StorageManager {
    #wordleStorageKey = "wordle-session-id";
    #colorModeKey = "braingames-color-mode";

    #sudokuGameKey = "sudoku-game";
    #sudokuStartBoardKey = "sudoku-starting";
    #sudouCompleteBoardKey = "sudoku-complete";

    #twentyFEBestScoreKey = "2048-highscore";
    #twentyFEScoreKey = "2048-score";
    #twentyFEGoalKey = "2048-goal";
    #twentyFEBoardKey = "2048-board";

    #storage = localStorage;

    
    getWordleSessionId() {
        const sessionId = this.#storage.getItem(this.#wordleStorageKey);
        return sessionId;
    };

    saveWordleSessionId(sessionId) {
        this.#storage.setItem(this.#wordleStorageKey, sessionId);
    };

    getColorModeSetting() {
        const colorMode = this.#storage.getItem(this.#colorModeKey);
        return colorMode;
    };

    saveColorModeSetting(mode) {
        this.#storage.setItem(this.#colorModeKey, mode);
    };

    getSudokuGame() {
        let game = this.#storage.getItem(this.#sudokuGameKey);
        if (game !== null) {
            game = JSON.parse(game);
        }
        return game;
    };

    saveSudokuGame(game) {
        game = JSON.stringify(game);
        this.#storage.setItem(this.#sudokuGameKey, game);
    };

    getSudokuStartBoard() {
        let startBoard = this.#storage.getItem(this.#sudokuStartBoardKey);
        if (startBoard !== null) {
            startBoard = JSON.parse(startBoard);
        }
        return startBoard;
    };

    saveSudokuStartBoard(startBoard) {
        startBoard = JSON.stringify(startBoard);
        this.#storage.setItem(this.#sudokuStartBoardKey, startBoard);
    };

    getSudokuCompletedBoard() {
        let completedBoard = this.#storage.getItem(this.#sudouCompleteBoardKey);
        if (completedBoard !== null) {
            completedBoard = JSON.parse(completedBoard);
        }
        return completedBoard;
    };

    saveSudokuCompletedBoard(completedBoard) {
        completedBoard = JSON.stringify(completedBoard);
        this.#storage.setItem(this.#sudouCompleteBoardKey, completedBoard);
    };

    get2048BestScore() {
        let score = this.#storage.getItem(this.#twentyFEBestScoreKey);
        if (score !== null) {
            score = Number(score);
        }
        return score;
    };

    save2048BestScore(score) {
        this.#storage.setItem(this.#twentyFEBestScoreKey, score);
    };

    get2048Goal() {
        let goal = this.#storage.getItem(this.#twentyFEGoalKey);
        if (goal !== null) {
            goal = Number(goal);
        }
        return goal;
    };

    save2048Goal(goal) {
        this.#storage.setItem(this.#twentyFEGoalKey, goal);
    };

    get2048Board() {
        let board = this.#storage.getItem(this.#twentyFEBoardKey);
        if (board !== null) {
            board = JSON.parse(board);
        }
        return board;
    };

    save2048Board(board) {
        board = JSON.stringify(board);
        this.#storage.setItem(this.#twentyFEBoardKey, board);
    };

    get2048Score() {
        let score = this.#storage.getItem(this.#twentyFEScoreKey);
        if (score !== null) {
            score = Number(score);
        }
        return score;
    };

    save2048Score(score) {
        this.#storage.setItem(this.#twentyFEScoreKey, score);
    };
};



export default new StorageManager();