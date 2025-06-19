build:
	docker build -t app .

run:
	docker run -p 3000:3000 app

start: build run