export function isAuthenticated() {
    return sessionStorage.getItem('logged_user') !== null;
}