The scraper is really working, albeit leaking memory:
```
cd bikeshistory/scraper
npm install
node app.js

If you want to change the default behaviour look into the scraper/config.js
file. CONFIG.dbDriver lets you select to which databases should writing
take place (multiple my be selected at once).

If you want to wrie to Firebase the database must be wriatable by anyone,
there is no credentials code for that.
Writing to DynamoDB requires the AWS credentials to be put into
credentials.aws.js file, for file format details please refer to the exisitng
credentials.aws.tpl.js file.
