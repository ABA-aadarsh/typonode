import { BufferHandler } from "../../utils/bufferHandler";
import chalky from "../../utils/Chalky";
import EventBus from "../../utils/eventBus";
import { clearEntireTerminal } from "../../utils/io";
import { getGlobalStore } from "../../utils/store";

// parent class for all screens
export class BaseScreen {
    // partialFrameBuffer delay system is used to prevent the rapid change display of recordings like fps, wpm etc
    protected partialFrameBuffer : number = 0
    protected readonly partialFrameBufferDelay: number = 5
    protected eventHandler : EventBus;
    protected bh: BufferHandler;
    private  fps: number;
    constructor(
        {
            eventHandler
        }: {eventHandler: EventBus}
    ){
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
        process.stdout.cursorTo(0,0)
        process.stdout.write(this.bh.updateBuffer());
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