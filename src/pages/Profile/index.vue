<script lang="ts" setup>
import { computed, ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';
import { _emailStore } from '@/stores/base';

const { t } = useI18n();

// Namuna uchun interfeys
interface ProfileModel {
    avatarUrl?: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    role: string;
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
}

const getProfile_DEFAULT = (): ProfileModel => ({
    avatarUrl: '',
    fullName: 'Sultonxon Ziyodullayev',
    email: 'sultonxonziyodullayev@gmail.com',
    phoneNumber: '',
    role: 'Administrator',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
});

const _loading = ref(false);
const _isEditing = ref(false);
const _item = ref<ProfileModel>(getProfile_DEFAULT());
const _originalItem = ref<ProfileModel>(getProfile_DEFAULT());

// --- Rasm yuklash holatlari ---
const _avatarFile = ref<File | null>(null);
const _avatarPreview = ref<string>('');

// O'zgarishlarni tekshirish (Rasm ham o'zgarganini hisobga olamiz)
const _isChanged = computed(() => {
    const isProfileChanged = JSON.stringify({
        fullName: _item.value.fullName,
        email: _item.value.email,
        phoneNumber: _item.value.phoneNumber
    }) !== JSON.stringify({
        fullName: _originalItem.value.fullName,
        email: _originalItem.value.email,
        phoneNumber: _originalItem.value.phoneNumber
    });

    return isProfileChanged || _avatarFile.value !== null;
});

const _isPasswordChanged = computed(() => {
    return _item.value.currentPassword || _item.value.newPassword || _item.value.confirmPassword;
});

async function loadItems() {
    _loading.value = true;
    // API CHAQIRUV (Simulyatsiya)
    setTimeout(() => {
        const response = getProfile_DEFAULT();
        _item.value = JSON.parse(JSON.stringify(response));
        _originalItem.value = JSON.parse(JSON.stringify(response));
        _avatarPreview.value = response.avatarUrl || '';
        _loading.value = false;
    }, 500);
}

// --- RASM YUKLASH FUNKSIYASI ---
const handleAvatarChange = (uploadFile: any) => {
    const rawFile = uploadFile.raw;
    
    // Fayl hajmini tekshirish (Masalan: 2MB)
    if (rawFile.size / 1024 / 1024 > 2) {
        ElMessage.error(t('profile.error_avatar_size'));
        return false;
    }

    _avatarFile.value = rawFile;
    _avatarPreview.value = URL.createObjectURL(rawFile); // UI da darhol ko'rsatish uchun
};

const handleStartEdit = () => {
    _isEditing.value = true;
    _item.value = JSON.parse(JSON.stringify(_originalItem.value));
};

const handleCancel = () => {
    _isEditing.value = false;
    _item.value = JSON.parse(JSON.stringify(_originalItem.value));
    
    // Parol va rasm holatlarini tozalash
    _item.value.currentPassword = '';
    _item.value.newPassword = '';
    _item.value.confirmPassword = '';
    _avatarFile.value = null;
    _avatarPreview.value = _originalItem.value.avatarUrl || '';
};

// --- PROFILNI SAQLASH (SUBMIT) ---
const handleUpdate = async () => {
    if (!_isChanged.value) { 
        _isEditing.value = false; 
        return; 
    }

    _loading.value = true;
    
    try {
        // API Simulyatsiyasi
        setTimeout(() => {
            _loading.value = false;
            _isEditing.value = false;
            _originalItem.value = JSON.parse(JSON.stringify(_item.value));
            _avatarFile.value = null; // Saqlangandan keyin yangi faylni tozalaymiz
            ElMessage.success(t('profile.success_update'));
        }, 1000);

    } catch (error) {
        _loading.value = false;
        ElMessage.error(t('profile.error_general'));
    }
};

// --- PAROLNI SAQLASH (SUBMIT) ---
const handleUpdatePassword = async () => {
    if (!_item.value.currentPassword || !_item.value.newPassword || !_item.value.confirmPassword) {
        ElMessage.warning(t('profile.warning_fill_fields'));
        return;
    }
    
    if (_item.value.newPassword !== _item.value.confirmPassword) {
        ElMessage.error(t('profile.error_password_match'));
        return;
    }

    _loading.value = true;
    
    try {
        // API Simulyatsiyasi
        setTimeout(() => {
            _loading.value = false;
            _item.value.currentPassword = '';
            _item.value.newPassword = '';
            _item.value.confirmPassword = '';
            ElMessage.success(t('profile.success_password'));
        }, 1000);

    } catch (error) {
        _loading.value = false;
        ElMessage.error(t('profile.error_general'));
    }
};

onMounted(() => {
    loadItems();
});
</script>

<template>
    <div v-loading="_loading" class="flex flex-col gap-6 w-full max-w-[800px] pb-5">
        
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div class="flex flex-col gap-1">
                <h2 class="flex items-center gap-3 text-2xl font-extrabold text-gray-800">{{ $t('profile.title') }}</h2>
                <p class="text-gray-500 text-sm font-medium">{{ $t('profile.subtitle') }}</p>
            </div>

            <div class="flex items-center gap-2">
                <el-button v-if="_isEditing" @click="handleCancel" plain type="primary" size="large" class="!rounded-xl">
                    <i class="ri-close-line mr-1"></i>
                    <p>{{ $t('common.cancel') }}</p>
                </el-button>
                
                <el-button v-if="_isEditing" @click="handleUpdate" plain type="success" size="large" :disabled="!_isChanged" class="!rounded-xl">
                    <i class="ri-save-3-line mr-1"></i>
                    <p>{{ $t('common.save') }}</p>
                </el-button>

                <el-button v-if="!_isEditing" @click="handleStartEdit" plain type="primary" size="large" class="!rounded-xl">
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

        <div class="flex flex-col gap-6 p-5 pb-2 border border-gray-200 rounded-[20px] bg-white shadow-sm" :class="_isEditing ? '' : 'pointer-events-none'">
            <div class="flex flex-col gap-1 mb-1">
                <h3 class="text-lg font-bold text-gray-900">{{ $t('profile.info_title') }}</h3>
                <p class="text-gray-500 text-sm font-medium">{{ $t('profile.info_subtitle') }}</p>
            </div>

            <div class="flex items-center gap-6 pb-4 border-b border-gray-100">
                
                <div class="w-20 h-20 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-2xl font-bold text-gray-800 shrink-0 overflow-hidden">
                    <img v-if="_avatarPreview" :src="_avatarPreview" class="w-full h-full object-cover" alt="Avatar" />
                    <span v-else>{{ _emailStore.substring(0, 2).toUpperCase() }}</span>
                </div>
                
                <div class="flex flex-col items-start gap-2">
                    <el-upload action="#" :show-file-list="false" :auto-upload="false" accept="image/jpeg,image/png,image/gif" :on-change="handleAvatarChange" :disabled="!_isEditing">
                        <el-button size="default" class="!rounded-lg font-medium !h-8" :disabled="!_isEditing">{{ $t('profile.change_avatar') }}</el-button>
                    </el-upload>
                    <span class="text-xs text-gray-500 font-medium">{{ $t('profile.avatar_hint') }}</span>
                </div>
            </div>

            <el-form :model="_item" label-width="auto" label-position="top" class="custom-form grid grid-cols-1 md:grid-cols-2 gap-x-5">
                <el-form-item v-if="false" :label="$t('profile.full_name')">
                    <el-input v-model="_item.fullName" :placeholder="$t('profile.full_name')" :readonly="!_isEditing" class="custom-input"></el-input>
                </el-form-item>

                <el-form-item v-if="false" :label="$t('profile.role')">
                    <el-input v-model="_item.role" disabled class="custom-input is-disabled"></el-input>
                </el-form-item>

                <el-form-item :label="$t('fields.email')">
                    <el-input v-model="_emailStore" :placeholder="$t('fields.email')" :readonly="!_isEditing || true" class="custom-input"></el-input>
                </el-form-item>

                <el-form-item v-if="false" :label="$t('profile.phone_number')">
                    <el-input v-model="_item.phoneNumber" :placeholder="$t('profile.phone_number')" :readonly="!_isEditing" class="custom-input"></el-input>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>