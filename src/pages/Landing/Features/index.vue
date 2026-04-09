<script lang="ts" setup>
const features = [
  {
    icon: 'ri-graduation-cap-line',
    iconColor: 'text-blue-600',
    title: 'landing.features.card1_title',
    desc: 'landing.features.card1_desc'
  },
  {
    icon: 'ri-calendar-check-line',
    iconColor: 'text-emerald-500',
    title: 'landing.features.card2_title',
    desc: 'landing.features.card2_desc'
  },
  {
    icon: 'ri-time-line',
    iconColor: 'text-purple-500',
    title: 'landing.features.card3_title',
    desc: 'landing.features.card3_desc'
  },
  {
    icon: 'ri-notification-3-line',
    iconColor: 'text-orange-500',
    title: 'landing.features.card4_title',
    desc: 'landing.features.card4_desc'
  }
];
</script>

<template>
  <section id="features" class="py-24 bg-gray-50/50 overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      <div class="text-center max-w-3xl mx-auto mb-16">
        <h2 data-aos="fade-up" data-aos-once="false" class="text-3xl font-bold text-gray-900 mb-4">
          {{ $t('landing.features.title') }}
        </h2>

        <p data-aos="fade-up" data-aos-delay="100" data-aos-once="false" class="text-gray-500 text-lg">
          {{ $t('landing.features.subtitle') }}
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        <div 
          v-for="(feat, idx) in features" 
          :key="idx" 
          :data-aos="idx < 2 ? 'fade-right' : 'fade-left'" 
          :data-aos-delay="(idx === 1 || idx === 2) ? 100 : 300"
          data-aos-once="false"
          class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
        >
          <div class="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-6">
            <i :class="[feat.icon, feat.iconColor]" class="text-2xl"></i>
          </div>

          <h3 class="text-lg font-bold text-gray-900 mb-3">{{ $t(feat.title) }}</h3>
          <p class="text-gray-500 text-[15px] leading-relaxed">{{ $t(feat.desc) }}</p>
        </div>

      </div>
    </div>
  </section>
</template>