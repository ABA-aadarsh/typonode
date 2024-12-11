// generate typing test words array based on params
import fs from "node:fs"
import process from "node:process"

export const newTest = (params: any): string[]=>{
    // TODO: update words.json to allow performing words select based on params. Params based customisation for this function as well
    const listOfWords: string[] = []
    const wordsLength = 50
    const filePath = "./assets/words.json"
    const file = fs.readFileSync(filePath, "utf-8")
    if(!file){
        process.exit(10)
    }
    const json : {words: string[]}= JSON.parse(file)
    for(let i = 0; (i<Math.min(wordsLength, json.words.length)); i++){
        const randomIndex = Math.floor(Math.random()*json.words.length)
        listOfWords.push(
            params.onlyLowerCase ? (json.words[randomIndex]).toLowerCase(): json.words[randomIndex]
        )
    }
    return listOfWords
}