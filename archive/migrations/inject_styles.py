import re

filepath = "/home/souvik/Projects/opus_template.framer.website/opus-template.framer.website/index.html"
with open(filepath, "r") as f:
    content = f.read()

# CSS Overrides
# The Pricing section: [data-framer-name="Pricing"]
# The Culture section (Life at Opus): [data-framer-name="After work"]
# The Values section: [data-framer-name="Values"]
# The Made in Framer badge: #__framer-badge-container
style_tag = """
    <style id="corabin-brand-overrides">
        /* Remove unused sections */
        [data-framer-name="Pricing"],
        [data-framer-name="After work"],
        [data-framer-name="Values"] {
            display: none !important;
        }
        
        /* Remove Framer Badge */
        #__framer-badge-container {
            display: none !important;
        }

        /* Adjust grid layout in About Us if Team grid is affected by removed elements (Optional) */
        
        /* We'll also inject our color overrides here if needed.
           Wait, did the user ask to override CSS variables?
           Let's look at the instructions: "Do not delete the old CSS. Instead, override the CSS variables."
           Primary Background: #f3f3f1 (leave as is if no instruction to change)
           Wait, what does the user want the colors to be?
           "The result must be the same design, same quality... fully my brand."
           Since no colors were provided in the prompt, I'll keep the original ones or 
           just add the structure for them. Let's just do the display block for now. */
    </style>
"""

# Inject right before </head>
if '</head>' in content:
    content = content.replace('</head>', style_tag + '</head>')
    with open(filepath, "w") as f:
        f.write(content)
    print("Injected styles successfully.")
else:
    print("Could not find </head>")
