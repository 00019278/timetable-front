export async function autoTranslate(text: string, lang: string): Promise<string> {
  // Matn bo'sh bo'lsa yoki allaqachon ingliz tilida bo'lsa (server xatosi inglizcha bo'lgani uchun)
  if (!text || !lang || lang === 'en') return text;

  try {
    // MyMemory kodlari: uz-UZ, ru-RU
    const targetLang = lang === 'uz' ? 'uz-UZ' : lang === 'ru' ? 'ru-RU' : lang;
    
    // langpair=en|uz formatida yuboramiz. 
    // muhim: encodeURIComponent ishlatish shart, chunki xato xabarlarida bo'sh joylar bo'ladi
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.responseStatus === 200 || data.responseStatus === "200") {
      let translatedText = data.responseData.translatedText;

      // Agar tarjima o'xshamasa yoki bo'sh kelsa
      if (!translatedText || translatedText === text) {
        return text;
      }

      // HTML entity-larni (masalan, &#39;) tozalash
      if (typeof document !== 'undefined') {
        const txt = document.createElement("textarea");
        txt.innerHTML = translatedText;
        return txt.value;
      }
      
      return translatedText;
    }
    
    return text;
  } catch (error) {
    console.error("AI Translation Error:", error);
    return text;
  }
}