import librosa
import noisereduce as nr
import numpy as np
import base64
import io
from flask import current_app
from pydub import AudioSegment, effects

mfcc_params = {'n_fft': 512, 'hop_length': 256, "n_mels":  13}
nr_params = {'stationary': True, 'n_fft': 256, 'freq_mask_smooth_hz': 500, 'n_std_thresh_stationary': 0.8}


def buffer_to_segment(buffer):
    assert (np.min(buffer) >= -1.5 and np.max(buffer)<=1.5), [np.min(buffer), np.max(buffer)]
    pcm_audio = (np.rint(buffer*(2**15-1))).astype(np.int16)
    return AudioSegment(pcm_audio.tobytes(), frame_rate=8000, sample_width=pcm_audio.dtype.itemsize, channels=1)


def segment_to_buffer(segment):
    return (np.array(segment.get_array_of_samples())/(2**15-1)).astype(np.float32)


def prepare_audio_for_mfcc(audio, nr_params):

    assert (np.min(audio) >= -1.5 and np.max(audio)<=1.5), [np.min(audio), np.max(audio)]

    audio_ = nr.reduce_noise(y=audio, sr=8000, **nr_params)
    audio_segment = buffer_to_segment(audio_)  # use function here
    normalized = effects.normalize(audio_segment)

    return segment_to_buffer(normalized)




def perform_mfcc(audio, mfcc_params, normalize=False, pad_to = None):

    if pad_to and len(audio) < pad_to:
      audio = np.concatenate((audio, np.zeros(pad_to-len(audio))))

    mfcc = librosa.feature.mfcc(y=audio, sr=8000, **mfcc_params)
    delta_1 = librosa.feature.delta(mfcc, width=3, order=1)
    delta_2 = librosa.feature.delta(mfcc, width=3, order=2)

    # normalize obtained features
    # mfcc, delta_1, delta_2 = [normalize_frame(arr) for arr in [mfcc.T, delta_1.T, delta_2.T]]
    mfcc, delta_1, delta_2 = mfcc.T, delta_1.T, delta_2.T

    return np.hstack([mfcc, delta_1, delta_2])


from eventlet import monkey_patch
monkey_patch()

import requests


def fetchResult(audioDatas):
    prepared_mfccs = [row.tolist() for audioData in audioDatas for row in audioData]
    segments = np.cumsum([0] + [len(audio) for audio in audioDatas]).tolist()

    try:
        data = {"inputs": {"args_0": prepared_mfccs, "args_0_1": segments}}
        response = requests.post(current_app.config['TFSERVING_URL'] + '/v1/models/SpeechDigits:predict', json=data)
        response.raise_for_status()

        # Check if the request was successful (status code 200)
        if response.status_code == 200:

            predictions = response.json()["outputs"]
            print("predictions", predictions)
            return predictions

        else:
            print('Failed to get a valid response from TensorFlow Serving')

    except requests.exceptions.RequestException as err:
        print(f"Request failed: {err}")
    # except Exception as e:
    #     print(str(e))


import soundfile as sf

def predict_wav(audio_data):

    audio_data_nr = nr.reduce_noise(y=audio_data, sr=8000, **nr_params)
    intervals = librosa.effects.split(audio_data_nr, top_db=30)

    parts = [audio_data[start:end] for start, end in intervals]
    prepared = [prepare_audio_for_mfcc(audio, nr_params) for audio in parts]
    mfccs = [perform_mfcc(audio, mfcc_params) for audio in prepared]

    # for i, part in enumerate(prepared):
    #     sf.write(r"C:\Users\User\debug" + str(i) + ".wav", part, 8000)


    outputs = fetchResult(mfccs)
    labels = [int(np.argmax(pred)) for pred in outputs]
    labels = [label for label in labels if label != 0]
    return labels



def base64_to_floats(audio_data):
    audio_data = "data:audio/wav;base64," + audio_data
    base64_audio = audio_data.split(",")[1]
    audio_bytes = base64.b64decode(base64_audio)
    audio, _ = librosa.load(io.BytesIO(audio_bytes), sr=8000)

    return audio
