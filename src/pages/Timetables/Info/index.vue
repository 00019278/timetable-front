<script lang="ts" setup>
import { computed, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getTimetableAll_DEFAULT, getTimetableById_API, type TimetableAllModel } from '@/services/timetable';

const route = useRoute();
const _loading = ref(true);
const _items = ref<TimetableAllModel>(getTimetableAll_DEFAULT());

// Haftaning kunlari va soatlar (Period)
const DAYS = [
    { key: 'MONDAY', label: 'Monday' },
    { key: 'TUESDAY', label: 'Tuesday' },
    { key: 'WEDNESDAY', label: 'Wednesday' },
    { key: 'THURSDAY', label: 'Thursday' },
    { key: 'FRIDAY', label: 'Friday' },
    { key: 'SATURDAY', label: 'Saturday' }
];
const PERIODS = [1, 2, 3, 4, 5, 6, 7];

// --- API DAN MA'LUMOT YUKLASH ---
async function loadItems() {
    _loading.value = true;
    const id = route.params.id ? String(route.params.id) : '';
    const [error, response] = await getTimetableById_API(id);
    
    if (!error && response) {
        _items.value = response;
    }
    _loading.value = false;
}

// --- 1. SINFLARNI TARTIBLASH (1A, 1B ... 10A, 11B) ---
const sortedClasses = computed(() => {
    if (!_items.value.classes) return [];
    
    return [..._items.value.classes].sort((a, b) => {
        const nameA = a.shortName || a.name || '';
        const nameB = b.shortName || b.name || '';

        const numA = parseInt(nameA.match(/\d+/)?.[0] || '0', 10);
        const numB = parseInt(nameB.match(/\d+/)?.[0] || '0', 10);

        const strA = nameA.replace(/\d+/g, '').trim().toLowerCase();
        const strB = nameB.replace(/\d+/g, '').trim().toLowerCase();

        if (numA !== numB) {
            return numA - numB;
        }
        
        return strA.localeCompare(strB);
    });
});

// --- 2. JADVAL MAP (Oson qidirish uchun strukturaga o'tkazish) ---
const scheduleMap = computed(() => {
    const map: Record<number, Record<string, Record<number, any[]>>> = {};

    _items.value.classes?.forEach(cls => {
        map[cls.id] = {};
        DAYS.forEach(day => {
            map[cls.id]![day.key] = {}; 
        });
    });

    _items.value.timetableData?.forEach(data => {
        const cId = data.classId;
        const day = data.dayOfWeek;
        const hour = data.hour;

        if (!map[cId]) map[cId] = {};
        if (!map[cId]![day]) map[cId]![day] = {};

        const slots = (data.slotDetails || [])?.map((slot: any) => {
            const subject = _items.value.subjects?.find(s => s.id === slot.subjectId);
            const teacher = _items.value.teachers?.find(t => t.id === slot.teacherId);
            const room = _items.value.rooms?.find(r => r.id === slot.roomId);
            const group = slot.groupId ? _items.value.groups?.find(g => g.id === slot.groupId) : null;

            const subjectDisplay = subject?.name || subject?.shortName || `Fan belgilanmagan`;
            const teacherDisplay = teacher?.shortName || teacher?.fullName || 'Ustoz belgilanmagan';
            const roomDisplay = room?.name || 'Xona yo\'q';

            return {
                id: slot.lessonId || Math.random(),
                subjectName: subjectDisplay,
                teacherName: teacherDisplay,
                roomName: roomDisplay,
                groupName: group?.name || ''
            };
        });

        map[cId]![day]![hour] = slots; 
    });

    return map;
});

onMounted(() => {
    loadItems();
});
</script>

