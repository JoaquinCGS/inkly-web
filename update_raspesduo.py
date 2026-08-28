import json

# Update products.json
with open("products.json", "r", encoding="utf-8") as f:
    products = json.load(f)

for p in products:
    if p["title"] == "Raspes Duo":
        p["title"] = 'Raspe "Encuentra a los padres"'

with open("products.json", "w", encoding="utf-8") as f:
    json.dump(products, f, indent=4, ensure_ascii=False)

# Update search_snippet.js
js_content = "  const globalSearchIndex = " + json.dumps(products, ensure_ascii=False) + ";"
with open("search_snippet.js", "w", encoding="utf-8") as f:
    f.write(js_content)
    
with open("search_snippet_fixed.js", "w", encoding="utf-8") as f:
    f.write(js_content)

print("Updated Raspes Duo title.")
