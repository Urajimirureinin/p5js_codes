const BLOCK_SIZE = 32; // ブロックのサイズ（ピクセル単位）
const COLS_COUNT = 10; // フィールドの列数
const ROWS_COUNT = 20; // フィールドの行数
const SCREEN_WIDTH = COLS_COUNT * BLOCK_SIZE; // ゲーム画面の幅
const SCREEN_HEIGHT = ROWS_COUNT * BLOCK_SIZE; // ゲーム画面の高さ
const NEXT_AREA_SIZE = 160; // 次のミノ表示エリアのサイズ
const BLOCK_SOURCES = [
    "images/block-0.png",
    "images/block-1.png",
    "images/block-2.png",
    "images/block-3.png",
    "images/block-4.png",
    "images/block-5.png",
    "images/block-6.png"
];

let blockImages = [];
let game, computerGame, イキスギィ, やりますねぇ, is_error;
let game_speed = 500;
let total_player_num = 0;
let total_com_num = 0;
let game_overed_players = [];
let model,net;

function preload() {
    net = new brain.NeuralNetwork();
    for (let i = 0; i < BLOCK_SOURCES.length; i++) {
        blockImages.push(loadImage(BLOCK_SOURCES[i]));
    }
    イキスギィ = loadSound('./sound_effect/nc150847.mp3');
    やりますねぇ = loadSound('./sound_effect/yarimasune.mp3');
    model = loadJSON("./trained-model.json");
}

function setup() {
    createCanvas(SCREEN_WIDTH * 2 + NEXT_AREA_SIZE + BLOCK_SIZE * 8, SCREEN_HEIGHT + 20);
    game = new Game();
    computerGame = new Game(true); // コンピュータ制御のフィールドを作成
    frameRate(60);
}

function draw() {
    clear();
    background(220);
    game.drawAll(10, 10); // メインゲームフィールド
    computerGame.drawAll(SCREEN_WIDTH + BLOCK_SIZE * 6 + 20, 10); // コンピュータ用フィールド
    game_speed -= 0.01;
}

function keyPressed() {
    if (game.is_game_over) return;

    if (keyIsDown(SHIFT)) {
        if (keyCode === RIGHT_ARROW && game.mino.valid(0, 0, game.field, true)) {
            game.mino.rotate(true);
        } else if (keyCode === LEFT_ARROW && game.mino.valid(0, 0, game.field, true)) {
            game.mino.rotate(false);
        }
    } else {
        switch (keyCode) {
            case LEFT_ARROW:
                if (game.mino.valid(-1, 0, game.field)) game.mino.x--;
                break;
            case RIGHT_ARROW:
                if (game.mino.valid(1, 0, game.field)) game.mino.x++;
                break;
            case DOWN_ARROW:
                if (game.mino.valid(0, 1, game.field)) game.mino.y++;
                break;
            case 32: // スペースキー
                game.hold();
                break;
            case UP_ARROW:
                while (game.mino.valid(0, 1, game.field)) game.mino.y++;
        }
    }
}

class Game {
    constructor(is_computer = false) {
        this.field = new Field();
        this.mino = null;
        this.nextMino = new Mino();
        this.holdMino = null;
        this.canHold = true;
        this.timer = 0;
        this.is_game_over = false;
        this.is_computer = is_computer; // コンピュータ制御のフラグ
        if (this.is_computer) {
            this.com_num = total_com_num++;
        } else {
            this.player_num = total_player_num++;
        }
        if (this.player_num==0) {
            this.sp = "You"
        } else if (this.player_num>1 && !this.is_computer) {
            this.sp = `Player${this.player_num+1}`
        } else if (this.is_computer) {
            this.sp = `Computer${this.com_num+1}`
            this.ai_Player = new AI_player(this);
        }
        is_error = false;
        this.start();
    }

    start() {
        if (game_overed_players.length!==0) return;
        this.mino = this.nextMino;
        this.mino.spawn();
        this.nextMino = new Mino();
        this.canHold = true;
    }

