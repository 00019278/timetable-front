<script lang="ts" setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goLogin = () => {
  router.push('/login');
};
</script>

<template>
  <section class="relative pt-24 pb-32 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
    
    <div data-aos="fade-down" class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold mb-8">
      <i class="ri-graduation-cap-fill"></i>
      <p>{{ $t('landing.hero.trusted_by') }}</p>
    </div>

    <h1 data-aos="fade-up" data-aos-delay="100" class="text-5xl sm:text-6xl lg:text-[64px] font-extrabold text-[#0f172a] leading-[1.1] tracking-tight mb-6">
      {{ $t('landing.hero.title_part1') }} <br class="hidden sm:block" />
      {{ $t('landing.hero.title_part2') }} <span class="text-blue-600">Timetable.uz</span>
    </h1>

    <p data-aos="fade-up" data-aos-delay="200" class="text-lg sm:text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
      {{ $t('landing.hero.description') }}
    </p>

    <div data-aos="zoom-in" data-aos-delay="300" class="flex flex-col sm:flex-row items-center justify-center gap-4">
      <button @click="goLogin" class="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3.5 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20">
        <p>{{ $t('landing.hero.start_free') }}</p>
        <i class="ri-arrow-right-line"></i>
      </button>

      <button class="w-full sm:w-auto bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-800 font-semibold px-8 py-3.5 rounded-xl transition-all active:scale-95 flex items-center justify-center">
        <p>{{ $t('landing.hero.view_demo') }}</p>
      </button>
    </div>
    
  </section>
</template>