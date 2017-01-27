#!/bin/bash

cd /opt/schifezze
echo "Cloning..."
git pull origin master
echo "npm install..."
npm install
echo "Restarting pm2 task..."
pm2 stop schifezze ; NODE_ENV=production pm2 start app.js --name 'schifezze'
echo "Done"