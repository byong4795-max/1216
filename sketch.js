// ================== 題庫 ==================
let questionPool = [
  { question: "5 - 2 = ?", answer: "3" },
  { question: "10 / 2 = ?", answer: "5" },
  { question: "4 / 2 = ?", answer: "2" },
  { question: "100 / 4 = ?", answer: "25" },
  { question: "25 - 12 = ?", answer: "13" },
  { question: "7 + 8 = ?", answer: "15" },
  { question: "89 + 2 = ?", answer: "91" },
  { question: "10 / 2.5 = ?", answer: "4" },
  { question: "5 + 6 = ?", answer: "11" },
  { question: "9 / 3 = ?", answer: "3" },
  { question: "1.2 + 6.3 = ?", answer: "7.5" },
  { question: "77 - 83 = ?", answer: "6" },
];
let questionPool2 = [
  { question: "落日霞光的英文原名叫？", answer: "sunset shimmer " },
  { question: "彩虹小馬大電影-小馬國女孩：魔法公主中，誰是大反派？", answer: "落日霞光" },
  { question: "彩虹小馬大電影-小馬國女孩：彩虹搖滾中，誰是大反派？", answer: "海妖三姊妹" },
  { question: "紫悅的寵物叫作", answer: "穗龍" },
  { question: "以彩虹小馬為主題的話，MLP是什麼意思？", answer: "my little pony " },
  { question: "落日霞光在友誼中代表什麼？", answer: "同理心" },
  { question: "彩虹小馬主角團中，誰的家族最龐大？", answer: "蘋果嘉兒" },
  { question: "紫悅來到人類世界後，第一次到達的地點是？", answer: "坎特拉中學" },
  { question: "彩虹小馬中，誰最愛派對?", answer: "碧琪" },
  { question: "彩虹小馬大電影-小馬國女孩：友誼競賽中，誰是大反派？", answer: "紫悅" },
  { question: "彩虹小馬中，最厲害的魔法是?", answer: "友誼" },
  { question: "彩虹小馬中，柔柔代表的元素是?", answer: "善良" },
];
// 顯示同時在畫面的鳥數量下限
const VISIBLE_BIRD_COUNT = 6;
// ================== 玩家 sprite =================
let walkingSpriteSheet;
let bulletSprite;
// ================== zi 角色（精靈） ==================
let ziSpriteSheet;
let ziLoaded = false;
// 若 ziUsePlayerSprite 為 true，會使用玩家的 `walkingSpriteSheet` 並轉為黑白呈現
let ziUsePlayerSprite = true;
const ZI_USED_FRAMES = 6; // 只使用前 6 幀
const ZI_TOTAL_FRAMES = 18; // 圖片內總共 18 幀
const ZI_SHEET_W = 1147;
const ZI_SHEET_H = 51;
// 每幀寬度應該以總幀數計算，然後只選用前 ZI_USED_FRAMES
const ZI_FRAME_W = ZI_SHEET_W / ZI_TOTAL_FRAMES;
const ZI_FRAME_H = ZI_SHEET_H;
let ziFrame = 0;
let ziFrameCounter = 0;
const ZI_FRAME_DELAY = 8;
let zi = {
  x: 100,
  y: 100,
  targetX: 100,
  targetY: 100,
  speed: 1.5,
  scale: 2.5,
  lastTargetChange: 0,
  targetChangeInterval: 2000
};
zi.lastHitTime = 0;
zi.hitCooldown = 1000; // 毫秒
zi.isMirrored = false;
// 扣分用角色相關：被子彈攻擊的計數與題庫
let penaltyHitCount = 0;
let penaltyCorrectAnswers = 0;
let penaltyDestroyed = false;
let penaltyQuestionActive = false;
let currentPenaltyQuestion = null;
let penaltyQuestionIndex = 0;
const penaltyQuestionPool = [
  { question: "神奇寶貝裡面，由可愛又迷人的反派角色組成的隊伍叫什麼？", answer: "火箭隊" },
  { question: "海綿寶寶裡面，章魚哥討厭的章魚叫甚麼？", answer: "花花公子帥章魚" },
  { question: "派大星的姊姊叫什麼?", answer: "派大珊" },
  { question: "名偵探柯南中，關西的高中生名偵探是?", answer: "服部平次" },
  { question: "豆豆先生的玩偶是什麼動物?", answer: "熊" },
  { question: "玩偶遊戲中，白蝙蝠叫什麼?", answer: "巴比特" },
  { question: "阿甘妙世界中，阿甘一家五口共包含幾種物種?", answer: "3" },
  { question: "櫻桃小丸子裡，最常胃痛的是?", answer: "山根" },
  { question: "我們這一家中，最常跟橘子鬥嘴的異性是?", answer: "吉岡" }
];
let gameOver = false;
let gameOverMessage = "";
let gameOverIsSuccess = false;
let paused = false;
let showEndBanner = false;

