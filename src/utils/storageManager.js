class StorageManager {
    #wordleStorageKey = "wordle-session-id";
    #storage = localStorage;

    
    getWordleSessionId() {
        const sessionId = this.#storage.getItem(this.#wordleStorageKey);
        return sessionId;
    };

    saveWordleSessionId(sessionId) {
        this.#storage.setItem(this.#wordleStorageKey, sessionId);
    };
};



export default new StorageManager();