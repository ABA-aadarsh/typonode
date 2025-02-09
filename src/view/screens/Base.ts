import { BufferHandler } from "../../utils/bufferHandler";
import chalky from "../../utils/Chalky";
import EventBus from "../../utils/eventBus";
import { clearEntireTerminal, disableCursor } from "../../utils/io";
import { getGlobalStore } from "../../utils/store";

// parent class for all screens
export class BaseScreen {
    // partialFrameBuffer delay system is used to prevent the rapid change display of recordings like fps, wpm etc
    protected partialFrameBuffer : number = 0
    protected readonly partialFrameBufferDelay: number = 5
    protected eventHandler : EventBus;
    protected bh: BufferHandler;
    private  fps: number;
    public cursorPosition : {x:number, y:number}
    public showCursor: boolean = false
    constructor(
        {
            eventHandler
        }: {eventHandler: EventBus}
    ){
        this.cursorPosition = {x:0, y:0}
        this.fps = 0
        this.bh = new BufferHandler()
        this.eventHandler = eventHandler
    }
    render(cleanRender: boolean = false){
        if(cleanRender){
            this.bh.forceDirtyAll()
            clearEntireTerminal()
            this.partialFrameBuffer = 0
        }
        let _bufferString : string = `\x1B[$0;0H` + this.bh.updateBufferAndGetBufferString() // the initial ansi makes sure that the writing starts from the top left
        if(this.showCursor){
            _bufferString += `\x1B[${this.cursorPosition.y};${this.cursorPosition.x}H`; // cusor position
            _bufferString += "\x1B[?25h"; // show cursor
        }else{
            _bufferString += "\x1B[?25l" // hide cursor
        }
        process.stdout.write(_bufferString)
    }
    resizeScreen(){
        this.bh.resize()
    }
    update(){}
    keyHandle(k: string){}
    refresh(){}
    updateFPS(){
        if(getGlobalStore().settings.showFPS){
            this.bh.clearLine(0)
            const fpsText = `${chalky.yellow(this.fps)} fps`
            this.bh.updateBlock(this.bh.width - chalky.parseAnsi(fpsText).normalTextLength-2, 0, -1, fpsText)
        }else{
            this.bh.clearLine(0)
        }
    }
    setFPS(fps:number){
        this.fps = fps
    }
    protected incrementPartialFrameBuffer(){
        this.partialFrameBuffer = (this.partialFrameBuffer + 1)%this.partialFrameBufferDelay
    }
}