// 幫助精靈（55.png，387x51，6 幀）
let helperSpriteSheet;
let helperLoaded = false;
let helper = {
  x: 0,
  y: 80,
  targetX: 0,
  phase: 'idle', // 'idle' | 'enter' | 'speak' | 'exit'
  visible: false,
  frame: 0,
  frameCounter: 0,
  scale: 3.0,
  speakStart: 0,
  speakDuration: 5000
};
const HELPER_FRAMES = 6;
const HELPER_SHEET_W = 387;
const HELPER_SHEET_H = 51;
const HELPER_FRAME_W = HELPER_SHEET_W / HELPER_FRAMES;

// 追蹤答題顯示時間，超過 6 秒就叫出幫助精靈
let questionShownAt = 0;
let helperHasShownThisQuestion = false;
let replayButtonRect = null;

let playerLoaded = false;
let bulletLoaded = false;

const TOTAL_FRAMES = 12;
const FRAME_WIDTH = 391 / TOTAL_FRAMES;
const FRAME_HEIGHT = 20;

const WALK_FRAMES = 5;
const SPECIAL_START = 5;
const SPECIAL_END = 8;

let currentFrame = 0;
let frameDelay = 6;
let frameCounter = 0;

let posX, posY;
let isWalking = false;
let dirX = 0, dirY = 0;
let isMirrored = false;

let specialAnim = false;

// ================== 子彈（加速 + 連射） ==================
let bullets = [];
const BULLET_SPEED = 12;
const FIRE_COOLDOWN = 150;
let lastFireTime = 0;

// ================== 鳥 ==================
let redBirdSpriteSheet;
let blueBirdSpriteSheet;

const BIRD_FRAME_COUNT = 6;
const BIRD_W = 15;
const BIRD_H = 8;
const BIRD_SCALE = 6;

let birds = [];
let currentBirdIndex = 0;
// 產鳥輪替索引
let redSpawnIdx = 0;
let blueSpawnIdx = 0;
const MIN_ONSCREEN_BIRDS = 4;

// ================== UI ==================
let answerInput;
let activeBird = null;
let showQuestion = false;
let score = 0;

// ================== 安全載入 ==================
function safeImage(path, color, w, h, cb) {
  loadImage(path, cb, () => {
    let g = createGraphics(w, h);
    g.noStroke();
    g.fill(color);
    g.rect(0, 0, w, h);
    cb(g);
  });
}

// ================== setup ==================
function setup() {
  createCanvas(windowWidth, windowHeight);
  noSmooth();

  // 🔧 人物一定在畫面中
  posX = width / 2 - FRAME_WIDTH * 3;
  posY = height / 2;

  safeImage("assets/pinky.png", "#ff69b4",
    FRAME_WIDTH * TOTAL_FRAMES, FRAME_HEIGHT,
    img => { walkingSpriteSheet = img; playerLoaded = true; });

  safeImage("assets/11.png", "#000", 20, 20,
    img => { bulletSprite = img; bulletLoaded = true; });

  safeImage("assets/redb.png", "#ff5555",
    BIRD_W * BIRD_FRAME_COUNT, BIRD_H,
    img => redBirdSpriteSheet = img);

  safeImage("assets/bb.png", "#5555ff",
    BIRD_W * BIRD_FRAME_COUNT, BIRD_H,
    img => blueBirdSpriteSheet = img);

  // 載入 zi 精靈圖（1147 x 51），只使用前 6 幀做動畫
  safeImage("assets/zi.png", "#FFFFFF", ZI_SHEET_W, ZI_SHEET_H,
    img => { ziSpriteSheet = img; ziLoaded = true; });

  // 載入幫助精靈圖片
  safeImage("assets/55.png", "#000", HELPER_SHEET_W, HELPER_SHEET_H,
    img => { helperSpriteSheet = img; helperLoaded = true; });

  createBirdQueue();

  answerInput = createInput("");
  answerInput.hide();
  answerInput.elt.addEventListener("keydown", e => {
    if (e.key === "Enter") checkAnswer();
  });
}

