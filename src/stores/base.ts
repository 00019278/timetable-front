import { useStorage } from "@vueuse/core";
import { getCompany_DEFAULT } from "@/services/company";

export const _language = useStorage('_language', 'en')
export const _emailStore = useStorage('_emailStore', '')
export const _menubar = useStorage('_menubar', () => false);
export const _openMenubar = useStorage('_openMenubar', () => true);
export const _companyStore = useStorage('_companyStore', () => getCompany_DEFAULT());