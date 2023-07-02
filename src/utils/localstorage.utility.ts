// Opcion 1: guardar todo dentro de una misma key
export const persistLocalStorage = <T,>(key: string, value: T) => {
    localStorage.setItem(key, JSON.stringify({ ...value }));
};

// Opcion 2: guardar cada valor en una key diferente
export const setLocalStorage = <T,>(key: string, value: T) => {
    localStorage.setItem(key, JSON.stringify(value));
};

export const clearLocalStorage = (key: string) => {
    localStorage.removeItem(key);
};

export const getLocalStorage = <T,>(key: string): T | null => {
    const data = localStorage.getItem(key);
    if (data) {
        return JSON.parse(data);
    }
    return null;
};