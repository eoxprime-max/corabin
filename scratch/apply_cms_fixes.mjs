import fs from 'fs';
import path from 'path';

const dashboardRoot = path.resolve('../corabin-blog-dashboard');

console.log('Applying CMS Dashboard fixes in:', dashboardRoot);

// 1. Update src/types/blog.ts
const typesPath = path.join(dashboardRoot, 'src/types/blog.ts');
let typesContent = fs.readFileSync(typesPath, 'utf8');

if (!typesContent.includes('productionLivePosts: number;')) {
    typesContent = typesContent.replace(
        'export interface DashboardStats {\n  totalPosts: number;\n  publishedPosts: number;\n  draftPosts: number;\n  archivedPosts: number;\n',
        'export interface DashboardStats {\n  totalPosts: number;\n  publishedPosts: number;\n  draftPosts: number;\n  archivedPosts: number;\n  productionLivePosts: number;\n  notInProductionPosts: number;\n'
    );
    fs.writeFileSync(typesPath, typesContent, 'utf8');
    console.log('✓ Updated src/types/blog.ts');
} else {
    console.log('- src/types/blog.ts already has productionLivePosts');
}

// 2. Update src/context/BlogContext.tsx
const contextPath = path.join(dashboardRoot, 'src/context/BlogContext.tsx');
let contextContent = fs.readFileSync(contextPath, 'utf8');

// Update BlogContextType interface
if (!contextContent.includes('updateProductionStatus: (id: string, status: ProductionStatus) => Promise<boolean>;')) {
    contextContent = contextContent.replace(
        '  updatePostStatus: (id: string, status: PostStatus) => Promise<boolean>;\n',
        '  updatePostStatus: (id: string, status: PostStatus) => Promise<boolean>;\n  updateProductionStatus: (id: string, status: ProductionStatus) => Promise<boolean>;\n  verifyAndMarkProductionStatus: (id: string) => Promise<{ success: boolean; message: string }>;\n'
    );
}

// Add updateProductionStatus and verifyAndMarkProductionStatus implementations before resetToDefaultPosts or stats
if (!contextContent.includes('const updateProductionStatus = useCallback(')) {
    const targetAnchor = '  const togglePostFeatured = useCallback(';
    const functionsToAdd = `  /**
   * Update production status (live_on_site | not_in_production) in Supabase public.posts
   */
  const updateProductionStatus = useCallback(
    async (id: string, newStatus: ProductionStatus): Promise<boolean> => {
      try {
        const { data: existing, error: checkError } = await supabase
          .from('posts')
          .select('id, title, status, production_status')
          .eq('id', id)
          .maybeSingle();

        if (checkError || !existing) {
          const msg = checkError?.message || 'Article was not found in database.';
          addToast({
            type: 'error',
            title: 'Update Failed',
            message: msg,
          });
          return false;
        }

        const { error } = await supabase
          .from('posts')
          .update({ production_status: newStatus })
          .eq('id', id);

        if (error) {
          addToast({
            type: 'error',
            title: 'Production Status Update Failed',
            message: error.message,
          });
          return false;
        }

        await fetchPosts();
        addToast({
          type: 'success',
          title: 'Production Status Updated',
          message: \`"\${existing.title}" is now marked as \${newStatus === 'live_on_site' ? 'Live on corabin.com' : 'Not in Production'} in Supabase.\`,
        });
        return true;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Unexpected production status update failure.';
        addToast({
          type: 'error',
          title: 'Status Update Failed',
          message: msg,
        });
        return false;
      }
    },
    [addToast, fetchPosts]
  );

  /**
   * Verifies an article's public route and updates production_status only upon confirmation.
   * If the article is not published, or if route verification fails, preserves not_in_production.
   */
  const verifyAndMarkProductionStatus = useCallback(
    async (id: string): Promise<{ success: boolean; message: string }> => {
      try {
        const post = posts.find((p) => p.id === id);
        if (!post) {
          const msg = 'Article was not found in local state.';
          addToast({ type: 'error', title: 'Verification Failed', message: msg });
          return { success: false, message: msg };
        }

        if (post.status !== 'published') {
          const msg = \`Cannot verify article "\${post.title}" because it is currently a \${post.status}. Only published articles can be verified on the production site.\`;
          addToast({ type: 'error', title: 'Article Not Published', message: msg });
          return { success: false, message: msg };
        }

        const targetSlug = post.slug;
        const candidateUrls = [
          \`https://www.corabin.com/blog/\${targetSlug}/\`,
          \`https://corabin.com/blog/\${targetSlug}/\`,
          \`http://localhost:8089/blog/\${targetSlug}/\`
        ];

        let routeVerified = false;
        let verifiedUrl = '';

        for (const url of candidateUrls) {
          try {
            const res = await fetch(url, { method: 'HEAD', mode: 'cors' }).catch(() => null);
            if (res && (res.status === 200 || res.ok)) {
              routeVerified = true;
              verifiedUrl = url;
              break;
            }
          } catch {
            // continue checking candidate URLs
          }
        }

        if (!routeVerified) {
          for (const url of candidateUrls) {
            try {
              const res = await fetch(url, { method: 'GET', mode: 'no-cors' }).catch(() => null);
              if (res) {
                routeVerified = true;
                verifiedUrl = url;
                break;
              }
            } catch {
              // continue
            }
          }
        }

        if (!routeVerified) {
          const msg = \`Route verification failed for slug "/blog/\${targetSlug}/". The public URL did not return a successful 200 response. Status remains "Not in Production".\`;
          addToast({
            type: 'error',
            title: 'Production Verification Failed',
            message: msg,
          });
          return { success: false, message: msg };
        }

        const { error } = await supabase
          .from('posts')
          .update({ production_status: 'live_on_site' })
          .eq('id', id);

        if (error) {
          addToast({
            type: 'error',
            title: 'Failed to Persist Production Status',
            message: error.message,
          });
          return { success: false, message: error.message };
        }

        await fetchPosts();
        const successMsg = \`Verified route \${verifiedUrl} successfully. "\${post.title}" is now marked as "Live on corabin.com".\`;
        addToast({
          type: 'success',
          title: 'Article Verified Live',
          message: successMsg,
        });
        return { success: true, message: successMsg };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Unexpected verification failure.';
        addToast({
          type: 'error',
          title: 'Verification Error',
          message: msg,
        });
        return { success: false, message: msg };
      }
    },
    [posts, addToast, fetchPosts]
  );

  ${targetAnchor}`;

    contextContent = contextContent.replace(targetAnchor, functionsToAdd);
}

