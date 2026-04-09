<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { computed, ref } from 'vue';
import draggable from 'vuedraggable';
import { SCHOOL_WORKING_DAYS } from '@/utils';
import { _companyStore } from '@/stores/base';
import { getCompany_API, getCompany_DEFAULT, updateCompany_API, type CompanyModel } from '@/services/company';

const { t } = useI18n();
const _loading = ref(false);
const _isEditing = ref(false);
const _item = ref<CompanyModel>(getCompany_DEFAULT());
const _originalItem = ref<CompanyModel>(getCompany_DEFAULT());

const selectedDaysCount = computed(() => _item.value.daysOfWeek?.length);
const _allDaysSelected = computed(() => _item.value.daysOfWeek?.length === SCHOOL_WORKING_DAYS?.length);

const _isChanged = computed(() => {
    return JSON.stringify(_item.value) !== JSON.stringify(_originalItem.value);
});

const toggleAllDays = () => {
    if (_allDaysSelected.value) _item.value.daysOfWeek = [];
    else _item.value.daysOfWeek = SCHOOL_WORKING_DAYS.map(day => day.key);
};

async function loadItems() {
    _loading.value = true;
    const [error, response] = await getCompany_API();
    _loading.value = false;

    if (error) return;
    _companyStore.value = response;
    _item.value = JSON.parse(JSON.stringify(response));
    _originalItem.value = JSON.parse(JSON.stringify(response));
}

const addPeriod = () => {
    const count = _item.value.periods?.filter(p => !p.isBreak).length + 1;
    _item.value.periods.push({
        name: `${count}-${t('organization.default_period_name')}`,
        startTime: '08:00',
        endTime: '08:45',
        duration: 45,
        isBreak: false
    });
};

const addBreak = (index: number) => {
    _item.value.periods?.splice(index + 1, 0, {
        name: t('organization.default_break_name'),
        startTime: '',
        endTime: '',
        duration: 10,
        isBreak: true
    });
};

const deletePeriod = (index: number) => {
    _item.value.periods?.splice(index, 1);
};

const handleStartEdit = () => {
    _isEditing.value = true;
    _item.value = JSON.parse(JSON.stringify(_originalItem.value));
};

const handleCancel = () => {
    _isEditing.value = false;
    _item.value = JSON.parse(JSON.stringify(_originalItem.value));
};

async function handleUpdate() {
    if (!_isChanged.value) { _isEditing.value = false; return; }

    const [error, response] = await updateCompany_API(_item.value);
    
    if (error) return;
    _isEditing.value = false;
    _companyStore.value = response;
    _originalItem.value = JSON.parse(JSON.stringify(_item.value));
}


loadItems();
</script>

