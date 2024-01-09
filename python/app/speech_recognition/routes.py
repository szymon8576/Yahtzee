from flask import Blueprint, request, jsonify
from .utils import *

import io

speech_recognition_bp = Blueprint('speech-recognition', __name__)


@speech_recognition_bp.route('/recognize', methods=["POST"])
def recognize():

    audio, _ = librosa.load(io.BytesIO(request.files["audio_data"].read()), sr=8000)

    if len(audio)>0:
        recognized_digits = predict_wav(audio)
        return jsonify(recognized_digits)
    else:
        return []
