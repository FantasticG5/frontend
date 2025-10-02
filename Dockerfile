# ---- BUILD ----
    FROM node:20-alpine AS build
    WORKDIR /app
    
    COPY package*.json ./
    RUN npm ci
    
    COPY . .
    
    # --- Build args (kommer utifrån) ---
    ARG VITE_IDENTITY_URL
    ARG VITE_BOOKING_URL
    ARG VITE_EVENT_URL
    ARG VITE_HOTJAR_SITE_ID
    ARG VITE_HOTJAR_ENABLED
    
    # Gör dem till ENV så npm run build ser dem
    ENV VITE_IDENTITY_URL=$VITE_IDENTITY_URL
    ENV VITE_BOOKING_URL=$VITE_BOOKING_URL
    ENV VITE_EVENT_URL=$VITE_EVENT_URL
    ENV VITE_HOTJAR_SITE_ID=$VITE_HOTJAR_SITE_ID
    ENV VITE_HOTJAR_ENABLED=$VITE_HOTJAR_ENABLED
    
    RUN npm run build
    
    # ---- RUNTIME ----
    FROM nginx:1.27-alpine
    COPY nginx.conf /etc/nginx/conf.d/default.conf
    COPY --from=build /app/dist /usr/share/nginx/html
    EXPOSE 80
    CMD ["nginx", "-g", "daemon off;"]
    