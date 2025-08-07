export async function compressBase64Image(
  base64: string,
  maxWidth = 300,
  quality = 0.7
): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = base64;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const scaleFactor = maxWidth / img.width;

      canvas.width = maxWidth;
      canvas.height = img.height * scaleFactor;

      const ctx = canvas.getContext('2d');
      if (!ctx) return reject('canvas context error');

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          if (!blob) return reject('Blob conversion failed');
          const file = new File([blob], 'signature.jpg', { type: 'image/jpeg' });
          resolve(file);
        },
        'image/jpeg',
        quality
      );
    };

    img.onerror = (err) => reject(err);
  });
}
