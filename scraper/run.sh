#!/bin/bash

while true
do
  date >> node-release.log
  node app.js >> node-release.log
done
