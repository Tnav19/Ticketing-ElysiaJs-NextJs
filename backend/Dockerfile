# Use the official Bun image
FROM oven/bun:1

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json bun.lockb ./

# Install dependencies
RUN bun install

# Copy source code
COPY . .

# Expose the port the app runs on
EXPOSE 5000

# Set environment variables
ENV PORT=5000
ENV NODE_ENV=production

# Start the application
CMD ["bun", "run", "src/index.ts"] 