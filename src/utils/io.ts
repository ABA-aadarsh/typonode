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

export const clearVisibleScreen = ()=>{
    process.stdout.write("\x1b[2J\x1b[H"); // Clear the screen
}

export const clearEntireTerminal = ()=>{
    // clears visible buffer + scrollback buffer + puts cursor to top
    process.stdout.write("\x1b[3J\x1b[2J\x1b[H");
}

export const _keys = {
    "arrowUp": "\x1b[A",
    "arrowDown": "\x1b[B",
    "arrowLeft": "\x1b[D",
    "arrowRight": "\x1b[C",
    "tab": "\t",
    "space": " ",
    "empty": "",
    "ctrl_c": "\x03",
    "ctrl_s": "\x13",
    "ctrl_m": "\x0d", // ctrl+m == \r
    "ctrl_t": "\x14",
    "ctrl_r": "\x12",
    "ctrl_o": "\x0f",
    "backspace": "\b",
    "backspaceLinux": "\x7f",
    "enter": "\r"
}