    hold() {
        if (!this.canHold) return;
        if (this.holdMino) {
            [this.mino, this.holdMino] = [this.holdMino, this.mino];
            this.mino.spawn();
        } else {
            this.holdMino = this.mino;
            this.mino = this.nextMino;
            this.mino.spawn();
            this.nextMino = new Mino();
        }
        this.canHold = false;
    }

    drawAll(offsetX, offsetY) {
        push();
        translate(offsetX, offsetY);
        this.field.drawFixedBlocks();
        if (this.mino) {
            this.mino.drawGhost(this.field);
            this.mino.draw();
        }
        pop();

        push();
        translate(offsetX, offsetY);
        stroke(0);
        strokeWeight(2);
        noFill();
        rect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        for (let i = 1; i <= 9; i++) {
            line(BLOCK_SIZE * i, 0, BLOCK_SIZE * i, SCREEN_HEIGHT);
        }
        for (let i = 1; i <= 19; i++) {
            line(0, BLOCK_SIZE * i, SCREEN_WIDTH, BLOCK_SIZE * i);
        }
        pop();

        push();
        translate(offsetX + SCREEN_WIDTH + 20, offsetY);
        fill(200);
        rect(0, 0, NEXT_AREA_SIZE, NEXT_AREA_SIZE);
        this.nextMino.drawNext();
        pop();

        push();
        translate(offsetX + SCREEN_WIDTH + 20, offsetY + 180);
        fill(200);
        rect(0, 0, NEXT_AREA_SIZE, NEXT_AREA_SIZE);
        if (this.holdMino) this.holdMino.drawNext();
        pop();

        this.timer += deltaTime;
        if (this.timer > game_speed && game_overed_players.length===0) {
            this.timer = 0;
            this.dropMino();
        }

        if (this.is_game_over) {
            push();
            textSize(48);
            textAlign(CENTER, CENTER);
            fill(255, 0, 0);
            text(`${this.sp} lose...`, offsetX + SCREEN_WIDTH / 2, offsetY + SCREEN_HEIGHT / 2);
            pop();
            game_overed_players.push(this)
        } else if (game_overed_players.length!==0) {
            push();
            textSize(48);
            textAlign(CENTER, CENTER);
            fill(255, 0, 0);
            text(`${this.sp} Win!`, offsetX + SCREEN_WIDTH / 2, offsetY + SCREEN_HEIGHT / 2);
            pop();
        }

        if (is_error) {
            window.location.href = "error.html";
        }

        if (this.is_computer) {
            this.ai_Player.analyzeAndAct();
        }
    }

    dropMino() {
        if (this.mino.valid(0, 1, this.field)) {
            this.mino.y++;
        } else {
            if (this.mino.y < 0) {
                this.is_game_over = true;
                return;
            }
            this.field.merge(this.mino);
            this.field.checkLine();
            this.start();
        }
    }

    getFixedBlockMap() {
        const map = {};
        for (let x = 0; x < COLS_COUNT; x++) {
            for (let y = 0; y < ROWS_COUNT; y++) {
                map[`(${x},${y})`] = this.field.has(x, y) ? 1 : 0;
            }
        }
        map.mino=this.mino.type;
        return map;
    }
}

class Field {
    constructor() {
        this.blocks = [];
    }

    drawFixedBlocks() {
        for (let block of this.blocks) {
            block.draw(0, 0);
        }
    }

    merge(mino) {
        for (let block of mino.blocks) {
            block.x += mino.x;
            block.y += mino.y;
            this.blocks.push(block);
        }
    }

