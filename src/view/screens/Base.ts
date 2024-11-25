// parent class for all screens
export class BaseScreen {
    private readonly refreshStyle : "on-demand" | "interval"
    private readonly fps: number;
    constructor(
        {
            refreshStyle,
            fps
        }: {refreshStyle: "on-demand" | "interval", fps?: number}
    ){
        this.refreshStyle = refreshStyle
        this.fps = fps || 10 // 10 being the default fps
    }
    render(){}
    update(){}
}