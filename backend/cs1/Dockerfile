# download the base image (os for the app )
FROM golang:alpine

# specify working directory 
WORKDIR /usr/local/app/worker-server

# source -> destination
COPY . .

# nothing to do with open ports , just for viewer to acess server will run on which port
EXPOSE 5001

# download the dependencies
RUN go mod download

#configure final image ( command to start the server )
ENTRYPOINT ["go","run","main.go"]




