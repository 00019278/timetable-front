import { ref } from "vue"
import { useI18n } from "vue-i18n";
import type { FormRules } from 'element-plus'


export const useRules = () => {
  const { t } = useI18n();

  const rules = ref<FormRules>({
    name: [{ required: true, message: t("common.required_field"), trigger: "blur" }],
  });

  return rules;
};