// setting screen for adjusments of type test
// reponsibility of maintaining the store.json

import chalky from "../../utils/Chalky";
import EventBus from "../../utils/eventBus";
import { _keys, terminalDimension } from "../../utils/io";
import { _saveintoStoreJSON, getGlobalStore, update_show_fps, updateTestParamsInStore } from "../../utils/store";
import { testParamsConstraints } from "../../utils/typingtestgeneration";
import { BaseScreen } from "./Base";

type Settings = {
    timeLimit: number,
    allowUppercase: boolean,
    type: string,
    showFPS: boolean
}

export class SettingScreen extends BaseScreen {
    private currentSettingParamIndex: number = 0
    private savedSettings: Settings
    private bufferSettings: Settings
    private isSettingsUnsaved: boolean
    constructor(
        { eventHandler }: {
            eventHandler: EventBus
        }
    ) {
        super({ eventHandler: eventHandler })
        const storeData = getGlobalStore()
        this.savedSettings = {
            "timeLimit": storeData.settings.testParams.timeLimit,
            "allowUppercase": storeData.settings.testParams.allowUppercase,
            "type": storeData.settings.testParams.type,
            "showFPS": storeData.settings.showFPS,
        }
        this.bufferSettings = { ...this.savedSettings } // initailised with saved settings
        this.isSettingsUnsaved = false
        // this.eventHandler.emit("settingsUpdated", this.savedSettings) // initially pass the settings to main screen
    }
    private updateSettingParam(direction: 1 | -1) {
        // direction 1 is passed when arrowRight is pressed and -1 when arrowDown is arrowLeft
        switch (this.currentSettingParamIndex) {
            case 0:
                // time
                let c: number = this.bufferSettings.timeLimit
                const maxTimeLimit = testParamsConstraints.timeLimit.max
                const minTimeLimit = testParamsConstraints.timeLimit.min
                c += direction * 5
                if (c > maxTimeLimit) c = 5;
                else if (c < minTimeLimit) c = maxTimeLimit;
                this.bufferSettings.timeLimit = c
                break
            case 1:
                // lowercase
                this.bufferSettings.allowUppercase = !this.bufferSettings.allowUppercase
                break
            case 2:
                // test type
                const options = testParamsConstraints.type.options
                let ci: number = options.findIndex(x => x == this.bufferSettings.type)
                ci = (ci + 1 * direction) % options.length
                if (ci < 0) ci += options.length
                this.bufferSettings.type = options[ci]
                break
            case 3:
                this.bufferSettings.showFPS = !this.bufferSettings.showFPS
                break
        }
        this.isSettingsUnsaved = true
    }

    keyHandle(k: string): void {
        const noOfSettingParams: number = Object.keys(this.bufferSettings).length
        switch (k) {
            case _keys.arrowLeft:
                this.updateSettingParam(-1)
                break
            case _keys.arrowRight:
                this.updateSettingParam(1)
                break
            case _keys.arrowUp:
                this.currentSettingParamIndex -= 1
                if (this.currentSettingParamIndex == -1) this.currentSettingParamIndex = noOfSettingParams - 1
                break
            case _keys.arrowDown:
                this.currentSettingParamIndex += 1
                if (this.currentSettingParamIndex == noOfSettingParams) this.currentSettingParamIndex = 0
                break
            case _keys.ctrl_o:
                // save settings
                this.saveSettings()
                break
        }
    }
    private saveSettings() {
        // persist settings value
        this.savedSettings = { ...this.bufferSettings }
        update_show_fps(this.savedSettings.showFPS)
        updateTestParamsInStore(
            {
                allowUppercase: this.savedSettings.allowUppercase,
                timeLimit: this.savedSettings.timeLimit,
                type: this.savedSettings.type
            }
        )
        _saveintoStoreJSON()
        this.isSettingsUnsaved = false
    }
    private settingParamHeader(h: string, i: number): string {
        if (i == this.currentSettingParamIndex) {
            return chalky.bgCyan(" ") + " " + h
        }
        return "  " + h
    }
    updateTitle(): void {
        const unsavedMessage = chalky.red("*") + chalky.yellow("Unsaved Settings (ctrl+o to save)")
        this.bh.updateBlock(
            Math.floor(terminalDimension.width - chalky.stripAnsi(unsavedMessage).length), 1,
            -1, this.isSettingsUnsaved?  unsavedMessage: " ".repeat(chalky.stripAnsi(unsavedMessage).length)
        )
    }
    updateMenu(): void {
        this.bh.updateBlock(0, 3, -1, chalky.bgYellow(" ") + " Options")
        this.bh.updateLine(5,
            `${this.settingParamHeader("Time Limit", 0)} : ${this.bufferSettings.timeLimit}`, true
        )
        this.bh.updateLine(6,
            `${this.settingParamHeader("Allow Uppercase", 1)} : ${this.bufferSettings.allowUppercase}`, true
        )
        this.bh.updateLine(7,
            `${this.settingParamHeader("Test Type: ", 2)}: ${this.bufferSettings.type}   `, true
        )
        this.bh.updateLine(8,
            `${this.settingParamHeader("Show FPS: ", 3)}: ${this.bufferSettings.showFPS}   `, true
        )
    }
    updateBottomPanel(): void {
        this.bh.updateLine(
            this.bh.height - 5, 
            `${chalky.bgCyan(" ")} ${chalky.yellow("Arrow up/down to choose option")} `,
            false
        )
        this.bh.updateLine(
            this.bh.height - 4, 
            `${chalky.bgCyan(" ")} ${chalky.yellow("Arrow Left/Right to toggle settings option")}`,
            false
        )
        this.bh.updateLine(
            this.bh.height - 2, 
            `${chalky.bgYellow(" ctrl + c: exit ")}     ${chalky.black.bgWhite(" ctrl + t: new test ")}    `,
            true
        )
    }
    update(): void {
        if(this.partialFrameBuffer==0){
            this.updateFPS()
        }
        this.updateTitle()
        this.updateMenu()
        this.updateBottomPanel()
        this.incrementPartialFrameBuffer()
    }
}