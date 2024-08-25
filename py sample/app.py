from flask import Flask, request, jsonify, send_from_directory
import requests
import json
import os
from requests.auth import HTTPBasicAuth
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # This will allow CORS for all routes

# Directory to store uploaded JSON files
UPLOAD_DIRECTORY = "uploaded_files"
if not os.path.exists(UPLOAD_DIRECTORY):
    os.makedirs(UPLOAD_DIRECTORY)

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
    
    try:
        response = requests.post(url, headers=headers, data=data, auth=HTTPBasicAuth(username, password))
        response.raise_for_status()  # Raises an HTTPError if the HTTP request returned an unsuccessful status code
        response_json = response.json()
        return response_json.get("access_token")
    except requests.exceptions.RequestException as e:
        raise Exception(f"Request failed: {e}")

@app.route('/')
def serve_index():
    return send_from_directory('static', 'index.html')

@app.route('/post-data', methods=['POST'])
def post_data():
    url = "https://css.us.api.opentext.com/v2/content"
    payload = request.json

    try:
        access_token = get_bearer_token()
    except Exception as e:
        return jsonify({"error": "Failed to retrieve access token", "details": str(e)}), 500
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {access_token}"
    }
    
    try:
        response = requests.post(url, headers=headers, data=json.dumps(payload))
        response.raise_for_status()  # Raises an HTTPError if the HTTP request returned an unsuccessful status code
        return jsonify({
            "status_code": response.status_code,
            "response": response.json()
        })
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e), "status_code": response.status_code if response else None}), 500

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file and file.filename.endswith('.json'):
        file_path = os.path.join(UPLOAD_DIRECTORY, file.filename)
        file.save(file_path)
        return jsonify({"message": "File uploaded successfully", "file_path": file_path})

    return jsonify({"error": "Invalid file type"}), 400

@app.route('/retrieve-data/<filename>', methods=['GET'])
def retrieve_data(filename):
    file_path = os.path.join(UPLOAD_DIRECTORY, filename)
    if os.path.exists(file_path):
        try:
            with open(file_path, 'r') as f:
                data = json.load(f)
            return jsonify(data)
        except json.JSONDecodeError:
            return jsonify({"error": "Error decoding JSON from file"}), 400
    return jsonify({"error": "File not found"}), 404

if __name__ == '__main__':
    app.run(debug=True)
