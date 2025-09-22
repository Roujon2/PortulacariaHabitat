# Official Node.js image
FROM node:18-alpine

# Working dir
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start the app
CMD ["node", "server.js"]
