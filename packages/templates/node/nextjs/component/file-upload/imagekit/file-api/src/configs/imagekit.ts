import ImageKit from "@imagekit/nodejs";

const imagekitClient = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY
});

export default imagekitClient;
