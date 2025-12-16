# 1. Usamos Node 22 (versión segura y actual)
FROM node:22-alpine

# 2. Carpeta de trabajo
WORKDIR /app

# 3. Dependencias
COPY package*.json ./
RUN npm install

# 4. Copiamos el código
COPY . .

# 5. Exponemos el puerto de Vite
EXPOSE 5173

# 6. Arrancamos en modo desarrollo explícitamente
# --host 0.0.0.0 es OBLIGATORIO para que Docker exponga la web hacia fuera
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]