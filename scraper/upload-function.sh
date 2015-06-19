#

# borrowed from project https://github.com/doodeck/aws-lambda-idempotent
# similarly the invokidempotent folder

mkdir -p tmp
zip -r tmp/index.zip \
  *.js invokeidempotent/*.js invokeidempotent/modules/ \
  lib/ modules/ public/ routes/ views/ node_modules/
# As of CLI 1.7 upload-function option has been discontinued. Use update-function-code instead
#aws --profile lambda lambda upload-function --region eu-west-1 \
#  --function-name bikeslambda \
#  --function-zip tmp/index.zip \
#  --role 'arn:aws:iam::915133436062:role/bikes_lambda_exec_role' --mode event \
#  --handler invokeidempotent/invokeidempotent.handler --runtime nodejs --timeout 30
# Keep the timeout value in sync with the invokeidempotent/config.js
aws --profile lambda lambda update-function-code --region eu-west-1 \
  --function-name bikeslambda \
  --zip-file fileb://tmp/index.zip
