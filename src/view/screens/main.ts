// home screen
// basic - info , on keypress -> start test, ctrl combos -> settings or commands
// typing test screen

interface IProps {
    refreshStyle : "on-demand" | "interval",
    fps?: number
}


import ANSI_CODES from "../../utils/ansiCodes";
import { getBuffer } from "../../utils/Block";
import chalky from "../../utils/Chalky";
import { writeOnScreen } from "../../utils/io";
import { BaseScreen } from "./Base";
export class MainScreen extends BaseScreen{
    testText: string[];
    constructor(inputProp: IProps){
        super({refreshStyle: inputProp.refreshStyle, fps: inputProp.fps})
        this.testText = this.generateTest()
    }
    private generateTest(){
        // create random list of words for test 
        return "This is a piece of randomly generated text for the typing speed test".split(" ")
    }
    public refresh(){
        this.testText = this.generateTest();
    }

    public render(){
        const buffer = getBuffer(
            [

            ]
        )
    }
}