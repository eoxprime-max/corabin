import os

def update_landing_mjs(path):
    with open(path, 'r', encoding='utf-8') as f:
        c = f.read()

    # Kora
    old_kora = 'pixelHeight:1024,pixelWidth:1024,src:`/assets/images/projects/kora/img1.webp?width=1024&height=1024`,srcSet:`/assets/images/projects/kora/img1.webp?scale-down-to=512&width=1024&height=1024 512w,/assets/images/projects/kora/img1.webp?width=1024&height=1024 1024w`}'
    new_kora = 'pixelHeight:800,pixelWidth:800,src:`/assets/images/testimonials/kora-ceo.webp`,srcSet:`/assets/images/testimonials/kora-ceo.webp 800w`}'

    # Himon
    old_himon = 'pixelHeight:2855,pixelWidth:1903,src:`/assets/images/projects/himon/img1.webp?width=1903&height=2855`,srcSet:`/assets/images/projects/himon/img1.webp?scale-down-to=1024&width=1903&height=2855 682w,/assets/images/projects/himon/img1.webp?scale-down-to=2048&width=1903&height=2855 1365w,/assets/images/projects/himon/img1.webp?width=1903&height=2855 1903w`}'
    new_himon = 'pixelHeight:800,pixelWidth:800,src:`/assets/images/testimonials/himon-ceo.webp`,srcSet:`/assets/images/testimonials/himon-ceo.webp 800w`}'

    # Norda
    old_norda = 'pixelHeight:3456,pixelWidth:5184,src:`/assets/images/projects/norda/img1.webp?width=5184&height=3456`,srcSet:`/assets/images/projects/norda/img1.webp?scale-down-to=512&width=5184&height=3456 512w,/assets/images/projects/norda/img1.webp?scale-down-to=1024&width=5184&height=3456 1024w,/assets/images/projects/norda/img1.webp?scale-down-to=2048&width=5184&height=3456 2048w,/assets/images/projects/norda/img1.webp?scale-down-to=4096&width=5184&height=3456 4096w,/assets/images/projects/norda/img1.webp?width=5184&height=3456 5184w`}'
    new_norda = 'pixelHeight:800,pixelWidth:800,src:`/assets/images/testimonials/norda-ceo.webp`,srcSet:`/assets/images/testimonials/norda-ceo.webp 800w`}'

    assert old_kora in c, f'old_kora not found in {path}'
    assert old_himon in c, f'old_himon not found in {path}'
    assert old_norda in c, f'old_norda not found in {path}'

    c = c.replace(old_kora, new_kora)
    c = c.replace(old_himon, new_himon)
    c = c.replace(old_norda, new_norda)

    with open(path, 'w', encoding='utf-8') as f:
        f.write(c)
    print(f'Successfully updated {path}')

if __name__ == '__main__':
    update_landing_mjs('framerusercontent.com/sites/46CYIm3dbxFoU3f63shpCX/iKJRSh9jmrbmilHdac6ozhPaiCytW8lQqaCPLmlLitI.Z1Wyg5E1.mjs')
    update_landing_mjs('public/framerusercontent.com/sites/46CYIm3dbxFoU3f63shpCX/iKJRSh9jmrbmilHdac6ozhPaiCytW8lQqaCPLmlLitI.Z1Wyg5E1.mjs')
