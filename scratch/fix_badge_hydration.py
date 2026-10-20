with open('public/framerusercontent.com/sites/46CYIm3dbxFoU3f63shpCX/script_main.CNn1uaXy.mjs', 'r', encoding='utf-8') as f:
    text = f.read()

old_snippet = 'ne(document.getElementById(`__framer-badge-container`),S(v,{},S(x(()=>import(`./PX9hIOIVM.Dl3LQnTP.mjs`)))))'
new_snippet = '(()=>{let _b=document.getElementById(`__framer-badge-container`);_b&&ne(_b,S(v,{},S(x(()=>import(`./PX9hIOIVM.Dl3LQnTP.mjs`)))))})()'

if old_snippet in text:
    updated = text.replace(old_snippet, new_snippet, 1)
    with open('public/framerusercontent.com/sites/46CYIm3dbxFoU3f63shpCX/script_main.CNn1uaXy.mjs', 'w', encoding='utf-8') as f:
        f.write(updated)
    print('Successfully guarded badge hydration in script_main.CNn1uaXy.mjs')
else:
    print('Target snippet not found!')
