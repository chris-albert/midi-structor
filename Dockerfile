FROM nginx:alpine

COPY local/nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
RUN rm -rf ./*

# Copy static assets from builder stage
COPY dist/apps/ui .

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