    checkLine() {
        let counter = 0;
        for (let r = 0; r < ROWS_COUNT; r++) {
            const line = this.blocks.filter(block => block.y === r);
            if (line.length === COLS_COUNT) {
                this.blocks = this.blocks.filter(block => block.y !== r);
                counter++;
                for (let block of this.blocks) {
                    if (block.y < r) block.y++;
                }
            }
        }
        if (counter === 4) {
            やりますねぇ.play();
        } else if (counter < 4 && counter > 0) {
            イキスギィ.play();
        } else if (counter >= 5) {
            is_error = true;
        }
    }

    has(x, y) {
        return this.blocks.some(block => block.x === x && block.y === y);
    }
}

class Mino {
    constructor() {
        this.type = floor(random(7)); // ミノの種類をランダムに決定
        this.blocks = this.initBlocks(); // ミノの形状を初期化
        this.x = 0; // ミノのx座標
        this.y = 0; // ミノのy座標
        this.rotationCenter = this.getRotationCenter(); // 回転軸を設定
    }

    initBlocks() {
        const t = this.type;
        switch (t) {
            case 0: // I型
                return [new Block(0, 1, t), new Block(1, 1, t), new Block(2, 1, t), new Block(3, 1, t)];
            case 1: // O型
                return [new Block(1, 0, t), new Block(2, 0, t), new Block(1, 1, t), new Block(2, 1, t)];
            case 2: // T型
                return [new Block(1, 0, t), new Block(0, 1, t), new Block(1, 1, t), new Block(2, 1, t)];
            case 3: // L型
                return [new Block(0, 0, t), new Block(0, 1, t), new Block(1, 1, t), new Block(2, 1, t)];
            case 4: // J型
                return [new Block(2, 0, t), new Block(0, 1, t), new Block(1, 1, t), new Block(2, 1, t)];
            case 5: // S型
                return [new Block(1, 0, t), new Block(2, 0, t), new Block(0, 1, t), new Block(1, 1, t)];
            case 6: // Z型
                return [new Block(0, 0, t), new Block(1, 0, t), new Block(1, 1, t), new Block(2, 1, t)];
        }
    }

    getRotationCenter() {
        // ミノごとに回転軸を設定（リンク先の設定に従う）
        switch (this.type) {
            case 0: return { x: 1.5, y: 1.5 }; // I型
            case 1: return { x: 1.5, y: 0.5 }; // O型（回転なし）
            case 2: return { x: 1, y: 1 };     // T型
            case 3: return { x: 1, y: 1 };     // L型
            case 4: return { x: 1, y: 1 };     // J型
            case 5: return { x: 1, y: 1 };     // S型
            case 6: return { x: 1, y: 1 };     // Z型
        }
    }

  spawn() {
        this.x = floor(COLS_COUNT / 2) - 2; // ミノを中央に配置
        this.y = -2; // 初期位置（画面外）
    }

    draw() {
        for (let block of this.blocks) {
            block.draw(this.x, this.y); // 各ブロックを描画
        }
    }

    drawNext() {
        for (let block of this.blocks) {
            block.draw(1, 1); // 次のミノを描画
        }
    }
  
    rotate(isClockwise) {
        const centerX = this.rotationCenter.x;
        const centerY = this.rotationCenter.y;
    
        for (let block of this.blocks) {
            const relativeX = block.x - centerX;
            const relativeY = block.y - centerY;
    
            // 回転計算
            if (isClockwise) {
                // 右回転（90度時計回り: x' = y, y' = -x）
                block.x = relativeY + centerX;
                block.y = -relativeX + centerY;
            } else {
                // 左回転（90度反時計回り: x' = -y, y' = x）
                block.x = -relativeY + centerX;
                block.y = relativeX + centerY;
            }
        }
    }

