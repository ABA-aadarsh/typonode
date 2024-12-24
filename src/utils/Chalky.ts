// chalky: ansi escape code based text formatter. stripped down version of chalk.js
import ANSI_CODES, { ansiValues } from "./ansiCodes"


class ChalkyMainUtility {
  // General functions
  protected stylesList: Set<number>
  constructor() {
    this.stylesList = new Set<number>()
  }
  protected applyStyles(text: string | number) {
    let styledText: string
    const resetANSI = ANSI_CODES.reset
    styledText = this.getAnsiCode([...this.stylesList]) + text + this.getAnsiCode(resetANSI)
    this.stylesList.clear()
    return styledText
  }
  style(text: string | number, listOfStyles: number[]) {
    // directly apply styles
    for (let i = 0; i < listOfStyles.length; i++) {
      if (ansiValues.has(listOfStyles[i])) {
        this.stylesList.add(listOfStyles[i])
      }
    }
    return this.applyStyles(text)
  }
  private getAnsiCode(code: number[] | number): string {
    if (typeof code == "number") {
      return `\x1b[${code}m`
    }
    return `\x1b[${code.join(";")}m`
  }
  public stripAnsi(ansiString: string): string {
    // TODO: input: \x1b[30mHelloWorld , output : HelloWorld
    return ansiString.replace(/\x1b\[[0-9;]*m/g, "");
  }
  public parseAnsi = (ansiCodedText: string): {
    parsed: {
      codes: number[],
      text: string
    }[],
    normalTextLength: number,
    ansiTextLength: number,
    ansiCodesCount: number
  } => {
    let i: number;
    let normalTextLength: number = 0;
    let text: string = ""
    let stylesCode: number[] = []
    let ansiCodesCount: number = 0;
    const parsed: { codes: number[], text: string }[] = []
    const ESC: string = "\x1b"
    for (i = 0; i < ansiCodedText.length; i++) {
      if (ansiCodedText[i] == ESC) {
        // ansi codes handle
        if (text != "") {
          parsed.push(
            {
              codes: stylesCode,
              text: text
            }
          )
          normalTextLength += text.length
          text = "";
          stylesCode = [];
        }
        i++; // skip ESC

        if (ansiCodedText[i] == "[") {
          i++; // skip [
          let codeString: string = ""
          while (i < ansiCodedText.length && ansiCodedText[i] != "m") {
            codeString += ansiCodedText[i]
            i++;
          }
          ansiCodesCount += codeString.split(";").length
          stylesCode.push(
            ...codeString.split(";").map(Number)
          )
        }
        // i++ done by the for loop will skip the "m"
      }
      else {
        // handle normal text
        text += ansiCodedText[i]
      }
    }
    if (text) {
      normalTextLength += text.length
      parsed.push(
        {
          codes: stylesCode,
          text: text
        }
      )
    }
    return {
      parsed,
      normalTextLength,
      ansiTextLength: ansiCodedText.length - normalTextLength,
      ansiCodesCount
    }
  }
}
class Chalky extends ChalkyMainUtility {
  private proxy: ChalkyProxy;

  constructor() {
    super();
    this.proxy = new Proxy(this.applyStyles.bind(this), {
      get: (target, prop: string) => {
        if (prop in ANSI_CODES) {
          this.stylesList.add(ANSI_CODES[prop])
          return this.proxy; // Return proxy for chaining
        }
        return Reflect.get(target, prop); // Default behavior
      },
      apply: (target, thisArg, args: string[] | number[]) => {
        return target(args[0]); // Call applyStyles
      },
    }) as ChalkyProxy;
  }

  // getter methods for basic formatting

  get bold(){
    this.stylesList.add(ANSI_CODES.bold)
    return this.proxy
  }
  get italic(){
    this.stylesList.add(ANSI_CODES.italic)
    return this.proxy
  }
  get underline(){
    this.stylesList.add(ANSI_CODES.underline)
    return this.proxy
  }
  get red(){
    this.stylesList.add(ANSI_CODES.red)
    return this.proxy
  }
  get yellow(){
    this.stylesList.add(ANSI_CODES.yellow)
    return this.proxy
  }
  get orange(){
    this.stylesList.add(ANSI_CODES.orange)
    return this.proxy
  }
  get white(){
    this.stylesList.add(ANSI_CODES.white)
    return this.proxy
  }
  get black(){
    this.stylesList.add(ANSI_CODES.black)
    return this.proxy
  }
  get green(){
    this.stylesList.add(ANSI_CODES.green)
    return this.proxy
  }
  get cyan(){
    this.stylesList.add(ANSI_CODES.cyan)
    return this.proxy
  }
  get dim(){
    this.stylesList.add(ANSI_CODES.dim)
    return this.proxy
  }
  get bgRed(){
    this.stylesList.add(ANSI_CODES.bgRed)
    return this.proxy
  }
  get bgYellow(){
    this.stylesList.add(ANSI_CODES.bgYellow)
    return this.proxy
  }
  get bgWhite(){
    this.stylesList.add(ANSI_CODES.bgWhite)
    return this.proxy
  }
  get bgCyan(){
    this.stylesList.add(ANSI_CODES.bgCyan)
    return this.proxy
  }
}




type ChalkyProxy = {
  // Foreground colors
  red: ChalkyProxy;
  yellow: ChalkyProxy;
  orange: ChalkyProxy;
  white: ChalkyProxy;
  black: ChalkyProxy;
  green: ChalkyProxy;
  cyan: ChalkyProxy;

  // Background colors
  bgRed: ChalkyProxy;
  bgYellow: ChalkyProxy;
  bgWhite: ChalkyProxy;
  bgCyan: ChalkyProxy;

  // Text styles
  bold: ChalkyProxy;
  italic: ChalkyProxy;
  underline: ChalkyProxy;
  dim: ChalkyProxy;

  // Callable to apply styles to text
  (text: string | number): string;
};



// Create an instance of Chalky
const chalky = new Chalky();
export default chalky;