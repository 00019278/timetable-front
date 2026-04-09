# Берем готовый Nginx
FROM nginx:alpine

# Копируем УЖЕ СОБРАННУЮ папку dist внутрь Nginx
COPY dist/ /usr/share/nginx/html/

# Копируем настройки Nginx (чтобы работал роутинг Vue)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]