import { BufferHandler } from "../../utils/bufferHandler";
import EventBus from "../../utils/eventBus";
import { clearEntireTerminal, clearVisibleScreen } from "../../utils/io";

// parent class for all screens
export class BaseScreen {
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
        }
        process.stdout.cursorTo(0,0)
        process.stdout.write(this.bh.updateBuffer());
    }
    resizeScreen(){
        this.bh.resize()
    }
    update(fps?:number){}
    keyHandle(k: string){}
    refresh(){}
}