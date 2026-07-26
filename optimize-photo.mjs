import sharp from 'sharp';
// Source lives outside the deployed site; outputs go into public/assets/.
const src = 'src-assets/profile-original.jpg';
// Center-crop to square, resize to 640 (2x for a 320px display), strip metadata.
await sharp(src)
  .rotate() // respect EXIF orientation
  .resize(640, 640, { fit: 'cover', position: 'attention' })
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile('public/assets/profile.jpg');
await sharp(src)
  .rotate()
  .resize(640, 640, { fit: 'cover', position: 'attention' })
  .webp({ quality: 80 })
  .toFile('public/assets/profile.webp');
console.log('done');
