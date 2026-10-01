import subprocess
import json
import sys

pages = [
    ("Homepage", "http://localhost:8088/index.html", ["Kora", "Himon", "Nordå", "Ardène", "Havyn", "Almare"]),
    ("Projects Listing", "http://localhost:8088/projects", ["Kora", "Himon", "Nordå", "Ardène", "Havyn", "Almare"]),
    ("Kora Detail", "http://localhost:8088/projects/kora", ["Kora", "Scaling Revenue Architecture", "2025", "6 weeks"]),
    ("Himon Detail", "http://localhost:8088/projects/himon", ["Himon", "Precision Logistics", "2025", "5 weeks"]),
    ("Nordå Detail", "http://localhost:8088/projects/norda", ["Nordå", "Scandinavian Architecture", "2024", "7 weeks"]),
    ("Ardène Detail", "http://localhost:8088/projects/ardene", ["Ardène", "Timeless Boutique Residences", "2025", "8 weeks"]),
    ("Havyn Detail", "http://localhost:8088/projects/havyn", ["Havyn", "Curated Modern Real Estate", "2025", "6 weeks"]),
    ("Almare Detail", "http://localhost:8088/projects/almare", ["Almare", "Quiet Spatial Design", "2025", "4 weeks"]),
]

all_passed = True

for name, url, expected_texts in pages:
    cmd = [
        "google-chrome",
        "--headless=new",
        "--no-sandbox",
        "--disable-gpu",
        "--window-size=1440,900",
        "--virtual-time-budget=6000",
        "--dump-dom",
        url
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    dom = res.stdout

    if "GracefullyDegradingErrorBoundary" in dom:
        print(f"❌ {name} ({url}): ERROR BOUNDARY TRIGGERED!")
        all_passed = False
        continue

    missing = [t for t in expected_texts if t not in dom]
    if missing:
        print(f"⚠️ {name} ({url}): Missing expected texts: {missing}")
        all_passed = False
    else:
        print(f"✅ {name} ({url}): All {len(expected_texts)} markers verified successfully!")

if all_passed:
    print("\n🎉 ALL 8 ROUTES VERIFIED 100% HEALTHY AND CONTENT-ACCURATE!")
    sys.exit(0)
else:
    print("\n❌ SOME CHECKS FAILED!")
    sys.exit(1)
