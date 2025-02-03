import ANSI_CODES from "../../utils/ansiCodes";
import chalky from "../../utils/Chalky";
import EventBus from "../../utils/eventBus";
import { terminalDimension, writeOnScreen } from "../../utils/io";
import { BaseScreen } from "./Base";
export class ResultScreen extends BaseScreen{
    private resultData: {
        wpm: number,
        cpm: number,
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
    } | null = null;
    constructor(
        {eventHandler}: {
            eventHandler: EventBus
        }
    ){
        super({refreshStyle: "on-demand", fps: 10, dimension: {width: terminalDimension.width,  height: terminalDimension.height}, eventHandler: eventHandler})
    }

    keyHandle(k: string): void {
        
    }
    setResultData(
        data: typeof this.resultData
    ){
        this.resultData = data
    }
    updateTitle(){
        const title = "TypoTest - Result"
        this.bh.updateBlock(
            Math.floor(this.bh.width/2 - title.length/2),0,-1,
            title
        )
    }
    updateResultSection(){
        if(this.resultData!=null)
        {
            const wordInfo = this.resultData.wordsInfo
            const charInfo = this.resultData.charactersInfo
            let accuray = 0
            if(charInfo.correct+charInfo.skipped+charInfo.error!=0){
                accuray=Math.floor(
                    (charInfo.correct)
                    /(charInfo.correct+charInfo.skipped+charInfo.error) * 100
                ) 
            }
            this.bh.updateLine(
                3, 
                `WPM: ${this.resultData.wpm}`
            )
            this.bh.updateLine(
                4,
                `Accuracy: ${
                    accuray
                }%`
            )
            this.bh.updateLine(
                5,
                "Details:"
            )
            this.bh.updateLine(
                6, `Words: (${chalky.style(wordInfo.correct,[ANSI_CODES.green])} / ${
                    chalky.style(wordInfo.error,[ANSI_CODES.red])
                })`
            )
            this.bh.updateLine(
                7,
                `Characters: (${chalky.style(charInfo.correct,[ANSI_CODES.green])} / ${
                    chalky.style(charInfo.error,[ANSI_CODES.red])
                } / ${chalky.style(charInfo.skipped,[ANSI_CODES.yellow])})`
            )
            this.bh.updateLine(
                12, "Typed- History", false
            )

            const lines: string[] = []
            let currentLine: string = ""
            let charCount : number = 0
            const maxCharLimit : number = this.bh.width
            for(let i = 0; i<this.resultData.formattedWords.length; i++){
                const word = this.resultData.formattedWords[i]
                if(charCount + word.letterCount > maxCharLimit){
                    lines.push(currentLine)
                    currentLine = word.formattedWord + " "
                    charCount = word.letterCount + 1
                }else{
                    currentLine+=word.formattedWord+" "
                    charCount+=word.letterCount+1
                }
            }
            if(currentLine!=""){
                lines.push(currentLine)
            }

            const startY: number = 13
            for(let i = 0; i<lines.length; i++){
                this.bh.updateLine(
                    startY + i, lines[i], false
                )
            }
        }else{
            this.bh.updateLine(
                3, chalky.italic("Data not available. Something fishy."), true
            )
        }
    }
    updateBottomPanel(){
        this.bh.updateLine(
            this.bh.height - 4, 
            `${chalky.style(" ctrl + c: exit ", [ANSI_CODES.bgYellow])}     ${chalky.style(" ctrl + s: settings ", [ANSI_CODES.bgWhite, ANSI_CODES.black])}      ${chalky.style(" ctrl + t: new test ", [ANSI_CODES.bgCyan])}  `,
            true
        )
    }
    update(): void{
        this.updateTitle()
        this.updateResultSection()
        this.updateBottomPanel()
    }

}