// ================== 建立多隻鳥 ==================
function createBirdQueue() {
  // 讓紅、藍鳥使用不同題庫並交錯加入隊列
  shuffle(questionPool, true);
  shuffle(questionPool2, true);

  const maxLen = max(questionPool.length, questionPool2.length);
  for (let i = 0; i < maxLen; i++) {
    if (i < questionPool.length) {
      birds.push({
        type: "red",
        x: -100,
        y: random(80, height / 2),
        speed: random(4, 7),
        frame: 0,
        frameCounter: 0,
        moving: true,
        fleeing: false,
        question: questionPool[i]
      });
    }
    if (i < questionPool2.length) {
      birds.push({
        type: "blue",
        x: -100,
        y: random(80, height / 2),
        speed: random(4, 7),
        frame: 0,
        frameCounter: 0,
        moving: true,
        fleeing: false,
        question: questionPool2[i]
      });
    }
  }
  // 確保畫面上至少有幾隻鳥初始在畫面範圍內
  const minOnscreen = min(4, birds.length);
  for (let i = 0; i < minOnscreen; i++) {
    birds[i].x = random(50, width - 200);
  }
}

// ================== draw ==================
function draw() {
  drawBackground();

  drawScore();
  drawPenaltyStatus();
  // 若分數低於 -3，立即結束遊戲（失敗）
  if (!gameOver && score < -3) {
    triggerGameOver(false);
  }
  if (gameOver) {
    push();
    fill(gameOverIsSuccess ? '#2B8E4B' : '#8B1E1E');
    textSize(20);
    textAlign(CENTER, TOP);
    text(gameOverMessage, width / 2, 60);
    pop();
  }

  if (playerLoaded) {
    if (!paused) updatePlayer();
    drawPlayer();
  }

  updateBullets();

  // 更新並繪製所有未完成的鳥，確保天上持續有鳥在飛
  for (let bird of birds) {
    if (!bird.done) {
      if (!paused) updateBird(bird);
      drawBird(bird);
    }
  }

  // 確保畫面上至少有 MIN_ONSCREEN_BIRDS 隻鳥
  ensureMinBirds();

  drawQuestion();

  // 管理答題超時計時器：一開始顯示題目時記錄時間，題目結束時清除
  if (showQuestion) {
    if (questionShownAt === 0) questionShownAt = millis();
    // 超過 6 秒且還沒顯示過幫助精靈，觸發
    if (!helperHasShownThisQuestion && millis() - questionShownAt > 6000) {
      triggerHelperSprite();
    }
  } else {
    questionShownAt = 0;
    helperHasShownThisQuestion = false;
  }

  // 更新與繪製幫助精靈（若載入）
  if (helperLoaded) {
    updateHelperSprite();
    drawHelperSprite();
  }

  // 更新並繪製 zi（使用玩家精靈作為黑白精靈）
  if (playerLoaded) {
    if (!paused) updateZi();
    drawZi();
  }

  // 如果遊戲結束，畫出結束畫面（在最上層）
  if (gameOver) drawGameOver();
}

// ================== zi 更新與繪製 ==================
function updateZi() {
  // 動畫
  ziFrameCounter++;
  if (ziFrameCounter > ZI_FRAME_DELAY) {
    ziFrameCounter = 0;
    ziFrame = (ziFrame + 1) % ZI_USED_FRAMES;
  }

  // 定期改變目標點
  if (millis() - zi.lastTargetChange > zi.targetChangeInterval) {
    zi.lastTargetChange = millis();
    zi.targetChangeInterval = random(1200, 4000);
    zi.targetX = random(20, width - 60);
    zi.targetY = random(80, height - 80);
    zi.speed = random(0.6, 2.2);
  }

  // 往目標移動（線性插值）
  let dx = zi.targetX - zi.x;
  let dy = zi.targetY - zi.y;
  let dist = sqrt(dx * dx + dy * dy);
  if (dist > 1) {
    zi.x += (dx / dist) * zi.speed;
    zi.y += (dy / dist) * zi.speed;
  }

  // 與玩家碰撞檢查（只有在色塊有足夠重疊時才扣分；加入冷卻避免每幀重複扣分）
  const playerW = FRAME_WIDTH * 6;
  const playerH = FRAME_HEIGHT * 6;
  const ziW = ZI_FRAME_W * zi.scale;
  const ziH = ZI_FRAME_H * zi.scale;

  const ax1 = posX, ay1 = posY, ax2 = posX + playerW, ay2 = posY + playerH;
  const bx1 = zi.x, by1 = zi.y, bx2 = zi.x + ziW, by2 = zi.y + ziH;

  const overlapW = max(0, min(ax2, bx2) - max(ax1, bx1));
  const overlapH = max(0, min(ay2, by2) - max(ay1, by1));
  const overlapArea = overlapW * overlapH;
  const areaA = playerW * playerH;
  const areaB = ziW * ziH;
  const overlapThreshold = 0.2 * min(areaA, areaB); // 閾值：至少重疊 20% 的小面積

  if (overlapArea > overlapThreshold) {
    if (millis() - zi.lastHitTime > zi.hitCooldown) {
      zi.lastHitTime = millis();
      score -= 0.5;
    }
  }

  // 根據水平移動方向設定翻轉
  if (abs(dx) > 0.5) zi.isMirrored = dx < 0;

  // 檢查子彈是否命中 zi（扣分用角色），並處理命中計數與觸發題目
  if (!penaltyDestroyed) {
    for (let i = bullets.length - 1; i >= 0; i--) {
      const b = bullets[i];
      if (b.x > zi.x && b.x < zi.x + ZI_FRAME_W * zi.scale && b.y > zi.y && b.y < zi.y + ZI_FRAME_H * zi.scale) {
        // 子彈命中
        bullets.splice(i, 1);
        penaltyHitCount++;

        // 每 5 次命中觸發一題
        if (penaltyHitCount % 5 === 0) {
          triggerPenaltyQuestion();
        }
        // 若命中超過 200 次，避免無限成長（保險）
        if (penaltyHitCount > 10000) penaltyHitCount = 10000;
      }
    }
  }
}

