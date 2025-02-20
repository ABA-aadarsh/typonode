// generate typing test words array based on params
import { convertToPiglatin } from "./piglatin"
import { getGlobalStore } from "../store"
import { terminalDimension } from "../io"
import { commonWords as wordsList } from "../../assets/commonWords"
export const newTest = (): string[] => {
    // TODO: update words.json to allow performing words select based on params. Params based customisation for this function as well

    // NOTE: the number of words that should be selected should be such that it must in minimum cover 3 lines of terminal
    const storeData = getGlobalStore()
    const params = storeData.settings.testParams
    const terminalWidth = terminalDimension.width
    let charLength: number = 0;
    const paddingX : number = 2
    let linesCount : number = 0
    const maxLines : number = 4;
    const listOfWords: string[] = []
    if(params.type=="random"){
        const i = Math.floor(Math.random()*testParamsConstraints.type.options.length)
        params.type = testParamsConstraints.type.options[i]
    }
    if (params.type == "common" || params.type == "piglatin") {
        const isPiglatin = params.type=="piglatin"
        let randomIndex:number, isCapital : boolean
        while(linesCount < maxLines){
            randomIndex = Math.floor(Math.random()*wordsList.length)
            isCapital=false
            if(params.allowUppercase){
                isCapital = Math.random()<0.5;
            }
            let w = wordsList[randomIndex]
            if(isCapital) w = w[0].toUpperCase() + w.slice(1);
            if(isPiglatin) w = convertToPiglatin(w);
            if(charLength + w.length + paddingX + 2 > terminalWidth){
                linesCount ++
                charLength = w.length + 1
            }else{
                charLength += w.length + 1
            }
            if(linesCount<maxLines) listOfWords.push(w);
        }
    }
    return listOfWords
}

export const testParamsConstraints = {
    "timeLimit": {
        // in seconds
        min: 5,
        max: 180,
        default: 30
    },
    "type": {
        options: ["common", "piglatin"],
        default: "common"
    },
    "allowUppercase": {
        default: false
    },
    "showFPS": {
        default: true
    }
}

export type testParamsConstraintsType = typeof testParamsConstraints
export type testParamsType = {
    "timeLimit": number,
    "type": string,
    "allowUppercase": boolean,
}