const ANSI_CODES : {[index: string]: string}= {
    "black": "\x1b[30m",
    "red": "\x1b[31m",
    "green": "\x1b[32m",
    "yellow": "\x1b[33m",
    "blue": "\x1b[34m",
    "magenta": "\x1b[35m",
    "cyan": "\x1b[36m",
    "white": "\x1b[37m",
    "bgBlack": "\x1b[40m",
    "bgRed": "\x1b[41m",
    "bgGreen": "\x1b[42m",
    "bgYellow": "\x1b[43m",
    "bgBlue": "\x1b[44m",
    "bgMagneta": "\x1b[45m",
    "bgCyan": "\x1b[46m",
    "bgWhite": "\x1b[47m",
    "reset": "\x1b[0m",
    "bold": "\x1b[1m",
    "dim": "\x1b[2m",
    "italic": "\x1b[3m",
    "underline": "\x1b[4m",
    "blink": "\x1b[5m",
    "inverse": "\x1b[7m",
    "hidden": "\x1b[8m",
    "strikethrough": "\x1b[9m"
}
const ansiKeys = new Set<string>(Object.keys(ANSI_CODES))
export const ansiValues = new Set<string>(Object.values(ANSI_CODES))
export default ANSI_CODES