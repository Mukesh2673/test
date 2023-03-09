import config from "config";
import * as AWS from "aws-sdk";
import fs from 'fs';
const webp=require('webp-converter');
webp.grant_permission();

const options: any = {
  secretAccessKey: config.get("AWS.BUCKET.SECRET"),
  accessKeyId: config.get("AWS.BUCKET.ACCESS_KEY"),
  region: config.get("AWS.BUCKET.REGION"),
  endpoint: config.get("AWS.BUCKET.ENDPOINT")
};

export class FileUpload {

  /**
   * 
   * @param carrierID string
   * @param file object
   */
  public static async upload(file: any, isWebp: any = false, folder: any = '') {
    AWS.config.update(options);
    const s3 = new AWS.S3();

    let params: any;
    let newName: any;

    if(isWebp){
      //new name of file
      newName = Date.now() + '.webp';

      await webp.cwebp(file.path,`temp/${newName}`,"-q 80");

      params = {
        ACL: 'public-read',
        ContentType: 'webp',
        Bucket: `${config.get("AWS.BUCKET.NAME")}`,
        Body: fs.createReadStream(`temp/${newName}`),
        Key: folder ? `${folder}/${newName}` : `${newName}`
      };
    }else{

      //split the name to get the extension
      const originalname = file.originalname;
      const splitName = originalname.split('.');

      //new name of file
      // newName = CherryUtilities.getUUID() + '.' + splitName[splitName.length - 1];
      newName = Date.now() + '.jpg';


      params = {
        ACL: 'public-read',
        // ContentType: file.mimetype,
        ContentType: 'jpg',
        Bucket: `${config.get("AWS.BUCKET.NAME")}`,
        Body: fs.createReadStream(file.path),
        Key: folder ? `${folder}/${newName}` : `${newName}`
      };
    }


    try {
      await s3.upload(params).promise()
    } catch (err) {
      newName = '';  //if its not uploaded empty the image name
      console.log(`Error uploading file to S3. Details: ${err}`);
    }

    fs.unlinkSync(file.path); // Empty temp folder
    if(isWebp && newName)  fs.unlinkSync(`temp/${newName}`); // Delete web image
    return newName;
  }

  /**
   * 
   * @param carrierID string
   * @param fileName string
   */
  public static async delete(fileName: any) {
    AWS.config.update(options);

    const s3 = new AWS.S3();
    const params = {
      Bucket: `${config.get("AWS.BUCKET.NAME")}`,
      Key: `${fileName}`
    };

    try {
      await s3.deleteObject(params).promise();
      return true;
    } catch (err) {
      console.log(`Error deleting file from S3. Details: ${err}`);
      return false;
    }
  }
}
