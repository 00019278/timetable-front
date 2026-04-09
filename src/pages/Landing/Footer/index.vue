<template>
  <footer id="contact" class="bg-[#0B1120] text-gray-300 pt-20 pb-10 border-t border-gray-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

        <div class="md:col-span-1">
          <div class="flex items-center gap-2 mb-6">
            <div class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white">
              <i class="ri-book-open-line text-lg"></i>
            </div>
            <span class="text-xl font-extrabold text-white tracking-tight">Timetable.uz</span>
          </div>
          <p class="text-sm text-gray-400 leading-relaxed pr-4">
            {{ $t('landing.footer.description') }}
          </p>
        </div>

        <div>
          <h4 class="text-white font-semibold mb-6">{{ $t('landing.footer.product') }}</h4>
          <ul class="space-y-3 text-sm">
            <li><a href="#" class="hover:text-white transition-colors">{{ $t('landing.footer.features') }}</a></li>
            <li><a href="#" class="hover:text-white transition-colors">{{ $t('landing.footer.pricing') }}</a></li>
            <li><a href="#" class="hover:text-white transition-colors">{{ $t('landing.footer.demo') }}</a></li>
            <li><a href="#" class="hover:text-white transition-colors">{{ $t('landing.footer.support') }}</a></li>
          </ul>
        </div>

        <div>
          <h4 class="text-white font-semibold mb-6">{{ $t('landing.footer.company') }}</h4>
          <ul class="space-y-3 text-sm">
            <li><a href="#" class="hover:text-white transition-colors">{{ $t('landing.footer.about_us') }}</a></li>
            <li><a href="#" class="hover:text-white transition-colors">{{ $t('landing.footer.contact') }}</a></li>
            <li><a href="#" class="hover:text-white transition-colors">{{ $t('landing.footer.privacy_policy') }}</a></li>
            <li><a href="#" class="hover:text-white transition-colors">{{ $t('landing.footer.terms_of_service') }}</a></li>
          </ul>
        </div>

        <div>
          <h4 class="text-white font-semibold mb-6">{{ $t('landing.footer.connect') }}</h4>
          <ul class="space-y-3 text-sm">
            <li><a href="#" class="hover:text-white transition-colors">{{ $t('landing.footer.twitter') }}</a></li>
            <li><a href="#" class="hover:text-white transition-colors">{{ $t('landing.footer.linkedin') }}</a></li>
            <li><a href="#" class="hover:text-white transition-colors">{{ $t('landing.footer.facebook') }}</a></li>
            <li><a href="#" class="hover:text-white transition-colors">{{ $t('landing.footer.email') }}</a></li>
          </ul>
        </div>
      </div>

      <div class="pt-8 border-t border-gray-800/60 text-center text-sm text-gray-500">
        <p>{{ $t('landing.footer.rights') }}</p>
      </div>
    </div>
  </footer>
</template>