function handlePenaltyDestroyed() {
  if (gameOver) return;
  // 使用統一的結束處理：若分數小於 -3 → 失敗，否則成功
  if (score < -3) {
    triggerGameOver(false);
  } else {
    triggerGameOver(true);
  }
}

function triggerGameOver(isSuccess) {
  // 共用的遊戲結束設定
  gameOver = true;
  paused = true;
  showEndBanner = true;
  penaltyQuestionActive = false;
  currentPenaltyQuestion = null;
  showQuestion = false;
  answerInput.hide();

  gameOverIsSuccess = !!isSuccess;
  gameOverMessage = gameOverIsSuccess ? '你成功了!' : '你輸了!';
  if (gameOverIsSuccess) zi.bright = true;
  else zi.bright = false;

  // 清除暫存物件（子彈）以避免意外互動
  bullets = [];

  // 記錄除錯資訊
  console.log('triggerGameOver: success=', gameOverIsSuccess, 'score=', score);
}

function restartGame() {
  // 重置所有遊戲狀態回到初始
  gameOver = false;
  gameOverMessage = '';
  gameOverIsSuccess = false;
  paused = false;
  showEndBanner = false;
  replayButtonRect = null;

  // 重置分數與扣分相關
  score = 0;
  penaltyHitCount = 0;
  penaltyCorrectAnswers = 0;
  penaltyDestroyed = false;
  penaltyQuestionActive = false;
  currentPenaltyQuestion = null;
  penaltyQuestionIndex = 0;

  // 重置鳥群與子彈
  birds = [];
  bullets = [];
  currentBirdIndex = 0;
  redSpawnIdx = 0;
  blueSpawnIdx = 0;
  createBirdQueue();

  // 重置玩家位置與狀態
  posX = width / 2 - FRAME_WIDTH * 3;
  posY = height / 2;
  dirX = 0; dirY = 0; isWalking = false; isMirrored = false;
  zi.bright = false;

  answerInput.value('');
  answerInput.hide();
}

function triggerPenaltyQuestion() {
  if (penaltyQuestionActive || penaltyDestroyed) return;
  penaltyQuestionActive = true;
  currentPenaltyQuestion = penaltyQuestionPool[penaltyQuestionIndex % penaltyQuestionPool.length];
  penaltyQuestionIndex++;
  showQuestion = true;
  answerInput.show();
}

