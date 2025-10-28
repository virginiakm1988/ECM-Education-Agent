#!/usr/bin/env python3
"""
Simple proxy server to handle CORS issues for the AI Chatbot
This server acts as a proxy between the frontend and various LLM APIs
"""

from http.server import HTTPServer, SimpleHTTPRequestHandler
import json
import urllib.request
import urllib.parse
import urllib.error
from urllib.parse import urlparse, parse_qs
import ssl
import os

class CORSRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_POST(self):
        if self.path == '/api/chat':
            self.handle_chat_request()
        else:
            super().do_POST()

    def handle_chat_request(self):
        try:
            # Read the request body
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            request_data = json.loads(post_data.decode('utf-8'))
            
            provider = request_data.get('provider')
            api_key = request_data.get('apiKey')
            message = request_data.get('message')
            model = request_data.get('model')
            temperature = request_data.get('temperature', 0.7)
            nim_endpoint = request_data.get('nimEndpoint')
            
            print(f"🔍 Debug: Provider={provider}, Model={model}, NIM Endpoint='{nim_endpoint}'")
            
            # Call the appropriate API
            if provider == 'gemini':
                response = self.call_gemini(message, api_key, model, temperature)
            elif provider == 'openai':
                response = self.call_openai(message, api_key, model, temperature)
            elif provider == 'anthropic':
                response = self.call_anthropic(message, api_key, model, temperature)
            elif provider == 'nvidia-nim':
                response = self.call_nvidia_nim(message, api_key, nim_endpoint, model, temperature)
            else:
                raise ValueError(f"Unsupported provider: {provider}")
            
            # Send successful response
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'response': response}).encode('utf-8'))
            
        except Exception as e:
            print(f"❌ Server Error: {str(e)}")
            # Send error response
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            error_response = {'error': str(e)}
            self.wfile.write(json.dumps(error_response).encode('utf-8'))

    def call_gemini(self, message, api_key, model, temperature):
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
        
        data = {
            "contents": [{
                "parts": [{
                    "text": message
                }]
            }],
            "generationConfig": {
                "temperature": temperature,
                "topK": 40,
                "topP": 0.95,
                "maxOutputTokens": 1024,
            }
        }
        
        return self.make_api_request(url, data)

    def call_openai(self, message, api_key, model, temperature):
        url = "https://api.openai.com/v1/chat/completions"
        
        data = {
            "model": model,
            "messages": [
                {"role": "user", "content": message}
            ],
            "temperature": temperature,
            "max_tokens": 1024
        }
        
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        
        return self.make_api_request(url, data, headers)

    def call_anthropic(self, message, api_key, model, temperature):
        url = "https://api.anthropic.com/v1/messages"
        
        data = {
            "model": model,
            "max_tokens": 1024,
            "temperature": temperature,
            "messages": [
                {"role": "user", "content": message}
            ]
        }
        
        headers = {
            "x-api-key": api_key,
            "anthropic-version": "2023-06-01",
            "Content-Type": "application/json"
        }
        
        return self.make_api_request(url, data, headers)

    def call_nvidia_nim(self, message, api_key, nim_endpoint, model, temperature):
        # Use NVIDIA's integrate API if no custom endpoint is provided
        if not nim_endpoint or nim_endpoint.strip() == "":
            base_url = "https://integrate.api.nvidia.com/v1"
            url = f"{base_url}/chat/completions"
            print(f"🔗 Using NVIDIA hosted API: {url}")
        else:
            # Clean up the endpoint URL
            base_url = nim_endpoint.rstrip('/').rstrip('/v1')
            url = f"{base_url}/v1/chat/completions"
            print(f"🔗 Using custom endpoint: {url}")
        
        print(f"📤 Making request to: {url}")
        
        data = {
            "model": model,
            "messages": [
                {"role": "user", "content": message}
            ],
            "temperature": temperature,
            "top_p": 0.7,
            "max_tokens": 4096,
            "stream": False
        }
        
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        
        return self.make_api_request(url, data, headers)

    def make_api_request(self, url, data, headers=None):
        if headers is None:
            headers = {"Content-Type": "application/json"}
        
        # Prepare the request
        json_data = json.dumps(data).encode('utf-8')
        req = urllib.request.Request(url, data=json_data, headers=headers)
        
        # Create SSL context that doesn't verify certificates (for development)
        ssl_context = ssl.create_default_context()
        ssl_context.check_hostname = False
        ssl_context.verify_mode = ssl.CERT_NONE
        
        try:
            with urllib.request.urlopen(req, context=ssl_context) as response:
                response_data = json.loads(response.read().decode('utf-8'))
                
                # Extract the actual response text based on the API format
                if 'candidates' in response_data:  # Gemini
                    return response_data['candidates'][0]['content']['parts'][0]['text']
                elif 'choices' in response_data:  # OpenAI/NIM
                    return response_data['choices'][0]['message']['content']
                elif 'content' in response_data:  # Anthropic
                    return response_data['content'][0]['text']
                else:
                    return str(response_data)
                    
        except urllib.error.HTTPError as e:
            error_body = e.read().decode('utf-8')
            try:
                error_data = json.loads(error_body)
                raise Exception(f"API Error: {error_data}")
            except:
                raise Exception(f"HTTP Error {e.code}: {error_body}")

def run_server(port=8000):
    server_address = ('', port)
    httpd = HTTPServer(server_address, CORSRequestHandler)
    print(f"🚀 Server running at http://localhost:{port}")
    print(f"📁 Serving files from: {os.getcwd()}")
    print(f"🌐 Open your browser to: http://localhost:{port}")
    print("Press Ctrl+C to stop the server")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Server stopped")
        httpd.server_close()

if __name__ == '__main__':
    run_server()
