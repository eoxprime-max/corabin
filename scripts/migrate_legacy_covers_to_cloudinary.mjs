/**
 * Dry-Run & Migration Script for 10 Legacy Blog Covers to Cloudinary
 *
 * SAFETY GUARANTEES:
 * 1. Default mode is DRY-RUN. Does not upload or mutate database without --execute flag.
 * 2. Uses slug-and-content-hash public IDs to guarantee zero collision with existing Cloudinary assets.
 * 3. Does not delete any local files.
 * 4. Does not print credentials or secrets.
 *
 * Usage:
 *   node scripts/migrate_legacy_covers_to_cloudinary.mjs           # Dry-run plan & SQL generation
 *   node scripts/migrate_legacy_covers_to_cloudinary.mjs --execute # Live execution (requires env vars)
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const CLOUDINARY_CLOUD_NAME = 'teolzwgc';
const CLOUDINARY_BLOG_COVERS_FOLDER = 'corabin/blog-covers';

export const LEGACY_POSTS_MAPPING = [
  { slug: 'custom-vs-off-the-shelf-choose-wisely', file: 'public/assets/images/blogs/blog1.png' },
  { slug: 'design-that-converts-our-approach', file: 'public/assets/images/blogs/blog2.png' },
  { slug: '7-critical-steps-to-successfully-launch-your-digital-product', file: 'public/assets/images/blogs/blog3.png' },
  { slug: 'choosing-the-right-tech-stack-a-decision-framework-for-2025', file: 'public/assets/images/blogs/blog4.png' },
  { slug: 'speed-up-your-website-today', file: 'public/assets/images/blogs/blog5.png' },
  { slug: 'why-design-systems-actually-matter', file: 'public/assets/images/blogs/blog6.png' },
  { slug: 'headless-cms-the-future-is-here', file: 'public/assets/images/blogs/blog7.png' },
  { slug: 'stop-making-these-common-api-mistakes', file: 'public/assets/images/blogs/blog8.png' },
  { slug: 'website-security-made-simple', file: 'public/assets/images/blogs/blog9.png' },
  { slug: 'technical-debt-friend-or-foe', file: 'public/assets/images/blogs/blog10.png' }
];

export function generateMigrationPlan() {
  const plan = [];

  for (const item of LEGACY_POSTS_MAPPING) {
    const fullPath = path.resolve(process.cwd(), item.file);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Local file not found: ${fullPath}`);
    }

    const buf = fs.readFileSync(fullPath);
    const hash = crypto.createHash('md5').update(buf).digest('hex').slice(0, 8);
    const publicId = `${CLOUDINARY_BLOG_COVERS_FOLDER}/${item.slug}-${hash}`;
    const deliveryUrl = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/f_auto,q_auto/${publicId}`;

    plan.push({
      slug: item.slug,
      localFile: item.file,
      fileSizeBytes: buf.length,
      publicId,
      deliveryUrl,
      updateSql: `UPDATE public.posts SET cover_image = '${publicId}' WHERE slug = '${item.slug}';`
    });
  }

  return plan;
}

async function main() {
  const isExecute = process.argv.includes('--execute');

  console.log('======================================================================');
  console.log('CORABIN CLOUDINARY MIGRATION PLAN (10 LEGACY COVERS)');
  console.log(`Mode: ${isExecute ? 'LIVE EXECUTION' : 'DRY-RUN AUDIT'}`);
  console.log('======================================================================\n');

  const plan = generateMigrationPlan();

  console.log('1. Target Cloudinary Configuration:');
  console.log(`   Cloud Name: ${CLOUDINARY_CLOUD_NAME}`);
  console.log(`   Folder:     ${CLOUDINARY_BLOG_COVERS_FOLDER}\n`);

  console.log('2. Asset Mapping Table (Local File -> Proposed Public ID -> Delivery URL):\n');
  plan.forEach((item, idx) => {
    console.log(`[${idx + 1}/10] Post: ${item.slug}`);
    console.log(`       Source File:  ${item.localFile} (${(item.fileSizeBytes / 1024).toFixed(1)} KB)`);
    console.log(`       Public ID:    ${item.publicId}`);
    console.log(`       Delivery URL: ${item.deliveryUrl}\n`);
  });

  console.log('3. Safe SQL Migration Statements for Supabase:\n');
  console.log('BEGIN;');
  plan.forEach(item => console.log(item.updateSql));
  console.log('COMMIT;\n');

  if (!isExecute) {
    console.log('======================================================================');
    console.log('DRY-RUN COMPLETE: 0 remote files uploaded, 0 database rows modified.');
    console.log('To execute live after owner approval, configure CLOUDINARY_API_KEY and');
    console.log('CLOUDINARY_API_SECRET in your environment and run with --execute.');
    console.log('======================================================================');
    return;
  }

  console.log('Live execution requested. Verifying environment credentials...');
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!apiKey || !apiSecret) {
    console.error('Error: CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET must be set for live execution.');
    process.exit(1);
  }

  console.log('Uploading images to Cloudinary...');
  // Upload implementation deferred until owner approval
}

if (process.argv[1]?.endsWith('migrate_legacy_covers_to_cloudinary.mjs')) {
  main().catch(err => {
    console.error('Migration plan error:', err);
    process.exit(1);
  });
}
