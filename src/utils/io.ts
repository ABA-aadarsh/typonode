import process from "node:process"

const paddingText = "    " // 4 spaces


export const terminalDimension = {
    width: process.stdout.columns,
    height: process.stdout.rows
}

export const writeOnScreen = (
    data: string, 
    pos1 : {x: number, y: number}, 
    pos2: {x: number, y:number}
)=>{
    process.stdout.cursorTo(pos1.x, pos1.y)
    process.stdout.clearScreenDown()
    process.stdout.write(data)
}