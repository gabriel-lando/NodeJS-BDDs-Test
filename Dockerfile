# Use NodeJS Latest Slim image
FROM node:slim

# Create app directory 
WORKDIR /app
VOLUME /app/data

# Install app dependencies
COPY package.json ./
RUN npm install

# Copy remaning files
COPY . .

# Expose application port, if necessary
EXPOSE 8000

# Run JS file with Node
CMD [ "node", "index.js" ]

# How to run:
# docker build . -t bdds-test
# docker run -d -p 8005:8000 -v /home/gabriel/data/nodejs/BDDs-Test/data:/app/data --restart unless-stopped --name bdds-test bdds-test