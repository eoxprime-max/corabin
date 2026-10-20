// scratch/audit_supabase_covers.mjs
// Read-only audit of all Supabase posts and verification of Cloudinary covers.
// Does NOT print any credentials, secrets, or API keys.

import { SUPABASE_PROJECT_URL, SUPABASE_ANON_KEY, CLOUDINARY_CLOUD_NAME } from '../public/assets/js/blog-runtime.js';

function classifyCoverImage(cover) {
  if (!cover || typeof cover !== 'string' || cover.trim() === '') {
    return 'Empty or invalid value';
  }
  const clean = cover.trim();
  if (clean.startsWith('http://') || clean.startsWith('https://')) {
    return 'Full image URL';
  }
  if (clean.startsWith('/') || clean.startsWith('./') || clean.includes('assets/')) {
    return 'Local asset path';
  }
  // Cloudinary public ID typically has format "folder/slug-suffix" or "corabin/blog-covers/..."
  if (/^[a-zA-Z0-9_\-\/]+$/.test(clean) && !clean.includes(' ') && !clean.startsWith('.')) {
    return 'Cloudinary public ID';
  }
  return 'Empty or invalid value';
}

function constructCloudinaryUrl(publicId) {
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/f_auto,q_auto/${publicId}`;
}

async function verifyImageUrl(url) {
  try {
    const res = await fetch(url, { method: 'GET' });
    const contentType = res.headers.get('content-type') || 'unknown';
    const contentLength = res.headers.get('content-length') || 'unknown';
    return {
      status: res.status,
      ok: res.ok,
      contentType,
      contentLength,
      error: null
    };
  } catch (err) {
    return {
      status: 0,
      ok: false,
      contentType: null,
      contentLength: null,
      error: err.message
    };
  }
}

async function main() {
  console.log('======================================================================');
  console.log('CORABIN PHASE 4.2: READ-ONLY SUPABASE COVER IMAGE AUDIT');
  console.log('======================================================================\n');

  // Query Supabase for all records
  const url = `${SUPABASE_PROJECT_URL}/rest/v1/posts?select=slug,status,featured,cover_image&order=published_at.desc.nullslast`;
  const res = await fetch(url, {
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
    }
  });

  if (!res.ok) {
    console.error(`Failed to query Supabase: HTTP ${res.status} ${res.statusText}`);
    process.exit(1);
  }

  const posts = await res.json();
  console.log(`Retrieved ${posts.length} total post records from Supabase public.posts.\n`);

  let validCloudinaryCount = 0;
  let invalidIdCount = 0;
  let legacyLocalCount = 0;
  let fullUrlCount = 0;
  let emptyCount = 0;

  const tableData = [];
  const verificationResults = [];

  for (const p of posts) {
    const classification = classifyCoverImage(p.cover_image);
    const populated = Boolean(p.cover_image && p.cover_image.trim() !== '');

    tableData.push({
      slug: p.slug,
      status: p.status,
      featured: p.featured ? 'true' : 'false',
      classification: classification,
      populated: populated ? 'Yes' : 'No',
      cover_image: p.cover_image
    });

    if (classification === 'Cloudinary public ID') {
      const cUrl = constructCloudinaryUrl(p.cover_image);
      const verifyRes = await verifyImageUrl(cUrl);
      const isValid = verifyRes.ok && verifyRes.contentType.startsWith('image/');
      if (isValid) {
        validCloudinaryCount++;
      } else {
        invalidIdCount++;
      }

      verificationResults.push({
        slug: p.slug,
        publicId: p.cover_image,
        url: cUrl,
        status: verifyRes.status,
        contentType: verifyRes.contentType,
        contentLength: verifyRes.contentLength,
        isValid: isValid
      });
    } else if (classification === 'Local asset path') {
      legacyLocalCount++;
    } else if (classification === 'Full image URL') {
      fullUrlCount++;
    } else {
      emptyCount++;
    }
  }

  console.log('### STEP 1: SUPABASE AUDIT TABLE');
  console.log('------------------------------------------------------------------------------------------------------------------------');
  console.log(`| #  | Slug                                                         | Status    | Feat. | Classification        | Populated | Value`);
  console.log('------------------------------------------------------------------------------------------------------------------------');
  tableData.forEach((row, i) => {
    const num = String(i + 1).padEnd(2);
    const slug = row.slug.padEnd(60);
    const status = row.status.padEnd(9);
    const feat = row.featured.padEnd(5);
    const cls = row.classification.padEnd(21);
    const pop = row.populated.padEnd(9);
    console.log(`| ${num} | ${slug} | ${status} | ${feat} | ${cls} | ${pop} | ${row.cover_image}`);
  });
  console.log('------------------------------------------------------------------------------------------------------------------------\n');

  console.log('### STEP 2: CLOUDINARY IMAGE HTTP VERIFICATION');
  console.log('------------------------------------------------------------------------------------------------------------------------');
  console.log(`| #  | Slug                                                         | HTTP Status | Content-Type      | Bytes     | Verified?`);
  console.log('------------------------------------------------------------------------------------------------------------------------');
  verificationResults.forEach((vr, i) => {
    const num = String(i + 1).padEnd(2);
    const slug = vr.slug.padEnd(60);
    const statusStr = String(vr.status).padEnd(11);
    const cType = (vr.contentType || 'N/A').padEnd(17);
    const cLen = (vr.contentLength || 'N/A').padEnd(9);
    const verified = vr.isValid ? '✅ PASS' : '❌ FAIL';
    console.log(`| ${num} | ${slug} | ${statusStr} | ${cType} | ${cLen} | ${verified}`);
  });
  console.log('------------------------------------------------------------------------------------------------------------------------\n');

  console.log('### SUMMARY METRICS:');
  console.log(`Total Posts Examined:       ${posts.length}`);
  console.log(`Valid Cloudinary Covers:    ${validCloudinaryCount}`);
  console.log(`Invalid Cloudinary IDs:     ${invalidIdCount}`);
  console.log(`Legacy Local Asset Paths:   ${legacyLocalCount}`);
  console.log(`Full URLs:                  ${fullUrlCount}`);
  console.log(`Empty or Invalid Values:    ${emptyCount}`);
  console.log('======================================================================\n');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
