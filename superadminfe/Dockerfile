# FROM node:18

# WORKDIR /app

# COPY package.json .


# RUN npm install --force


# RUN npm i @mui/styles --force


# COPY . .


# EXPOSE 3000

# CMD ["npm", "start"]





FROM node:18
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps
COPY . .
RUN npm run build
CMD ["npx","serve","-s","build","-l","3000"]