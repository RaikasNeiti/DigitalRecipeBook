# Use Node.js LTS as the base image
FROM node:23-slim

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json from the root/src/app folder
COPY ../../package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code from the root/src/app folder
COPY ../../src/app ./

# Expose the frontend port
EXPOSE 3000

# Start the frontend development server
CMD ["npm", "run", "dev"]