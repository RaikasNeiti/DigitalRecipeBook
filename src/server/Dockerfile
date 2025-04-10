# Use Node.js LTS as the base image
FROM node:23-slim

# Set the working directory
WORKDIR /recipe/

# Copy package.json and package-lock.json
COPY package.json /recipe/
COPY package-lock.json /recipe/
COPY .env ../

# Install dependencies
RUN npm install

# Copy the rest of the application code from the root/src/app folder
COPY ./src/server /recipe/server
WORKDIR /recipe/server

# Expose the backend port
EXPOSE 5000

# Start the backend server
CMD ["node", "index.js"]