// setting screen for adjusments of type test

import { getBuffer } from "../../utils/Block";
import { BufferHandler } from "../../utils/bufferHandler";
import { terminalDimension, writeOnScreen } from "../../utils/io";
import { BaseScreen } from "./Base";
export class SettingScreen extends BaseScreen{
    bh: BufferHandler;
    constructor(){
        super({refreshStyle: "on-demand", fps: 10, dimension: {width: terminalDimension.width,  height: terminalDimension.height}})
        this.bh = new BufferHandler(terminalDimension.width, terminalDimension.height)
    }
    update(): void{
        this.bh.updateLine(0, "This is setting screen")
    }
}