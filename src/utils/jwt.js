export function parse(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(window.atob(base64));
}

export function getExpirationDate(token) {
    const { exp } = parse(token);
    return new Date(exp * 1000);
}

export function isExpired(token) {
    const { exp } = parse(token);
    // console.log('Segundos restantes:', (exp * 1000 - Date.now()) / 1000)
    return Date.now() >= exp * 1000;
}
