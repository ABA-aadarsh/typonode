// dumb simple string top-down buffer generator. from small components

import { terminalDimension } from "./io";

const tabValue = " ".repeat(4) //replace \t with 4 spaces

const getSimplifiedText = (text:string): string => {
    // returns text without ansi-codes
    const ansiRegex = /\x1B\[\d+m/g
    let simplifiedText: string = text.replace(ansiRegex, "")
    return simplifiedText
}

// components props :  content, height
export const getBuffer = (componentsList : {
    content: string,
    height?: number,
    margin?: number
}[]): string=>{
    let buffer: string = ""; // buffer for the renderer
    let maxCharLimit: number = 0 // max char limit for each component
    let contentHeight: number = 0 // content height, calculated based on content character size
    let viewableContent : string = ""
    for(const component of componentsList){
        component.content = component.content.replace("\t", tabValue)
        if(!component.height) component.height = 1; // default height 1
        if(!component.margin) component.margin = 0; // default margin 0 (bottom margin)


        maxCharLimit = terminalDimension.width * component.height;
        viewableContent = component.content.slice(0, maxCharLimit)
        contentHeight = Math.ceil(viewableContent.length / terminalDimension.width)
        buffer+= viewableContent + '\n'.repeat(component.height - contentHeight+1) // viewable content + content height adjustment 
        buffer += '\n'.repeat(component.margin)
    }
    return buffer
}