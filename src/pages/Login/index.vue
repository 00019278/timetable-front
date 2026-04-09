<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { _emailStore } from '@/stores/base';
import { getLogin_DEFAULT, postLogin_API, postVerify_API, postSendCode_API, type LoginModel } from '@/services/login';

const isLogin = ref(true);
const router = useRouter();
const _loading = ref(false);
const isCodeSent = ref(false);
const _formData = ref<LoginModel>(getLogin_DEFAULT());


async function handleAuth() {
    _loading.value = true;
    
    if (isLogin.value) {
        const [error, response] = await postLogin_API({
            email: _formData.value.email,
            password: _formData.value.password
        } as any);
        
        if (!error && response) {
          _emailStore.value = _formData.value.email;
          localStorage.setItem('token', response.token);
          
          router.push('/home/organization');
          _formData.value = getLogin_DEFAULT();
        }
    } 
    else if (!isCodeSent.value) {
        const [error] = await postSendCode_API(_formData.value.email);
        if (!error) {
            isCodeSent.value = true;
            ElMessage.success("Tasdiqlash kodi emailingizga yuborildi!");
        }
    } 
    else {
        const [error, response] = await postVerify_API({
            name: _formData.value.name,
            surname: _formData.value.surname,
            email: _formData.value.email,
            password: _formData.value.password,
            code: Number(_formData.value.code)
        });
        
        if (!error && response) {
            _emailStore.value = _formData.value.email;
            localStorage.setItem('token', response.token);

            router.push('/home/organization');
            ElMessage.success("Muvaffaqiyatli ro'yxatdan o'tdingiz!");
            _formData.value = getLogin_DEFAULT();
        }
    }
    _loading.value = false;
};

function toggleMode(val: boolean) {
    isLogin.value = val;
    isCodeSent.value = false;
}
</script>

<template>
  <div class="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 font-sans">
    <div class="w-full max-w-md bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-8 md:p-10 border border-gray-50">
      
      <div class="flex justify-center mb-6">
        <div class="w-16 h-16 bg-[#1A56FF] rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100">
          <i class="ri-book-open-fill text-3xl text-white"></i>
        </div>
      </div>

      <div class="text-center mb-8">
        <h1 class="text-[26px] font-bold text-[#2D4396] mb-2 tracking-tight">
            {{ isLogin ? $t('login.welcome') : (isCodeSent ? 'Tasdiqlash' : $t('login.create_account')) }}
        </h1>
        <p class="text-gray-400 text-sm font-medium">{{ $t('login.subtitle') }}</p>
      </div>

      <div class="bg-[#F1F5F9] p-1 rounded-2xl flex mb-5 relative">
        <div class="absolute top-1 bottom-1 bg-white rounded-[12px] shadow-sm transition-all duration-300 ease-in-out"
          :style="{ width: 'calc(50% - 4px)', transform: isLogin ? 'translateX(0)' : 'translateX(100%)' }"></div>
        <button @click="toggleMode(true)" class="flex-1 py-2.5 text-[15px] font-bold z-10 transition-colors" :class="isLogin ? 'text-[#1E293B]' : 'text-gray-400'">{{ $t('login.sign_in') }}</button>
        <button @click="toggleMode(false)" class="flex-1 py-2.5 text-[15px] font-bold z-10 transition-colors" :class="!isLogin ? 'text-[#1E293B]' : 'text-gray-400'">{{ $t('login.sign_up') }}</button>
      </div>

      <form @submit.prevent="handleAuth" class="space-y-4">
        
        <template v-if="!isLogin">
            <div v-if="isCodeSent" class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                    <div class="group">
                        <label class="block text-[13px] font-bold text-gray-700 mb-1.5 ml-1">Ism</label>
                        <input v-model="_formData.name" placeholder="Ism" class="w-full px-4 py-2.5 bg-[#F1F5F9] border-2 border-transparent focus:border-[#1A56FF] focus:bg-white rounded-xl outline-none transition-all" required />
                    </div>
                    <div class="group">
                        <label class="block text-[13px] font-bold text-gray-700 mb-1.5 ml-1">Familiya</label>
                        <input v-model="_formData.surname" placeholder="Familiya" class="w-full px-4 py-2.5 bg-[#F1F5F9] border-2 border-transparent focus:border-[#1A56FF] focus:bg-white rounded-xl outline-none transition-all" required />
                    </div>
                </div>

                <div class="group">
                    <label class="block text-[13px] font-bold text-gray-700 mb-1.5 ml-1">Tasdiqlash kodi</label>
                    <input v-model="_formData.code" type="number" placeholder="0000" class="w-full px-4 py-2.5 bg-[#F1F5F9] border-2 border-transparent focus:border-[#1A56FF] focus:bg-white rounded-xl outline-none transition-all font-mono tracking-[10px] text-center" required />
                </div>
            </div>
        </template>

        <div class="group">
          <label class="block text-[13px] font-bold text-gray-700 mb-1.5 ml-1">{{ $t('login.email_label') }}</label>
          <input type="email" v-model="_formData.email" :disabled="isCodeSent" :placeholder="$t('login.email_placeholder')" class="w-full px-4 py-2.5 bg-[#F1F5F9] border-2 border-transparent focus:border-[#1A56FF] focus:bg-white rounded-xl outline-none transition-all disabled:opacity-60" required />
        </div>

        <div v-if="isLogin || isCodeSent" class="group">
          <label class="block text-[13px] font-bold text-gray-700 mb-1.5 ml-1">{{ $t('login.password_label') }}</label>
          <input type="password" v-model="_formData.password" :placeholder="$t('login.password_placeholder')" class="w-full px-4 py-2.5 bg-[#F1F5F9] border-2 border-transparent focus:border-[#1A56FF] focus:bg-white rounded-xl outline-none transition-all" required />
        </div>

        <button type="submit" v-loading="_loading" class="w-full py-3.5 bg-[#1A56FF] hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-100 transition-all active:scale-[0.98] mt-4">
          <template v-if="isLogin">
            {{ $t('login.sign_in') }}
          </template>
          <template v-else>
            {{ isCodeSent ? 'Ro\'yxatdan o\'tishni yakunlash' : 'Tasdiqlash kodini olish' }}
          </template>
        </button>

        <p v-if="isCodeSent" @click="isCodeSent = false" class="text-center text-xs text-blue-600 font-bold cursor-pointer hover:underline">
          Emailni o'zgartirish
        </p>
      </form>
    </div>
  </div>
</template>