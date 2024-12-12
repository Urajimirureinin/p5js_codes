import webview
import base64
import os
"""
import tensorflow as tf
from basic_pitch.inference import predict_and_save, Model
from basic_pitch import ICASSP_2022_MODEL_PATH
"""
import subprocess
"""
basic_pitch_model = Model(ICASSP_2022_MODEL_PATH)
"""
def fix_base64_padding(data):
    """Base64データのパディングを補正する"""
    missing_padding = len(data) % 4
    if missing_padding:
        data += "=" * (4 - missing_padding)
    return data

class Api:
    def add(self, a, b):
        print("Python")
        return a+b
    def convert_to_midi(self, audio_file):        
        return 114514
    
    def process_audio_file(self, base64_data, file_name):
        # Base64データのパディングを修正
        try:
            base64_data = fix_base64_padding(base64_data)
        except Exception as e:
            raise ValueError("Invalid Base64 data") from e
        # 保存先フォルダを設定
        audio_folder = "audio_files"
        output_folder = "output_files"
        os.makedirs(audio_folder, exist_ok=True)
        os.makedirs(output_folder, exist_ok=True)
    
        # 入力ファイルのパスと名前を設定
        input_file_name = f"input_audio_{file_name}"
        input_file_path = os.path.join(audio_folder, input_file_name)
    
        # デコードしてファイルに保存
        with open(input_file_path, "wb") as audio_file:
            audio_file.write(base64.b64decode(base64_data))
    
        # 出力フォルダのパスを設定
        output_path = os.path.abspath(output_folder)
    
        # コマンドを実行
        command = f"basic-pitch {output_path} {input_file_path}"
        subprocess.run(command, shell=True, check=True)
    
        # 出力ファイル名を設定
        midi_file_name = os.path.splitext(input_file_name)[0] + "_basic_pitch.mid"
        midi_file_path = os.path.join(output_path, midi_file_name)
    
        # MIDIファイルをbase64エンコード
        if os.path.exists(midi_file_path):
            with open(midi_file_path, "rb") as midi_file:
                encoded_midi = base64.b64encode(midi_file.read()).decode('utf-8')
                print(encoded_midi)
            return f"{file_name} was completely converted to midi."
        else:
            raise FileNotFoundError(f"MIDI file not found: {midi_file_path}")

    """
    def process_audio_with_basic_pitch(self, base64_data):
        # Base64データのパディングを修正
        try:
            base64_data = fix_base64_padding(base64_data)
        except Exception as e:
            raise ValueError("Invalid Base64 data") from e

        # 保存先フォルダを設定
        audio_folder = "audio_files"
        output_folder = "output_files"
        os.makedirs(audio_folder, exist_ok=True)
        os.makedirs(output_folder, exist_ok=True)

        # 入力オーディオファイルのパス
        input_file_name = "input_audio.wav"
        input_file_path = os.path.join(audio_folder, input_file_name)
        print(input_file_path)

        # デコードしてオーディオファイルに保存
        try:
            with open(input_file_path, "wb") as audio_file:
                audio_file.write(base64.b64decode(base64_data))
        except base64.binascii.Error as e:
            raise ValueError("Failed to decode Base64 data") from e

        # 出力ファイルのパス
        output_midi_file_name = "input_audio.mid"
        output_midi_file_path = os.path.join(output_folder, output_midi_file_name)

        # basic-pitchで解析しMIDIファイルを保存
        predict_and_save(
            [input_file_path],  # 入力ファイルリスト
            output_folder,      # 出力先フォルダ
            save_midi=True,     # MIDIファイルを保存
            sonify_midi=True,
            save_model_outputs=False,  # モデル出力を保存しない
            save_notes=False,    # ノートデータを保存しない
            model_or_model_path=basic_pitch_model,
        )

        # MIDIファイルをbase64エンコードして返す
        if os.path.exists(output_midi_file_path):
            with open(output_midi_file_path, "rb") as midi_file:
                encoded_midi = base64.b64encode(midi_file.read()).decode('utf-8')
            return encoded_midi
        else:
            raise FileNotFoundError(f"MIDI file not found: {output_midi_file_path}")
        """

api=Api()
window = webview.create_window("JS to Python", url="index.html", js_api=api)
webview.start(http_server=True, debug=True)
