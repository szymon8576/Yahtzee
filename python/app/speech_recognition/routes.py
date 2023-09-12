from flask import Blueprint, request, jsonify
from .utils import *

import tensorflow as tf

import io
import soundfile as sf

speech_recognition_bp = Blueprint('speech-recognition', __name__)
loaded_model = tf.keras.models.load_model("app/speech_recognition/VoiceRecognitionModel.h5")

@speech_recognition_bp.route('/recognize', methods=["POST"])
def recognize():

    # audio =  base64_to_floats(request.form["audio_data"])
    audio, sr  = sf.read(io.BytesIO(request.files["audio_data"].read()))
    recognized_digits = predict_wav(audio, used_model=loaded_model)

    return jsonify(recognized_digits)


