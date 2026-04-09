<script lang="ts" setup>
const testimonials = [
  {
    text: 'landing.testimonials.review1_text',
    author: 'landing.testimonials.review1_author',
    role: 'landing.testimonials.review1_role'
  },
  {
    text: 'landing.testimonials.review2_text',
    author: 'landing.testimonials.review2_author',
    role: 'landing.testimonials.review2_role'
  },
  {
    text: 'landing.testimonials.review3_text',
    author: 'landing.testimonials.review3_author',
    role: 'landing.testimonials.review3_role'
  }
];
</script>

<template>
  <section id="testimonials" class="py-24 overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div class="text-center max-w-3xl mx-auto mb-16">
        <h2 
          data-aos="fade-up" 
          data-aos-once="false" 
          class="text-3xl font-bold text-gray-900 mb-4"
        >
          {{ $t('landing.testimonials.title') }}
        </h2>
        
        <p 
          data-aos="fade-up" 
          data-aos-delay="100" 
          data-aos-once="false" 
          class="text-gray-500 text-lg"
        >
          {{ $t('landing.testimonials.subtitle') }}
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div 
          v-for="(review, idx) in testimonials" 
          :key="idx" 
          data-aos="fade-up"
          :data-aos-delay="idx * 150"
          data-aos-once="false"
          class="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 flex flex-col justify-between hover:shadow-md hover:-translate-y-1 transition-all duration-300"
        >
          <div>
            <div class="flex items-center gap-1 text-yellow-400 mb-4 text-lg">
              <i class="ri-star-fill" v-for="i in 5" :key="i"></i>
            </div>
            <p class="text-gray-600 italic leading-relaxed mb-8">{{ $t(review.text) }}</p>
          </div>
          <div>
            <p class="font-bold text-gray-900">{{ $t(review.author) }}</p>
            <p class="text-sm text-gray-500">{{ $t(review.role) }}</p>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>