// 必要なモジュールをインポート
const fs = require('fs');
const brain = require('brain.js');

// 学習用のデータをロード
const dataPath = './probabilities.json';
let trainingData;

try {
    const rawData = fs.readFileSync(dataPath, 'utf8');
    trainingData = JSON.parse(rawData);
} catch (error) {
    console.error('Error loading training data:', error);
    process.exit(1);
}

// データをbrain.jsの形式に整形
const formattedData = trainingData.map(item => ({
    input: item.input, // 入力データ
    output: item.output // 出力データ
}));

// Neural Networkの設定
const net = new brain.NeuralNetwork({
    hiddenLayers: [10, 10], // 隠れ層の設定
    activation: 'sigmoid'  // 活性化関数の設定
});

// モデルを学習
console.log('Training the model...');
const trainingOptions = {
    iterations: 20000, // 最大反復回数
    errorThresh: 0.005, // 許容誤差
    log: true, // ログの出力
    logPeriod: 100, // ログの出力間隔
    learningRate: 0.3 // 学習率
};

net.train(formattedData, trainingOptions);

// 学習結果を保存
const modelPath = './trained-model.json';
try {
    const trainedModel = net.toJSON();
    fs.writeFileSync(modelPath, JSON.stringify(trainedModel, null, 2));
    console.log('Model saved to', modelPath);
} catch (error) {
    console.error('Error saving trained model:', error);
}
