# Property photo retouch proposals

Created on 2026-11-03 with the built-in ImageGen editing tool from the owner's updated PowerPoint photographs. These are AI-retouched proposals, not new camera photographs. The public website continues to use its original property images. No originals were overwritten.

Open `index.html` locally for the side-by-side comparison, or inspect `overview.jpg`. Each `*-retouched.webp` is an individual export; each `*-original.webp` is a resized reference. Generated exports retain their output resolution (up to 1800 px), use WebP quality 92 and omit source metadata.

## Review

Visually reviewed all 13 outputs against the source contact sheet. Main layouts, furniture types and bed arrangements remain recognisable. Generative processing reconstructs fine details, especially the low-resolution pool and bedroom 2 sources. Owner verification is needed before using these as commercial property photographs. Do not represent reconstructed detail as documentary evidence. Public gallery images have deliberately not been switched.

## Source mapping

| Export                        | Original PowerPoint media |
| ----------------------------- | ------------------------- |
| pool-retouched.webp           | image1.jpeg               |
| terrace-retouched.webp        | image8.jpeg               |
| terrace-lounge-retouched.webp | image9.jpeg               |
| facade-retouched.webp         | image7.JPG                |
| room-1-retouched.webp         | image11.JPG               |
| room-2-retouched.webp         | image12.jpg               |
| room-3-retouched.webp         | image13.jpeg              |
| room-4-retouched.webp         | image14.jpg               |
| living-retouched.webp         | image18.JPG               |
| bathroom-1-retouched.webp     | image19.jpeg              |
| bathroom-2-retouched.webp     | image21.jpeg              |
| ping-pong-retouched.webp      | image5.jpeg               |
| garden-retouched.webp         | image6.jpeg               |

## Exact prompt set

Each edit used the following prompt, followed by `Subject/file identifier: NAME.` where NAME is the export identifier above. The corresponding original was the sole edit target.

> Use case: lighting-weather. Input image 1 is the edit target, an actual rental villa photograph. Produce a careful professional real-estate photographic retouch of THIS EXACT photograph, not a reimagining. Improve exposure, neutral white balance, recover shadows, softly balance bright windows, restrained natural colours, fine photographic clarity and subtle lens correction. Welcoming Mediterranean daylight, realistic editorial property photography, no HDR halos. Preserve the exact camera position, framing, aspect ratio, architecture, room size, layout, all furniture and its positions, beds and bed counts, fixtures, wall colours, materials, vegetation, pool shape and proportions. Do not add, remove or replace any object or invent views or luxury amenities. No staging, no new decor, no text, no watermark. Retain authentic imperfections and texture. Output one finished photograph.

## Preview in Codespaces

From the repository root:

```bash
python3 -m http.server 8766 --directory docs/photography --bind 0.0.0.0
```

Open forwarded port 8766. This comparison is documentation, not a public website route.
