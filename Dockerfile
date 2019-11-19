FROM node:12.13.0

WORKDIR /usr/src/face-recognition-api

COPY ./ ./

RUN npm install

CMD ["/bin/bash"]