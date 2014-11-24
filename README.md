The scraper is really working, albeit leaking memory:
```
cd bikeshistory/scraper
npm install
node app.js
```

If you want to change the default behaviour look into the scraper/config.js file. CONFIG.dbDriver lets you select to which databases should writing take place (multiple entries may be selected at once).

If you want to write to Firebase the database must be writable by anyone, there is no credentials code for that.
Writing to DynamoDB requires the AWS credentials to be put into <code>credentials.aws.js</code> file, for file format details please refer to the exisitng <code>credentials.aws.tpl.js</code> file.

MongoDB is reading the credentials from credentials.js, with the corresponding credentials.tmpl.js as an example.

In order to run AngularJS/Bootstrap based frontend stay in the project's root folder and run npm start.

```
cd bikeshistory
npm start
```

The fronted is listening on port 8000 by default.