function drawZi() {
  push();
  let dw = ZI_FRAME_W * zi.scale;
  let dh = ZI_FRAME_H * zi.scale;

  if (ziUsePlayerSprite && playerLoaded) {
    // 使用玩家精靈的前幾幀來顯示 zi（黑白）
    const frameIdx = ziFrame % WALK_FRAMES;
    const sx = frameIdx * FRAME_WIDTH;
    if (zi.bright) tint(255); else tint(180); // 灰階或鮮亮
    if (zi.isMirrored) {
      push();
      translate(zi.x + dw, zi.y);
      scale(-1, 1);
      image(walkingSpriteSheet, 0, 0, dw, dh, sx, 0, FRAME_WIDTH, FRAME_HEIGHT);
      pop();
    } else {
      image(walkingSpriteSheet, zi.x, zi.y, dw, dh, sx, 0, FRAME_WIDTH, FRAME_HEIGHT);
    }
    noTint();
  } else if (ziLoaded) {
    if (zi.isMirrored) {
      push();
      translate(zi.x + dw, zi.y);
      scale(-1, 1);
      if (zi.bright) tint(255, 230);
      image(ziSpriteSheet, 0, 0, dw, dh, ziFrame * ZI_FRAME_W, 0, ZI_FRAME_W, ZI_FRAME_H);
      noTint();
      pop();
    } else {
      if (zi.bright) tint(255, 230);
      image(ziSpriteSheet, zi.x, zi.y, dw, dh, ziFrame * ZI_FRAME_W, 0, ZI_FRAME_W, ZI_FRAME_H);
      noTint();
    }
  }
  pop();
}

function triggerHelperSprite() {
  if (helper.visible) return;
  helper.visible = true;
  helper.phase = 'enter';
  // 從左側進場：以 sprite 寬度計算起始位置
  const dw = HELPER_FRAME_W * helper.scale;
  helper.x = -dw - 40;
  helper.y = max(60, height * 0.15);
  helper.targetX = width / 2 - 160;
  helper.frame = 0;
  helper.frameCounter = 0;
  helperHasShownThisQuestion = true;
}

function updateHelperSprite() {
  if (!helper.visible) return;

  // frame animation
  helper.frameCounter++;
  if (helper.frameCounter > 6) {
    helper.frameCounter = 0;
    helper.frame = (helper.frame + 1) % HELPER_FRAMES;
  }

  if (helper.phase === 'enter') {
    // 緩速移入
    helper.x = lerp(helper.x, helper.targetX, 0.12);
    if (abs(helper.x - helper.targetX) < 2) {
      helper.phase = 'speak';
      helper.speakStart = millis();
    }
  } else if (helper.phase === 'speak') {
    if (millis() - helper.speakStart > helper.speakDuration) {
      helper.phase = 'exit';
      helper.targetX = width + 80;
    }
  } else if (helper.phase === 'exit') {
    helper.x = lerp(helper.x, helper.targetX, 0.14);
    if (helper.x > width + 20) {
      helper.visible = false;
      helper.phase = 'idle';
    }
  }
}

function drawHelperSprite() {
  if (!helper.visible) return;
  push();
  const dw = HELPER_FRAME_W * helper.scale;
  const dh = HELPER_SHEET_H * helper.scale;
  // 畫精靈
  image(helperSpriteSheet, helper.x, helper.y, dw, dh,
    helper.frame * HELPER_FRAME_W, 0, HELPER_FRAME_W, HELPER_SHEET_H);

  // 畫對話框（像素風小方塊邊框）
  const txt = '不會的話就亂打跳過!';
  textSize(18);
  textAlign(LEFT, TOP);
  fill('#FFF');
  stroke(0);
  strokeWeight(2);
  const pad = 8;
  const tx = helper.x + dw + 6;
  const ty = helper.y - 6;
  const tw = textWidth(txt) + pad * 2;
  const th = 30;
  // 像素邊框
  const px = 6;
  fill('#222');
  for (let ix = tx - px; ix < tx + tw + px; ix += px) {
    for (let iy = ty - px; iy < ty + th + px; iy += px) {
      if (ix === tx - px || ix >= tx + tw || iy === ty - px || iy >= ty + th) {
        rect(ix, iy, px, px);
      }
    }
  }
  // 內部
  fill('#FFF8E6');
  rect(tx, ty, tw, th);
  fill(0);
  noStroke();
  text(txt, tx + pad, ty + 6);
  pop();
}

