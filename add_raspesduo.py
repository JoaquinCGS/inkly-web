import json

# Update products.json
with open("products.json", "r", encoding="utf-8") as f:
    products = json.load(f)

new_product = {
    "title": "Raspes Duo",
    "url": "babyshower.html",
    "image": "assets/images/RaspesDuo.jpg"
}

products.insert(4, new_product) # inserting near other babyshower items

with open("products.json", "w", encoding="utf-8") as f:
    json.dump(products, f, indent=4, ensure_ascii=False)

# Update search_snippet.js
js_content = "  const globalSearchIndex = " + json.dumps(products, ensure_ascii=False) + ";"
with open("search_snippet.js", "w", encoding="utf-8") as f:
    f.write(js_content)
    
# Update search_snippet_fixed.js just in case
with open("search_snippet_fixed.js", "w", encoding="utf-8") as f:
    f.write(js_content)

print("Added Raspes Duo to JSON and JS.")
