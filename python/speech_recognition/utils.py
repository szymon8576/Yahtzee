import librosa
import noisereduce as nr
import numpy as np
import tensorflow as tf
import base64
import io

mfcc_params = {"n_fft": 768, 'hop_length': 256, "n_mels": 13}  # TODO read it from file
PAD_SIZE = 512

def normalize_mfcc_frame(mfcc_frame):
    assert mfcc_frame.shape[1] == 13

    mfcc_frame_transposed = mfcc_frame.copy()

    # Compute the mean and variance along the axis=0 (across MFCC coefficients)
    mean = np.mean(mfcc_frame_transposed, axis=0)
    variance = np.var(mfcc_frame_transposed, axis=0)

    # Perform mean normalization by subtracting the mean
    mfcc_frame_normalized = mfcc_frame_transposed - mean

    # Perform variance normalization by dividing by the square root of the variance
    mfcc_frame_normalized /= np.sqrt(variance)

    return mfcc_frame_normalized


def prepare_audio_for_mfcc(audio):
    audio_ = nr.reduce_noise(y=audio, sr=8000)
    audio_ = librosa.util.normalize(audio_)
    audio_ = np.concatenate((np.zeros(PAD_SIZE, dtype=audio_.dtype),
                             audio_,
                             np.zeros(PAD_SIZE, dtype=audio_.dtype)))

    return audio_


def perform_mfcc(audio):
    mfcc = librosa.feature.mfcc(y=audio, sr=8000, **mfcc_params).T
    mfcc = normalize_mfcc_frame(mfcc)

    return mfcc


def predict_raw_audio(audio, used_model, k=None):
    audio_ = prepare_audio_for_mfcc(audio)
    mfcc_ = perform_mfcc(audio_)
    output = used_model(tf.ragged.constant([mfcc_]))

    # process output - take argmax
    if k:
        top_values, top_indices = tf.math.top_k(output, k=k)

        for val, prob in zip(top_indices.numpy()[0], top_values.numpy()[0]):
            print(f"y = {val} with p={round(prob * 100, 1)}%")

    # if argmax probability is less than k%, return '-1'
    if tf.reduce_max(output, axis=1).numpy() > 0.5:
        return tf.argmax(output, axis=1).numpy()[0]
    else:
        return -1


def predict_wav(audio_data, used_model, k=None):

    audio_data = nr.reduce_noise(y=audio_data, sr=8000)

    # split the audio into non-silent intervals
    intervals = librosa.effects.split(audio_data, top_db=20)

    # predict label for each interval
    labels = []
    for i, (start, end) in enumerate(intervals):
        prediction_result = predict_raw_audio(audio_data[start:end], k=k, used_model=used_model)
        labels.append(int(prediction_result))
    return labels


def base64_to_floats(audio_data):

    audio_data = "data:audio/wav;base64," + audio_data
    base64_audio = audio_data.split(",")[1]
    audio_bytes = base64.b64decode(base64_audio)
    audio, _ = librosa.load(io.BytesIO(audio_bytes), sr=8000)

    return audio