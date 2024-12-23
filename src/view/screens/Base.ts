import { BufferHandler } from "../../utils/bufferHandler";
import EventBus from "../../utils/eventBus";
import { clearEntireTerminal, clearVisibleScreen } from "../../utils/io";

// parent class for all screens
export class BaseScreen {
    private readonly refreshStyle : "on-demand" | "interval"
    protected eventHandler : EventBus;
    protected bh: BufferHandler;
    private readonly fps: number;
    constructor(
        {
            refreshStyle,
            fps,
            dimension,
            eventHandler
        }: {refreshStyle: "on-demand" | "interval", fps?: number, dimension: {width: number, height: number}, eventHandler: EventBus}
    ){
        this.refreshStyle = refreshStyle
        this.fps = fps || 10 // 10 being the default fps
        this.bh = new BufferHandler(dimension.width, dimension.height)
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
    update(){}
    keyHandle(k: string){}
    refresh(){}
}