// setting screen for adjusments of type test

import EventBus from "../../utils/eventBus";
import { terminalDimension, writeOnScreen } from "../../utils/io";
import { BaseScreen } from "./Base";
export class SettingScreen extends BaseScreen{
    constructor(
        {eventHandler}: {
            eventHandler: EventBus
        }
    ){
        super({refreshStyle: "on-demand", fps: 10, dimension: {width: terminalDimension.width,  height: terminalDimension.height}, eventHandler: eventHandler})
    }
    update(): void{
        this.bh.updateLine(0, "This is setting screen")
    }
}