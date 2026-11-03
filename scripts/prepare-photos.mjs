import sharp from 'sharp';
import { mkdir, copyFile } from 'node:fs/promises';
import { resolve } from 'node:path';
const source = process.argv[2];
if (!source)
  throw new Error(
    'Pass the directory containing the extracted original PowerPoint photographs.',
  );
const images = {
  pool: 'image1.jpeg',
  facade: 'image7.JPG',
  terrace: 'image8.jpeg',
  'terrace-lounge': 'image9.jpeg',
  'room-1': 'image11.JPG',
  'room-2': 'image12.jpg',
  'room-3': 'image13.jpeg',
  'room-4': 'image14.jpg',
  living: 'image18.JPG',
  'bathroom-1': 'image19.jpeg',
  'bathroom-2': 'image21.jpeg',
  'ping-pong': 'image5.jpeg',
  garden: 'image6.jpeg',
  grasse: 'image23.jpg',
  'grasse-street': 'image22.jpeg',
};
await mkdir('public/images', { recursive: true });
for (const [name, file] of Object.entries(images))
  await sharp(resolve(source, file))
    .rotate()
    .resize({ width: 1800, withoutEnlargement: true })
    .webp({ quality: 84 })
    .toFile(`public/images/${name}.webp`);
await sharp(resolve(source, 'gourdon-licensed.jpg'))
  .rotate()
  .resize({ width: 1600, withoutEnlargement: true })
  .webp({ quality: 84 })
  .toFile('public/images/gourdon.webp');
if (process.argv[3])
  await copyFile(process.argv[3], 'docs/design/approved-sand-olive.png');
console.log(
  'Prepared 16 web photographs. Metadata removed; original aspect ratios preserved.',
);
