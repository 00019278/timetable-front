<script lang="ts" setup>
const pricing = [
  {
    name: 'landing.pricing.plan1_name',
    price: '$0',
    period: 'landing.pricing.forever',
    desc: 'landing.pricing.plan1_desc',
    features: [
      'landing.pricing.plan1_f1', 
      'landing.pricing.plan1_f2', 
      'landing.pricing.plan1_f3', 
      'landing.pricing.plan1_f4'
    ],
    isPopular: false,
    btnText: 'landing.pricing.get_started'
  },
  {
    name: 'landing.pricing.plan2_name',
    price: '$29',
    period: 'landing.pricing.per_month',
    desc: 'landing.pricing.plan2_desc',
    features: [
      'landing.pricing.plan2_f1', 
      'landing.pricing.plan2_f2', 
      'landing.pricing.plan2_f3', 
      'landing.pricing.plan2_f4', 
      'landing.pricing.plan2_f5', 
      'landing.pricing.plan2_f6'
    ],
    isPopular: true,
    btnText: 'landing.pricing.get_started'
  },
  {
    name: 'landing.pricing.plan3_name',
    price: '$99',
    period: 'landing.pricing.per_month',
    desc: 'landing.pricing.plan3_desc',
    features: [
      'landing.pricing.plan3_f1', 
      'landing.pricing.plan3_f2', 
      'landing.pricing.plan3_f3', 
      'landing.pricing.plan3_f4', 
      'landing.pricing.plan3_f5', 
      'landing.pricing.plan3_f6'
    ],
    isPopular: false,
    btnText: 'landing.pricing.get_started'
  }
];
</script>


<template>
  <section id="pricing" class="py-24 bg-gray-50/50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-3xl mx-auto mb-16">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">{{ $t('landing.pricing.title') }}</h2>
        <p class="text-gray-500 text-lg">{{ $t('landing.pricing.subtitle') }}</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-center max-w-5xl mx-auto">
        <div v-for="(plan, idx) in pricing" :key="idx"
          class="relative bg-white rounded-3xl p-8 border shadow-sm flex flex-col"
          :class="plan.isPopular ? 'border-blue-500 shadow-xl md:-translate-y-4' : 'border-gray-200'">

          <div v-if="plan.isPopular"
            class="absolute -top-4 left-1/2 -translate-x-1/2 text-center bg-blue-500 text-white text-[11px] font-bold uppercase tracking-wider py-1 px-3 rounded-full">
            {{ $t('landing.pricing.most_popular') }}
          </div>

          <div class="text-center mb-8">
            <h3 class="text-xl font-bold text-gray-900 mb-4">{{ $t(plan.name) }}</h3>
            <div class="flex items-baseline justify-center gap-1">
              <span class="text-5xl font-extrabold text-gray-900">{{ plan.price }}</span>
              <span class="text-gray-500 font-medium">{{ $t(plan.period) }}</span>
            </div>
            <p class="text-sm text-gray-500 mt-4">{{ $t(plan.desc) }}</p>
          </div>

          <ul class="space-y-4 mb-8 flex-1">
            <li v-for="(feat, fIdx) in plan.features" :key="fIdx" class="flex items-start gap-3">
              <i class="ri-check-line text-emerald-500 font-bold mt-0.5"></i>
              <span class="text-gray-600 text-[15px]">{{ $t(feat) }}</span>
            </li>
          </ul>

          <button
            :class="plan.isPopular ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-50 text-gray-900 border border-gray-200 hover:bg-gray-100'"
            class="w-full py-3.5 rounded-xl font-bold transition-all active:scale-95">
            {{ $t(plan.btnText) }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>