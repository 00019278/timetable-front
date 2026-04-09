<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { _language } from '@/stores/base'

const { locale } = useI18n()

const languages = [
  { code: 'uz', name: "O'zbek", flag: '🇺🇿' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
]

const setLocale = (code: string) => {
  locale.value = code
  _language.value = code
}
</script>

<template>
  <el-dropdown trigger="click" placement="bottom-end" popper-class="my-custom-dropdown">
    <i class="ri-translate-2 text-xl cursor-pointer"></i>

    <template #dropdown>
      <el-dropdown-menu class="min-w-[160px] p-0!">
        <el-dropdown-item v-for="lang in languages" :key="lang.code" @click="setLocale(lang.code)"
          class="!flex !items-center !justify-between !px-3 !py-2"
          :class="{ '!bg-blue-50 !text-blue-600': locale === lang.code }">
          <span class="flex items-center gap-2">
            <span>{{ lang.flag }}</span>
            <span class="font-medium">{{ lang.name }}</span>
          </span>
          <i v-if="locale === lang.code" class="ri-check-line text-blue-600 font-bold"></i>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>