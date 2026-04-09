import type { TimetableAllModel, TimetableModel } from './model'
import { axiosInstance,type BaseError } from '@/services/network'


export async function getTimetables_API(): Promise<[BaseError, null] | [null, TimetableModel[]]> {
    try {
        const response = <TimetableModel[]> await axiosInstance.get('/timetable/v1/timetable')
        
        return [null, response]
    } catch (error) {
        return [error as BaseError, null]
    }
}

export async function getTimetableById_API(id: string): Promise<[BaseError, null] | [null, TimetableAllModel]> {
    try {
        const response = <TimetableAllModel> await axiosInstance.get(`/timetable/v1/timetable/${id}`)
        
        return [null, response]
    } catch (error) {
        return [error as BaseError, null]
    }
}



export async function createTimetable_API(payload: TimetableModel): Promise<[null, TimetableModel] | [BaseError, null]> {
    try {
        const response = <any> await axiosInstance.post('/timetable/v1/timetable', {
            ...payload
        })

        return [null, response]
    } catch (error) {
        return [error as BaseError, null]
    }
}

export async function generateTimetable_API(name: string): Promise<[null, TimetableModel] | [BaseError, null]> {
    try {
        const response = <any> await axiosInstance.post('/timetable/v1/timetable/generate', {
            name
        })

        return [null, response]
    } catch (error) {
        return [error as BaseError, null]
    }
}