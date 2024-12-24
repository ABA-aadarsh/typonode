const isVowel = (char:string):boolean =>{
    return "aeiouAEIOU".includes(char)
}

export const convertToPiglatin = (word:string): string=>{
    if(isVowel(word[0])){
        return word + "way";
    }
    else{
        const firstVowelIndex = [...word].findIndex(x=>isVowel(x))
        if(firstVowelIndex==-1) return word + "ay";
        const prefix = word.slice(0, firstVowelIndex)
        const rest = word.slice(firstVowelIndex)
        let piglatinWord = rest + prefix + "ay";
        if(word[0]==word[0].toUpperCase()){
            return piglatinWord[0].toUpperCase() + piglatinWord.slice(1).toLowerCase()
        }
        return piglatinWord
    }
}