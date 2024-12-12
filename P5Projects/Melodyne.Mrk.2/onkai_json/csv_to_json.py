import csv
import json

# 入力CSVファイルと出力JSONファイルのパス
input_csv = "C:/Users/wolf4/Videos/projectfile/P5Projects/Melodyne.Mrk.2/onkai_json/onkai.csv"
output_json = "C:/Users/wolf4/Videos/projectfile/P5Projects/Melodyne.Mrk.2/onkai_json/onkai.json"

# データをオクターブごとに整理する辞書
octave_data = {}

# CSVファイルを読み込む
with open(input_csv, mode='r', encoding='utf-8') as csv_file:
    reader = csv.reader(csv_file)
    headers = next(reader)  # ヘッダー行をスキップ

    for row in reader:
        if len(row) < 3:
            continue  # データが不完全な行をスキップ

        octave = row[0]  # オクターブ情報
        note = row[1]  # 音階
        frequency = row[2]  # 周波数

        if octave not in octave_data:
            octave_data[octave] = []

        # note_dataを辞書型にする
        note_data = {
            "key": note,
            "frequency": frequency
        }

        octave_data[octave].append(note_data)

# 辞書をJSON形式に変換して保存
with open(output_json, mode='w', encoding='utf-8') as json_file:
    json.dump(octave_data, json_file, indent=4, ensure_ascii=False)

print(f"JSONファイルに変換が完了しました: {output_json}")