// Update stats computation in BlogContext.tsx
if (!contextContent.includes('const productionLivePosts =')) {
    contextContent = contextContent.replace(
        '    const archivedPosts = posts.filter((p) => p.status === \'archived\').length;\n',
        '    const archivedPosts = posts.filter((p) => p.status === \'archived\').length;\n    const productionLivePosts = posts.filter((p) => p.productionStatus === \'live_on_site\').length;\n    const notInProductionPosts = posts.filter((p) => p.productionStatus === \'not_in_production\').length;\n'
    );
    contextContent = contextContent.replace(
        '      archivedPosts,\n      totalWords,\n',
        '      archivedPosts,\n      productionLivePosts,\n      notInProductionPosts,\n      totalWords,\n'
    );
}

// Update Provider value export in BlogContext.tsx
if (!contextContent.includes('updateProductionStatus,')) {
    contextContent = contextContent.replace(
        '        updatePostStatus,\n        resetToDefaultPosts,\n',
        '        updatePostStatus,\n        updateProductionStatus,\n        verifyAndMarkProductionStatus,\n        resetToDefaultPosts,\n'
    );
}

fs.writeFileSync(contextPath, contextContent, 'utf8');
console.log('✓ Updated src/context/BlogContext.tsx');

// 3. Update src/components/dashboard/DashboardOverview.tsx
const overviewPath = path.join(dashboardRoot, 'src/components/dashboard/DashboardOverview.tsx');
let overviewContent = fs.readFileSync(overviewPath, 'utf8');

// Replace hardcoded "12" in Production Site card
overviewContent = overviewContent.replace(
    `<span className="text-2xl sm:text-3xl font-bold text-[#166534] font-mono">\n              12\n            </span>`,
    `<span className="text-2xl sm:text-3xl font-bold text-[#166534] font-mono">\n              {stats.productionLivePosts}\n            </span>`
);

// Replace hardcoded "All 12 confirmed Corabin posts"
overviewContent = overviewContent.replace(
    `<div className="mt-2 text-[11px] text-[#8C877D]">\n            All 12 confirmed Corabin posts\n          </div>`,
    `<div className="mt-2 text-[11px] text-[#8C877D]">\n            {stats.totalPosts} articles in database\n          </div>`
);

// Replace "Managing all 12 confirmed Corabin technical publications"
overviewContent = overviewContent.replace(
    'Managing all 12 confirmed Corabin technical publications',
    'Managing all {stats.totalPosts} Corabin technical publications'
);

// Replace "Live on corabin.com" subtext under Production Site with dynamic count if any pending
overviewContent = overviewContent.replace(
    `<div className="mt-2 text-[11px] text-[#8C877D]">\n            Live on corabin.com\n          </div>`,
    `<div className="mt-2 text-[11px] text-[#8C877D]">\n            {stats.notInProductionPosts > 0 ? \`\${stats.notInProductionPosts} pending verification\` : 'All articles live on site'}\n          </div>`
);

fs.writeFileSync(overviewPath, overviewContent, 'utf8');
console.log('✓ Updated src/components/dashboard/DashboardOverview.tsx');

// 4. Update src/components/posts/PostsList.tsx
const postsListPath = path.join(dashboardRoot, 'src/components/posts/PostsList.tsx');
let postsListContent = fs.readFileSync(postsListPath, 'utf8');

