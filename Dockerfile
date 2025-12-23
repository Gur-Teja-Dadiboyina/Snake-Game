# Use the official nginx image as the base
FROM nginx:stable-alpine

# Set working directory in container
WORKDIR /usr/share/nginx/html

# Remove default nginx static files
RUN rm -rf ./*

# Copy all site files into nginx html directory
COPY . .

# Expose port 80 (default nginx port)
EXPOSE 80

# Start nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