function drawGameOver() {
  // 半透明遮罩
  push();
  noStroke();
  fill(0, 140);
  rect(0, 0, width, height);

  // 中央像素風面板
  const w = min(480, width * 0.6);
  const h = min(200, height * 0.4);
  const x = (width - w) / 2;
  const y = (height - h) / 2;

  // 像素邊框 (畫小方塊營造像素感)
  fill('#FFF1C6');
  for (let ix = x - 8; ix < x + w + 8; ix += 8) {
    for (let iy = y - 8; iy < y + h + 8; iy += 8) {
      if (ix === x - 8 || ix >= x + w || iy === y - 8 || iy >= y + h) {
        rect(ix, iy, 8, 8);
      }
    }
  }

  // 裡面面板
  fill('#FFF');
  rect(x, y, w, h);

  // 大字：{遊戲結束}
  // 大字：{遊戲結束}
  noStroke();
  // 更顯眼的大字
  const bigColor = gameOverIsSuccess ? '#3CB371' : '#CD2626';
  fill(0);
  textSize(min(96, w / 2));
  textAlign(CENTER, CENTER);
  // 黒邊描邊效果
  fill(bigColor);
  text('{遊戲結束}', width / 2, y + h / 2 - 20);

  // 顯示成功/失敗訊息
  fill(0);
  textSize(28);
  let msg = gameOverMessage;
  text(msg, width / 2, y + h - 30);

  // 強制顯示橫幅（如果需要更突出）
  if (showEndBanner) {
    fill(gameOverIsSuccess ? '#DFF7E6' : '#FFD6D6');
    rect(width / 2 - w / 2, y - 70, w, 50);
    fill(gameOverIsSuccess ? '#2B8E4B' : '#8B1E1E');
    textSize(22);
    text(gameOverMessage, width / 2, y - 70 + 25);
  }

  // 繪製「再來一局」按鈕（像素風），並儲存位置供點擊判斷
  const btnW = min(220, w - 40);
  const btnH = 44;
  const btnX = width / 2 - btnW / 2;
  const btnY = y + h - btnH - 12;

  // 像素邊框
  fill('#333');
  for (let ix = btnX - 8; ix < btnX + btnW + 8; ix += 8) {
    for (let iy = btnY - 8; iy < btnY + btnH + 8; iy += 8) {
      if (ix === btnX - 8 || ix >= btnX + btnW || iy === btnY - 8 || iy >= btnY + btnH) {
        rect(ix, iy, 8, 8);
      }
    }
  }

  // 按鈕內部
  fill('#FFEEDD');
  rect(btnX, btnY, btnW, btnH);
  fill('#222');
  textSize(20);
  textAlign(CENTER, CENTER);
  text('再來一局', btnX + btnW / 2, btnY + btnH / 2);

  // 儲存按鈕位置
  replayButtonRect = { x: btnX, y: btnY, w: btnW, h: btnH };

  pop();
}

// ================== 背景：馬卡龍色系像素農莊 ==================
function drawBackground() {
  const px = max(6, floor(min(width, height) / 80)); // pixel size adaptive

  // Sky gradient (pastel)
  for (let y = 0; y < height * 0.5; y += px) {
    let t = map(y, 0, height * 0.5, 0, 1);
    let c = lerpColor(color('#FDEEF8'), color('#c5ecffff'), t);
    noStroke();
    fill(c);
    rect(0, y, width, px);
  }

  // Pixel sun (top-right)
  let sunX = width - 120;
  let sunY = 80;
  for (let ix = -3; ix <= 3; ix++) {
    for (let iy = -3; iy <= 3; iy++) {
      if (sq(ix) + sq(iy) <= 9) {
        fill('rgba(255, 241, 176, 1)');
        rect(sunX + ix * px, sunY + iy * px, px, px);
      }
    }
  }

  // Clouds
  fill('#FFF5FD');
  for (let cx = 60; cx < width - 100; cx += 200) {
    for (let i = 0; i < 6; i++) {
      let x = cx + i * px * 2 + sin((frameCount + i * 10) * 0.01) * 6;
      let y = 40 + i % 2 * px * 1.5;
      rect(x, y, px * 6, px * 3);
    }
  }

  // Ground fields (pastel greens)
  const groundY = height * 0.5;
  for (let y = groundY; y < height; y += px) {
    for (let x = 0; x < width; x += px) {
      let shade = (x / px + y / px) % 2 === 0 ? '#DFF7E6' : '#CFF3D9';
      fill(shade);
      rect(x, y, px, px);
    }
  }

  // Simple pixel barn (left)
  const barnX = 40;
  const barnY = groundY - px * 6;
  fill('#fae482ff');
  rect(barnX, barnY, px * 8, px * 6);
  fill('#7c202fff');
  rect(barnX + px * 2, barnY - px * 2, px * 4, px * 2);

  // Fence (foreground)
  fill('rgba(255, 208, 137, 1)');
  for (let fx = 0; fx < width; fx += px * 8) {
    rect(fx, groundY + px * 1.5, px * 2, px * 4);
    rect(fx + px * 2, groundY + px * 2.5, px * 8, px);
  }
}

