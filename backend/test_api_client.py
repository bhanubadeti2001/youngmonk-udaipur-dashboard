import requests

BASE = 'http://127.0.0.1:8080'

# 1. Unauthenticated test
r_unauth = requests.get(f'{BASE}/api/dashboard/overview')
print('1. Unauth check (expected 401):', r_unauth.status_code)

# 2. Login test
r_login = requests.post(f'{BASE}/api/auth/login', json={'token': 'udaipur-hostel-key-2026'})
print('2. Login check (expected 200):', r_login.status_code)
session_token = r_login.json().get('session_token')
print('   Session token issued:', session_token[:12] + '...')

# 3. Authenticated Overview
headers = {'Authorization': f'Bearer {session_token}'}
r_ov = requests.get(f'{BASE}/api/dashboard/overview', headers=headers)
print('3. Overview check:', r_ov.status_code, r_ov.json())

# 4. Hostels check
r_h = requests.get(f'{BASE}/api/hostels', headers=headers)
print('4. Hostels check: Status', r_h.status_code, 'Count:', len(r_h.json()))

# 5. Frontend SPA check
r_spa = requests.get(f'{BASE}/')
print('5. Frontend HTML served check:', r_spa.status_code, 'Contains HTML:', '<div id="root"></div>' in r_spa.text)

# 6. Direct Access link test
r_access = requests.get(f'{BASE}/access?token=udaipur-hostel-key-2026', allow_redirects=False)
print('6. Protected Direct Link /access check:', r_access.status_code, 'Redirects to:', r_access.headers.get('Location'))
