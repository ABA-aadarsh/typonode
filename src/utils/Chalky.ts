// chalky: ansi escape code based text formatter. stripped down version of chalk.js
import ANSI_CODES, { ansiValues } from "./ansiCodes"

class ChalkyMainUtility {
  stylesList: Set<number>
  constructor(){
    this.stylesList = new Set<number>()
  }
  private applyStyles(text: string | number) {
    let styledText: string
    const resetANSI = ANSI_CODES.reset
    styledText = this.getAnsiCode([...this.stylesList]) + text + this.getAnsiCode(resetANSI)
    this.stylesList.clear()
    return styledText
  }
  style(text: string | number, listOfStyles: number[]) {
    for (let i = 0; i < listOfStyles.length; i++) {
      if (ansiValues.has(listOfStyles[i])) {
        this.stylesList.add(listOfStyles[i])
      }
    }
    return this.applyStyles(text)
  }
  private proxy = new Proxy(this.applyStyles,
    {
      get: (target: (text: string) => {}, prop) => {
        if (prop in this) {
          return (this as any)[prop]
        }
        return null
      },
      apply: (target: (...args: any) => {}, thisArg: any, argArray: any[]) => {
        return target(...argArray);
      }
    }
  )
  private getAnsiCode(code: number[] | number): string {
    if (typeof code == "number") {
      return `\x1b[${code}m`
    }
    return `\x1b[${code.join(";")}m`
  }
  public stripAnsi (ansiString: string): string {
    // TODO: input: \x1b[30mHelloWorld , output : HelloWorld
    return ""
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
  // TODO: add getter methods for basic formatting
}

const chalky = new Chalky()
export default chalky