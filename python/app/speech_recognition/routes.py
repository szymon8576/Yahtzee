from flask import Blueprint, request, jsonify
from .utils import *

import tensorflow as tf

import io
import soundfile as sf

speech_recognition_bp = Blueprint('speech-recognition', __name__)
loaded_model = tf.keras.models.load_model("app/speech_recognition/VoiceRecognitionModel.h5")

from base64 import b64encode

@speech_recognition_bp.route('/recognize', methods=["POST"])
def recognize():

    audio, _ = librosa.load(io.BytesIO(request.files["audio_data"].read()), sr=8000)
    recognized_digits = predict_wav(audio, used_model=loaded_model)

    print(recognized_digits)

    return jsonify(recognized_digits)


