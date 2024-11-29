import process from "node:process"

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

export const disableCursor = (): void => {
    process.stdout.write("\x1B[?25l");
}

export const enableCursor = (): void => {
    process.stdout.write("\x1B[?25h");
}

export const clearScreen = ()=>{
    process.stdout.write('\x1B[2J'); // Clear the screen
}