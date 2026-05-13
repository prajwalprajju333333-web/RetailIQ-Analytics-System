import urllib.request
import urllib.error
import json

BASE_URL = "http://localhost:8000"

def test_endpoint(method, path, data=None):
    url = BASE_URL + path
    if data:
        data = json.dumps(data).encode('utf-8')
    req = urllib.request.Request(url, data=data, method=method)
    req.add_header('Content-Type', 'application/json')
    try:
        with urllib.request.urlopen(req, timeout=5) as resp:
            body = resp.read().decode('utf-8')
            return resp.status, body
    except urllib.error.HTTPError as e:
        body = e.read(200).decode('utf-8', errors='replace')
        return e.code, body
    except Exception as e:
        return None, str(e)

# Test 1: Check if backend is up
status, body = test_endpoint("GET", "/")
if status:
    print(f"✓ Backend is running: {status}")
else:
    print(f"✗ Backend is DOWN: {body}")
    exit(1)

# Test 2: Try login (invalid creds)
status, body = test_endpoint("POST", "/api/auth/login", {"email": "test@example.com", "password": "wrong"})
if status == 401:
    print(f"✓ Login endpoint works (401): Auth required or invalid")
elif status == 200:
    print(f"✓ Login successful: {body[:100]}")
else:
    print(f"⚠️  Login status {status}: {body[:100]}")

# Test 3: Check RFM endpoint 
status, body = test_endpoint("GET", "/api/rfm")
if status == 401:
    print(f"✓ RFM endpoint exists but requires auth (401)")
elif status == 200:
    try:
        data = json.loads(body)
        print(f"✓ RFM data: {len(data)} records")
    except:
        print(f"⚠️  RFM returned: {body[:100]}")
else:
    print(f"✗ RFM error {status}: {body[:100]}")

# Test 4: Check Clusters endpoint 
status, body = test_endpoint("GET", "/api/clusters")
if status == 401:
    print(f"✓ Clusters endpoint exists but requires auth (401)")
elif status == 200:
    try:
        data = json.loads(body)
        print(f"✓ Clusters data: {len(data)} records")
    except:
        print(f"⚠️  Clusters returned: {body[:100]}")
else:
    print(f"✗ Clusters error {status}: {body[:100]}")

# Test 5: Check Country Analysis endpoint 
status, body = test_endpoint("GET", "/api/country-analysis")
if status == 401:
    print(f"✓ Country Analysis endpoint exists (requires auth - 401)")
elif status == 200:
    try:
        data = json.loads(body)
        print(f"✓ Country Analysis data: {len(data)} records")
    except:
        print(f"⚠️  Country Analysis returned: {body[:100]}")
else:
    print(f"✗ Country Analysis error {status}: {body[:100]}")

print("\n📋 Summary: Endpoints that return 401 require authentication (expected)")
