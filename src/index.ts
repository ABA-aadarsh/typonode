import { clearEntireTerminal, terminalDimension } from "./utils/io";
import { SM } from "./view/ScreenManager";
import process from "node:process"
const sm = new SM()
let minimumDeltaLimit = 15
process.stdin.on("data", (buffer: Buffer)=>{
    const key = String(buffer)
    sm.keyHandle(key)
})
process.stdout.on('resize', () => {
    terminalDimension.width = process.stdout.columns
    terminalDimension.height = process.stdout.rows
    sm.handleScreenResize()
});
// initial screen clearing
clearEntireTerminal()
let previousLoopTime: number | null = null
const loop = ()=>{
    const newTime = Date.now()
    if(previousLoopTime!=null){
        const delta = newTime - previousLoopTime
        const fps = delta!=0 ? 1000/delta : 1000 // 1000 is arbitarily set for max fps
        if(delta > minimumDeltaLimit){
            sm.setFPS(
                Math.floor(
                    Math.min(fps) 
                )
            )
            sm.update()
            sm.render()
            previousLoopTime = Date.now()
        }
    }else{
        previousLoopTime = newTime
    }
    setTimeout(loop)
}
loop()