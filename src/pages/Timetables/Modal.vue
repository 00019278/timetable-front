<script lang="ts" setup>
import { ref } from 'vue';
import { useRules } from "./rules";
import { generateTimetable_API, getTimetable_DEFAULT, type TimetableModel } from '@/services/timetable';

const _formRef = ref();
const rules = useRules();
const _visible = ref(false);
const _loading = ref(false);
const emit = defineEmits(['update']);
const _formData = ref<TimetableModel>(getTimetable_DEFAULT());


async function open() {
  _visible.value = true;
}


function close() {
  _visible.value = false;
  _formRef.value?.resetFields();
  _formData.value = getTimetable_DEFAULT();
}

async function submit() {
  _formRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      _loading.value = true;
      const [error] = await generateTimetable_API(_formData.value.name);
      _loading.value = false;
      if (error) return;
      close(); 
      emit('update');
    }
  });
}

defineExpose({ open });
</script>

<template>
  <el-dialog v-model="_visible" :title="_formData.id ? $t('timetables.modal_edit') : $t('timetables.modal_add')" width="550px" class="room-dialog" @close="close">
    <el-form ref="_formRef" :model="_formData" :rules="rules" label-position="top">
      
      <el-form-item :label="$t('fields.name')" prop="name">
        <el-input v-model="_formData.name" :placeholder="$t('timetables.placeholder_name')" />
      </el-form-item>

      <div class="flex justify-end gap-2 pt-4 mt-2 border-t border-gray-50">
        <el-button size="default" class="!rounded-lg !h-9 !px-6" @click="close">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" class="!rounded-lg !h-9 !px-6" :loading="_loading" @click="submit">{{ _formData.id ? $t('common.save') : $t('common.add') }}</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>