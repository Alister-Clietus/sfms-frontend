# Stage 1: Build
FROM node:20.11.1-alpine AS build
WORKDIR /app

# Install dependencies securely
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code
COPY . .

# Build the Angular application
# For local compose testing, we build the development configuration
RUN npm run build -- --configuration=development

# Stage 2: Runtime
FROM nginx:alpine
# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy the generated Angular build to Nginx
COPY --from=build /app/dist/sfms-frontend/browser /usr/share/nginx/html

# Expose standard web port
EXPOSE 80

# Run Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]