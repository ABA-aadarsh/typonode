// generate typing test words array based on params
import fs from "node:fs"
import process from "node:process"

export const newTest = (params: testParamsType | null): string[]=>{
    // TODO: update words.json to allow performing words select based on params. Params based customisation for this function as well
    const listOfWords: string[] = []
    const wordsLength = 50
    const filePath = "./assets/commonWords.json"
    const file = fs.readFileSync(filePath, "utf-8")
    if(!file){
        process.exit(10)
    }
    const json : {words: string[]}= JSON.parse(file)

    if(params==null){
        // when will this case occur? dont know for now
        
        return []
    }else{
        for(let i = 0; (i<Math.min(wordsLength, json.words.length)); i++){
            const randomIndex = Math.floor(Math.random()*json.words.length)
            listOfWords.push(
                params.allowUppercase ? (json.words[randomIndex]).toLowerCase(): json.words[randomIndex]
            )
        }
        return listOfWords
    }
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

export type testParamsConstraintsType  = typeof testParamsConstraints
export type testParamsType = {
    "timeLimit": number,
    "type": string,
    "allowUppercase": boolean,
    "allowPunctuation": boolean
}