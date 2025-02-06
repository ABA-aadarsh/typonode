// home screen
// basic - info , on keypress -> start test, ctrl combos -> settings or commands
// typing test screen

// NOTE: here update methods are to update the view buffer as well, render methods makes the updated buffer visible on screen
import ANSI_CODES from "../../utils/ansiCodes";
import chalky from "../../utils/Chalky";
import EventBus from "../../utils/eventBus";
import { getTimeFormatFromMilliseconds } from "../../utils/helperFunctions";
import { _keys, terminalDimension, writeOnScreen } from "../../utils/io";
import { newTest, testParamsConstraints, testParamsType } from "../../utils/typingtestgeneration";
import { BaseScreen } from "./Base";
export class MainScreen extends BaseScreen {
    private testText: string[];
    private testParams: testParamsType
    private correctWordsCount : number = 0;
    private errorWordsCount: number = 0
    
    private correctCharCount: number = 0;
    private errorCharCount: number = 0
    private skippedCharCount: number = 0

    private startTime : number | null = null
    private timeRemaining: number | null = null // ms
    running: boolean // indicates whether the speed test has started or not
    private userTypedWords: string[] // words users typed (no fromatting)
    private formattedUserWords: {formattedWord: string, letterCount: number}[] // formatted user typed words  shown in the screen

    private currentWordIndex: number
    private currentCharIndex: number
    //  currentCharIndex is always equal to currentWord.length, it is to point the next char to be typed in testText[currentWordIndex] if it is not beyond the limit
    private currentWord: string
    constructor(
        {eventHandler}: {
            eventHandler: EventBus
        }
    ) {
        super({eventHandler: eventHandler})
        this.running = false; // TODO: the changing of this.running mechanism implementation
        this.userTypedWords = []
        this.currentWordIndex = 0
        this.currentCharIndex = 0
        this.currentWord = ""
        this.formattedUserWords = []
        // default value 
        this.testParams = {
            timeLimit: testParamsConstraints.timeLimit.default,
            allowPunctuation: testParamsConstraints.allowPunctuation.default,
            allowUppercase: testParamsConstraints.allowPunctuation.default,
            type: testParamsConstraints.type.default
        }        
        this.testText = this.generateTest();
        this.eventHandler.on(
            "settingsUpdated", (data: testParamsType)=>{
                this.testParams = {...data}
                // create new test
                this.refresh();
            }
        )
    }

    private resetVariables (){
        // reset the variables to their default value
        this.running = false
        this.correctCharCount = 0
        this.currentCharIndex = 0
        this.skippedCharCount = 0
        this.errorCharCount = 0
        this.correctWordsCount = 0
        this.errorWordsCount = 0
        this.currentWord = ""
        this.currentWordIndex = 0
        this.userTypedWords = []
        this.formattedUserWords = []
        this.timeRemaining = null
        this.partialFrameBuffer = 0
    }

    public start() {
        this.resetVariables()
        this.startTime = new Date().getTime()
        this.timeRemaining = this.testParams?.timeLimit || testParamsConstraints.timeLimit.default
        this.running = true
    }

    public stop() {
        this.running = false
    }

