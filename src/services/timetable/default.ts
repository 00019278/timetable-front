import type { TimetableAllModel, TimetableModel } from "./model"

export function getTimetable_DEFAULT(): TimetableModel {
  const object: TimetableModel = {
    id: null,
    taskId: null,
    name: '',
    scheduled: null,
    unscheduled: null,
    score: null,
    teacherGaps: null,
    classGaps: null,
    deleted: false,
    createdDate: '',
  }

  return object
}

export function getTimetableAll_DEFAULT(): TimetableAllModel {
  const object: TimetableAllModel = {
    classes: [],
    groups: [],
    rooms: [],
    subjects: [],
    teachers: [],
    timetableData: [],
  }

  return object
}