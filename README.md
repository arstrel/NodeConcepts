# Advanced Node Concepts
Example node - express - react - redux app to learn and showcase some node concepts. The react front end part of the app is just enough to enable me to learn and showcase the node concepts. 

This is the approximate plan of action:
1. Authentication with passport and Google
2. Connecting to remote MondoDB
3.  Data caching with Redis
    - [x] Connect redis server that runs on local machine
    - [x] Create a chainable 'cache' function on mongoose.Query.prototype to signal that this query instance needs to use caching
    - [x] Modify mongoose exec function to use redis caching
    - [x] Create 'cleanCache' middleware to make sure we can clean the cache when needed. It need to work after the route handler.
4. Automated Headless Browser Testing (Integration testing)
    - [x] Make use of Jest test suite
    - [x] Boot up 'headless' version of Chromium with puppeteer. Visit 'localhost:3000' and ineract with the app such as the user will do.
    - [x] Handle authentication via Google OAuth in testing environment
    - [x] Write some tests to make an assertion about the content on the 'virtual screen'
    - [x] Add testing factory functions for creating Users and Sessions
    - [x] Create a wrapper class and make use of Proxy to extend puppeteer Page class with login functionality
5. Continuous Integration (CI)
    - [x] Make use of Travis CI
    - [x] Dig into CI behind the scenes, Travis CI setup options
6. Image/File upload scalable AWS S3 solution 