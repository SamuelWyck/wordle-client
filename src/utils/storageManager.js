class StorageManager {
    #wordleStorageKey = "wordle-session-id";
    #colorModeKey = "braingames-color-mode";
    #sudokuGameKey = "sudoku-game";
    #sudokuStartBoardKey = "sudoku-starting";
    #sudouCompleteBoardKey = "sudoku-complete";
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
};



export default new StorageManager();