import { AuthResponse, LoginRequest, LogoutResponse, MeResponse, RegisterRequest } from "@/types";
import apiClient from "./axios.config";

/**
 * Service d'authentification
 */
class AuthService {
    /**
     * Connexion
     */
    async login(credentials: LoginRequest): Promise<AuthResponse> {
        const { data } = await apiClient.post<AuthResponse>('/auth/login', credentials)
        return data
    }
    /**
     * Inscription
     */
    async register(userData: RegisterRequest): Promise<AuthResponse> {
        const { data } = await apiClient.post<AuthResponse>('/auth/register', userData)
        return data
    }

    /**
     * Déconnexion
    */
    async logout(): Promise<LogoutResponse> {
        const { data } = await apiClient.post<LogoutResponse>('/auth/logout')
        return data
    }

    /**
     * Récuperer l'utilisateur connecté
     */
    async me():Promise<MeResponse>{
        const {data} = await apiClient.get<MeResponse>('/auth/me')
        return data
    }

    /**
     * Vérifier si le token est valide
     */
    async checkAuth():Promise<boolean>{
        try{
            await this.me()
            return true
        }catch(error){
            return false
        }
    }
}

export default new AuthService()