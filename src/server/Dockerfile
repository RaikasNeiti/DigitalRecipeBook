# Use Node.js LTS as the base image
FROM node:22-slim

ENV NODE_ENV=production

# Set the working directory
WORKDIR /recipe/

# Copy package.json and package-lock.json
COPY package.json /recipe/
COPY package-lock.json /recipe/

# Install dependencies (NODE_ENV=production skips the frontend-only devDependencies)
RUN npm install

# Copy the backend code and the admin CLI (scripts/create-admin.js)
COPY ./src/server /recipe/server
COPY ./scripts /recipe/scripts
WORKDIR /recipe/server

# Expose the backend port
EXPOSE 5000

# Start the backend server
CMD ["node", "index.js"]