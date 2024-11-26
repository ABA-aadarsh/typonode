import { SM } from "./view/ScreenManager";
import process from "node:process"

const sm = new SM()
process.stdin.on("data", (buffer: Buffer)=>{
    const key = String(buffer)
    sm.keyHandle(key)
})


setInterval(() => {
    sm.render();
}, 300);