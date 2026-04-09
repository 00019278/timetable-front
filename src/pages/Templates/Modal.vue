<script lang="ts" setup>
import { ref } from 'vue';
import { useRules } from "./rules";
import { createTemplate_API, updateTemplate_API, getTemplate_DEFAULT, type TemplateModel } from '@/services/template';

const _formRef = ref();
const _visible = ref(false);
const _loading = ref(false);
const rules = useRules();
const emit = defineEmits(['update']);
const _cloneType = ref<'class' | 'subject' | null>(null);
const _formData = ref<TemplateModel>(getTemplate_DEFAULT());


function open(item: TemplateModel | null, cloneMode: 'class' | 'subject' | null = null) {
  _visible.value = true;
  _cloneType.value = cloneMode;

  if (item) {
    _formData.value = JSON.parse(JSON.stringify(item));

    if (cloneMode) _formData.value.id = 0;
    if (cloneMode === 'class') _formData.value.class = '';
    else if (cloneMode === 'subject') _formData.value.subject = '';
  }
}

function close() {
  _visible.value = false;
  _cloneType.value = null;
  _formRef.value?.resetFields();
  _formData.value = getTemplate_DEFAULT();
}

async function submit() {
  _formRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      _loading.value = true;
      const isUpdate = _formData.value.id && !_cloneType.value;
      const handler = isUpdate ? updateTemplate_API : createTemplate_API;

      const [error] = await handler(_formData.value);
      _loading.value = false;

      if (error) return;
      close();
      emit('update');
    }
  });
}

const getDayName = (key: string) => {
  const days: Record<string, string> = {
    monday: 'Dush', tuesday: 'Sesh', wednesday: 'Chor',
    thursday: 'Pay', friday: 'Juma', saturday: 'Shan'
  };

  return days[key] || key;
};

const getTotalHours = (availability: any) => {
  if (!availability) return 0;
  return Object.values(availability).reduce((acc: number, curr: any) => acc + curr.length, 0);
};

defineExpose({ open });
</script>

<template>
  <el-dialog v-model="_visible" :title="_formData.id && !_cloneType ? $t('templates.modal_edit') : _cloneType ? $t('templates.modal_clone') : $t('templates.modal_add')" width="650px" @close="close">
    <el-form ref="_formRef" :model="_formData" :rules="rules" label-position="top">
      <div class="grid grid-cols-2 gap-4 mb-4">
        <el-form-item :label="$t('models.class')" prop="class">
          <el-input v-model="_formData.class" :placeholder="$t('classes.placeholder_name')" class="compact-input" :disabled="_cloneType === 'subject'" />
          <span v-if="_cloneType === 'class'" class="text-[10px] text-orange-500 mt-1 absolute -bottom-5">{{ $t('templates.clone_hint_class') }}</span>
        </el-form-item>

        <el-form-item :label="$t('models.subject')" prop="subject">
          <el-input v-model="_formData.subject" :placeholder="$t('subjects.placeholder_name')" class="compact-input" :disabled="_cloneType === 'class'" />
          <span v-if="_cloneType === 'subject'" class="text-[10px] text-purple-500 mt-1 absolute -bottom-5">{{ $t('templates.clone_hint_subject') }}</span>
        </el-form-item>
      </div>

      <div class="border rounded-xl p-4 bg-gray-50/50 border-gray-100">
        <h4 class="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wide">{{ $t('templates.weekly_distribution') }}</h4>
        <div class="space-y-2">
          <div v-for="(slots, day) in _formData.availability" :key="day" class="flex items-start gap-3 border-b border-gray-100 last:border-0 pb-2 last:pb-0">
            <div class="w-16 text-sm font-semibold text-gray-600">{{ $t(`days.${day}`) }}:</div>
            <div class="flex flex-wrap gap-1 flex-1">
              <template v-if="slots && slots.length">
                <span v-for="slot in slots" :key="slot"
                  class="px-2 py-0.5 bg-white border border-gray-200 rounded text-xs text-gray-600 font-mono shadow-sm">
                  {{ slot }}{{ $t('lessons.period_unit') }}
                </span>
              </template>
              <span v-else class="text-xs text-gray-400 italic">{{ $t('templates.no_lessons') }}</span>
            </div>
          </div>
        </div>

        <div class="mt-3 pt-2 border-t border-gray-200 flex justify-end">
          <span class="text-sm font-medium text-gray-600">{{ $t('templates.total_load') }}: <span class="text-blue-600 font-bold">{{ getTotalHours(_formData.availability) }}</span> {{ $t('templates.hours') }}</span>
        </div>
      </div>

      <div class="flex justify-end gap-2 pt-4 mt-2 border-t border-gray-50">
        <el-button size="default" class="!rounded-lg !h-9 !px-6" @click="close">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" class="!rounded-lg !h-9 !px-6 !bg-blue-600 !border-blue-600" :loading="_loading" @click="submit">
            {{ _formData.id && !_cloneType ? $t('common.save') : $t('common.confirm') }}
        </el-button>
      </div>
    </el-form>
  </el-dialog>
</template>