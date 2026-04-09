<script lang="ts" setup>
import { ref } from 'vue';
import TheModal from './Modal.vue';
import { useRouter } from 'vue-router';
import { OPEN_DELETE_MODAL } from '@/components/DeleteModal/store';
import { getTimetables_API, type TimetableModel } from '@/services/timetable';

const _modalRef = ref()
const router = useRouter();
const _loading = ref(false);
const _items = ref<TimetableModel[]>([]);

function openModal(item: TimetableModel | null) {
  _modalRef.value?.open(item)
}

async function loadItems() {
    _loading.value = true;
    const [error, response] = await getTimetables_API();
    _loading.value = false;

    if (error) return;
    _items.value = response;
}

function rowClick(item: TimetableModel) {
    router.push(`/home/timetables/${item.id}`)
}


function deleteItem(item: TimetableModel) {
    OPEN_DELETE_MODAL({
        callback: loadItems,
        title: `${item.name}`,
        url: `timetable/v1/timetable/${item.id}`,
    })
}


const calculatePercentage = (scheduled: number | null, unscheduled: number | null) => {
    const s = scheduled || 0;
    const u = unscheduled || 0;
    const total = s + u;
    if (total === 0) return 0;
    return Math.round((s / total) * 100);
};

loadItems();
</script>

<template>
    <div class="flex flex-col gap-6">
        <div class="flex items-center justify-end gap-4">
            
            <el-button @click="openModal(null)" type="primary" plain>
                <i class="ri-add-line text-lg"></i> 
                <p class="hidden md:block ml-1">{{ $t('timetables.add_btn') }}</p>
            </el-button>
        </div>

        <div v-loading="_loading" class="border rounded-2xl overflow-hidden bg-white shadow-sm transition-all">

            <el-table table-layout="auto" :data="_items" style="width: 100%" :header-cell-style="{ background: '#f9fafb', color: '#111827', fontWeight: '600', height: '56px' }" @row-click="rowClick">
                
                <el-table-column :label="$t('timetables.label_name')" min-width="220">
                    <template #default="{ row }">
                        <div class="flex items-center gap-3 px-1">
                            <div class="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-lg border border-indigo-100">
                                <i class="ri-calendar-todo-line"></i>
                            </div>
                            <div class="flex flex-col">
                                <span class="font-semibold text-gray-800">{{ row.name }}</span>
                                <span class="text-[11px] text-gray-400">Task ID: {{ row.taskId || '-' }}</span>
                            </div>
                        </div>
                    </template>
                </el-table-column>

                <el-table-column :label="$t('timetables.col_status')" min-width="200">
                    <template #default="{ row }">
                        <div class="flex flex-col w-full pr-4">
                            <div class="flex justify-between text-xs mb-1">
                                <span class="text-gray-600 font-medium">{{ $t('timetables.scheduled') }}: {{ row.scheduled || 0 }}</span>
                                <span class="text-gray-400">{{ $t('timetables.remaining') }}: {{ row.unscheduled || 0 }}</span>
                            </div>
                            <el-progress 
                                :percentage="calculatePercentage(row.scheduled, row.unscheduled)" 
                                :status="row.unscheduled === 0 ? 'success' : ''" 
                                :stroke-width="8" 
                                :show-text="false"
                            />
                        </div>
                    </template>
                </el-table-column>

                <el-table-column :label="$t('timetables.col_quality')" min-width="120">
                    <template #default="{ row }">
                        <div class="flex items-center gap-1.5">
                            <i class="ri-bar-chart-box-line text-green-500"></i>
                            <span class="font-bold text-gray-700">{{ row.score || 0 }}</span>
                            <span class="text-xs text-gray-400">{{ $t('timetables.score_unit') }}</span>
                        </div>
                    </template>
                </el-table-column>

                <el-table-column :label="$t('common.actions')" width="120">
                    <template #default="{ row }">
                        <div class="flex justify-end gap-2 px-2">
                            <el-button size="small" link class="!p-2 hover:bg-indigo-50 rounded-lg group">
                                <i class="ri-eye-line text-gray-400 group-hover:text-indigo-500 text-lg transition-colors"></i>
                            </el-button>
                            <el-button @click="openModal(row)" size="small" link class="!p-2 hover:bg-indigo-50 rounded-lg group">
                                <i class="ri-pencil-fill text-gray-400 group-hover:text-indigo-500 text-lg transition-colors"></i>
                            </el-button>
                            <el-button @click="deleteItem(row)" size="small" link class="!p-2 hover:bg-red-50 rounded-lg group">
                                <i class="ri-delete-bin-6-line text-gray-400 group-hover:text-red-500 text-lg transition-colors"></i>
                            </el-button>
                        </div>
                    </template>
                </el-table-column>

                <template #empty>
                    <div class="py-16 flex flex-col items-center gap-2">
                        <i class="ri-calendar-event-line text-4xl text-gray-200"></i>
                        <p class="text-gray-400 font-medium italic">{{ $t('timetables.not_found') }}</p>
                    </div>
                </template>
            </el-table>
        </div>

        <the-modal ref="_modalRef" @update="loadItems" />
    </div>
</template>