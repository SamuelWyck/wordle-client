function colorWordleKeyboardKeys(wordScores) {
    const seenLetters = {};
    const keyClasses = ["wrong", "right-letter", "correct"];
    for (let wordScore of wordScores) {
        for (let key in wordScore) {
            const {char, charScore} = wordScore[key];
            if (char in seenLetters && charScore <= seenLetters[char]) {
                continue;
            }
            const keyboardKey = document.querySelector(`.w-keyboard-key[data-key="${char}"]`);
            const keyClass = keyClasses[charScore];
            keyboardKey.classList.add(keyClass);
            seenLetters[char] = charScore;
        }
    }
};



export default colorWordleKeyboardKeys;