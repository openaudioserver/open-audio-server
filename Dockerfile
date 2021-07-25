# syntax=docker/dockerfile:1
FROM node:14
WORKDIR /app
ENV MUSIC_PATH=/data/music
ENV CACHE_PATH=/data/cache
ENV SYNOMAN_PATH=/data/synoman
ENV THEME_PATH=/data/theme
ENV DSAUDIO_HTML_PATH=/data/html/dsaudio.html
ENV GZIP=true
ENV PORT=5000
ENV HOST=0.0.0.0
RUN apt-get update
RUN apt-get install -y sox libsox-fmt-all build-essential
RUN git clone https://github.com/openaudioserver/open-audio-server /app
RUN npm install
EXPOSE 5000
CMD [ "node", "server.js" ]