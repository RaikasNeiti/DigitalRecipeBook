# Use Node.js LTS as the base image
FROM node:23-slim
# Set the working directory
WORKDIR /recipe/

# Copy package.json and package-lock.json from the root/src/app folder
COPY package.json /recipe/
COPY package-lock.json /recipe/
COPY postcss.config.mjs /recipe/
COPY next.config.ts /recipe/
COPY tsconfig.json /recipe/

# Install dependencies
RUN npm install

# Copy the rest of the application code from the root/src/app folder
COPY ./src/app /recipe/app

# Expose the frontend port
EXPOSE 3000

# Start the frontend development server
CMD ["npm", "run", "dev"]