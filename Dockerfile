FROM nginx:1.27-alpine

# Configuração do servidor
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Arquivos do site
COPY index.html /usr/share/nginx/html/
COPY css/ /usr/share/nginx/html/css/
COPY js/ /usr/share/nginx/html/js/
COPY assets/ /usr/share/nginx/html/assets/

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost/ >/dev/null || exit 1
