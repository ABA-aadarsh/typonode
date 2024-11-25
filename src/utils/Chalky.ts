import ANSI_CODES, { ansiValues } from "./ansiCodes"

// chalky: ansi escape code based text formatter. stripped down version of chalk.js
class Chalky {
  stylesList : Set<string>
  constructor() {
    this.stylesList= new Set<string>()
  }
  private applyStyles (text: string){
    let styledText : string = ""
    const resetANSI = ANSI_CODES.reset
    for(const style of this.stylesList){
      styledText += style
    }
    styledText+= text + resetANSI;
    this.stylesList.clear()
    return styledText
  }
  style(text: string, listOfStyles: string[]) {
    let styledText : string = ""
    for(let i = 0; i<listOfStyles.length; i++){
      if(ansiValues.has(listOfStyles[i])){
        styledText += listOfStyles[i]
      }
    }
    styledText += text + ANSI_CODES.reset
    return styledText
  }
  private proxy = new Proxy (this.applyStyles, 
    {
      get: (target: (text:string)=>{}, prop)=>{
        if(prop in this){
          return (this as any)[prop]
        }
        return null
      },
      apply: (target: (...args: any)=>{}, thisArg: any, argArray: any[])=>{
        return target(...argArray);
      }
    }
  )
}

const chalky = new Chalky()
export default chalky