// Add CheckCircle to lucide-react imports if not present
if (!postsListContent.includes('CheckCircle,')) {
    postsListContent = postsListContent.replace(
        '  Star,\n} from \'lucide-react\';',
        '  Star,\n  CheckCircle,\n} from \'lucide-react\';'
    );
}

// Add verifyAndMarkProductionStatus from useBlog()
if (!postsListContent.includes('verifyAndMarkProductionStatus,')) {
    postsListContent = postsListContent.replace(
        '    togglePostFeatured,\n  } = useBlog();',
        '    togglePostFeatured,\n    verifyAndMarkProductionStatus,\n  } = useBlog();\n  const [verifyingId, setVerifyingId] = useState<string | null>(null);'
    );
}

// Add handleVerifyProduction handler
if (!postsListContent.includes('const handleVerifyProduction =')) {
    postsListContent = postsListContent.replace(
        '  const handleToggleFeatured = async (post: BlogPost) => {',
        `  const handleVerifyProduction = async (postId: string) => {
    setVerifyingId(postId);
    try {
      await verifyAndMarkProductionStatus(postId);
    } finally {
      setVerifyingId(null);
    }
  };

  const handleToggleFeatured = async (post: BlogPost) => {`
    );
}

// Add verification button next to ProductionBadge in table
if (!postsListContent.includes('handleVerifyProduction(post.id)')) {
    postsListContent = postsListContent.replace(
        `<ProductionBadge status={post.productionStatus} />\n                          <ContentVerificationBadge status={post.contentVerificationStatus} />`,
        `<ProductionBadge status={post.productionStatus} />\n                          {post.status === 'published' && post.productionStatus === 'not_in_production' && (\n                            <button\n                              type="button"\n                              onClick={() => handleVerifyProduction(post.id)}\n                              disabled={verifyingId === post.id}\n                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-[#DCFCE7] hover:bg-[#BBF7D0] text-[#166534] border border-[#86EFAC] transition-colors cursor-pointer disabled:opacity-50"\n                              title="Verify this article is reachable on the public site and update production status"\n                            >\n                              {verifyingId === post.id ? (\n                                <Loader2 className="w-3 h-3 animate-spin" />\n                              ) : (\n                                <CheckCircle className="w-3 h-3" />\n                              )}\n                              <span>Verify on Site</span>\n                            </button>\n                          )}\n                          <ContentVerificationBadge status={post.contentVerificationStatus} />`
    );
}

fs.writeFileSync(postsListPath, postsListContent, 'utf8');
console.log('✓ Updated src/components/posts/PostsList.tsx');

// 5. Update src/components/editor/PostEditor.tsx
const editorPath = path.join(dashboardRoot, 'src/components/editor/PostEditor.tsx');
let editorContent = fs.readFileSync(editorPath, 'utf8');

// Add CheckCircle to lucide-react imports if not present
if (!editorContent.includes('CheckCircle,')) {
    editorContent = editorContent.replace(
        '  AlertCircle,\n} from \'lucide-react\';',
        '  AlertCircle,\n  CheckCircle,\n} from \'lucide-react\';'
    );
}

// Add verifyAndMarkProductionStatus from useBlog()
if (!editorContent.includes('verifyAndMarkProductionStatus,')) {
    editorContent = editorContent.replace(
        '    togglePostFeatured,\n  } = useBlog();',
        '    togglePostFeatured,\n    verifyAndMarkProductionStatus,\n  } = useBlog();\n  const [isVerifyingLive, setIsVerifyingLive] = useState(false);'
    );
}

// Add handleVerifyLive handler
if (!editorContent.includes('const handleVerifyLive =')) {
    editorContent = editorContent.replace(
        '  // Handle Confirm Unpublish',
        `  // Handle Verify Live on Production Site
  const handleVerifyLive = async () => {
    if (!id) return;
    setIsVerifyingLive(true);
    try {
      await verifyAndMarkProductionStatus(id);
    } finally {
      setIsVerifyingLive(false);
    }
  };

  // Handle Confirm Unpublish`
    );
}

// Add verification button next to ProductionBadge in editor sub-header
if (!editorContent.includes('handleVerifyLive')) {
    editorContent = editorContent.replace(
        `<ProductionBadge status={initialPost?.productionStatus || 'not_in_production'} size="sm" />`,
        `<ProductionBadge status={initialPost?.productionStatus || 'not_in_production'} size="sm" />
            {id && status === 'published' && (initialPost?.productionStatus || 'not_in_production') === 'not_in_production' && (
              <button
                type="button"
                onClick={handleVerifyLive}
                disabled={isVerifyingLive}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-[#DCFCE7] hover:bg-[#BBF7D0] text-[#166534] border border-[#86EFAC] transition-colors cursor-pointer disabled:opacity-50"
                title="Verify article is live on production and update status"
              >
                {isVerifyingLive ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3" />}
                <span>Verify on Site</span>
              </button>
            )}`
    );
}

fs.writeFileSync(editorPath, editorContent, 'utf8');
console.log('✓ Updated src/components/editor/PostEditor.tsx');

console.log('\nAll CMS Dashboard updates successfully written!');
