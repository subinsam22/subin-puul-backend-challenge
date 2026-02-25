FROM node:24-alpine

WORKDIR /usr/src/app


COPY package*.json ./
RUN npm install

# Copy the rest of your source code
COPY . .

# Expose the port your dev server runs on
EXPOSE 3000

# Keep the development command
CMD ["npm", "run", "start:dev"]