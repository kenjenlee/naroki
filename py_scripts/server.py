from flask_cors import CORS

from flask import Flask, request, jsonify
import nao_functions as naofn

app = Flask(__name__)

@app.route('/random_response')
def random_response():
    return jsonify({'Hello':'Hola'})

@app.route('/register', methods=['POST'])
def register():
    body = request.get_json()
    if 'name' in body:
        return jsonify({'text': 'Your name is ' + body['name']})
    else:
        return jsonify({'text': 'You did not specify your name in the body'})

@app.route('/speak', methods=['POST'])
def speak():
    body = request.get_json()
    if 'speech' in body:
        naofn.speak(body['speech'])
        return jsonify({'speech': body['speech']})
    else:
        return jsonify({'speech': 'You did not specify the speech in the body'})

if __name__ == '__main__':
    CORS(app)
    app.config['CORS_HEADERS'] = 'Content-Type'
    app.run()