export interface ImageKitConfig {
  privateKey: string;
}

export function getImageKitConfig(): ImageKitConfig {
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;

  if (!privateKey) {
    throw new Error(
      'Missing required ImageKit configuration. Please check IMAGEKIT_PRIVATE_KEY environment variable.',
    );
  }

  return { privateKey };
}
