# Use uma imagem Node.js mais completa (baseada em Debian)
FROM node:20-bullseye

# Diretório de trabalho
WORKDIR /app

# Instalar dependências do sistema (Python + FFmpeg + bibliotecas para librosa)
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-dev \
    build-essential \
    libsndfile1 \
    libatlas-base-dev \
    gfortran \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Instalar yt-dlp e librosa via pip
RUN pip3 install --no-cache-dir yt-dlp librosa

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências do Node.js
# Instalar dependências do Node.js
RUN npm install
ENV DATABASE_URL="postgresql://cifras_user:PqqThqzvabtKngHlcXd9jnDFYTkkxmoP@dpg-d2pm44fdiees73c5t06g-a.oregon-postgres.render.com/cifras"
COPY prisma ./prisma
RUN npx prisma generate

# Copiar o restante do código
COPY . .

# Build do TypeScript
RUN npm run build

# Porta exposta
EXPOSE 3000

# Rodar a aplicação
CMD ["node", "dist/index.js"]
