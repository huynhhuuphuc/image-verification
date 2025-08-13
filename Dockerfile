# Use the official Node.js image as the base image
FROM node:18-alpine AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json package-lock.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy the rest of the application code to the working directory
COPY . .

# Accept build arguments for environment
ARG NODE_ENV=production
ARG BUILD_MODE=production

# Set environment variables
ENV NODE_ENV=${NODE_ENV}
ENV BUILD_MODE=${BUILD_MODE}

# Build the application based on BUILD_MODE
RUN if [ "$BUILD_MODE" = "production" ]; then \
        npm run build:prod; \
    elif [ "$BUILD_MODE" = "uat" ]; then \
        npm run build:uat; \
    elif [ "$BUILD_MODE" = "development" ]; then \
        npm run build:dev; \
    else \
        npm run build; \
    fi

# Production stage with nginx
FROM nginx:alpine AS production

# Install envsubst for environment variable substitution
RUN apk add --no-cache gettext

# Copy the build output to nginx html directory
# The build output is in dist/production/ folder
COPY --from=build /app/dist/production /usr/share/nginx/html

# Create nginx configuration template
COPY nginx.conf.template /etc/nginx/nginx.conf.template

# Copy startup script
COPY start-nginx.sh /start-nginx.sh
RUN chmod +x /start-nginx.sh

# Cloud Run uses PORT environment variable
ENV PORT=8080
EXPOSE $PORT

# Use the startup script
CMD ["/start-nginx.sh"]
