import os
import re

directory = "/home/souvik/Projects/opus_template.framer.website"

replacements = {
    # Case-sensitive brand replacements
    b"STUDIO OPUS": b"STUDIO CORABIN",
    b"Studio Opus": b"Studio Corabin",
    b"OPUS": b"CORABIN",
    b"Opus": b"Corabin",
    b"opushq.com": b"corabin.com",
    b"contact@opushq.com": b"hello@corabin.com",
    
    # Home Page Strings
    b"At Opus, we help companies build stronger brands, better products, and websites that actually perform.": b"At Corabin, we help companies build stronger brands, modern products, and websites that actually perform.",
    b"47+ Projects delivered": b"25+ Projects delivered",
    b"95% Client retention": b"99% On-time delivery",
    b"\\$21M Client revenue impacted": b"\\$17M Client revenue impacted",
    b"04 Motion Graphics": b"04 App Development",
    b"Our team brings together design": b"Corabin brings together bespoke design",
    b"19 talented individuals": b"1:1 Direct collaboration",
    b"134+ projects": b"25+ Projects",
    b"\\u221E combined exp": b"5+ Years exp",
    b"We are a group of positive thinkers": b"We are a boutique digital studio",
    
    # About Us Page Strings
    b"Building digital excellence since 2019": b"Crafting modern digital experiences that perform",
    b"From humble beginnings": b"From a passion for craft",
    b"Markus Chen": b"Founder",
}

for root, _, files in os.walk(directory):
    if "_original_backup" in root or ".git" in root or "docs" in root:
        continue
    for file in files:
        if file.endswith((".html", ".mjs", ".js", ".json")):
            filepath = os.path.join(root, file)
            with open(filepath, "rb") as f:
                content = f.read()
            
            modified = False
            for old, new in replacements.items():
                if old in content:
                    content = content.replace(old, new)
                    modified = True
            
            # Special regex replacements for dynamic JSON/JS strings that might be slightly different
            # e.g., escaped strings
            
            if modified:
                with open(filepath, "wb") as f:
                    f.write(content)
                print(f"Updated {filepath}")

print("Done replacements.")