    private generateTest() {
        // fetch settings from settings screen
        return newTest(this.testParams)
    }
    public keyHandle(k: string): void {
        // commands handle
        switch(k){
            case _keys.ctrl_r: 
                this.refresh();
                return;
            default: 
                break;
        }

        // normal char handle
        if(this.currentWordIndex >= this.testText.length){
            return
        }
        if (k == _keys.tab || (k == _keys.backspace || k==_keys.backspaceLinux) || k == _keys.enter || k == _keys.space) {
            if (this.currentWord == "") return;
            else if(k==_keys.backspace || k==_keys.backspaceLinux){
                const lastChar = this.currentWord[this.currentCharIndex - 1]
                if(this.currentCharIndex >= this.testText[this.currentWordIndex].length){
                    this.errorCharCount -= 1
                }else{
                    if(lastChar == this.testText[this.currentWordIndex][this.currentCharIndex - 1]) this.correctCharCount -= 1
                    else this.errorCharCount -= 1
                }
                this.currentWord = this.currentWord.slice(0, this.currentWord.length-1)
                this.currentCharIndex -= 1
            }
            else {
                if(this.currentWordIndex > this.testText.length) return; // TODO: more test words as the user goes to the end of selected words limit ?

                this.userTypedWords.push(this.currentWord);
                this.formattedUserWords.push(
                    {...this.formatWord(this.currentWord, this.testText[this.currentWordIndex], true)}
                )
                if(this.currentWord == this.testText[this.currentWordIndex]){
                    this.correctWordsCount += 1
                }else{
                    this.skippedCharCount += Math.max(0, this.testText[this.currentWordIndex].length - this.currentWord.length)
                    this.errorWordsCount += 1
                }
                this.currentWord = ""
                this.currentWordIndex += 1
                this.currentCharIndex = 0
                return;
            }
        }
        const code = k.charCodeAt(0)
        if ((code > 47 && code < 58) || // numeric (0-9)
            (code > 64 && code < 91) || // upper alpha (A-Z)
            (code > 96 && code < 123) || // lower alpha (a-z)
            (code > 32 && code < 48 ) // special characters
        ) {
            if(this.running==false) this.start();
            if(this.currentCharIndex < this.testText[this.currentWordIndex].length){
                if(this.testText[this.currentWordIndex][this.currentCharIndex]==k) this.correctCharCount += 1
                else this.errorCharCount += 1
            }else this.errorCharCount += 1
            this.currentWord += k;
            this.currentCharIndex += 1
        }
    }

    private formatWord(userWord: string, testWord: string, completed: boolean = true, isCurrent: boolean = false): 
        {
            formattedWord: string,
            letterCount: number,
            ansiCodeLength: number
        }
    {
        let formattedWord: string = ""
        let uChar, tChar;
        let letterCount: number = Math.max(userWord.length, testWord.length);
        let i;
        for (i = 0; (i < userWord.length && i < testWord.length); i++) {
            uChar = userWord[i];
            tChar = testWord[i];
            if (uChar == tChar) formattedWord += chalky.green(uChar);
            else formattedWord += chalky.red(tChar);
        }
        if (testWord.length > userWord.length) {
            const remainingChars = testWord.slice(i)
            formattedWord += (completed)? chalky.yellow(remainingChars): chalky.dim(remainingChars)
        } else if (userWord.length > testWord.length) {
            formattedWord += chalky.red.underline(userWord.slice(i))
        }

        if(isCurrent){
            formattedWord = "[" + formattedWord + "]" 
        }
        return {
            formattedWord: formattedWord,
            letterCount,
            ansiCodeLength: formattedWord.length - letterCount
        }
    }

    public refresh() {
        this.resetVariables()
        this.testText = this.generateTest()
    }
    public updateTestSettings() {
        //TODO: modify the time, words format etc
    }

    private getFormattedDisplayTest(): string[] {
        // ansicoded text for the test
        const lines: string[] = []
        let currentLine: string = " "
        let charCount : number = 0
        let paddingX : number = 2
        const maxCharLimit : number = this.bh.width
        for (let i = 0; i < this.testText.length; i++) {
            let formattedWord: string, letterCount: number
            if(i<this.currentWordIndex){
                formattedWord = this.formattedUserWords[i].formattedWord
                letterCount = this.formattedUserWords[i].letterCount
            }else{
                const formatResult = this.formatWord(
                    (i==this.currentWordIndex) ? this.currentWord : ""
                    , this.testText[i], false,
                    i == this.currentWordIndex
                )
                formattedWord = formatResult.formattedWord
                letterCount = formatResult.letterCount
            }

            if(charCount + letterCount + 2 + paddingX > maxCharLimit){ // 2 to account for possibility of having [] on currentWord
                // in new line
                lines.push(currentLine)
                currentLine = " " + formattedWord + " "
                charCount = letterCount + 2
            }else{
                // same line
                currentLine += formattedWord + " "
                charCount += letterCount + 1
            }
        }
        if(currentLine!=""){
            lines.push(currentLine)
        }
        return lines
    }
    private showTestResult(){
        if(this.currentWord!="" && this.currentWordIndex<this.testText.length){
            this.userTypedWords.push(this.currentWord)
            const formattedWord = this.formatWord(this.currentWord, this.testText[this.currentWordIndex], true)
            this.formattedUserWords.push(formattedWord)
            if(this.currentWord == this.testText[this.currentWordIndex]) this.correctWordsCount++
            else{
                this.skippedCharCount += Math.max(0, this.testText[this.currentWordIndex].length - this.currentWord.length)
                this.errorWordsCount += 1
            }
        }
        const resultData : {wpm: number, cpm: number,
            charactersInfo: {
                correct: number,
                error: number,
                skipped: number
            },
            wordsInfo: {
                correct: number,
                error: number
            },
            formattedWords: {formattedWord: string, letterCount: number}[],
            timeLimit: number
        } ={
            wpm: this.getWPM(),
            cpm: this.getCPM(),
            charactersInfo: {
                correct: this.correctCharCount,
                error: this.errorCharCount,
                skipped: this.skippedCharCount
            },
            wordsInfo: {
                correct: this.correctWordsCount,
                error: this.errorWordsCount
            },
            timeLimit: this.testParams.timeLimit,
            formattedWords: this.formattedUserWords
        }
        this.eventHandler.emit("displayResult", resultData)
        this.stop();
    }

