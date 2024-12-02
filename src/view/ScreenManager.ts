// screen-manager: manages rendering, updation and switching of screens

import process from "node:process";
import { BaseScreen } from "./screens/Base";
import { MainScreen } from "./screens/main";
import { SettingScreen } from "./screens/settings";
import { clearScreen, disableCursor, enableCursor, writeOnScreen } from "../utils/io";
import { setInterval } from "node:timers";


// stdin and stdout configure
process.stdin.setRawMode(true)
process.stdin.setEncoding("utf-8")
disableCursor()
process.stdin.resume()


// SM - ScreenManager
export class SM {
    private screensList : {id: string, screen: BaseScreen}[] = [];
    private intervalRunning : null | ReturnType<typeof setInterval>
    private currentScreen: BaseScreen | null = null;
    private currentScreenId: string | null = null
    private commands = {
        "exit": "\x03", // ctrl - c
        "switchToMain" : "\x14", // ctrl - t
        "switchToSettings" : "\x13", // ctrl - s
    }
    private justSwitched : boolean // justSwitched is set when the switching occurs and after the render it is unset. on justswitched = true, the screen.render will clear entire screen and render
    constructor(){
        this.screensList = [
            {id: "main", screen:  new MainScreen()},
            {id: "setting", screen: new SettingScreen()}
        ]
        this.currentScreenId = "main"
        this.currentScreen = this.screensList[0].screen
        this.justSwitched = true
        this.intervalRunning = null
    }
    keyHandle(k: string){
        switch(k){
            case this.commands.exit: 
                enableCursor();
                clearScreen()
                if(this.intervalRunning) clearInterval(this.intervalRunning);
                process.exit();
            case this.commands.switchToMain: 
                this.switchScreen("main")
                break
            case this.commands.switchToSettings:
                this.switchScreen("setting")
                break
            default:
                this.currentScreen?.keyHandle(k)
        }
    }
    private switchScreen(newScreenId: string){
        if(this.currentScreenId != newScreenId){
            const nsIndex = this.screensList.findIndex(x=>x.id==newScreenId)
            if(nsIndex!=-1){
                this.currentScreenId = newScreenId
                this.currentScreen = this.screensList[nsIndex].screen;
                this.justSwitched = true
            }
        }
    }
    update(){
        if(this.currentScreen){
            this.currentScreen.update();
        }
    }
    render(){
        if(this.currentScreen){
            this.currentScreen.render(this.justSwitched); // do clean rendering is just switched
            if(this.justSwitched) this.justSwitched = false;
        }
    }

    intiateAnimation (){
        // manages the interval system for rendering and updation
        if(this.intervalRunning!=null){
            clearInterval(this.intervalRunning)
        }
        this.intervalRunning = setInterval(() => {
            this.update()
            this.render()
        }, 1000/10); //TODO: different screen may have different interval
    }
}