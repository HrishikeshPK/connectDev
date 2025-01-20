const {SESClient} = require("@aws-sdk/client-ses")
// set the aws region
const REGION = "ap-south-1"
// Create SES service object
const SESClient = new SESClient({ 
    region: REGION,
    credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY
} })

module.exports = {SESClient}
// snippet-end:[ses.javascript.createclientv3]