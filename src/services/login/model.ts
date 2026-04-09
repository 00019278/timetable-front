export interface LoginModel {
    phone: string;
    email: string;
    password: string;
    name: string;
    surname: string;
    code: string;
    newPassword: string;
}


export interface VerifyModel {
    name: string;
    surname: string;
    email: string;
    code: number;
    password: string;
}

export interface LoginResponseModel {
    token: string;
}