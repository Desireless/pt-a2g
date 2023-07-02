import { UserInfo } from "../models/models";
import { getLocalStorage, setLocalStorage } from "../utils/localstorage.utility";
import { getMinutesDifferenceFromNow } from "../utils/time.utility";

const MAX_TOKEN_DURATION = 180;
interface SignInResponse {
    ok: boolean;
    error?: string | null;
}

// Crear la variable de entorno
const API_URL = 'https://devtest.a2g.io/api';

class AuthService {


    async signIn(email: string, password: string): Promise<SignInResponse> {

        try {
            const user = {
                email: email,
                password: password
            }

            const response = await fetch(API_URL + '/Auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            });

            if (response.ok) {
                const data: UserInfo = await response.json();

                setLocalStorage('token', data.token);
                setLocalStorage('email', data.email);
                setLocalStorage('name', data.name);
                setLocalStorage('ts', data.ts);

                return { ok: true, error: null };
            }
        } catch (error) {
            return { ok: false, error: "Ha ocurrido un error en la petición" };
        }

        return { ok: false, error: "Ha ocurrido un error" };
    }

    getUser(): UserInfo {
        const token = getLocalStorage('token') as string;
        const email = getLocalStorage('email') as string;
        const name = getLocalStorage('name') as string;
        const ts = getLocalStorage('ts') as string;
        return {token, email, name, ts};
    }

    isValidToken(): boolean {
        const token = getLocalStorage('token');
        if (token === null) return false;

        const timestamp: string | null = getLocalStorage('ts')
        if (timestamp !== null && getMinutesDifferenceFromNow(timestamp) > MAX_TOKEN_DURATION) return false;

        return true;
    }
}

export default new AuthService();