    valid(moveX, moveY, field, rotate = false) {
        const testBlocks = this.blocks.map(block => {
            const newBlock = new Block(block.x, block.y, this.type);
            if (rotate) {
                const centerX = this.rotationCenter.x;
                const centerY = this.rotationCenter.y;

                const relativeX = newBlock.x - centerX;
                const relativeY = newBlock.y - centerY;

                const rotatedX = relativeY;
                const rotatedY = -relativeX;

                newBlock.x = rotatedX + centerX;
                newBlock.y = rotatedY + centerY;
            }
            newBlock.x += this.x + moveX;
            newBlock.y += this.y + moveY;
            return newBlock;
        });

        return testBlocks.every(block => {
            return (
                block.x >= 0 &&
                block.x < COLS_COUNT &&
                block.y < ROWS_COUNT &&
                !field.has(block.x, block.y)
            );
        });
    }

    drawGhost(field) {
        // ゴーストミノの位置を計算
        let ghostY = this.y;
        while (this.valid(0, ghostY - this.y + 1, field)) {
            ghostY++;
        }
    
        // ゴーストミノを描画
        for (let block of this.blocks) {
            push();
            tint(255, 100); // 半透明に設定
            block.draw(this.x, ghostY);
            pop();
        }
    }
    
}

class Block {
    constructor(x, y, type) {
        this.x = x; // ブロックのx座標
        this.y = y; // ブロックのy座標
        this.type = type; // ブロックの種類
    }

    draw(offsetX = 0, offsetY = 0) {
        const drawX = (this.x + offsetX) * BLOCK_SIZE; // 描画用x座標を計算
        const drawY = (this.y + offsetY) * BLOCK_SIZE; // 描画用y座標を計算
        if (drawX >= 0 && drawX < SCREEN_WIDTH && drawY >= 0 && drawY < SCREEN_HEIGHT) {
            image(blockImages[this.type], drawX, drawY, BLOCK_SIZE, BLOCK_SIZE); // ブロック画像を描画
        }
    }
}

class AI_player {
    constructor(game) {
        this.game = game;
        this.net = new brain.NeuralNetwork();

        // 学習済みモデルをロード
        fetch('./trained-model.json')
            .then(response => response.json())
            .then(modelData => {
                this.net.fromJSON(modelData);
            })
            .catch(err => console.error("Failed to load model data:", err));
    }

    analyzeAndAct() {
        if (this.game.is_game_over) return;

        // getFixedBlockMapの結果をニューロンネットワークに入力
        const input = this.game.getFixedBlockMap();
        const output = this.net.run(input);


        // 出力から最大の値を持つアクションを取得
        const actions = Object.keys(output);
        const predictedAction = actions.reduce((a, b) => (output[a] > output[b] ? a : b));

        // 解析結果をmap(解析結果, 0, 1, 36, 42)
        const actionIndex = Math.floor(map(output[predictedAction], 0, 1, 36, 42));

        // アクションに対応する処理を実行
        this.executeAction(actionIndex);
    }

    executeAction(actionIndex) {
        if (keyIsDown(SHIFT)) {
            if (actionIndex === 41 && this.game.mino.valid(0, 0, this.game.field, true)) {
                keyCode = LEFT_ARROW;
                this.game.mino.rotate(false);
            } else if (actionIndex === 42 && this.game.mino.valid(0, 0, this.game.field, true)) {
                keyCode = RIGHT_ARROW;
                this.game.mino.rotate(true);
            }
        } else {
            switch (actionIndex) {
                case 36:
                    keyCode = 32; // スペースキー
                    this.game.hold();
                    break;
                case 37:
                    keyCode = LEFT_ARROW;
                    if (this.game.mino.valid(-1, 0, this.game.field)) this.game.mino.x--;
                    break;
                case 38:
                    keyCode = UP_ARROW;
                    while (this.game.mino.valid(0, 1, this.game.field)) this.game.mino.y++;
                    break;
                case 39:
                    keyCode = RIGHT_ARROW;
                    if (this.game.mino.valid(1, 0, this.game.field)) this.game.mino.x++;
                    break;
                case 40:
                    keyCode = DOWN_ARROW;
                    if (this.game.mino.valid(0, 1, this.game.field)) this.game.mino.y++;
                    break;
                default:
                    console.log("Unknown action index:", actionIndex);
            }
        }
    }
}