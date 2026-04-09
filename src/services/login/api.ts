import { type LoginModel, type LoginResponseModel, type VerifyModel } from './model'
import { axiosInstance, type BaseError } from '@/services/network'


export async function postLogin_API(payload: LoginModel): Promise<[null, LoginResponseModel] | [BaseError, null]> {
    try {
        const response = <any>await axiosInstance.post('/auth/v1/login/NO_TOKEN ', {
            ...payload
        })

        return [null, response]
    } catch (error) {
        return [error as BaseError, null]
    }
}

export async function postResetEmail_API(email: string): Promise<[any, any]> {
    try {
        const response = await axiosInstance.post('/auth/v1/reset/NO_TOKEN', { email });
        return [null, response];
    } catch (error) {
        return [error, null];
    }
}

export async function postResetVerify_API(payload: any): Promise<[any, any]> {
    try {
        const response = await axiosInstance.post('/auth/v1/reset/verify/NO_TOKEN', payload);
        return [null, response];
    } catch (error) {
        return [error, null];
    }
}

export async function postSendCode_API(email: string): Promise<[any, any]> {
    try {
        const response = await axiosInstance.post('/auth/v1/code/NO_TOKEN', { email });
        return [null, response];
    } catch (error) {
        return [error, null];
    }
}

export async function postVerify_API(payload: VerifyModel): Promise<[null, LoginResponseModel] | [BaseError, null]> {
    try {
        const response = <any>await axiosInstance.post('/auth/v1/verify/NO_TOKEN', payload)
        return [null, response]
    } catch (error) {
        return [error as BaseError, null]
    }
}