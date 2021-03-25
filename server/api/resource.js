const router = require('express').Router()
const AWS = require('aws-sdk');
const fs = require('fs');
const FileType = require('file-type'); //checks file type
const multiparty = require('multiparty'); // parse http  requests

AWS.config.update({
    // accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    // secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    accessKeyId: "AKIAZJQUHJDDUN2UJKT4",
    secretAccessKey: "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"
  });
  
  
  const s3 = new AWS.S3();
  
  const uploadFile = (buffer, name, type) => {
  
    // console.log("ACCESS KEY", AWS_ACCESS_KEY_ID)
    const params = {
      ACL: 'public-read',
      Body: buffer,
      Bucket: "built-to-learn",
      ContentType: type.mime,
      Key: `${name}.${type.ext}`,
    };
    return s3.upload(params).promise();
  };
  
  // Define POST route
  router.post('/test-upload', (request, response) => {
    console.log("inside POST")
    const form = new multiparty.Form();
    console.log("FORM", form)
    form.parse(request, async (error, fields, files) => {
      if (error) {
        console.log("ERROR INSIDE")
        return response.status(500).send(error);
      };
  
      try {
        console.log("INSIDE POST ROUTE")
        const path = files.file[0].path;
        const buffer = fs.readFileSync(path);
        const type = await FileType.fromBuffer(buffer);
        const fileName = `bucketFolder/${Date.now().toString()}`;
        const data = await uploadFile(buffer, fileName, type);
        return response.status(200).send(data);
      } catch (err) {
        console.log("THIS IS MY ERROR", err)
        return response.status(500).send(err);
      }
    });
  });

  module.exports = router
