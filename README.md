
REST Service
Introduction
Welcome to the Home Library Service project! This repository contains a REST service that allows users to manage their home library, including information about artists, tracks, albums, and favorites. This README provides details on the project structure, API endpoints, and instructions for running the service.

Project Structure
The project is organized into separate modules for better maintainability:

src/app - Application logic
controllers - Request handlers for each resource
services - Business logic services
models - Data models for entities
middlewares - Custom middleware functions
src/config - Configuration files
src/routes - Route definitions for each resource
src/utils - Utility functions
test - Unit and integration tests
API Endpoints
The REST service provides the following endpoints for each resource:

Users
GET /user - Get all users
GET /user/:id - Get a single user by ID
POST /user - Create a new user
PUT /user/:id - Update a user's password
DELETE /user/:id - Delete a user
Tracks
GET /track - Get all tracks
GET /track/:id - Get a single track by ID
POST /track - Create a new track
PUT /track/:id - Update track information
DELETE /track/:id - Delete a track
Artists
GET /artist - Get all artists
GET /artist/:id - Get a single artist by ID
POST /artist - Create a new artist
PUT /artist/:id - Update artist information
DELETE /artist/:id - Delete an artist
Albums
GET /album - Get all albums
GET /album/:id - Get a single album by ID
POST /album - Create a new album
PUT /album/:id - Update album information
DELETE /album/:id - Delete an album
Favorites
GET /favs - Get all favorites (artists, albums, tracks)
POST /favs/track/:id - Add a track to favorites
DELETE /favs/track/:id - Remove a track from favorites
POST /favs/album/:id - Add an album to favorites
DELETE /favs/album/:id - Remove an album from favorites
POST /favs/artist/:id - Add an artist to favorites
DELETE /favs/artist/:id - Remove an artist from favorites
Getting Started
Follow these steps to run the service:

Install Node.js (version 18 LTS).

Create a .env file with the following content:

 ```env
   PORT=4000
   DATABASE_URL=postgresql://username:password@localhost:5432/database
    "npm i" - to install all the packages
    "start": "npm run serve:mock",
    "serve": "node scripts/start.js",
    "serve:mock": "npm run serve -- --env.config mock",
    "serve:dev": "npm run serve -- --env.config epam/config_dev.js",
    "serve:ast:dev": "npm run serve -- --env.config ast/config_qa.js",
    "server:prod": "http-server ./dist",
    "build": "node scripts/build.js",
