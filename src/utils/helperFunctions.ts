export const getTimeFormatFromMilliseconds = (milliseconds:number):string =>{
    const s = Math.floor(milliseconds/1000)
    const ms = Math.floor(milliseconds%1000)
    return `${String(s).padStart(2, "0")}.${String(ms).padStart(2,"0").slice(0,2)}`
}