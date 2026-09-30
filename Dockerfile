# Stage 1: Build environment
FROM node:14 AS builder
WORKDIR /app
COPY package*.json ./
# Install ALL dependencies (including devDependencies) so we can build
RUN npm install
COPY . .
# Run the babel build script from package.json
RUN npm run build

# Stage 2: Production environment
FROM node:14-alpine
WORKDIR /app
COPY package*.json ./
# Install ONLY production dependencies to keep the image small and secure
RUN npm install --only=production
# Copy only the compiled dist folder from the builder stage
COPY --from=builder /app/dist ./dist

EXPOSE 5000
# Run the built app directly
CMD [ "node", "dist/app.js" ]