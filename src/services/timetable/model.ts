import type { ClassModel } from "../class";
import type { RoomModel } from "../room";
import type { SubjectModel } from "../subject";
import type { TeacherModel } from "../teacher";

export interface TimetableModel {
    id: number | null;
    taskId: number | null;
    name: string;
    scheduled: number | null;
    unscheduled: number | null;
    score: number | null;
    teacherGaps: number | null;
    classGaps: number | null;
    deleted: boolean;
    createdDate: Date | string | null;
}


export interface TimetableAllModel {
    classes: ClassModel[];
    groups: any[];
    rooms: RoomModel[];
    subjects: SubjectModel[];
    teachers: TeacherModel[];
    timetableData: TimetableModel[] | any[];
}