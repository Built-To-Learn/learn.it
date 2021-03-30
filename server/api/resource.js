const router = require('express').Router()
const AWS = require('aws-sdk');
const fs = require('fs');
const FileType = require('file-type'); //checks file type
const multiparty = require('multiparty'); // parse http  requests

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
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

  const uploadImageFile = (buffer, name, type) => {
    const params = {
      ACL: 'public-read',
      Body: buffer,
      Bucket: "built-to-learn-profile-pics",
      ContentType: type.mime,
      Key: `${name}.${type.ext}`,
    };
    return s3.upload(params).promise();
  };


  // Define POST route
  router.post('/test-upload/:title', (request, response) => {
    // console.log("inside POST")
    const form = new multiparty.Form();
    const title = request.params.title
    // console.log("FORM", form)
    form.parse(request, async (error, fields, files) => {
      if (error) {
        return response.status(500).send(error);
      };
  
      try {
        console.log("FILE",files)
        const path = files.file[0].path;
        const buffer = fs.readFileSync(path);
        const type = await FileType.fromBuffer(buffer);
        const fileName = `${title}/${files.file[0].originalFilename}`;
        const fileNameNoExt = fileName.split('.').slice(0, -1).join('.')
        const data = await uploadFile(buffer, fileNameNoExt, type);
        return response.status(200).send(data);
      } catch (err) {
        console.log("THIS IS MY ERROR", err)
        return response.status(500).send(err);
      }
    });
  });

  router.get('/:courseTitle', async(request, response) => {
      try {

        const courseTitle = request.params.courseTitle

        AWS.config.setPromisesDependency()
        AWS.config.update({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          });
          const s3 = new AWS.S3()
          const data = await s3.listObjectsV2({
              Bucket: "built-to-learn",
              Prefix: courseTitle
          }).promise()

        return response.status(200).send(data);
      } catch (err) {
          console.log(err)

      }
  
  });

  router.post('/profile-pic/:username', (request, response) => {
    // console.log("inside POST")
    const form = new multiparty.Form();
    const username = request.params.username
    form.parse(request, async (error, fields, files) => {
      if (error) {
        return response.status(500).send(error);
      };
  
      try {
        const path = files.file[0].path;
        const buffer = fs.readFileSync(path);
        const type = await FileType.fromBuffer(buffer);
        const fileName = `${username}/${files.file[0].originalFilename}`;
        const fileNameNoExt = fileName.split('.').slice(0, -1).join('.')
        const data = await uploadImageFile(buffer, fileNameNoExt, type);
        return response.status(200).send(data);
      } catch (err) {
        console.log("THIS IS MY ERROR", err)
        return response.status(500).send(err);
      }
    });
  });
   
 
  module.exports = router
