export function isObjectEmpty(obj) {
    return Object.keys(obj).length === 0 && obj.constructor === Object
}


export function adaptarTextoParaUrl(texto) {
    return texto.toLowerCase().replace(/ /g, '-').normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}
