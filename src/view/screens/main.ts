// home screen
// basic - info , on keypress -> start test, ctrl combos -> settings or commands
// typing test screen
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
    running: boolean // indicates whether the speed test has started or not
    private userTypedWords: string[] // words users typed (no fromatting)
    private formattedUserWords: string[] // formatted user typed words  shown in the screen
    private currentWordIndex: number
    private currentWord: string
    constructor() {
        super({ refreshStyle: "interval", fps: 30 , dimension: {width: terminalDimension.width, height: terminalDimension.height}})
        this.testText = this.generateTest();
        this.running = false;
        this.userTypedWords = []
        this.currentWordIndex = 0
        this.currentWord = ""
        this.formattedUserWords = []
    }

    public start() {
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
                this.userTypedWords.push(this.currentWord);
                this.currentWord = ""
                this.currentWordIndex += 1
                return;
            }
        }
        const code = k.charCodeAt(0)
        if ((code > 47 && code < 58) || // numeric (0-9)
            (code > 64 && code < 91) || // upper alpha (A-Z)
            (code > 96 && code < 123)) { // lower alpha (a-z)
            this.currentWord += k;
        }
    }

    private formatWord(userWord: string, testWord: string, completed: boolean = true): string {
        let formattedWord: string = ""
        let uChar, tChar;
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
        return formattedWord
    }

    public refresh() {
        this.testText = this.generateTest();
    }
    public updateTestSettings() {
        //TODO: modify the time, words format etc
    }

    private getFormattedDisplayTest(): string {
        // ansicoded text for the test
        const result: string[] = []
        let uWord, tWord;
        for (let i = 0; i < this.testText.length; i++) {
            tWord = this.testText[i]
            if (i < this.currentWordIndex) uWord = this.userTypedWords[i];
            else if (i == this.currentWordIndex) uWord = this.currentWord;
            else uWord = "";
            result.push(this.formatWord(
                uWord,
                tWord,
                (i < this.currentWordIndex)
            ))
        }
        return result.join(" ")
    }

    private updateTitle (){
        this.bh.updateLine(
            0,
            "Main screen title"
        )
    }
    public update(): void {
        this.updateTitle();
    }
}