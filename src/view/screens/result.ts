import ANSI_CODES from "../../utils/ansiCodes";
import chalky from "../../utils/Chalky";
import EventBus from "../../utils/eventBus";
import { _saveintoStoreJSON, updateHighestScore } from "../../utils/store";
import { BaseScreen } from "./Base";
export type ResultData = {
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
    timeLimit: number,
    beatHighestRecord: boolean
}
export class ResultScreen extends BaseScreen{
    private resultData: ResultData | null = null;
    constructor(
        {eventHandler}: {
            eventHandler: EventBus
        }
    ){
        super({eventHandler: eventHandler})
    }

    keyHandle(k: string): void {
        
    }
    setResultData(
        data: typeof this.resultData
    ){
        this.resultData = data
    }
    updateTitle(){
        const title = "Result"
        this.bh.updateBlock(
            Math.floor(this.bh.width/2 - title.length/2),0,-1,
            title
        )
    }
    updateResultSection(){
        if(this.resultData!=null)
        {
            let isNewRecord : boolean = false
            const startLineIndex : number = 2
            const wordInfo = this.resultData.wordsInfo
            const charInfo = this.resultData.charactersInfo
            let accuray = 0
            if(charInfo.correct+charInfo.skipped+charInfo.error!=0){
                accuray=Math.floor(
                    (charInfo.correct)
                    /(charInfo.correct+charInfo.skipped+charInfo.error) * 100
                ) 
            }
            if(this.resultData.beatHighestRecord){
                isNewRecord = true
                updateHighestScore(this.resultData.wpm, accuray)
                _saveintoStoreJSON()
            }
            this.bh.updateLine(
                startLineIndex + 0, 
                ` WPM: ${chalky.yellow(this.resultData.wpm)} (${chalky.style(wordInfo.correct,[ANSI_CODES.green])} / ${
                    chalky.style(wordInfo.error,[ANSI_CODES.red])
                }) ${chalky.bgCyan.white(" [NEW RECORD]!!! ")}`, true
            )
            this.bh.updateLine(
                startLineIndex + 1,
                ` Accuracy: ${
                    chalky.yellow(accuray)
                }%`, true
            )
            this.bh.updateLine(
                startLineIndex + 2,
                ` Characters: (${chalky.style(charInfo.correct,[ANSI_CODES.green])} / ${
                    chalky.style(charInfo.error,[ANSI_CODES.red])
                } / ${chalky.style(charInfo.skipped,[ANSI_CODES.yellow])})`, true
            )
            this.bh.updateLine(
                startLineIndex + 6, " Typed- History", false
            )

            const lines: string[] = []
            let currentLine: string = " "
            let charCount : number = 0
            let paddingX : number = 2
            const maxCharLimit : number = this.bh.width
            for(let i = 0; i<this.resultData.formattedWords.length; i++){
                const word = this.resultData.formattedWords[i]
                if(charCount + word.letterCount + paddingX > maxCharLimit){
                    lines.push(currentLine)
                    currentLine =" " + word.formattedWord + " "
                    charCount = word.letterCount + 1
                }else{
                    currentLine+=word.formattedWord+" "
                    charCount+=word.letterCount+1
                }
            }
            if(currentLine!=""){
                lines.push(currentLine)
            }

            const startY: number = startLineIndex + 7
            for(let i = 0; i<lines.length; i++){
                this.bh.updateLine(
                    startY + i, lines[i], false
                )
            }


            // guidelines
            this.bh.updateLine(
                startLineIndex + 13,
                `${chalky.bgYellow(" ")} ${chalky.yellow("Color Coding Info: ")}`
            )
            this.bh.updateLine(
                startLineIndex + 14,
                `${chalky.yellow("y")} - skipped char`
            )
            this.bh.updateLine(
                startLineIndex + 15,
                `${chalky.green("g")} - correct char`
            )
            this.bh.updateLine(
                startLineIndex + 16,
                `${chalky.red("e")} - wrong char`
            )
            this.bh.updateLine(
                startLineIndex + 17,
                `${chalky.red.underline("e")} - extra typed char`
            )
        }else{
            this.bh.updateLine(
                3, chalky.italic("Data not available. Something fishy."), true
            )
        }
    }
    updateBottomPanel(){
        this.bh.updateLine(
            this.bh.height - 1, 
            `${chalky.style(" ctrl + c: exit ", [ANSI_CODES.bgYellow])}     ${chalky.style(" ctrl + s: settings ", [ANSI_CODES.bgWhite, ANSI_CODES.black])}      ${chalky.style(" ctrl + t: new test ", [ANSI_CODES.bgCyan])}  `,
            true
        )
    }
    update(): void{
        if(this.partialFrameBuffer==0){
            this.updateFPS()
        }
        this.updateTitle()
        this.updateResultSection()
        this.updateBottomPanel()
        this.incrementPartialFrameBuffer()
    }

}