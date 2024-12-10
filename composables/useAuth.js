import { useAxios } from '@/composables/useAxios';
import { useCookie } from '#app';

const axios = useAxios();

export const useAuth = () => {
    const userId = useCookie('user-id')
    const userToken = useCookie('user-token')
    const userMenu = useCookie('user-menu')
    const userRole = useCookie('user-role')

    const login = async (email, password) => {
        try {
            const res = await axios.post('/auth/login', {
                email: email,
                password: password
            });

            userToken.value = res.data.token;
            userToken.options = { maxAge: 60 * 60 };
            userId.value = res.data.userId;
            userMenu.value = res.data.menu;
            userRole.value = res.data.role;

            return true;
        } catch (error) {
            console.error('Login error:', error);

            return false;
        }
    };

    const register = async (name, email, password) => {
        try {
            const data = await axios.post('/auth/register', {
                name: name,
                email: email,
                password: password
            });
            userToken.value = data.token;

            return true;
        } catch (error) {
            console.error('Register error:', error);

            return false;
        }
    };

    const logout = () => {
        userToken.value = null;
        userToken.options = { maxAge: -1 };
        userId.value = null;
        userMenu.value = null;
        userRole.value = null;
    }

    return { login, register, logout, userId, userToken, userRole, userMenu };
};