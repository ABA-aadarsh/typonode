import { BufferHandler } from "../../utils/bufferHandler";
import { clearScreen } from "../../utils/io";

// parent class for all screens
export class BaseScreen {
    private readonly refreshStyle : "on-demand" | "interval"
    protected bh: BufferHandler;
    private readonly fps: number;
    constructor(
        {
            refreshStyle,
            fps,
            dimension
        }: {refreshStyle: "on-demand" | "interval", fps?: number, dimension: {width: number, height: number}}
    ){
        this.refreshStyle = refreshStyle
        this.fps = fps || 10 // 10 being the default fps
        this.bh = new BufferHandler(dimension.width, dimension.height)
    }
    render(cleanRender: boolean = false){
        if(cleanRender){
            this.bh.forceDirtyAll()
            clearScreen()
        }
        process.stdout.write(this.bh.updateBuffer());
    }
    update(){}
    keyHandle(k: string){}
}