import { PlatformApiResponse, PlatformServiceResponse } from "../models/models";
import { getLocalStorage } from "../utils/localstorage.utility";
import { getMinutesDifferenceFromNow } from "../utils/time.utility";



// Crear la variable de entorno
const API_URL = 'https://devtest.a2g.io/api';
const BASE_URL = `${API_URL}/Platforms`;
const MAX_TOKEN_DURATION = 180; // 3 horas

class PlatformService {

    async getPlatforms(pageNumber: number, pageSize: number, fleet: string): Promise<PlatformServiceResponse> {
        const token = getLocalStorage('token');
        if (token === null) return { ok: false, error: "token", data: null };

        const timestamp: string | null = getLocalStorage('ts')
        if (timestamp !== null && getMinutesDifferenceFromNow(timestamp) > MAX_TOKEN_DURATION) return { ok: false, error: "token_expired", data: null };

        // encodeURIComponent debido a los espacios del string fleet
        const query = `?pageNumber=${pageNumber}&pageSize=${pageSize}&fleet=${encodeURIComponent(fleet)}`;
        const url = `${BASE_URL}${query}`;


        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data: PlatformApiResponse = await response.json();
                return { ok: true, error: null, data: data };
            }
        } catch (error) {
            return { ok: false, error: "request", data: null };
        }

        return { ok: false, error: "platformservice", data: null };
    }


}

export default new PlatformService();