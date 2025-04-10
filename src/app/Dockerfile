# Use Node.js LTS as the base image
FROM node:23-slim
# Set the working directory
WORKDIR /recipe/

# Copy package.json and package-lock.json from the root/src/app folder
<<<<<<< HEAD
COPY package.json /recipe/
COPY package-lock.json /recipe/
COPY postcss.config.mjs /recipe/
COPY next.config.ts /recipe/
COPY tsconfig.json /recipe/
=======
COPY ../../package*.json ./
>>>>>>> main

# Install dependencies
RUN npm install

# Copy the rest of the application code from the root/src/app folder
<<<<<<< HEAD
COPY ./src/app /recipe/app
=======
COPY ../../src/app ./
>>>>>>> main

# Expose the frontend port
EXPOSE 3000

# Start the frontend development server
CMD ["npm", "run", "dev"]