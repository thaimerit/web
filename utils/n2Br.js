export function n2Br(text){
    if(!text) return ''
    return text.replace(/\n/g, "<br>")
}