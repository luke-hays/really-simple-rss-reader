docker build -t mongo-rss .
docker run -d -p 127.0.0.1:27017:27017 --name mongo-rss-container mongo-rss

# TODO Persist Data with Volumnes
# TODO Add Environment Variables for auth