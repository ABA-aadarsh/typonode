// home screen
// basic - info , on keypress -> start test, ctrl combos -> settings or commands
// typing test screen

// NOTE: here update methods are to update the view buffer as well, render methods makes the updated buffer visible on screen
import ANSI_CODES from "../../utils/ansiCodes";
import { getBuffer } from "../../utils/Block";
import { BufferHandler } from "../../utils/bufferHandler";
import chalky from "../../utils/Chalky";
import { terminalDimension, writeOnScreen } from "../../utils/io";
import { newTest } from "../../utils/testGenerate";
import { BaseScreen } from "./Base";
export class MainScreen extends BaseScreen {
    private testText: string[];
    private testParams: any = null
    private wpm : number;
    private correctWordsCount : number = 0;
    private correctCharCount: number = 0;
    private startTime : number | null = null
    private cpm : number;
    running: boolean // indicates whether the speed test has started or not
    private userTypedWords: string[] // words users typed (no fromatting)
    private formattedUserWords: {formattedWord: string, letterCount: number}[] // formatted user typed words  shown in the screen
    private currentWordIndex: number
    private currentWord: string
    constructor() {
        super({ refreshStyle: "interval", fps: 30 , dimension: {width: terminalDimension.width, height: terminalDimension.height}})
        this.testText = this.generateTest();
        this.running = false; // TODO: the changing of this.running mechanism implementation
        this.userTypedWords = []
        this.currentWordIndex = 0
        this.wpm = 0
        this.cpm = 0
        this.currentWord = ""
        this.formattedUserWords = []
    }

    public start() {
        this.correctCharCount = 0
        this.correctWordsCount = 0
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
        if (k == '\t' || k == '\b' || k == '\r' || k == ' ') {
            if (this.currentWord == "") return;
            else if(k=='\b'){
                this.currentWord = this.currentWord.slice(0, this.currentWord.length-1)
            }
            else {
                if(this.currentWordIndex > this.testText.length) return;
                this.userTypedWords.push(this.currentWord);
                this.formattedUserWords.push(
                    {...this.formatWord(this.currentWord, this.testText[this.currentWordIndex], true)}
                )
                if(this.currentWord == this.testText[this.currentWordIndex]){
                    this.correctWordsCount += 1
                }
                this.currentWord = ""
                this.currentWordIndex += 1
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
            this.currentWord += k;
        }
    }

    private formatWord(userWord: string, testWord: string, completed: boolean = true): 
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
                (completed ? ANSI_CODES.red : ANSI_CODES.dim)
                // if the word is completed (before currentword) then mark its incompleteness with red else with grey
            ])
        } else if (userWord.length > testWord.length) {
            formattedWord += chalky.style(userWord.slice(i), [ANSI_CODES.yellow])
        }
        return {
            formattedWord: formattedWord,
            letterCount,
            ansiCodeLength: formattedWord.length - letterCount
        }
    }

    public refresh() {
        this.testText = this.generateTest();
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
                    , this.testText[i], false
                )
                formattedWord = formatResult.formattedWord
                letterCount = formatResult.letterCount
            }

            if(charCount + letterCount > maxCharLimit){
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
        return lines
    }

    private getWPM (){
        if(this.running && this.startTime){
            return Math.round((this.correctWordsCount * 60)/((new Date().getTime() - this.startTime)/1000))
        }
        return null
    }

    private updateTitle (){
        const t: number | null = (this.startTime ? Math.round((new Date().getTime() - this.startTime)/1000): null)
        const wpm =  "WPM: " +this.getWPM()
        const title = 
        `${this.running ? wpm + "  (" + t + ")": "    "}        TypoTest`
        this.bh.updateLine(
            0,
            title
        )
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
    public update(): void {
        
        this.updateTitle();
        this.updateTestSection();
        this.updateCurrentWordSection();
    }
}