// setting screen for adjusments of type test
// reponsibility of maintaining the store.json

import chalky from "../../utils/Chalky";
import EventBus from "../../utils/eventBus";
import { _keys, terminalDimension, writeOnScreen } from "../../utils/io";
import { checkStore, createDefaultStore, getStoreData, updateTestParamsInStore } from "../../utils/store";
import { testParamsConstraints, testParamsConstraintsType } from "../../utils/typingtestgeneration";
import { BaseScreen } from "./Base";

type testParams = {
    // order matters
    timeLimit: number,
    type: string,
    allowUppercase: boolean,
    allowPunctuation: boolean,
}

export class SettingScreen extends BaseScreen {
    private currentSettingParamIndex: number = 0
    private savedTestParams: testParams
    private bufferTestParams: testParams
    private isSettingsUnsaved: boolean
    constructor(
        { eventHandler }: {
            eventHandler: EventBus
        }
    ) {
        super({ eventHandler: eventHandler })

        if (!checkStore()) {
            try {
                createDefaultStore();
            } catch (error) {
                this.eventHandler.emit("closeAppOnError", error)
            }
        }
        const storeData = getStoreData();
        if (storeData == undefined) {
            this.eventHandler.emit("closeAppOnError", "StoreData is undefined") // this will ideally close the app
            // fallback and for typescript constraint
            this.savedTestParams = {
                timeLimit: testParamsConstraints.timeLimit.default,
                allowUppercase: testParamsConstraints.allowUppercase.default,
                allowPunctuation: testParamsConstraints.allowPunctuation.default,
                type: testParamsConstraints.type.default
            }
        } else {
            this.savedTestParams = storeData.settings.testParams
        }
        this.bufferTestParams = { ...this.savedTestParams } // initailised with saved settings
        this.isSettingsUnsaved = false
        this.eventHandler.emit("settingsUpdated", this.savedTestParams) // initially pass the settings to main screen
    }
    private updateSettingParam(direction: 1 | -1) {
        // direction 1 is passed when arrowRight is pressed and -1 when arrowDown is arrowLeft
        switch (this.currentSettingParamIndex) {
            case 0:
                // time
                let c: number = this.bufferTestParams.timeLimit
                const maxTimeLimit = testParamsConstraints.timeLimit.max
                const minTimeLimit = testParamsConstraints.timeLimit.min
                c += direction * 5
                if (c > maxTimeLimit) c = 5;
                else if (c < minTimeLimit) c = maxTimeLimit;
                this.bufferTestParams.timeLimit = c
                break
            case 1:
                // lowercase
                this.bufferTestParams.allowUppercase = !this.bufferTestParams.allowUppercase
                break
            case 2:
                // punctutation allowed
                this.bufferTestParams.allowPunctuation = !this.bufferTestParams.allowPunctuation
                break
            case 3:
                // test type
                const options = testParamsConstraints.type.options
                let ci: number = options.findIndex(x => x == this.bufferTestParams.type)
                ci = (ci + 1 * direction) % options.length
                if (ci < 0) ci += options.length
                this.bufferTestParams.type = options[ci]
                break
            case 4:
                // this.bufferTestParams.showFPS != this.bufferTestParams.showFPS
                break
        }
        this.isSettingsUnsaved = true
    }

    keyHandle(k: string): void {
        const noOfSettingParams: number = Object.keys(this.bufferTestParams).length
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
        this.savedTestParams = { ...this.bufferTestParams }
        if (updateTestParamsInStore(this.savedTestParams)) {
            this.isSettingsUnsaved = false
            this.eventHandler.emit("settingsUpdated", this.savedTestParams)
        }
    }
    private settingParamHeader(h: string, i: number): string {
        if (i == this.currentSettingParamIndex) {
            return chalky.bgCyan(" ") + " " + h
        }
        return "  " + h
    }
    getSettingsData(): testParams {
        return { ...this.savedTestParams }
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
            `${this.settingParamHeader("Time Limit", 0)} : ${this.bufferTestParams.timeLimit}`, true
        )
        this.bh.updateLine(6,
            `${this.settingParamHeader("Allow Uppercase", 1)} : ${this.bufferTestParams.allowUppercase}`, true
        )
        this.bh.updateLine(7,
            `${this.settingParamHeader("Punctuation Allowed", 2)} : ${this.bufferTestParams.allowPunctuation}`, true
        )
        this.bh.updateLine(8,
            `${this.settingParamHeader("Test Type: ", 3)}: ${this.bufferTestParams.type}   `, true
        )
        // this.bh.updateLine(9,
        //     `${this.settingParamHeader("Show FPS: ", 4)}: ${this.bufferTestParams.showFPS}   `, true
        // )
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
            `${chalky.bgYellow(" ctrl + c: exit ")}     ${chalky.black.bgWhite(" ctrl + s: settings ")}      ${chalky.bgCyan(" ctrl + r: restart ")}`,
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