// ================== 玩家 ==================
function updatePlayer() {
  frameCounter++;

  if (specialAnim) {
    if (frameCounter >= frameDelay) {
      frameCounter = 0;
      currentFrame++;
      if (currentFrame > SPECIAL_END) {
        specialAnim = false;
        currentFrame = SPECIAL_END;
      }
    }
  } else if (isWalking) {
    if (frameCounter >= frameDelay) {
      frameCounter = 0;
      currentFrame = (currentFrame + 1) % WALK_FRAMES;

      posX += dirX * 6;
      posY += dirY * 6;
    }
  }

  posX = constrain(posX, 0, width - FRAME_WIDTH * 6);
  posY = constrain(posY, 0, height - FRAME_HEIGHT * 6);
}

function drawPlayer() {
  let sx = currentFrame * FRAME_WIDTH;
  let dw = FRAME_WIDTH * 6;
  let dh = FRAME_HEIGHT * 6;

  push();
  if (isMirrored) {
    translate(posX + dw, posY);
    scale(-1, 1);
    image(walkingSpriteSheet, 0, 0, dw, dh, sx, 0, FRAME_WIDTH, FRAME_HEIGHT);
  } else {
    image(walkingSpriteSheet, posX, posY, dw, dh, sx, 0, FRAME_WIDTH, FRAME_HEIGHT);
  }
  pop();
}

// ================== 子彈 ==================
function fireBullet() {
  if (millis() - lastFireTime < FIRE_COOLDOWN) return;

  bullets.push({
    x: posX + FRAME_WIDTH * 3,
    y: posY + FRAME_HEIGHT * 3,
    dx: isMirrored ? -BULLET_SPEED : BULLET_SPEED,
    dy: -BULLET_SPEED / 2
  });

  lastFireTime = millis();
}

function updateBullets() {
  for (let b of bullets) {
    b.x += b.dx;
    b.y += b.dy;
    image(bulletSprite, b.x, b.y, 20, 20);
  }
  bullets = bullets.filter(b => b.x > 0 && b.x < width && b.y > 0);
}

// ================== 鳥 ==================
function updateBird(bird) {
  if (!bird.moving && !bird.fleeing) return;

  bird.frameCounter++;
  if (bird.frameCounter > frameDelay) {
    bird.frameCounter = 0;
    bird.frame = (bird.frame + 1) % BIRD_FRAME_COUNT;
  }

  // 一般移動或逃跑移動
  if (bird.fleeing) {
    bird.y -= 4;
    bird.x += bird.speed * 3; // 逃跑時加速
  } else {
    bird.x += bird.speed;
  }

  for (let b of bullets) {
    if (b.x < bird.x + BIRD_W * BIRD_SCALE &&
        b.x + 20 > bird.x &&
        b.y < bird.y + BIRD_H * BIRD_SCALE &&
        b.y + 20 > bird.y) {

      // 如果正在處理扣分角色的題目，暫時不觸發鳥題目，避免衝突
      if (penaltyQuestionActive || penaltyDestroyed) continue;

      bird.moving = false;
      bird.fleeing = false;
      activeBird = bird;
      showQuestion = true;
      bullets = [];
      answerInput.show();
    }
  }

  if (bird.x > width + 100) {
    bird.done = true;
    if (activeBird === bird) activeBird = null;
    advanceBirdIndex();
  }
}

function advanceBirdIndex() {
  while (currentBirdIndex < birds.length && birds[currentBirdIndex].done) {
    currentBirdIndex++;
  }
}

function countActiveBirds() {
  let c = 0;
  for (let b of birds) if (!b.done) c++;
  return c;
}

function spawnBird(type) {
  let q = null;
  if (type === "red") {
    q = questionPool[redSpawnIdx % questionPool.length];
    redSpawnIdx++;
  } else {
    q = questionPool2[blueSpawnIdx % questionPool2.length];
    blueSpawnIdx++;
  }

  birds.push({
    type: type,
    x: random(-200, -50),
    y: random(80, height / 2),
    speed: random(3, 7),
    frame: 0,
    frameCounter: 0,
    moving: true,
    fleeing: false,
    done: false,
    question: q
  });
}

function ensureMinBirds() {
  while (countActiveBirds() < MIN_ONSCREEN_BIRDS) {
    // 交替生成紅/藍鳥
    if ((redSpawnIdx + blueSpawnIdx) % 2 === 0) spawnBird("red");
    else spawnBird("blue");
  }
}

function drawBird(bird) {
  let sheet = bird.type === "red" ? redBirdSpriteSheet : blueBirdSpriteSheet;
  image(sheet, bird.x, bird.y,
    BIRD_W * BIRD_SCALE, BIRD_H * BIRD_SCALE,
    bird.frame * BIRD_W, 0, BIRD_W, BIRD_H);
}

