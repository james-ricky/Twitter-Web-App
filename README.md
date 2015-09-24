Lamplight Frontend Users
=====================================
## Setup dependencies

    npm install
    bower install

## Dev Server

    gulp dev


## Heroku Demo Server

### Setup Heroku

    git remote add demo https://git.heroku.com/lamplight-frontend-users-v1.git
    heroku create lamplight-frontend
    heroku config:set BUILDPACK_URL='https://github.com/heroku/heroku-buildpack-nodejs#v63'
    heroku config:set NODE_ENV=production

### Deploy Heroku

    gulp deploy
    gulp deploy --env demo


## VPS Staging Server


### Setting up git push for deploy

Run the following commands on local dev machine:

    git remote add staging ssh://labs42@119.9.95.179/var/repo/lamplight-v1-frontend-users.git
    git push staging master

Run the following commands on server:

    groupadd deployers
    useradd -G deployers labs42
    sudo mkdir /var/repo
    cd /var/repo
    sudo chgrp deployers .
    sudo chmod g+xrw .
    mkdir lamplight-v1-frontend-users.git
    cd lamplight-v1-frontend-users.git
    git init --bare

    vi hooks/post-receive

        #!/bin/sh
        git --work-tree=/var/www/lamplight-v1-frontend-users --git-dir=/var/repo/lamplight-v1-frontend-users.git checkout -f

    chmod +x hooks/post-receive

    mkdir /var/www
    cd /var/www
    sudo chgrp deployers .
    sudo chmod g+xrw .
    sudo mkdir lamplight-v1-frontend-users
    cd lamplight-v1-frontend-users
    mkdir log


### Setting up server dependencies

Run the following commands on server:

    sudo apt-get install nginx-extras supervisor
    vi /etc/nginx/sites-available/lamplight-v1-frontend-users

        server {
          listen 80;
          server_name staging-v1-frontend-users.lamplight-analytics.com;
          access_log  /var/log/nginx/access.log;
          root /var/www/lamplight-v1-frontend-users;

          location / {
            proxy_headers_hash_max_size 51200;
            proxy_headers_hash_bucket_size 6400;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_read_timeout 600;
            include proxy_params;
            proxy_pass http://127.0.0.1:3001;
          }
        }

    ln -s /etc/nginx/sites-enabled/lamplight-v1-frontend-users /etc/nginx/sites-available/lamplight-v1-frontend-users
    sudo vi /etc/supervisor/conf.d/lamplight-v1-frontend-users.conf

        [program:lamplight-v1-frontend-users-nodejs]
        directory=/var/www/lamplight-v1-frontend-users
        command=/usr/bin/nodejs server.js
        autostart=true
        autorestart=unexpected
        user=labs42
        startsecs=10
        stdout_logfile=/var/www/lamplight-v1-frontend-users/log/supervisor.log
        redirect_stderr=true

    sudo service nginx restart
    sudo service supervisor restart

    cd /var/www/lamplight-v1-frontend-users
    npm install


### Deploy

    gulp deploy --env staging


## Change API url

Update /app/env.json

---
