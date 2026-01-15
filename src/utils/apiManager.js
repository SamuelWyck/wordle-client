import storageManager from "./storageManager";



class ApiManager {
    #apiDomain = "https://wordle-api-n3g1.onrender.com";
    #storage = storageManager;
    #wordleSessionHeader = "wordle-session-id";


    async #makeApiCall(url, options) {
        try {
            const res = await fetch(url, options);

            const wordleSessionId = res.headers.get("set-wordle-session-id");
            if (wordleSessionId) {
                this.#storage.saveWordleSessionId(wordleSessionId);
            }

            const jsonRes = await res.json();
            return jsonRes;
        } catch (error) {
            console.log(error);
            return {errors: [{msg: "Unable to connect to server"}]};
        }
    };

    async getWordleGuesses() {
        const url = `${this.#apiDomain}/wordle/guesses`;

        const headers = {};
        const [wordleKey, wordleVal] = this.#getWordleHeader();
        if (wordleKey !== null) {
            headers[wordleKey] = wordleVal;
        }

        const options = {
            method: "GET",
            headers: headers,
            mode: "cors"
        };

        const response = await this.#makeApiCall(url, options);
        return response;
    };

    #getWordleHeader() {
        const sessionId = this.#storage.getWordleSessionId();
        let headerKey = this.#wordleSessionHeader;
        if (sessionId === null) {
            headerKey = null;
        }
        return [headerKey, sessionId];
    };

    async makeWordleGuess(word) {
        const url = `${this.#apiDomain}/wordle/guess/${word}`;

        const headers = {};
        const [wordleKey, wordleVal] = this.#getWordleHeader();
        if (wordleKey !== null) {
            headers[wordleKey] = wordleVal;
        }

        const options = {
            mode: "cors",
            method: "GET",
            headers: headers
        };

        const response = await this.#makeApiCall(url, options);
        return response;
    };

    async getWordOfTheDay() {
        const url = `${this.#apiDomain}/wordle/todays-word`;

        const headers = {};
        const [wordleKey, wordleVal] = this.#getWordleHeader();
        if (wordleKey !== null) {
            headers[wordleKey] = wordleVal;
        }

        const options = {
            mode: "cors",
            method: "GET",
            headers: headers
        };

        const res = await this.#makeApiCall(url, options);
        return res;
    };
};



export default new ApiManager();