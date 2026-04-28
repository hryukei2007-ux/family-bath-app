const firebaseConfig = {
  apiKey: "AIzaSyCkLEcunc5idyyAEbr0DgCR6sACpzDbPcY",
  authDomain: "family-bath-app.firebaseapp.com",
  databaseURL: "https://family-bath-app-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "family-bath-app",
  storageBucket: "family-bath-app.firebasestorage.app",
  messagingSenderId: "326797398505",
  appId: "1:326797398505:web:5a2339b4b9d78bb169bb78",
  measurementId: "G-RQTM7DTE69"
};

function sendToYoom(name, isEntering) {
    const yoomUrl = "https://yoom.fun/app_trigger/webhooks/5y9rJucnS_CIGrofcXXp0Q"; 
    const messageText = `${name}がお風呂に${isEntering ? "入ったよ🛀" : "あがったよ✨"}`;

    fetch(yoomUrl, {
        method: 'POST',
        mode: 'no-cors', // セキュリティチェックを無視して強制送信
        headers: {
            'Content-Type': 'text/plain' // JSONではなくプレーンテキストとして送る（これで通ることが多い）
        },
        body: JSON.stringify({ message: messageText })
    }).then(() => {
        console.log("投げました！");
    }).catch(e => {
        console.error("送信エラー:", e);
    });
}
// 初期化
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const CORRECT_PASSWORD = "runasoru"; 
const familyMembers = ["父ちゃん", "お母さん", "龍慶", "かな"];

// ログインチェック関数
function checkPassword() {
    const input = document.getElementById('password-input').value;
    if (input === CORRECT_PASSWORD) {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('app-screen').style.display = 'block';
        startSync(); // ログイン成功後に同期開始
    } else {
        alert("合言葉が違います！");
    }
}

// データベース同期
function startSync() {
    database.ref('bathStatus').on('value', (snapshot) => {
        const data = snapshot.val() || {};
        const container = document.getElementById('member-list');
        if (!container) return;
        container.innerHTML = ""; 

        familyMembers.forEach(name => {
            const isInBath = data[name] || false;
            const card = document.createElement('div');
            card.className = 'card';
            card.style.borderLeft = isInBath ? "10px solid #ff4d4d" : "10px solid #4CAF50";
            
            card.innerHTML = `
                <div style="font-size: 1.2em; font-weight: bold;">${name}</div>
                <div style="margin: 10px 0;">${isInBath ? '🛀 入浴中' : '✨ あがっています'}</div>
                <button onclick="toggleBath('${name}', ${isInBath})" 
                        style="background-color: ${isInBath ? '#ff4d4d' : '#4CAF50'};">
                    ${isInBath ? 'あがった！' : 'お風呂に入る'}
                </button>
            `;
            container.appendChild(card);
        });
    });
}

// お風呂状態の切り替え
function toggleBath(name, currentStatus) {
    const newStatus = !currentStatus;

    // 1. まず先にLINE通知を投げる（Firebaseを待たずに実行）
    sendToYoom(name, newStatus);

    // 2. そのあとFirebaseを更新
    database.ref('bathStatus/' + name).set(newStatus)
        .then(() => {
            console.log("Firebase更新完了");
        })
        .catch((error) => {
            console.error("Firebaseエラー:", error);
        });
}

// YOOM（LINE）通知
function sendToYoom(name, isEntering) {
    const yoomUrl = "https://yoom.fun/app_trigger/webhooks/5y9rJucnS_CIGrofcXXp0Q"; 
    
    // YOOMが受け取りやすいシンプルなデータ形式に整理
    const payload = {
        name: name,
        status: isEntering ? "入りました" : "あがりました",
        message: `${name}がお風呂に${isEntering ? "入りました🛀" : "あがりました✨"}`
    };

    // fetchのオプションから複雑なものを外して、とにかく「送る」ことに集中
    fetch(yoomUrl, {
        method: 'POST',
        // あえて headers を最小限にするか、外すと通る場合があります
        body: JSON.stringify(payload)
    })
    .then(() => console.log("通知リクエスト送信完了"))
    .catch(e => console.error("通知送信失敗:", e));
  function sendToYoom(name, isEntering) {
    const yoomUrl = "https://yoom.fun/app_trigger/webhooks/5y9rJucnS_CIGrofcXXp0Q"; 
    const messageText = `${isEntering ? "【入浴開始】" : "【お風呂あがり】"}\n${name} がお風呂 ${isEntering ? "入りました" : "あがりました"}！ ${isEntering ? "🛀" : "✨"}`;

    // ブラウザのセキュリティ(CORS)を回避するための設定
    fetch(yoomUrl, {
        method: 'POST',
        mode: 'no-cors', // 成功・失敗の判定を捨てて強制送信するモード
        headers: {
            'Content-Type': 'text/plain' // あえてJSONと言わずに送るのがコツ
        },
        body: JSON.stringify({ 
            name: name, 
            message: messageText 
        })
    })
    .then(() => {
        console.log("信号をYOOMに投げました（no-cors）");
    })
    .catch(e => {
        console.error("送信自体に失敗:", e);
    });
}
}
