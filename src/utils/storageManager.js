class StorageManager {
    #wordleStorageKey = "wordle-session-id";
    #colorModeKey = "braingames-color-mode";
    #sudokuStorageKey = "sudoku-game";
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
        let gameInfo = this.#storage.getItem(this.#sudokuStorageKey);
        gameInfo = JSON.parse(gameInfo);
        return gameInfo;
    };

    saveSudokuGame(gameInfo) {
        gameInfo = JSON.stringify(gameInfo);
        this.#storage.setItem(this.#sudokuStorageKey, gameInfo);
    };
};



export default new StorageManager();