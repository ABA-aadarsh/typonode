// setting screen for adjusments of type test

import { getBuffer } from "../../utils/Block";
import { writeOnScreen } from "../../utils/io";
import { BaseScreen } from "./Base";
export class SettingScreen extends BaseScreen{
    constructor(){
        super({refreshStyle: "on-demand", fps: 10})
    }
    render(): void {
        const buffer = getBuffer(
            [
                {content: "Settings Screen"},
                {content: "Time: 30s", height: 1, margin:2},
                {content: "FPS: 30"}
            ]
        )
        writeOnScreen(
            buffer,
            {x:0, y:0},
            {x:100, y:100}
        )
    }
}