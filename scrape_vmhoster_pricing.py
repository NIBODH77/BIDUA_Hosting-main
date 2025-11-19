import requests
from bs4 import BeautifulSoup
import csv

URL = "https://vmhoster.com/cloud-solution.php?tab=pricing-section-slider"
resp = requests.get(URL)
resp.raise_for_status()
soup = BeautifulSoup(resp.text, "html.parser")

plans = []

# Example: find each plan block under "General Purpose VM" etc
for heading in soup.select("h3"):
    title = heading.get_text(strip=True)
    # only catch those like "G.4GB", "G.8GB", etc
    if title.startswith(("G.","M.","C.")):
        block = heading.find_next_sibling("p")
        price_text = block.get_text(strip=True) if block else None
        specs = heading.find_next("ul")
        spec_text = specs.get_text(" | ", strip=True) if specs else ""
        plans.append({
            "plan": title,
            "starting_price": price_text,
            "specs": spec_text
        })

# Write to CSV
with open("vmhoster_pricing.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=["plan","starting_price","specs"])
    writer.writeheader()
    for p in plans:
        writer.writerow(p)

print("Done – extracted", len(plans), "plans")
