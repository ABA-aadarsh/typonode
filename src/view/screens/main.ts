// home screen
// basic - info , on keypress -> start test, ctrl combos -> settings or commands
// typing test screen
import { getBuffer } from "../../utils/Block";
import { writeOnScreen } from "../../utils/io";
import { newTest } from "../../utils/testGenerate";
import { BaseScreen } from "./Base";
export class MainScreen extends BaseScreen{
    private testText: string[];
    private testParams : any = null
    running : boolean // indicates whether the speed test has started or not
    private userTypedWords: string[] // words users typed (no fromatting)
    private formattedUserWords : string[] // formatted user typed words  shown in the screen
    private currentWordIndex: number 
    private currentWord: string 
    constructor(){
        super({refreshStyle: "interval", fps: 30})
        this.testText = this.generateTest();
        this.running = false;
        this.userTypedWords =[]
        this.currentWordIndex = 0
        this.currentWord = ""
        this.formattedUserWords = []
    }

    public start(){
        this.running = true
    }

    public stop(){
        this.running = false
    }

    private generateTest(){
        return newTest(null)
    }
    public keyHandle(k: string): void {
        
    }
    public refresh(){
        this.testText = this.generateTest();
    }
    public updateTestSettings (){
        //TODO: modify the time, words format etc
    }

    private getFormattedDisplayTest(){
        // ansicoded text for the test
    }


    public render(){
        const buffer = getBuffer(
            [
                {content: "Hello world this is a test text", height:1, margin:0}
            ]
        )
        writeOnScreen(
            buffer,
            {x:0, y:0},
            {x:0, y:0}
        )
    }
}