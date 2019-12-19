from flask_cors import CORS
CORS(app)
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/random_response')
def random_response():
    return jsonify({'Hello':'Hola'})

if __name__ == '__main__':
    app.run()