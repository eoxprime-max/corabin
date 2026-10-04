import os

def patch_contact_mjs(path):
    with open(path, 'r', encoding='utf-8') as f:
        c = f.read()

    # 1. Update form JSX
    old_form_jsx = 'l(f.div,{className:`framer-80ibnp`,children:[o(f.label,{className:`framer-1xnuexn`,children:o(T,{className:`framer-jznxc`,inputName:`Name`,placeholder:`Name *`,required:!0,type:`text`})}),o(f.label,{className:`framer-1k507qy`,children:o(T,{className:`framer-x4fs21`,inputName:`Email`,placeholder:`E-mail *`,type:`email`})})]})'
    
    new_form_jsx = ('l(f.div,{className:`framer-80ibnp`,children:[o(f.label,{className:`framer-1xnuexn`,children:o(T,{className:`framer-jznxc`,inputName:`Name`,placeholder:`Name *`,required:!0,type:`text`})}),o(f.label,{className:`framer-1k507qy`,children:o(T,{className:`framer-x4fs21`,inputName:`Email`,placeholder:`E-mail *`,required:!0,type:`email`})})]}),'
                    'l(f.div,{className:`framer-80ibnp`,children:[o(f.label,{className:`framer-1xnuexn`,children:o(T,{className:`framer-jznxc`,inputName:`Phone`,placeholder:`Phone`,type:`tel`})}),o(f.label,{className:`framer-1k507qy`,children:o(`select`,{name:`Budget`,className:`framer-budget-select`,defaultValue:``,onChange:e=>{e.target.style.color=e.target.value?`var(--token-bb407a59-7892-4758-ae44-34831ff9d303, #0c120c)`:`var(--token-3fab5145-6c42-41d7-b4bf-01a5bc8bcdc3, rgba(12, 18, 12, 0.6))`},children:[o(`option`,{value:``,disabled:!0,children:`Budget`}),o(`option`,{value:`<$1k`,children:`<$1k`}),o(`option`,{value:`$1k-10k`,children:`$1k-10k`}),o(`option`,{value:`>$10k`,children:`>$10k`})]})})]})')

    assert old_form_jsx in c, f'old_form_jsx not found in {path}'
    c = c.replace(old_form_jsx, new_form_jsx)

    # 2. Add CSS rules to JLqe mjs
    old_css_base = '`.framer-3ut9s .framer-jznxc, .framer-3ut9s .framer-x4fs21 { --framer-input-background: rgba(0, 0, 0, 0); --framer-input-border-bottom-width: 1px; --framer-input-border-color: var(--token-3fab5145-6c42-41d7-b4bf-01a5bc8bcdc3, rgba(0, 0, 0, 0.6)); --framer-input-border-left-width: 0px; --framer-input-border-right-width: 0px; --framer-input-border-style: solid; --framer-input-border-top-width: 0px; --framer-input-focused-border-color: var(--token-cd9ab9a9-1d98-4bbc-9f79-c98ab7a3770b, #0048f9); --framer-input-focused-border-style: solid; --framer-input-focused-border-width: 0px 0px 2px 0px; --framer-input-font-color: var(--token-bb407a59-7892-4758-ae44-34831ff9d303, #0c120c); --framer-input-font-family: "Onest"; --framer-input-font-letter-spacing: -0.04em; --framer-input-font-line-height: 1.2em; --framer-input-font-size: 24px; --framer-input-font-weight: 500; --framer-input-icon-color: #999999; --framer-input-padding: 0px 0px 8px 0px; --framer-input-placeholder-color: var(--token-3fab5145-6c42-41d7-b4bf-01a5bc8bcdc3, rgba(12, 18, 12, 0.6)); --framer-input-wrapper-height: auto; flex: none; height: auto; position: relative; width: 100%; }`,'
    
    new_css_base = (old_css_base +
                    '`.framer-3ut9s .framer-budget-select { width: 100%; appearance: none; -webkit-appearance: none; -moz-appearance: none; background: transparent url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'rgba(12,18,12,0.6)\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpath d=\'m6 9 6 6 6-6\'/%3E%3C/svg%3E") no-repeat right 4px center; background-size: 16px; border: none; border-bottom: 1px solid var(--token-3fab5145-6c42-41d7-b4bf-01a5bc8bcdc3, rgba(0, 0, 0, 0.6)); border-radius: 0; font-family: "Onest", sans-serif; font-size: 24px; font-weight: 500; letter-spacing: -0.04em; line-height: 1.2em; color: var(--token-3fab5145-6c42-41d7-b4bf-01a5bc8bcdc3, rgba(12, 18, 12, 0.6)); padding: 0px 24px 8px 0px; outline: none; cursor: pointer; box-sizing: border-box; transition: border-color 0.2s ease, color 0.2s ease; } .framer-3ut9s .framer-budget-select:focus { border-bottom: 2px solid var(--token-cd9ab9a9-1d98-4bbc-9f79-c98ab7a3770b, #0048f9); padding-bottom: 7px; } .framer-3ut9s .framer-budget-select option { background-color: #ffffff; color: #0c120c; font-family: "Onest", sans-serif; font-size: 18px; font-weight: 500; }`,')

    assert old_css_base in c, f'old_css_base not found in {path}'
    c = c.replace(old_css_base, new_css_base)

    # 3. Add tablet query styles
    old_tablet_css = '.framer-3ut9s .framer-jznxc, .framer-3ut9s .framer-x4fs21 { --framer-input-font-size: 20px; --framer-input-padding: 0px 0px 6px 0px; }'
    new_tablet_css = '.framer-3ut9s .framer-jznxc, .framer-3ut9s .framer-x4fs21 { --framer-input-font-size: 20px; --framer-input-padding: 0px 0px 6px 0px; } .framer-3ut9s .framer-budget-select { font-size: 20px; padding: 0px 24px 6px 0px; } .framer-3ut9s .framer-budget-select:focus { padding-bottom: 5px; }'

    assert old_tablet_css in c, f'old_tablet_css not found in {path}'
    c = c.replace(old_tablet_css, new_tablet_css)

    # 4. Add mobile query styles
    old_mobile_css = '.framer-3ut9s .framer-jznxc, .framer-3ut9s .framer-x4fs21 { --framer-input-font-size: 18px; }'
    new_mobile_css = '.framer-3ut9s .framer-jznxc, .framer-3ut9s .framer-x4fs21 { --framer-input-font-size: 18px; } .framer-3ut9s .framer-budget-select { font-size: 18px; padding: 0px 24px 6px 0px; } .framer-3ut9s .framer-budget-select:focus { padding-bottom: 5px; }'

    assert old_mobile_css in c, f'old_mobile_css not found in {path}'
    c = c.replace(old_mobile_css, new_mobile_css)

    with open(path, 'w', encoding='utf-8') as f:
        f.write(c)
    print(f'Successfully updated {path}')

