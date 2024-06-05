# Gunakan node sebagai base image
FROM node:18 as development

# Set working directory di dalam container
WORKDIR /app

# Salin file package.json dan package-lock.json
COPY package*.json ./

# Install dependensi npm untuk mode pengembangan
RUN npm install --only=development

# Salin seluruh kode sumber aplikasi
COPY . .

# Expose port yang digunakan oleh aplikasi (misalnya, 3000 untuk React + Vite)
EXPOSE 3000

# Perintah untuk menjalankan aplikasi dalam mode pengembangan
CMD ["npm", "run", "dev"]
