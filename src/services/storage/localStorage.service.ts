import { STORAGE_KEYS } from "@/utils";

/**
 * Service de gestion du localStorage
 */
class LocalStorageService {
    /**
     * Sauvegarde une valeur dans le localStorage
     */
    set<T>(key: string, value: T): void {
        try {
            const serialized = JSON.stringify(value);
            localStorage.setItem(key, serialized);
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    }

    /**
     * Récupère une valeur depuis le localStorage
     */
    get<T>(key: string): T | null {
        try {
            const item = localStorage.getItem(key);
            if (!item) return null;
            return JSON.parse(item) as T;
        } catch (error) {
            console.error('Error getting from localStorage:', error);
            return null;
        }
    }

    /**
     * Supprime une valeur du localStorage
     */
    remove(key: string): void {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Error removing from localStorage:', error);
        }
    }

    /**
     * Vide le localStorage
     */
    clear(): void {
        try {
            localStorage.clear();
        } catch (error) {
            console.error('Error clearing localStorage:', error);
        }
    }

    /**
     * Vérifie si une clé existe dans le localStorage
     */
    has(key: string): boolean {
        return localStorage.getItem(key) !== null;
    }

    //Methode spécifique pour les tokens d'authentification
    /**
     * Sauvegarde le token d'authentification
     */
    setAuthToken(token: string): void {
        this.set(STORAGE_KEYS.AUTH_TOKEN, token);
    }

    /**
     * Récupère le token d'authentification
     */
    getAuthToken(): string | null {
        return this.get<string>(STORAGE_KEYS.AUTH_TOKEN);
    }

    /**
     * Supprime le token d'authentification
     */
    removeAuthToken(): void {
        this.remove(STORAGE_KEYS.AUTH_TOKEN);
    }

    /**
     * Sauvegarde les informations de l'utilisateur
     */
    setUser<T>(user: T): void {
        this.set(STORAGE_KEYS.USER, user);
    }

    /**
     * Récupère les informations de l'utilisateur
     */
    getUser<T>(): T | null {
        return this.get<T>(STORAGE_KEYS.USER);
    }

    /**
     * Supprime les informations de l'utilisateur
     */
    removeUser(): void {
        this.remove(STORAGE_KEYS.USER);
    }

    /**
     * Sauvegarde les préférences de l'utilisateur
     */
    setRememberMe<T>(value: T): void {
        this.set(STORAGE_KEYS.REMEMBER_ME, value);
    }

    /**
     * Récupère les préférences de l'utilisateur
     */
    getRememberMe(): boolean {
        return this.get<boolean>(STORAGE_KEYS.REMEMBER_ME) ? true : false;
    }

    /**
     * Nettoie les données d'authentification
     */
    clearAuthData(): void {
        this.removeAuthToken();
        this.removeUser();
    }

}

export default new LocalStorageService()