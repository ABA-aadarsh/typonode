// home screen
// basic - info , on keypress -> start test, ctrl combos -> settings or commands
// typing test screen

// NOTE: here update methods are to update the view buffer as well, render methods makes the updated buffer visible on screen
import ANSI_CODES from "../../utils/ansiCodes";
import chalky from "../../utils/Chalky";
import { terminalDimension, writeOnScreen } from "../../utils/io";
import { newTest } from "../../utils/testGenerate";
import { BaseScreen } from "./Base";
export class MainScreen extends BaseScreen {
    private testText: string[];
    private testParams: any = null

    private correctWordsCount : number = 0;
    private errorWordsCount: number = 0
    
    private correctCharCount: number = 0;
    private errorCharCount: number = 0
    private skippedCharCount: number = 0

    private startTime : number | null = null
    running: boolean // indicates whether the speed test has started or not
    private userTypedWords: string[] // words users typed (no fromatting)
    private formattedUserWords: {formattedWord: string, letterCount: number}[] // formatted user typed words  shown in the screen

    private currentWordIndex: number
    private currentCharIndex: number
    //  currentCharIndex is always equal to currentWord.length, it is to point the next char to be typed in testText[currentWordIndex] if it is not beyond the limit
    private currentWord: string


    private commands = {
        "restart": "\x12"
    }
    constructor() {
        super({ refreshStyle: "interval", fps: 30 , dimension: {width: terminalDimension.width, height: terminalDimension.height}})
        this.testText = this.generateTest();
        this.running = false; // TODO: the changing of this.running mechanism implementation
        this.userTypedWords = []
        this.currentWordIndex = 0
        this.currentCharIndex = 0
        this.currentWord = ""
        this.formattedUserWords = []
    }

    private resetVariables (){
        // reset the variables to their default value
        this.running = false
        this.correctCharCount = 0
        this.skippedCharCount = 0
        this.errorCharCount = 0
        this.correctWordsCount = 0
        this.errorWordsCount = 0
        this.currentWord = ""
        this.currentWordIndex = 0
        this.userTypedWords = []
        this.formattedUserWords = []
    }

    public start() {
        this.resetVariables()
        this.startTime = new Date().getTime()
        this.running = true
    }

    public stop() {
        this.running = false
    }

    private generateTest() {
        return newTest(null)
    }
    public keyHandle(k: string): void {
        // commands handle
        switch(k){
            case this.commands.restart: 
                this.refresh();
                return;
            default: 
                break;
        }

        // normal char handle
        if(this.currentWordIndex >= this.testText.length){
            this.refresh()
            return
        }
        if (k == '\t' || k == '\b' || k == '\r' || k == ' ') {
            if (this.currentWord == "") return;
            else if(k=='\b'){
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
            if (uChar == tChar) formattedWord += chalky.style(uChar, [ANSI_CODES.green]);
            else formattedWord += chalky.style(tChar, [ANSI_CODES.red]);
        }
        if (testWord.length > userWord.length) {
            formattedWord += chalky.style(testWord.slice(i), [
                (completed ? ANSI_CODES.yellow : ANSI_CODES.dim)
                // if the word is completed (before currentword) then mark its incompleteness with red else with grey
            ])
        } else if (userWord.length > testWord.length) {
            formattedWord += chalky.style(userWord.slice(i), [ANSI_CODES.red, ANSI_CODES.underline])
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
        let currentLine: string = ""
        let charCount : number = 0
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

            if(charCount + letterCount + 2 > maxCharLimit){ // 2 to account for possibility of having [] on currentWord
                // in new line
                lines.push(currentLine)
                currentLine = formattedWord + " "
                charCount = letterCount + 1
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
    private updateTitle (){
        this.bh.updateBlock(Math.floor(this.bh.width/2) - 4, 0, -1,
            "[" + chalky.style("T",[ANSI_CODES.green]) + chalky.style("yp", [ANSI_CODES.red, ANSI_CODES.underline]) + chalky.style("oTest", [ANSI_CODES.green]) + "]"
        )
        if(!this.running || !this.startTime){
            // this.bh.updateBlock(0,2, -1, chalky.style("Start Typing ....", [ANSI_CODES.yellow]))
            this.bh.updateLine(2, chalky.style("Start Typing...", [ANSI_CODES.yellow, ANSI_CODES.italic]))
        }else{
            const leftPart = `${this.getWPM()} wpm (${chalky.style(this.correctWordsCount,[ANSI_CODES.green])}/${chalky.style(this.errorWordsCount,[ANSI_CODES.red])})     ${this.getCPM()} cpm (${chalky.style(this.correctCharCount,[ANSI_CODES.green])}/${chalky.style(this.errorCharCount,[ANSI_CODES.red])}/${chalky.style(this.skippedCharCount, [ANSI_CODES.yellow])})`
            const rightPart = `Time Remaining: ${chalky.style(Math.max(0, Math.floor(60 - (new Date().getTime() - (this.startTime))/1000)) + "s", [ANSI_CODES.yellow])}`

            const gapping = this.bh.width - rightPart.length - chalky.parseAnsi(leftPart).normalTextLength
            this.bh.updateLine(
                2, 
                leftPart + " ".repeat(gapping) + rightPart,
                true
            )
        }
    }
    private updateTestSection (){
        const ansiFormattedLines = this.getFormattedDisplayTest()
        const startY: number = 5
        for(let i = 0; i<ansiFormattedLines.length; i++){
            this.bh.updateLine(
                startY + i, ansiFormattedLines[i], true
            )
        }
    }
    private updateCurrentWordSection (){
        this.bh.updateLine(
            15, ": " + this.currentWord, true
        )
    }
    private updateBottomPanel(){
        this.bh.updateLine(
            this.bh.height - 4, 
            `${chalky.style(" ctrl + c: exit ", [ANSI_CODES.bgYellow])}     ${chalky.style(" ctrl + s: settings ", [ANSI_CODES.bgWhite, ANSI_CODES.black])}      ${chalky.style(" ctrl + r: restart ", [ANSI_CODES.bgCyan])}  `,
            true
        )
        this.bh.updateLine(
            this.bh.height - 2,
            "Highest WPM Record: 50"
        )
    }
    public update(): void {
        this.updateTitle();
        this.updateTestSection();
        this.updateCurrentWordSection();
        this.updateBottomPanel();
    }
}