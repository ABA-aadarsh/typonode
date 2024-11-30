import ANSI_CODES from "./utils/ansiCodes";
import chalky from "./utils/Chalky";
import { clearScreen } from "./utils/io";
import { SM } from "./view/ScreenManager";
import process from "node:process"

const sm = new SM()
process.stdin.on("data", (buffer: Buffer)=>{
    const key = String(buffer)
    sm.keyHandle(key)
})
// initial screen clearing
clearScreen()
sm.intiateAnimation();