// ================== 題目 ==================
function drawQuestion() {
  if (!showQuestion) return;

  fill(255);
  stroke(0);
  strokeWeight(2);
  textSize(26);
  textAlign(CENTER);

  if (penaltyQuestionActive && currentPenaltyQuestion) {
    text(currentPenaltyQuestion.question, width / 2, 50);
    answerInput.position(width / 2 - 100, 80);
  } else if (activeBird) {
    text(activeBird.question.question, width / 2, 50);
    answerInput.position(posX, posY - 40);
  }
}

// ================== 檢查答案 ==================
function checkAnswer() {
  const given = answerInput.value().trim().toLowerCase();

  if (penaltyQuestionActive && currentPenaltyQuestion) {
    const expected = (currentPenaltyQuestion.answer + "").trim().toLowerCase();
    if (given === expected) {
      score += 5; // 答對 +5 分
      penaltyCorrectAnswers++;
      // 答對後降低扣分人物速度，最低保留 0.3
      zi.speed = max(0.3, zi.speed * 0.7);
      // 消滅條件：答對 4 題
      if (penaltyCorrectAnswers >= 4) {
        penaltyDestroyed = true;
        handlePenaltyDestroyed();
      }
    } else {
      // 答錯：扣除命中次數 5 次，最低為 0
      penaltyHitCount = max(0, penaltyHitCount - 5);
    }

    // 關閉 penalty 題目狀態
    penaltyQuestionActive = false;
    currentPenaltyQuestion = null;
    answerInput.value("");
    answerInput.hide();
    showQuestion = false;
    return;
  }

  if (!activeBird) return;

  const expected = (activeBird.question.answer + "").trim().toLowerCase();
  if (given === expected) {
    score += 5; // 答對 +5 分
  }

  answerInput.value("");
  answerInput.hide();
  showQuestion = false;
  nextBird();
}

function nextBird() {
  if (activeBird) activeBird.done = true;
  activeBird = null;
  advanceBirdIndex();
}

// ================== UI ==================
function drawScore() {
  // Pixel-style framed HUD (左上角)
  const boxX = 12;
  const boxY = 12;
  const boxW = min(280, width * 0.33);
  const boxH = 72;
  const px = 8; // pixel block size for border

  // outer pixel border
  fill('#fdadd5ff');
  for (let ix = boxX - px; ix < boxX + boxW + px; ix += px) {
    for (let iy = boxY - px; iy < boxY + boxH + px; iy += px) {
      if (ix === boxX - px || ix >= boxX + boxW || iy === boxY - px || iy >= boxY + boxH) {
        rect(ix, iy, px, px);
      }
    }
  }

  // interior
  fill('#ffffffff');
  rect(boxX, boxY, boxW, boxH);

  // Score text (保持原本功能)
  fill(0);
  textSize(18);
  textAlign(LEFT, TOP);
  text('Score: ' + score, boxX + 12, boxY + 8);
}

// 顯示扣分角色進度
function drawPenaltyStatus() {
  // 將扣分狀態顯示於 HUD 內（位置與原本相近）
  fill(0);
  textSize(14);
  textAlign(LEFT, TOP);
  let status = penaltyDestroyed ? '扣分角色已消滅' : ('命中: ' + penaltyHitCount + ' / 留存答對: ' + penaltyCorrectAnswers);
  // 與 drawScore 的 boxX/boxY 相對應
  const boxX = 12;
  const boxY = 12;
  text(status, boxX + 12, boxY + 36);
}

// ================== 控制 ==================
function mousePressed() {
  // 若遊戲已結束，檢查是否按下「再來一局」按鈕
  if (gameOver) {
    if (replayButtonRect) {
      if (mouseX >= replayButtonRect.x && mouseX <= replayButtonRect.x + replayButtonRect.w &&
          mouseY >= replayButtonRect.y && mouseY <= replayButtonRect.y + replayButtonRect.h) {
        restartGame();
        return;
      }
    }
    return;
  }

  // 在答題狀態下不要發射子彈
  if (showQuestion) return;
  fireBullet();
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) { dirX = -1; isMirrored = true; isWalking = true; }
  if (keyCode === RIGHT_ARROW) { dirX = 1; isMirrored = false; isWalking = true; }
  if (keyCode === UP_ARROW) { dirY = -1; isWalking = true; }
  if (keyCode === DOWN_ARROW) { dirY = 1; isWalking = true; }
}

function keyReleased() {
  dirX = 0;
  dirY = 0;
  isWalking = false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

