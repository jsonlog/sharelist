FROM node:8-alpine
MAINTAINER reruin

ADD . /sharelist/
WORKDIR /sharelist
VOLUME /sharelist/cache

RUN npm install

# ENV HOST 0.0.0.0
ENV PORT 33001

EXPOSE 33001

CMD ["npm", "start"]

# RUN mkdir -m 777 /app 

# ADD deploy.sh /deploy.sh

# RUN chmod +x /deploy.sh 

# CMD /deploy.sh