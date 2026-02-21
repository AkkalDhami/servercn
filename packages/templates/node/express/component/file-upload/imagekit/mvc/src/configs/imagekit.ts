import ImageKit from "@imagekit/nodejs";
import env from "./env";

const imagekitClient = new ImageKit({
  privateKey: env.IMAGEKIT_PRIVATE_KEY
});

export default imagekitClient;
