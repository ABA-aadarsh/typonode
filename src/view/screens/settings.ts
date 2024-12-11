// setting screen for adjusments of type test
// reponsibility of maintaining the store.json

import EventBus from "../../utils/eventBus";
import { terminalDimension, writeOnScreen } from "../../utils/io";
import { checkStore, createDefaultStore, getStoreData } from "../../utils/store";
import { BaseScreen } from "./Base";
export class SettingScreen extends BaseScreen{
    private settingsData: {
        timeLimit: number,
        onlyLowerCase: boolean,
        punctuationAllowed: boolean
    }; // stores "saved" settings values
    private unsavedSetttingsData: typeof this.settingsData
    constructor(
        {eventHandler}: {
            eventHandler: EventBus
        }
    ){
        super({refreshStyle: "on-demand", fps: 10, dimension: {width: terminalDimension.width,  height: terminalDimension.height}, eventHandler: eventHandler})
        
        if(!checkStore()){
            try {
                createDefaultStore();  
            } catch (error) {
                this.eventHandler.emit("closeAppOnError", error)
            }
        }
        const storeData = getStoreData();
        if(storeData==undefined){
            this.eventHandler.emit("closeAppOnError", "StoreData is undefined")
            this.settingsData = {
                timeLimit: 30,
                onlyLowerCase: false,
                punctuationAllowed: true
            };
        }else{
            this.settingsData = storeData.settings
        }
        this.unsavedSetttingsData = {...this.settingsData} // initailised with saved settings
        this.eventHandler.emit("settingsUpdated", this.settingsData) // initially pass the settings to main screen
    }
    private saveSettings(){
        // persist settings value
        this.eventHandler.emit("settingsUpdated", this.settingsData)
    }
    getSettingsData(): typeof this.settingsData{
        return {...this.settingsData}
    }

    update(): void{
        this.bh.updateLine(0, "This is setting screen")
    }
}