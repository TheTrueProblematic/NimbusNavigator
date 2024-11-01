# Use an official Node.js LTS version as the base image
FROM node:lts

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port 3000 to the host
EXPOSE 3000

# Start the application
CMD ["node", "index.js"]
