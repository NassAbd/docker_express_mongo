# Utiliser l'image Node.js officielle
FROM node:18

# Définir le répertoire de travail
WORKDIR /usr/src/app

# Copier les fichiers nécessaires
COPY app/package*.json ./
RUN npm install
COPY app .

# Exposer le port de l'application
EXPOSE 3000

# Démarrer l'application
CMD ["npm", "start"]
