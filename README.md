## Live Demo

The frontend demonstrating the content of the databases is running here:

https://bikeshistory.firebaseapp.com/

As of today, it's not writing to the Firebase DB, only to Dynamo. The maim reason is much more generous free tier (25 GB).

## The Web Scraper

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

The server is listening on port 8000 by default.


Running as Lambda Function
--------------------------
The scraper module is capable of being run as the Lambda function. The meager resources needed (128MB) make it capable of fitting within the indefinite AWS free quota. There is a convenience upload script to facilitate uploading. The preceding npm install is still required.


### Lambda Function Execution Role

The default role created by the AWS Console/CLI is not enough. You need additional rights to access DynamoDB and execute the Lambda function (recursion, this is how the daemon functionality works). The sample policy may look like this:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "logs:*"
      ],
      "Resource": "arn:aws:logs:*:*:*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject"
      ],
      "Resource": [
        "arn:aws:s3:::*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
         "lambda:*"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:*"
      ],
      "Resource": "*"
    }
  ]
}```
This is of course granting too much rights (all Lambda and all DynamoDB operations/resources), but since this function is executed internally, from the context of authorized user, there is no risk of misuse.


## The Frontend

### Create AWS Cognito identity pool
Open AWS Console, select Cognito module.

Click "New Identity Pool". Enter the Identity Pool Name of your choice, e.g. "bikeshistory". Check the box "Enable Access to Unauthenticated Identities". Click "Create Pool". On the next page leave all the defaults, click "Update Roles".
On the next page you'll see the sampel code for Android, iOS and .NET. Copy/Paste the unique id's into app.js/config/cognito/AccountId:|IdentityPoolId:|RoleArn. Do not copy the authenticated role name (e.g. "Cognito_bikeshistory_Auth_DefaultRole"), this is not used.

In AWS xonsole open IAM module. Edit the roles. Edit the unathenticated role (e.g. "Cognito_bikeshistory_Unauth_DefaultRole") you have just created. In the Permissions section click "Attach Role Policy". Depending on your experience and personal preferences go through either "Policy Generator" or "Custom Policy". Create a policy with selected read-only access to the DynamoDB database, e.g.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "Stmt1417028341000",
      "Effect": "Allow",
      "Action": [
        "dynamodb:BatchGetItem",
        "dynamodb:DescribeTable",
        "dynamodb:GetItem",
        "dynamodb:Query",
        "dynamodb:Scan"
      ],
      "Resource": [
        "arn:aws:dynamodb:eu-west-1:915133436062:table/bikeshistory"
      ]
    }
  ]
}
```
