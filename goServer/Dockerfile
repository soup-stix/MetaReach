FROM --platform=linux/amd64 golang:1.21.1 AS builder

WORKDIR /usr/src/app

COPY . .

RUN go mod tidy

RUN go build -o /app/main 

EXPOSE 3000

CMD ["/app/main"]