<template>
    <div v-loading="_loading" class="flex flex-col gap-8 pb-10 min-h-[50vh]">
        
        <div class="flex items-center justify-between bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <div>
                <h1 class="text-2xl font-bold text-gray-800">Dars jadvali</h1>
                <p class="text-gray-500 text-sm mt-1">Sinflar kesimida umumiy ko'rinish</p>
            </div>
            <el-button @click="$router.back()" plain class="!rounded-xl shadow-sm">
                <i class="ri-arrow-left-line mr-2"></i> Orqaga
            </el-button>
        </div>

        <template v-if="!_loading && sortedClasses.length > 0">
            <div v-for="cls in sortedClasses" :key="cls.id" class="flex flex-col rounded-xl overflow-hidden bg-white shadow-sm border border-gray-200">
                
                <div class="bg-[#4F46E5] text-white px-5 py-3 font-bold text-lg tracking-wide shadow-sm z-10">
                    Class {{ cls.shortName || cls.name }}
                </div>

                <div class="overflow-x-auto p-4">
                    <table class="w-full min-w-[1000px] border-collapse table-fixed">
                        
                        <thead>
                            <tr>
                                <th class="w-[80px] border-b border-r border-gray-200 bg-[#f8fafc] p-3 text-center text-sm font-bold text-gray-600">Time</th>
                                <th v-for="day in DAYS" :key="day.key" class="w-[150px] border-b border-r border-gray-200 bg-[#f8fafc] p-3 text-center text-sm font-bold text-gray-600 last:border-r-0">
                                    {{ day.label }}
                               </th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr v-for="period in PERIODS" :key="period" class="border-b border-gray-200 last:border-b-0">
                                
                                <td class="border-r border-gray-200 p-2 text-center align-middle font-medium text-[13px] text-gray-500 bg-[#f8fafc]">
                                    Period {{ period }}
                                </td>

                                <td v-for="day in DAYS" :key="day.key" class="border-r border-gray-200 p-1.5 align-top last:border-r-0">
                                    
                                    <div v-if="scheduleMap[cls.id]?.[day.key]?.[period]" class="flex flex-col gap-1.5 h-full min-h-[80px]">
                                        
                                        <div v-for="slot in scheduleMap[cls.id]?.[day.key]?.[period]" :key="slot.id" 
                                             class="flex flex-col justify-center bg-white border border-gray-200 rounded-lg p-2 min-h-[80px] text-center shadow-sm">
                                            
                                            <span v-if="slot.groupName" class="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded self-center mb-1">
                                                {{ slot.groupName }}
                                            </span>

                                            <p class="text-[12px] font-bold text-gray-800 leading-tight mb-1 truncate px-1" :title="slot.subjectName">
                                                <span v-if="slot.subjectName !== 'Fan belgilanmagan'">{{ slot.subjectName }}</span>
                                                <span v-else class="text-red-400 italic font-medium">Dars kiritilmagan</span>
                                            </p>
                                            
                                            <p class="text-[11px] text-gray-500 leading-tight mb-0.5 truncate px-1" :title="slot.teacherName">
                                                {{ slot.teacherName }}
                                            </p>
                                            
                                            <p class="text-[10px] text-gray-400 leading-tight italic truncate px-1">
                                                {{ slot.roomName }}
                                            </p>
                                        </div>
                                    </div>

                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </template>

        <div v-if="!_loading && sortedClasses.length === 0" class="py-24 flex flex-col items-center justify-center gap-3 bg-white rounded-2xl border border-gray-200">
            <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-2">
                <i class="ri-calendar-event-line text-3xl text-gray-400"></i>
            </div>
            <h3 class="text-lg font-bold text-gray-700">Ma'lumot topilmadi</h3>
            <p class="text-gray-500 text-sm font-medium">Bu jadvalga hali darslar biriktirilmagan</p>
        </div>
    </div>
</template>

<style scoped>
.table-fixed {
    table-layout: fixed;
}

.overflow-x-auto::-webkit-scrollbar {
    height: 8px;
}
.overflow-x-auto::-webkit-scrollbar-track {
    background: #f8fafc;
    border-radius: 4px;
    margin: 0 16px;
}
.overflow-x-auto::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
}
.overflow-x-auto::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
}
</style>