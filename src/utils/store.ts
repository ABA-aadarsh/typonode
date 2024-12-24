// utilities for handling the store.json file

import { homedir } from "os"
import path from "path"
import fs from "fs"
import { testParamsConstraintsType } from "./typingtestgeneration"

export type  storeDataType = {
    "highestWPM": {
        "wpm": null|number,
        "date": null|Date
    },
    "settings":{
        "testParams": {
            "timeLimit": number,
            "allowUppercase": boolean,
            "allowPunctuation": boolean,
            "type": string
        }
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
                    {
                        "highestWPM": {
                            "wpm": null,
                            "date": null
                        },
                        "settings":{
                            "testParams": {
                                "timeLimit": 30,
                                "allowUppercase": false,
                                "allowPunctuation": false,
                                "type": "common"
                            }
                        }
                    }
                ), "utf-8"
            )
        }else{
            try{
                fs.mkdirSync(path.resolve(homedir(), ".config", "typonode"))
            }catch(e){
                throw new Error("Can't make store.json for storing data.\nMake a /.config/typonode folder in " + homedir())
            }
        }
    }
}

export const getStoreData = (): storeDataType | undefined=>{
    if(checkStore()){
        const storeData: storeDataType = JSON.parse(fs.readFileSync(storeFilePath, "utf-8"))
        return (storeData)
    }
}


export const updateStoreData = (
    data: storeDataType
):void =>{
    if(checkStore()){
        fs.writeFileSync(storeFilePath, JSON.stringify(data), "utf-8")
    }
}

export const updateTestParamsInStore = (
    newTestParams: storeDataType["settings"]["testParams"]
):boolean=>{
    const storeData: storeDataType | undefined = getStoreData()
    if(storeData){
        storeData.settings.testParams = {...newTestParams}
        fs.writeFileSync(storeFilePath, JSON.stringify(storeData), "utf-8")
        return true
    }else{
        return false
    }
}