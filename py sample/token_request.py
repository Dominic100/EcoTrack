import requests
from requests.auth import HTTPBasicAuth

def get_bearer_token():
    url = "https://us.api.opentext.com/tenants/6b844870-0c01-480d-b617-cda14ff7627a/oauth2/token"
    username = "CnLP84THbg904Wf8dMhTAhqXFz6pbJ6P"
    password = "1aWlZih6Ufv5BS2U"
    
    headers = {
        "Accept": "application/json",
        "Content-Type": "application/x-www-form-urlencoded"
    }
    
    data = {
        "grant_type": "client_credentials"
    }
    
    response = requests.post(url, headers=headers, data=data, auth=HTTPBasicAuth(username, password))
    
    if response.status_code == 200:
        response_json = response.json()
        return response_json.get("access_token")
    else:
        raise Exception(f"Request failed with status code {response.status_code}: {response.text}")

# Usage
if __name__ == "__main__":
    try:
        token = get_bearer_token()
        print("Bearer Token:", token)
    except Exception as e:
        print("Error:", e)
