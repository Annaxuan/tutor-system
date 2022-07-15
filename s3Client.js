import AWS from "aws-sdk"

AWS.config.update({
	apiVersion: "latest",
	region: "ca-central-1",
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

const s3 = new AWS.S3()

export default s3;
