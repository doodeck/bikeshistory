#

mkdir -p tmp
zip -r tmp/index.zip \
  *.js invokeidempotent/*.js invokeidempotent/modules/ \
  lib/ modules/ public/ routes/ views/ node_modules/
aws --profile lambda lambda create-function --region eu-west-1 \
  --function-name bikeslambda \
  --runtime nodejs \
  --role 'arn:aws:iam::915133436062:role/bikes_lambda_exec_role' \
  --handler 'invokeidempotent/invokeidempotent.handler' \
  --timeout 30 \
  --memory-size 128 \
  --zip-file fileb://tmp/index.zip
