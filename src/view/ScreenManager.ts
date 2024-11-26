// screen-manager: manages rendering, updation and switching of screens

import process from "node:process";
import { BaseScreen } from "./screens/Base";
import { MainScreen } from "./screens/main";
import { SettingScreen } from "./screens/settings";
import { disableCursor, enableCursor, writeOnScreen } from "../utils/io";


// stdin and stdout configure
process.stdin.setRawMode(true)
process.stdin.setEncoding("utf-8")
disableCursor()
process.stdin.resume()


// SM - ScreenManager
export class SM {
    private screensList : {id: string, screen: BaseScreen}[] = [];
    private currentScreen: BaseScreen | null = null;
    private currentScreenId: string | null = null
    private commands = {
        "exit": "\x03", // ctrl - q
        "switchToMain" : "\x0D", // ctrl - m
        "switchToSettings" : "\x13", // ctrl - s
    }
    constructor(){
        this.screensList = [
            {id: "main", screen:  new MainScreen()},
            {id: "setting", screen: new SettingScreen()}
        ]
        this.currentScreenId = "main"
        this.currentScreen = this.screensList[0].screen
    }
    keyHandle(k: string){
        switch(k){
            case this.commands.exit: 
                enableCursor();
                process.exit();
            case this.commands.switchToMain: 
                this.switchScreen("main")
                break
            case this.commands.switchToSettings:
                this.switchScreen("setting")
                break
            default:
                break;
        }
    }
    private switchScreen(newScreenId: string){
        if(this.currentScreenId != newScreenId){
            const nsIndex = this.screensList.findIndex(x=>x.id==newScreenId)
            if(nsIndex!=-1){
                this.currentScreenId = newScreenId
                this.currentScreen = this.screensList[nsIndex].screen;
            }
        }
    }
    render(){
        if(this.currentScreen){
            this.currentScreen.render();
        }
    }
}