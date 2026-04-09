<script setup lang="ts">
import { useRouter } from 'vue-router';
import { logout_HANDLER } from '@/services/network';
import Language from '@/components/Language/index.vue'
import { _emailStore } from '@/stores/base';

const router = useRouter();

const handleCommand = async (command: string) => {
  if (command === 'profile') {
    router.push('/home/profile');
  } else if (command === 'settings') {
    router.push('/home/settings');
  } else if (command === 'logout') {
    logout_HANDLER();
    router.push('/');
  }
}
</script>

<template>
  <div class="h-16 flex items-center justify-between p-4 border-b bg-gray-100">
    <back-title />

    <div class="flex items-center gap-4">
      <Language />

      <el-dropdown trigger="click" popper-class="my-custom-dropdown" placement="bottom-end" @command="handleCommand">
        <div class="flex items-center gap-2 cursor-pointer transition-colors outline-none">
          <div class="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 text-sm font-semibold text-gray-600 shrink-0">{{ _emailStore ? _emailStore?.split?.('@')[0]?.charAt(0)?.toUpperCase() : 'A' }}</div>
          <span class="text-sm font-medium text-gray-700 hidden sm:block">{{ _emailStore ? _emailStore.split('@')[0] : 'Admin' }}</span>
        </div>

        <template #dropdown>
          <el-dropdown-menu class="min-w-[260px] p-0">
            <div class="px-4 py-3">
              <p class="text-sm font-semibold text-gray-900">{{ $t('header.my_account') }}</p>
              <p class="text-xs text-gray-500 mt-0.5">{{ _emailStore || 'admin@system.com' }}</p>
            </div>

            <div class="h-px bg-gray-100 my-1"></div>

            <el-dropdown-item command="profile" class="!px-4 !py-2 !flex !items-center !gap-2">
              <i class="ri-user-line text-gray-500 text-lg leading-4"></i>
              <span>{{ $t('header.profile') }}</span>
            </el-dropdown-item>

            <el-dropdown-item v-if="false" command="settings" class="!px-4 !py-2 !flex !items-center !gap-2">
              <i class="ri-settings-3-line text-gray-500 text-lg"></i>
              <span>{{ $t('header.settings') }}</span>
            </el-dropdown-item>

            <div class="h-px bg-gray-100 my-1"></div>

            <el-dropdown-item command="logout" class="!px-4 !py-2 !flex !items-center !gap-2 !text-red-600 hover:!bg-red-50">
              <i class="ri-logout-box-r-line text-lg"></i>
              <span>{{ $t('header.log_out') }}</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

    </div>
  </div>
</template>