FROM node:24.18.0-alpine3.24 AS build
RUN npm install --global corepack@latest && \
    corepack enable pnpm && \
    corepack prepare pnpm@11.9.0 --activate
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build-storybook

FROM nginx:1.25.2-alpine
COPY --from=build /app/storybook-static /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
