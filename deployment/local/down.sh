#!/bin/bash

docker compose --project-name fitsuite-local \
               --file project/docker-compose.yml \
               down