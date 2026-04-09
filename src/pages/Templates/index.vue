<script lang="ts" setup>
import { ref } from 'vue';
import TheModal from './Modal.vue'; 
import { useRoute, useRouter } from 'vue-router';
import { OPEN_DELETE_MODAL } from '@/components/DeleteModal/store';
import { getTemplates_API, type TemplateModel } from '@/services/template';
import { getBaseList_DEFAULT, getBaseParams_DEFAULT, type BaseListModel, type BaseParamsModel } from '@/services/network';

const _modalRef = ref();
const _importVisible = ref(false); // Import modalini shu yerda qoldirdim yoki uni ham alohida qilish mumkin
const _loading = ref(false);

const route = useRoute();
const router = useRouter();
const _params = ref<BaseParamsModel>(getBaseParams_DEFAULT());
const _items = ref<BaseListModel<TemplateModel>>(getBaseList_DEFAULT());

async function loadItems() {
    _loading.value = true;
    const { page = 1, search = '' } = route.query;
    _params.value.page = Number(page);
    _params.value.search = String(search);

    const [error, response] = await getTemplates_API(_params.value);
    _loading.value = false;

    if (error) return;
    _items.value = response;
}

function deleteItem(item: TemplateModel) {
    OPEN_DELETE_MODAL({
        title: item.class,
        callback: loadItems,
        url: `templates/v1/${item.id}`,
    })
}

// Modalni ochish (Clone turi bilan birga)
function openModal(item: TemplateModel | null, cloneMode: 'class' | 'subject' | null = null) {
    _modalRef.value?.open(item, cloneMode);
}

// --- UTILS ---
async function onSearch() {
    await router.replace({ query: { ...route.query, search: _params.value.search, page: 1 } });
    loadItems();
}

async function handlePageChange(page: number) {
    await router.replace({ query: { ...route.query, page } });
    loadItems();
}

const getTotalHours = (availability: any) => {
    if (!availability) return 0;
    return Object.values(availability).reduce((acc: number, curr: any) => acc + curr.length, 0);
};

loadItems();
</script>

<template>
    <div class="flex flex-col gap-6">
        <div class="flex items-center justify-between gap-4">
            <div class="w-full max-w-sm relative custom-search">
                <el-input v-model="_params.search" :placeholder="$t('common.search_placeholder')" @input="onSearch" clearable style="width: 200px;"></el-input>
            </div>

            <div class="flex gap-2 w-full md:w-auto">
                <el-button @click="_importVisible = true" plain>
                    <i class="ri-upload-cloud-2-line mr-2 text-lg"></i> Import
                </el-button>
                <el-button @click="openModal(null)" type="primary" plain>
                    <i class="ri-add-line mr-1 text-lg"></i> {{ $t('templates.add_btn') }}
                </el-button>
            </div>
        </div>

        <div class="border rounded-2xl overflow-hidden bg-white shadow-sm transition-all">
            <el-table v-loading="_loading" :data="_items?.content || []" style="width: 100%" :header-cell-style="{ background: '#f9fafb', color: '#111827', fontWeight: '600' }">
                <el-table-column label="ID" width="80" align="center">
                    <template #default="{ row }">
                        <span class="font-mono text-xs text-gray-400">#{{ row.id }}</span>
                    </template>
                </el-table-column>

                <el-table-column :label="$t('models.class')" min-width="120">
                    <template #default="{ row }">
                        <span class="px-2.5 py-1 rounded-md bg-blue-50 text-blue-600 border border-blue-100 font-bold text-xs">
                            {{ row.class }}
                        </span>
                    </template>
                </el-table-column>

                <el-table-column :label="$t('models.subject')" min-width="150">
                    <template #default="{ row }">
                        <span class="font-medium text-gray-700">{{ row.subject }}</span>
                    </template>
                </el-table-column>

                <el-table-column :label="$t('templates.col_occupancy')" min-width="200">
                    <template #default="{ row }">
                        <div class="flex items-center gap-2">
                            <span class="px-2 py-1 rounded-md bg-green-50 text-green-700 border border-green-200 text-xs font-semibold">
                                {{ getTotalHours(row.availability) }} {{ $t('templates.hours_per_week') }}
                            </span>
                        </div>
                    </template>
                </el-table-column>

                <el-table-column :label="$t('common.actions')" width="180">
                    <template #default="{ row }">
                        <div class="flex justify-end gap-1">
                            <el-tooltip :content="$t('templates.tooltip_edit')" placement="top">
                                <el-button @click="openModal(row)" size="small" circle text class="hover:bg-blue-50 !text-gray-500 hover:!text-blue-600">
                                    <i class="ri-pencil-fill text-lg"></i>
                                </el-button>
                            </el-tooltip>
                            
                            <el-tooltip :content="$t('templates.tooltip_clone_class')" placement="top">
                                <el-button @click="openModal(row, 'class')" size="small" circle text class="hover:bg-orange-50 !text-gray-500 hover:!text-orange-600">
                                    <i class="ri-file-copy-line text-lg"></i>
                                </el-button>
                            </el-tooltip>

                            <el-tooltip :content="$t('templates.tooltip_clone_subject')" placement="top">
                                <el-button @click="openModal(row, 'subject')" size="small" circle text class="hover:bg-purple-50 !text-gray-500 hover:!text-purple-600">
                                    <i class="ri-file-copy-2-line text-lg"></i>
                                </el-button>
                            </el-tooltip>

                            <el-tooltip :content="$t('common.delete')" placement="top">
                                <el-button @click="deleteItem(row)" size="small" circle text class="hover:bg-red-50 !text-gray-500 hover:!text-red-600">
                                    <i class="ri-delete-bin-6-line text-lg"></i>
                                </el-button>
                            </el-tooltip>
                        </div>
                    </template>
                </el-table-column>

                <template #empty>
                    <div class="py-12 flex flex-col items-center gap-2 text-gray-400">
                        <i class="ri-inbox-line text-4xl"></i>
                        <p class="text-sm">{{ $t('common.not_found') }}</p>
                    </div>
                </template>
            </el-table>

            <div v-if="_items?.totalElements > 0" class="p-4 border-t flex justify-end bg-gray-50/50">
                <el-pagination :current-page="_items.number" :page-size="_params.size" :total="_items.totalElements" layout="prev, pager, next" background @current-change="handlePageChange" />
            </div>
        </div>

        <el-dialog v-model="_importVisible" width="400px" class="template-dialog" :show-close="false">
            <template #header>
                <h3 class="font-bold text-gray-800">{{ $t('templates.import_excel') }}</h3>
            </template>
            <div class="flex flex-col gap-4 py-4">
                <el-button class="w-full !h-12 !border-dashed !border-2 !border-blue-200 hover:!border-blue-400 hover:!bg-blue-50 transition-all group">
                    <div class="flex items-center gap-2 text-blue-600">
                        <i class="ri-download-line text-xl"></i>
                        <span>{{ $t('templates.download_sample') }}</span>
                    </div>
                </el-button>
                <div class="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center gap-2 cursor-pointer hover:bg-gray-50 hover:border-gray-300 transition-all">
                    <i class="ri-upload-cloud-line text-3xl text-gray-400"></i>
                    <p class="text-xs text-gray-500 text-center">{{ $t('templates.drop_file') }}</p>
                </div>
            </div>
            <div class="flex justify-end">
                <el-button @click="_importVisible = false">{{ $t('common.close') }}</el-button>
            </div>
        </el-dialog>

        <the-modal ref="_modalRef" @update="loadItems" />
    </div>
</template>