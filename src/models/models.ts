export interface UserInfo {
    token: string;
    email: string;
    name: string;
    ts: string;
}

export interface Platform {
    id: string;
    name: string;
    img: string;
    fleet: string;
}

export interface PlatformInfo {
    id: string;
    name: string;
    fleet: string;
    img: string;
    lastReport: string;
    sensors: Sensor[];
}

export interface Sensor {
    id: string;
    name: string;
    type: string;
}

export interface PlatformApiResponse {
    pageNumber: number;
    pageSize: number;
    firstPage: string;
    lastPage: string;
    totalPages: number;
    totalRecords: number;
    nextPage: string | null;
    previousPage: string | null;
    data: Platform[];
    succeeded: boolean;
    errors: any[] | null;
    message: string | null;
}

export interface PlatformServiceResponse {
    ok: boolean;
    error: string | null;
    data: PlatformApiResponse | null;
}