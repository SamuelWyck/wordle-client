import storageManager from "./storageManager";



class ApiManager {
    #apiDomain = "http://localhost:3000";
    #storage = storageManager;
    #wordleSessionHeader = "wordle-session-id";


    async #makeApiCall(url, options) {
        try {
            const res = await fetch(url, options);
            const jsonRes = await res.json();
            return jsonRes;
        } catch {
            return {errors: [{msg: "Unable to connect to server"}]};
        }
    };

    async getWordleGuesses() {
        const url = `${this.#apiDomain}/wordle/guesses`;

        const options = {
            method: "GET",
            headers: this.#getWordleHeaders()
        };

        const response = await this.#makeApiCall(url, options);
        console.log(response);
        return response;
    };

    #getWordleHeaders() {
        const headers = {};
        const sessionId = this.#storage.getWordleSessionId();
        if (sessionId !== null) {
            headers[this.#wordleSessionHeader] = sessionId;
        }
        return headers;
    };
};



export default new ApiManager();