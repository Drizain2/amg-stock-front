import { authService, localStorageService } from "@/services";
import { UserRole, type LoginRequest, type RegisterRequest, type User } from "@/types";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useToast } from "vue-toastification";

const toast = useToast();

export const useAuthStore = defineStore("auth", () => {
    //State
    const user = ref<User | null>(null);
    const token = ref<string | null>(null);
    const isLoading = ref(false);

    //Getters
    const isAuthenticated = computed(() => !!token.value && !!user.value);
    const userRole = computed(() => user.value?.role.name || null);
    const isSuperAdmin = computed(() => userRole.value === UserRole.SUPER_ADMIN);
    const isCompanyAdmin = computed(() => userRole.value === UserRole.COMPANY_ADMIN);
    const isBranchManager = computed(() => userRole.value === UserRole.BRANCH_MANAGER);
    const isEmployee = computed(() => userRole.value === UserRole.EMPLOYEE);
    const userCompanyId = computed(() => user.value?.company?.id || null);
    const userBranchId = computed(() => user.value?.branch?.id || null);

    //Actions
    const login = async (credentials: LoginRequest) => {
        try {
            isLoading.value = true;
            const response = await authService.login(credentials);

            user.value = response.user;
            token.value = response.token;

            //Sauvegarder dans le localStorage
            localStorageService.setAuthToken(response.token);
            localStorageService.setUser(response.user);

            toast.success(`Bienvenue ${response.user.full_name} !`)
            return response;
        } catch (error) {
            toast.error("Identifiants invalides");
            throw error;
        } finally {
            isLoading.value = false;
        }
    }

    const register = async (userData: RegisterRequest) => {
        try{
            isLoading.value = true;
            const response = await authService.register(userData);

            user.value = response.user;
            token.value = response.token;

             //Sauvegarder dans le localStorage
            localStorageService.setAuthToken(response.token);
            localStorageService.setUser(response.user);

            toast.success('Inscription réussie !')
            return response;
        }catch(error){
            toast.error("Erreur lors de l'inscription");
            throw error;
        }finally{
            isLoading.value = false;
        }
    }

    const logout = async () => {
        try {
            if (token.value) {
                await authService.logout()
            }
        } catch (error) {
            console.error("Erreur lors de la déconnexion:", error);
        } finally {
            //Nettoyer l'état local
            user.value = null;
            token.value = null;
            //Nettoyer le localStorage
            localStorageService.clearAuthData();

            toast.info("Vous avez été déconnecté.");
        }
    }

    const checkAuth = async()=>{
        const storedToken = localStorageService.getAuthToken();
        const storedUser = localStorageService.getUser<User>();

        if(storedToken && storedUser){
            token.value = storedToken;
            user.value = storedUser;

            try{
                const response = await authService.me();
                user.value = response.user;
                localStorageService.setUser(response.user);
            }catch(error){
                //Token invalide ou expiré
                await logout();
            }
        }
    }

    const refreshUser = async()=>{
        try{
            const response = await authService.me();
            user.value = response.user;
            localStorageService.setUser(response.user);
        }catch(error){
            console.error("Erreur lors de la mise à jour de l'utilisateur:",error);
        }
    }

    const hasPermission= (permission: string):boolean=>{
        if(!user.value) return false;

        const rolePermissions: Record<UserRole, string[]> = {
            [UserRole.SUPER_ADMIN]:["*"],
            [UserRole.COMPANY_ADMIN]:[
                'manage.companies',
                'manage.branches',
                'manage.users',
                'manage.products',
                'manage.stock',
                'view.reports'
            ],
            [UserRole.BRANCH_MANAGER]:['manage.products','manage.stock','view.reports'],
            [UserRole.EMPLOYEE]:['view.stock','view.products']
        }

        const permissions = rolePermissions[user.value.role.name]||[];
        return permissions.includes('*') || permissions.includes(permission);
    }

    const canAccessCompany = (companyId: number): boolean => {
        if(isSuperAdmin.value) return true;
        return userCompanyId.value === companyId;
    }

    const canAccessBranch = (branchId: number): boolean => {
        if(isSuperAdmin.value) return true;
        if(isCompanyAdmin.value){
            const userCompId = userCompanyId.value;
            const branchCompId = user.value?.company?.id;
            return userCompId === branchCompId;
        }
        return userBranchId.value === branchId;
    }
    return{
        //State
        user,
        token,
        isLoading,

        //Getters
        isAuthenticated,
        userRole,
        isSuperAdmin,
        isCompanyAdmin,
        isBranchManager,
        isEmployee,
        userCompanyId,
        userBranchId,

        //Actions
        login,
        register,
        logout,
        checkAuth,
        refreshUser,
        hasPermission,
        canAccessCompany,
        canAccessBranch
    }
},{
    persist:{
        key:'auth',
        storage: localStorage,
        pick:['user','token'],
    },
});