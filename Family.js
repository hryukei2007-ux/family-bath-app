// 1. 家族の定義
const familyMembers = ["父ちゃん", "お母さん", "龍慶", "かな"];
const memberListDiv = document.getElementById('member-list');

// 2. 画面初期化
if (memberListDiv) {
    memberListDiv.innerHTML = ""; // 二重にボタンが出ないようにリセット
    familyMembers.forEach(name => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="name">${name}</div>
            <div class="status">状況確認中</div>
            <button class="btn-off" id="btn-${name}">お風呂に入る</button>
        `;
        memberListDiv.appendChild(card);

        // ボタンに直接クリックイベントをつける
        const btn = document.getElementById(`btn-${name}`);
        btn.addEventListener('click', () => {
            console.log(name + " のボタンが押されました"); // 確認用
            sendToYoom(name);
        });
    });
}

// 3. YOOMに送る処理
function sendToYoom(name) {
    const yoomUrl = "https://yoom.fun/app_trigger/webhooks/5y9rJucnS_CIGrofcXXp0Q"; 
    const targetBtn = document.getElementById(`btn-${name}`);
    
    // 【重要】ボタンの文字で「今入っているか」を判定
    const isBathing = (targetBtn.innerText === "あがった！"); 
    
    let actionText, emoji, statusText;
    if (!isBathing) {
        // まだ入っていない場合
        actionText = "【入浴開始】";
        emoji = "🛀";
        statusText = "入りました";
    } else {
        // すでに入っていて、あがる場合
        actionText = "【お風呂あがり】";
        emoji = "✨";
        statusText = "あがりました";
    }

    const messageText = `${actionText}\n${name} がお風呂　${statusText}！ ${emoji}`;

    targetBtn.disabled = true;
    targetBtn.innerText = "送信中...";

    fetch(yoomUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        mode: 'no-cors',
        body: JSON.stringify({
            name: name,
            message: messageText
        })
    })
    .then(() => {
        targetBtn.disabled = false;
        // 送信成功後にボタンの文字を切り替える
        if (!isBathing) {
            targetBtn.innerText = "あがった！";
            targetBtn.style.backgroundColor = "#ff4d4d"; // 赤系
        } else {
            targetBtn.innerText = "お風呂に入る";
            targetBtn.style.backgroundColor = "#4CAF50"; // 緑系
        }
        alert("LINEに通知しました！");
    })
    .catch(error => {
        console.error("Error:", error);
        alert("送信に失敗しました");
        targetBtn.disabled = false;
    });
}