# Atelier | Ratings and Reviews Microservice

A redesign of a monolithic ratings and reviews microservice with an end goal to support load under large amounts of user traffic and stress. This service handles requests in gathering numerous product reviews, as well as gathering a product’s meta data, such as average rating, and the average rating for a product’s characteristics, like quality, fit or length. This service also allows user input, allowing them to add their own review to a product, as well as report or mark existing reviews as helpful.

## Goals
* Throughput of 1000 RPS
* < 1% Error Rate Under Load
* Average Latency of < 2000ms

## Tech Stack

* JavaScript
* PostgreSQL
* Redis
* Postman
* K6
* Loader.io
* NewRelic
* NGINX
* AWS EC2

## Initial Stress Test Metrics

### GET '/reviews' Route 
<img width="1226" alt="Screen Shot 2022-11-08 at 11 47 42 PM" src="https://user-images.githubusercontent.com/98191976/212228965-24344849-00af-4029-be31-5fd487e302a6.png">

* 35ms Latency
* 1000RPS Throughput
* 0% Error Rate

### GET '/metas' Route
<img width="1201" alt="Screen Shot 2022-11-08 at 11 45 43 PM" src="https://user-images.githubusercontent.com/98191976/212229391-7077a648-b9be-47a0-bc6d-085d111ff1e1.png">

* 1200ms Latency
* 1000 RPS Throughput
* 0% Error Rate

## After Horizontally Scaling Across 3 Servers with Redis Caching

### GET '/reviews' Route
<img width="1194" alt="Screen Shot 2022-11-15 at 11 57 52 PM" src="https://user-images.githubusercontent.com/98191976/212229895-bca186df-6859-484d-aabd-78aa7036658c.png">

* 24ms Latency
* 3000 RPS Througput
* 0.02% Error Rate

### GET '/metas' Route
<img width="1186" alt="Screen Shot 2022-11-16 at 12 04 42 AM" src="https://user-images.githubusercontent.com/98191976/212230294-5b8cdb9e-9d80-4e82-beaa-dca0e0cfe436.png">

* 23ms Latency
* 3000 RPS Throughput
* 0.2% Error Rate





