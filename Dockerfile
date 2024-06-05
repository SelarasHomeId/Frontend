# Gunakan node sebagai base image
FROM node:18 as build

# Set working directory di dalam container
WORKDIR /app

# Salin file package.json dan package-lock.json
COPY package*.json ./

# Install dependensi npm
RUN npm install

# Salin seluruh kode sumber aplikasi
COPY . .

# Build aplikasi menggunakan Vite
RUN npm run build

# Tahap kedua: gunakan nginx sebagai server web
FROM nginx:alpine

# Salin hasil build dari tahap pertama ke dalam direktori nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Port yang digunakan oleh nginx
EXPOSE 80

# Perintah untuk menjalankan nginx saat container dijalankan
CMD ["nginx", "-g", "daemon off;"]
