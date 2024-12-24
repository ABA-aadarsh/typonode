// generate typing test words array based on params
import fs from "node:fs"
import process from "node:process"
import { convertToPiglatin } from "./piglatin"
export const newTest = (params: testParamsType): string[] => {
    // TODO: update words.json to allow performing words select based on params. Params based customisation for this function as well
    const listOfWords: string[] = []
    const wordsLength: number = 50 // TODO: more sensible method
    if(params.type=="random"){
        const i = Math.floor(Math.random()*testParamsConstraints.type.options.length)
        params.type = testParamsConstraints.type.options[i]
    }
    if (params.type == "common" || params.type == "piglatin") {
        const isPiglatin = params.type=="piglatin"
        const filePath = "./assets/commonWords.json"
        const file = fs.readFileSync(filePath, "utf-8")
        if (!file) {
            return []
        }
        const json: { words: string[] } = JSON.parse(file)
        let randomIndex:number, isCapital : boolean
        for(let i = 0; i<wordsLength; i++){
            randomIndex = Math.floor(Math.random()*json.words.length)
            isCapital=false
            if(params.allowUppercase){
                isCapital = Math.random()<0.5;
            }
            let w = json.words[randomIndex]
            if(isCapital) w = w[0].toUpperCase() + w.slice(1);
            if(isPiglatin) w = convertToPiglatin(w);
            listOfWords.push(w)
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
        options: ["common", "shakespear", "piglatin", "cats", "random"],
        default: "common"
    },
    "allowUppercase": {
        default: false
    },
    "allowPunctuation": {
        default: false
    }
}

export type testParamsConstraintsType = typeof testParamsConstraints
export type testParamsType = {
    "timeLimit": number,
    "type": string,
    "allowUppercase": boolean,
    "allowPunctuation": boolean
}