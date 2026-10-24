import subprocess, re

def check_script_main():
    head_content = subprocess.check_output(['git', 'show', 'HEAD:public/framerusercontent.com/sites/46CYIm3dbxFoU3f63shpCX/script_main.CNn1uaXy.mjs'], text=True)
    with open('public/framerusercontent.com/sites/46CYIm3dbxFoU3f63shpCX/script_main.CNn1uaXy.mjs') as f:
        working_content = f.read()

    old_snippet = 'ne(document.getElementById(`__framer-badge-container`),S(v,{},S(x(()=>import(`./PX9hIOIVM.Dl3LQnTP.mjs`)))))'
    new_snippet = '(()=>{let _b=document.getElementById(`__framer-badge-container`);_b&&ne(_b,S(v,{},S(x(()=>import(`./PX9hIOIVM.Dl3LQnTP.mjs`)))))})()'

    if old_snippet in head_content:
        subbed = head_content.replace(old_snippet, new_snippet, 1)
        if subbed == working_content:
            print('✅ script_main.CNn1uaXy.mjs: The ONLY change is guarding badge hydration with null check. Exact match!')
        else:
            print('❌ script_main: Additional changes detected')
    else:
        print('❌ script_main: old_snippet not in head')

def check_blog_index():
    diff = subprocess.check_output(['git', 'diff', 'public/blog/index.html'], text=True)
    print(f'blog/index.html diff size: {len(diff.splitlines())} lines')
    # Print added/removed lines
    for line in diff.splitlines():
        if line.startswith('+') and not line.startswith('+++') or line.startswith('-') and not line.startswith('---'):
            print('  ', line[:100])

def check_home_index():
    diff = subprocess.check_output(['git', 'diff', 'public/index.html'], text=True)
    print(f'index.html diff size: {len(diff.splitlines())} lines')
    for line in diff.splitlines():
        if line.startswith('+') and not line.startswith('+++') or line.startswith('-') and not line.startswith('---'):
            print('  ', line[:100])

def check_blog_runtime():
    diff = subprocess.check_output(['git', 'diff', 'public/assets/js/blog-runtime.js'], text=True)
    print(f'blog-runtime.js diff size: {len(diff.splitlines())} lines')

if __name__ == '__main__':
    print('--- Checking script_main ---')
    check_script_main()
    print('\n--- Checking blog/index.html ---')
    check_blog_index()
    print('\n--- Checking index.html ---')
    check_home_index()
    print('\n--- Checking blog-runtime.js ---')
    check_blog_runtime()
