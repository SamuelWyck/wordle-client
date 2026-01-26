class StorageManager {
    #wordleStorageKey = "wordle-session-id";
    #colorModeKey = "braingames-color-mode";
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
};



export default new StorageManager();