    private getWPM ():number{
        if(this.running && this.startTime){
            return Math.round((this.correctCharCount * 60/5)/((new Date().getTime() - this.startTime)/1000))
            //  cant use correctwords for wpm since not all words are born equal. average english word is of 5 charaacters
        }
        return -1
    }
    private getCPM (): number{
        if(this.running && this.startTime){
            return Math.round((this.correctCharCount * 60 )/ ((new Date().getTime()- this.startTime)/1000))
        }
        return -1
    }
    private updateInfoSection (){
        if(!this.running || !this.startTime){
            this.bh.updateLine(2, chalky.yellow.italic(" Start Typing..."), true)
        }else{
            const info = ` ${this.getWPM()} wpm (${chalky.green(this.correctWordsCount)}/${chalky.red(this.errorWordsCount)})     ${this.getCPM()} cpm (${chalky.green(this.correctCharCount)}/${chalky.red(this.errorCharCount)}/${chalky.yellow(this.skippedCharCount)})`
            this.bh.updateLine(
                2,info,true
            )
        }
    }
    private updateTestSection (){
        const ansiFormattedLines = this.getFormattedDisplayTest()
        const maxHeight: number = 5
        const startY: number = 4
        let i : number = 0
        for(i; i<ansiFormattedLines.length && i<maxHeight; i++){
            this.bh.updateLine(
                startY + i, ansiFormattedLines[i], true
            )
        }
        for(i; i<maxHeight; i++){
            this.bh.clearLine(startY + i)
        }
    }
    private updateCurrentWordSection (){
        this.bh.clearLine(this.bh.height - 5)
        this.bh.updateLine(
            this.bh.height -5, ` ${chalky.bgWhite(" ")} : ${this.currentWord}`, true
        )
    }
    private updateTimeRemaining(){
        if(this.running && this.startTime){
            this.timeRemaining = (this.testParams.timeLimit*1000 - (new Date().getTime()- this.startTime)) 
            let t = getTimeFormatFromMilliseconds(this.timeRemaining || 0)
            const timeInfo = `Time Remaining: ${chalky.yellow(t + "s")} `
            this.bh.updateBlock(this.bh.width -  chalky.parseAnsi(timeInfo).normalTextLength, 2, -1, timeInfo)
        }
    }
    private updateBottomPanel(){
        this.bh.updateLine(
            this.bh.height - 2, 
            `${chalky.bgYellow(" ctrl + c: exit ")}     ${chalky.black.bgWhite(" ctrl + s: settings ")}      ${chalky.bgCyan(" ctrl + r: restart ")}  `,
            true
        )
        this.bh.updateLine(
            this.bh.height - 1,
            "Highest WPM Record: 50"
        )
    }
    public update(): void {
        if(this.partialFrameBuffer==0){
            this.updateFPS()
            this.updateInfoSection();
        }
        this.updateTimeRemaining();
        if(this.running && this.timeRemaining && this.timeRemaining<=0){
            this.showTestResult();
            return;
        }
        this.updateTestSection();
        this.updateCurrentWordSection();
        this.updateBottomPanel();
        this.incrementPartialFrameBuffer()
    }
}