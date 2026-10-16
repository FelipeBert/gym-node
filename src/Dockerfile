# Build the application and generate the Prisma client in a dedicated stage.
FROM node:22-alpine AS build_image
WORKDIR /usr/src/app
# Copy manifests first so dependency installation can be cached between builds.
COPY package*.json ./
RUN npm install

# Generate Prisma client before compiling the application.
COPY prisma ./prisma/
RUN npx prisma generate

COPY . .
RUN npm run build

# Keep the runtime image separate from build steps.
FROM node:22-alpine
WORKDIR /usr/src/app

COPY --chown=node:node --from=build_image /usr/src/app/package*.json ./
COPY --chown=node:node --from=build_image /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build_image /usr/src/app/build ./build
COPY --chown=node:node --from=build_image /usr/src/app/prisma ./prisma

# Run the application without root privileges.
USER node

EXPOSE 80
# Start the application.
CMD ["node", "build/server.cjs"]