const ANSI_CODES : {[index: string]: number}= {
    "black": 30,
    "red": 31,
    "green": 32,
    "yellow": 33,
    "blue": 34,
    "magenta": 35,
    "cyan": 36,
    "white": 37,
    "bgBlack": 40,
    "bgRed": 41,
    "bgGreen": 42,
    "bgYellow": 43,
    "bgBlue": 44,
    "bgMagneta": 45,
    "bgCyan": 46,
    "bgWhite": 47,
    "reset": 0,
    "bold": 1,
    "dim": 2,
    "italic": 3,
    "underline": 4,
    "blink": 5,
    "inverse": 7,
    "hidden": 8,
    "strikethrough": 9
}
export const ansiCode = (code:number): string=>{
    return `\x1b[${code}m`
}

const ansiKeys = new Set<string>(Object.keys(ANSI_CODES))
export const ansiValues = new Set<number>(Object.values(ANSI_CODES))
export default ANSI_CODES