<template>
    <div v-loading="_loading" class="flex flex-col gap-6 max-w-[1200px]">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div class="flex flex-col gap-1">
                <h2 class="flex items-center gap-3 text-2xl font-extrabold text-gray-800">
                    <i class="ri-building-2-line text-blue-600 text-3xl"></i>{{ $t('organization.title') }}
                </h2>
                <p class="text-gray-500 text-sm font-medium">{{ $t('organization.subtitle') }}</p>
            </div>

            <div class="flex items-center gap-2">
                <el-button v-if="_isEditing" @click="handleCancel" plain type="primary" size="large">
                    <i class="ri-close-line mr-1"></i>
                    <p>{{ $t('common.cancel') }}</p>
                </el-button>
                
                <el-button v-if="_isEditing" @click="handleUpdate" plain type="success" size="large" :disabled="!_isChanged">
                    <i class="ri-save-3-line mr-1"></i>
                    <p>{{ $t('common.save') }}</p>
                </el-button>

                <el-button v-if="!_isEditing" @click="handleStartEdit" plain type="primary" size="large">
                    <i class="ri-edit-line mr-1"></i>
                    <p>{{ $t('organization.edit_info') }}</p>
                </el-button>
            </div>
        </div>

        <el-collapse-transition>
            <div v-if="_isEditing && _isChanged" class="fixed bottom-10 right-10 z-50">
                <div class="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex items-center gap-3 shadow-lg">
                    <i class="ri-error-warning-fill text-amber-500 text-xl animate-pulse"></i>
                    <span class="text-amber-800 font-medium">{{ $t('organization.unsaved_changes') }}</span>
                </div>
            </div>
        </el-collapse-transition>

        <div class="flex flex-col gap-5 p-5 pb-2 border rounded-2xl">
            <div class="flex flex-col gap-1">
                <h2 class="flex items-center gap-2 font-medium text-gray-800">
                    <i class="ri-building-2-line text-blue-600 text-xl"></i>{{ $t('organization.title') }}
                </h2>
                <p class="text-gray-500 text-sm font-medium">{{ $t('organization.basic_info_desc') }}</p>
            </div>

            <el-form :model="_item" label-width="auto" label-position="top" :class="_isEditing ? '' : 'pointer-events-none'">
                <el-form-item :label="$t('organization.school_name')">
                    <el-input v-model="_item.name" :placeholder="$t('organization.school_name')"></el-input>
                </el-form-item>

                <el-form-item :label="$t('organization.description')">
                    <el-input v-model="_item.description" type="textarea" :autosize="{ minRows: 5, maxRows: 20 }" :placeholder="$t('organization.school_desc_placeholder')"></el-input>
                </el-form-item>
            </el-form>
        </div>

        <div class="flex flex-col gap-5 p-5 border rounded-2xl">
            <div class="flex flex-col gap-1">
                <h2 class="flex items-center gap-2 font-medium text-gray-800">
                    <i class="ri-calendar-line text-blue-600 text-xl"></i>{{ $t('organization.working_days') }}
                </h2>
                <p class="text-gray-500 text-sm font-medium">{{ $t('organization.working_days_desc') }}</p>
            </div>

            <el-form :model="_item" label-width="auto" label-position="top" :class="_isEditing ? '' : 'pointer-events-none'">
                <div class="flex items-center justify-between mb-4">
                    <p class="text-gray-400 text-sm tracking-wider leading-4">{{ selectedDaysCount }} / {{ SCHOOL_WORKING_DAYS.length }} {{ $t('organization.days_selected') }}</p>
                    <p class="cursor-pointer text-blue-500 hover:text-blue-700 transition-colors" @click="toggleAllDays">{{ _allDaysSelected ? $t('classes.clear_all') : $t('classes.select_all') }}</p>
                </div>

                <el-checkbox-group v-model="_item.daysOfWeek" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                    <el-checkbox v-for="day in SCHOOL_WORKING_DAYS" :key="day.key" :border="true" :label="day.key">{{ day.label }}</el-checkbox>
                </el-checkbox-group>
            </el-form>
        </div>

        <div class="flex flex-col gap-5 p-5 border rounded-2xl" :class="_isEditing ? '' : 'pointer-events-none'">
            <div class="flex flex-wrap justify-between gap-3">
                <div class="flex flex-col gap-1">
                    <h2 class="flex items-center gap-2 font-medium text-gray-800">
                        <i class="ri-time-line text-blue-600 text-xl"></i>{{ $t('organization.periods_breaks') }}
                    </h2>
                    <p class="text-gray-500 text-[13px] font-medium">{{ $t('organization.periods_count') }}: {{_item.periods?.filter(p => !p.isBreak)?.length }}, {{ $t('organization.breaks_count') }}: {{_item.periods?.filter(p => p.isBreak)?.length}}</p>
                </div>

                <el-button @click="addPeriod" plain type="primary"><i class="ri-add-line mr-1"></i> {{ $t('organization.add_period') }}</el-button>
            </div>

            <el-form :model="_item" label-width="auto" label-position="top">
                <div class="space-y-3 mt-2">
                    <draggable v-model="_item.periods" item-key="index" handle=".drag-handle" ghost-class="opacity-50" animation="200" :disabled="!_isEditing">
                        <template #item="{ element: period, index }">
                            <div class="group relative p-4 mb-3 rounded-2xl border-2 border-dashed transition-all" :class="[!period.isBreak ? 'bg-blue-50 border-blue-200' : 'bg-orange-50 border-orange-200']">
                                <div class="flex items-center justify-between gap-4">
                                    <div class="flex flex-wrap items-center gap-4">
                                        <i class="ri-drag-move-fill text-gray-300 drag-handle" :class="_isEditing ? 'cursor-move hover:text-gray-500' : 'cursor-not-allowed'"></i>

                                        <div class="md:col-span-4 flex items-center gap-2">
                                            <i :class="[!period.isBreak ? 'ri-time-fill text-blue-500' : 'ri-drinks-fill text-orange-500']"></i>
                                            <el-input v-model="period.name" :placeholder="!period.isBreak ? $t('organization.period_name') : $t('organization.break_name')" class="custom-period-input md:min-w-[250px]" />
                                        </div>

                                        <div v-if="!period.isBreak" class="md:col-span-5 flex items-center gap-2">
                                            <div class="flex items-center gap-2">
                                                <span class="text-[10px] text-gray-400 font-bold uppercase">{{ $t('organization.start_time') }}:</span>
                                                <el-time-picker v-model="period.startTime" format="HH:mm" :clearable="false" value-format="HH:mm" style="width: 120px !important;" placeholder="Arbitrary time" />
                                            </div>
                                            <div class="flex items-center gap-2">
                                                <span class="text-[10px] text-gray-400 font-bold uppercase">{{ $t('organization.end_time') }}:</span>
                                                <el-time-picker v-model="period.endTime" format="HH:mm" :clearable="false" value-format="HH:mm" style="width: 120px !important;" placeholder="Arbitrary time" />
                                            </div>
                                        </div>

                                        <div v-else class="md:col-span-5 flex items-center gap-3">
                                            <span class="text-xs font-bold text-orange-600 uppercase">{{ $t('organization.duration') }}:</span>
                                            <el-input-number v-model.number="period.duration" :step="1" controls-position="right" :min="0" :max="120" class="!w-[200px]" />
                                            <span class="text-xs">{{ $t('organization.minutes') }}</span>
                                        </div>
                                    </div>

                                    <div class="md:col-span-3 flex items-center justify-end gap-4" v-if="_isEditing">
                                        <div v-if="!period.isBreak" class="flex items-center gap-1 cursor-pointer text-orange-500" @click="addBreak(index)">
                                            <i class="ri-drinks-line leading-3"></i>
                                            <p>{{ $t('organization.add_break') }}</p>
                                        </div>
                                        <i @click="deletePeriod(index)" class="ri-delete-bin-6-line cursor-pointer text-red-500"></i>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </draggable>

                    <div v-if="_item.periods?.length === 0" class="text-center py-10 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
                        <i class="ri-time-line text-4xl text-gray-200"></i>
                        <p class="text-gray-400 font-bold mt-2 text-sm uppercase tracking-wider">{{ $t('organization.no_periods') }}</p>
                        <el-button v-if="_isEditing" type="primary" link @click="addPeriod" class="!mt-2">{{ $t('organization.click_to_add') }}</el-button>
                    </div>
                </div>
            </el-form>
        </div>
    </div>
</template>