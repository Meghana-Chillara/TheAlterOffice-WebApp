// cloudinary.ts
import { Cloudinary } from 'cloudinary-core';

const cloudinary = new Cloudinary({
    cloud_name: 'dbmqgcmgz', // Enclose your cloud name in quotes
    secure: true,
});

export default cloudinary;
