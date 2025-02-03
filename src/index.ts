import { clearEntireTerminal } from "./utils/io";
import { SM } from "./view/ScreenManager";
import process from "node:process"

const sm = new SM()
process.stdin.on("data", (buffer: Buffer)=>{
    const key = String(buffer)
    sm.keyHandle(key)
})
// initial screen clearing
clearEntireTerminal()
let previousLoopTime: number | null = null
const fpsBufferSize : number = 10
const fpsBufferArray : number[] = new Array(fpsBufferSize).fill(0)
let fpsBufferPointer = -1

const loop = ()=>{
    const newTime = new Date().getTime()
    if(previousLoopTime!=null){
        const delta = newTime - previousLoopTime
        const fps = 1000/delta
        if(fps<100){
            fpsBufferPointer = (fpsBufferPointer + 1)%fpsBufferSize
            fpsBufferArray[fpsBufferPointer]=fps
            let fpsSum: number = 0;
            for(let i =0; i<fpsBufferPointer; i++) fpsSum += fpsBufferArray[i];
            sm.setFPS(
                Math.floor(fpsSum/(fpsBufferPointer+1))
            )
            sm.update()
            sm.render()
            previousLoopTime = new Date().getTime()
        }
    }else{
        previousLoopTime = newTime
    }
    setTimeout(loop, 10)
}
loop()