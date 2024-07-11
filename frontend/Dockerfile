FROM nginx
WORKDIR /usr/share/nginx/html
RUN apt-get update
RUN apt-get install npm -y
COPY package.json .
RUN npm i
COPY . .
RUN npm run build
COPY dist .