FROM node:11 as builder

WORKDIR /src/
COPY package.json package-lock.json /src/
RUN npm ci
COPY app.js index.html style.css /src/

FROM nginx:1.15-alpine
ENV API_MOCK="false" \
    API_BASE_URL="http://localhost:8800" \
    LOCALE="cs" \
    DOLLAR="$"
CMD ["/bin/sh", "-c", "envsubst < /etc/nginx/nginx.conf > /etc/nginx/nginx.conf && exec nginx -g 'daemon off;'"]
COPY --from=builder /src/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/nginx.conf
