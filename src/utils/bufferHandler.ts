// handles double buffer system, and provides updation text for updating the screen
import chalky from "./Chalky"
import { terminalDimension } from "./io"

export class BufferHandler {
    readonly width: number
    readonly height: number
    private cells: {
        value: string,
        x: number,
        y: number,
        dirty: boolean
    }[][]
    constructor(
        width: number,
        height: number
    ){
        this.width = width
        this.height = height
        this.cells = Array.from(Array(height), ()=>new Array(width))
        for(let y = 0; y<height; y++){
            for(let x=0; x<width; x++){
                this.cells[y][x] = {
                    value: " ",
                    x: x,
                    y: y,
                    dirty: false
                } 
            }
        }
    }

    public updateCell(x:number, y:number, value: string){
        if(x>this.width || y>this.height) return;
        if(this.cells[y][x].value!=value){
            this.cells[y][x].value = value
            this.cells[y][x].dirty = true
        }
    }
    public updateLine (y:number, ansiString: string, clearAfter: boolean = false){
        let parsedResult = chalky.parseAnsi(ansiString)
        const parsed = parsedResult.parsed
        let x: number = 0;
        for(let i = 0; i<parsed.length; i++){
            const {codes, text} = parsed[i]
            for(let j = 0; (j<text.length && x<this.width); j++){
                this.updateCell(x, y, 
                    chalky.style(text[j], codes)
                )
                x++;
            }
        }
        if(clearAfter && parsedResult.normalTextLength < this.width){
            for(let i=parsedResult.normalTextLength; i<this.width; i++){
                this.updateCell(i, y, " ")
            }
        }
    }

    public forceDirtyAll (): void {
        // makes all cell dirty
        for(let y=0; y<this.height; y++){
            for(let x=0; x<this.width; x++){
                this.cells[y][x].dirty = true;
            }
        }
    }

    public updateBuffer(): string{
        // updates the buffer and returns the render text
        // stdout of render text with update the terminal screen
        let updationString: string = ""
        for(let y= 0; y<this.height; y++){
            for(let x=0; x<this.width; x++){
                if(this.cells[y][x].dirty){
                    updationString += `\x1B[${y + 1};${x + 1}H`
                    updationString += this.cells[y][x].value
                    this.cells[y][x].dirty = false
                }
            }
        }
        return updationString
    }

    // public checkWithString(compareString: string, yStart: number){
    //     for(let i = 0; i<compareString.length; i++){
    //         const y = Math.floor(i/this.width)

    //     }
    // }
}