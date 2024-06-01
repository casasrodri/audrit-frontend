export function isObjectEmpty(obj) {
    return Object.keys(obj).length === 0 && obj.constructor === Object
}


export function adaptarTextoParaUrl(texto) {
    return texto
        // .toLowerCase() // Convertimos a minúsculas
        .replace(/ /g, '-') // Reemplazamos los espacios por guiones
        .normalize("NFD") // Normalizamos el texto a su forma de descomposición
        .replace(/[\u0300-\u036f]/g, "") // Eliminamos las marcas diacríticas (acentos)
        .replace('/', '-') // Reemplazamos las barras por guiones
        .replace('.', '') // Reemplazamos los puntos por nada
        .replace(',', '') // Reemplazamos las comas por nada
}

export function fechaFormato(fecha) {
    try {
        return fecha.split('-').reverse().join('/')
    } catch (error) {
        // console.log(error)
        return fecha
    }
}

export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
