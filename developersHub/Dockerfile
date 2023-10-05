FROM --platform=linux/amd64 nginx:alpine

COPY ./dist/developers-hub /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]