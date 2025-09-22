FROM node:24-bookworm AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app
COPY . .
RUN pnpm install --prod --frozen-lockfile

RUN \
  --mount=type=cache,target=/var/cache/apt \
  apt-get update \
  && apt-get install -y --no-install-recommends wget curl gnupg \
  && curl --location --silent https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
  && apt-get update \
  && apt-get install google-chrome-stable -y --no-install-recommends \
  && rm -rf /var/cache/apt/archives /var/lib/apt/lists/*

EXPOSE 8678
EXPOSE 8679
CMD [ "pnpm", "start" ]