def patch_contact_html(path):
    with open(path, 'r', encoding='utf-8') as f:
        html = f.read()

    budget_override_css = '''
    /* Corabin Contact Form - Budget Dropdown Styles */
    .framer-budget-select {
        width: 100%;
        appearance: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        background: transparent url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='rgba(12,18,12,0.6)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E") no-repeat right 4px center;
        background-size: 16px;
        border: none;
        border-bottom: 1px solid rgba(0, 0, 0, 0.6);
        border-radius: 0;
        font-family: "Onest", "Onest Placeholder", sans-serif;
        font-size: 24px;
        font-weight: 500;
        letter-spacing: -0.04em;
        line-height: 1.2em;
        color: rgba(12, 18, 12, 0.6);
        padding: 0px 24px 8px 0px;
        outline: none;
        cursor: pointer;
        box-sizing: border-box;
        transition: border-color 0.2s ease, color 0.2s ease;
    }
    .framer-budget-select:focus {
        border-bottom: 2px solid #0048f9;
        padding-bottom: 7px;
    }
    .framer-budget-select option {
        background-color: #ffffff;
        color: #0c120c;
        font-family: "Onest", "Onest Placeholder", sans-serif;
        font-size: 18px;
        font-weight: 500;
    }
    @media (min-width: 700px) and (max-width: 1439.98px) {
        .framer-budget-select {
            font-size: 20px;
            padding: 0px 24px 6px 0px;
        }
        .framer-budget-select:focus {
            padding-bottom: 5px;
        }
    }
    @media (max-width: 699.98px) {
        .framer-budget-select {
            font-size: 18px;
            padding: 0px 24px 6px 0px;
        }
        .framer-budget-select:focus {
            padding-bottom: 5px;
        }
    }
'''
    if '<style id="corabin-custom-overrides">' in html:
        html = html.replace('<style id="corabin-custom-overrides">', '<style id="corabin-custom-overrides">' + budget_override_css)
        with open(path, 'w', encoding='utf-8') as f:
            f.write(html)
        print(f'Successfully injected budget styles in {path}')
    else:
        print(f'Warning: corabin-custom-overrides style tag not found in {path}')

if __name__ == '__main__':
    patch_contact_mjs('framerusercontent.com/sites/46CYIm3dbxFoU3f63shpCX/JLqe-6-qAsyy3l1paNGwEVrh-qv_jf3v_djF_VYWBoY.Ba0X3WII.mjs')
    patch_contact_mjs('public/framerusercontent.com/sites/46CYIm3dbxFoU3f63shpCX/JLqe-6-qAsyy3l1paNGwEVrh-qv_jf3v_djF_VYWBoY.Ba0X3WII.mjs')
    patch_contact_html('contact/index.html')
    patch_contact_html('public/contact/index.html')
