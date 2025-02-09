// utilities for handling the store.json file

import { homedir } from "os"
import path from "path"
import fs from "fs"

// globalStore will be used for accessing the states in all screens through getGlobalStore, and is updated when the settings or highest wpm are changed
let globalStore: storeDataType = {
    "highestWPM": {
        "wpm": null,
        "accuracy": null
    },
    "settings":{
        "testParams": {
            "timeLimit": 30,
            "allowUppercase": false,
            "allowPunctuation": false,
            "type": "common"
        },
        "showFPS":false
    }
}
export const getGlobalStore = ()=>{
    return globalStore
}
export type  storeDataType = {
    "highestWPM": {
        "wpm": null|number,
        "accuracy": null|number
    },
    "settings":{
        "testParams": {
            "timeLimit": number,
            "allowUppercase": boolean,
            "allowPunctuation": boolean,
            "type": string,
        },
        "showFPS": boolean
    }
}
const storeFilePath = path.resolve(homedir(), ".config", "typonode","store.json")
export const checkStore = ():boolean=>{
    // check if store exist or not
    return fs.existsSync(storeFilePath)
}

export const createDefaultStore = ()=>{
    if(!checkStore()){
        // creates only if store is not available
        if(fs.existsSync(path.resolve(homedir(), ".config", "typonode"))){
            fs.writeFileSync(
                storeFilePath, 
                JSON.stringify(
                    globalStore // which will be in its default form
                ), "utf-8"
            )
        }else{
            try{
                fs.mkdirSync(path.resolve(homedir(), ".config", "typonode"))
                fs.writeFileSync(
                    storeFilePath, 
                    JSON.stringify(
                        globalStore // which will be in its default form
                    ), "utf-8"
                )
            }catch(e){
                throw new Error("Can't make store.json for storing data.\nMake a /.config/typonode folder in " + homedir())
            }
        }
    }
}

// run only once through out the program during construction of screenManager
export const fetchFromStoreJSON = ()=>{
    if(checkStore()){
        const storeData: storeDataType = JSON.parse(fs.readFileSync(storeFilePath, "utf-8"))
        globalStore = storeData
    }
}
export const _saveintoStoreJSON = ()=>{
    // saves the current value of globalStore in to store.json
    try {
        fs.writeFileSync(storeFilePath, JSON.stringify(globalStore), "utf-8")
    } catch (error) {
        console.log(error)
    }
}

export const updateTestParamsInStore = (
    newTestParams: storeDataType["settings"]["testParams"]
)=>{
    globalStore.settings.testParams = {...newTestParams}
}

export const updateHighestScore = (wpm:number, accuracy:number)=>{
    globalStore.highestWPM.wpm = wpm
    globalStore.highestWPM.accuracy = accuracy
}

export const update_show_fps = (showFPS: boolean)=>{
    globalStore.settings.showFPS = showFPS
}