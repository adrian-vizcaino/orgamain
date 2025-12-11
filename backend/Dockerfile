# 1. Usamos una imagen ligera de Node
FROM node:22-alpine

# 2. Creamos la carpeta de trabajo dentro del contenedor
WORKDIR /app

# 3. Copiamos los archivos de dependencias primero (para aprovechar la caché)
COPY package*.json ./

# 4. Instalamos las dependencias
RUN npm install

# 5. Copiamos el resto del código del backend
COPY . .

# 6. Construimos el proyecto (TypeScript -> JavaScript)
RUN npm run build

# 7. Exponemos el puerto que usa el backend
EXPOSE 3000

# 8. Comando para iniciar
CMD ["npm", "start"]