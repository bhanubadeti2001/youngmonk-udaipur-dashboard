import requests

url = "https://derby-raises-brooklyn-emily.trycloudflare.com/access?token=udaipur-hostel-key-2026"
r = requests.get(url, allow_redirects=True, timeout=10)
print("Public Cloudflare URL Status:", r.status_code)
print("Final Destination URL:", r.url)
print("Page length:", len(r.text))
print("Includes root div:", '<div id="root"></div>' in r.text)
