document.addEventListener("DOMContentLoaded", () => {
  const scores = { aggressor: 0, victim: 0, caring: 0, childlike: 0 };
  let itemsDone = 0;
  let timerInterval;

  // 画面要素
  const startScreen = document.getElementById("start-screen");
  const checkboxScreen = document.getElementById("checkbox-screen");
  const roomScreen = document.getElementById("room-screen");
  const resultScreen = document.getElementById("result-screen");

  // --- 配列シャッフル関数 ---
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // 1. スタートボタン処理
  document.getElementById("start-btn").addEventListener("click", () => {
    startScreen.classList.remove("active");
    checkboxScreen.classList.add("active");

    // チェックボックスの生成（シャッフル）
    const cbContainer = document.getElementById("checkbox-container");
    cbContainer.innerHTML = "";
    const shuffledCb = shuffle([...checkboxQuestions]);
    shuffledCb.forEach(q => {
      const label = document.createElement("label");
      label.className = "checkbox-item";
      label.innerHTML = `<input type="checkbox" value="${q.type}"><span class="checkmark"></span>${q.text}`;
      cbContainer.appendChild(label);
    });
  });

  // ゲージ更新
  function updateGauge() {
    const maxScore = Math.max(1, Object.values(scores).reduce((a, b) => a + b, 0));
    document.getElementById("bar-aggressor").style.width = (scores.aggressor / maxScore * 100) + "%";
    document.getElementById("bar-victim").style.width = (scores.victim / maxScore * 100) + "%";
    document.getElementById("bar-caring").style.width = (scores.caring / maxScore * 100) + "%";
    document.getElementById("bar-childlike").style.width = (scores.childlike / maxScore * 100) + "%";
  }

  // 2. チェックボックス → お部屋へ
  document.getElementById("to-room-btn").addEventListener("click", () => {
    document.querySelectorAll('#checkbox-container input:checked').forEach(cb => {
      scores[cb.value]++;
    });
    updateGauge();
    checkboxScreen.classList.remove("active");
    roomScreen.classList.add("active");
  });

  // 3. モーダル処理（選択肢のシャッフル対応）
  const modalOverlay = document.getElementById("modal-overlay");
  const modalContent = document.getElementById("modal-content");
  
  function closeModal(itemId) {
    modalOverlay.classList.add("hidden");
    const btn = document.getElementById("item-" + itemId);
    btn.classList.add("done");
    itemsDone++;
    if (itemsDone === 6) { // 全6アイテム
      document.getElementById("room-guide").innerHTML = "<b>すべての探索が完了したよ！結果を見よう！</b>";
      document.getElementById("submit-btn").classList.remove("hidden");
    }
  }

  document.querySelectorAll(".room-item").forEach(item => {
    item.addEventListener("click", () => {
      if (item.classList.contains("done")) return;
      const itemId = item.id.replace("item-", "");
      const data = roomQuestions[itemId];
      openModal(itemId, data);
    });
  });

  function openModal(itemId, data) {
    modalOverlay.classList.remove("hidden");
    modalContent.innerHTML = "";

    if (data.type === "normal" || data.type === "chat") {
      let html = `<h3>${data.text}</h3>`;
      if(data.type === "chat"){
        html += `<div class="timer-bar-container"><div class="timer-bar" id="chat-timer"></div></div>
                 <div class="chat-container"><div class="chat-bubble">${data.chatMsg}</div></div>`;
      } else {
        html += `<p>${data.question}</p>`;
      }

      // ★選択肢をシャッフルして表示（バレバレ防止！）
      const shuffledOptions = shuffle([...data.options]);
      shuffledOptions.forEach(opt => {
        html += `<button class="option-btn" data-type="${opt.scoreType}">${opt.text}</button>`;
      });
      modalContent.innerHTML = html;

      // LINE風のタイマー処理
      if(data.type === "chat"){
        let timeLeft = 100;
        const timerBar = document.getElementById("chat-timer");
        timerInterval = setInterval(() => {
          timeLeft -= 1;
          timerBar.style.width = timeLeft + "%";
          if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert("時間切れ！焦ってパニックになったので『子どもタイプ』にポイント追加！ｗｗ");
            scores.childlike += 2;
            updateGauge();
            closeModal(itemId);
          }
        }, 100);
      }

      modalContent.querySelectorAll(".option-btn").forEach(btn => {
        btn.addEventListener("click", function() {
          if(timerInterval) clearInterval(timerInterval);
          scores[this.dataset.type] += 2;
          updateGauge();
          closeModal(itemId);
        });
      });

    } else if (data.type === "slider") {
      let html = `<h3>${data.text}</h3><p>${data.question}</p>
        <div class="slider-container">
          <div class="slider-labels"><span>${data.labels[0]}</span><span>${data.labels[1]}</span></div>
          <input type="range" id="love-slider" min="0" max="100" value="50">
          <button id="slider-submit" class="btn" style="margin-top:15px;">決定！</button>
        </div>`;
      modalContent.innerHTML = html;
      document.getElementById("slider-submit").addEventListener("click", () => {
        const val = parseInt(document.getElementById("love-slider").value);
        if (val <= 25) scores.victim += 2;
        else if (val <= 50) scores.caring += 2;
        else if (val <= 75) scores.childlike += 2;
        else scores.aggressor += 2;
        updateGauge();
        closeModal(itemId);
      });
    }
  }

  // 🐛 芋虫ギミックの実装（お父様歓喜仕様ｗｗ）
  let bugClicks = 0;
  const bug = document.getElementById("item-bug");
  const bugSpeech = document.getElementById("bug-speech");
  let speechTimeout;

  function showBugMsg(msg) {
    bugSpeech.innerText = msg;
    bugSpeech.classList.remove("hidden");
    clearTimeout(speechTimeout);
    speechTimeout = setTimeout(() => { bugSpeech.classList.add("hidden"); }, 2000);
  }

  bug.addEventListener("click", () => {
    if(bug.classList.contains("dead")) return;
    bugClicks++;
    
    if(bugClicks === 1) showBugMsg("ん？私はLSIのNiサブタイプだ。");
    else if(bugClicks === 5) showBugMsg("静かに観察しているんだ。あまり構うな。");
    else if(bugClicks === 10) showBugMsg("おい、ツンツンするな。Tiで分析するぞ。");
    else if(bugClicks === 15) showBugMsg("ふん、お前のタップからは強いSeの圧を感じるな…");
    else if(bugClicks === 20) showBugMsg("しつこいな！お前はSLEか！？やめろ！");
    else if(bugClicks === 25) showBugMsg("警告だ！これ以上は危険だぞ！");
    else if(bugClicks === 29) showBugMsg("ま、待て！次叩いたら本当に…！");
    else if(bugClicks >= 30) {
      bug.innerText = "💥";
      bug.classList.add("dead");
      showBugMsg("グシャッ…（強烈なSe圧により無惨にも潰された）");
    }
  });

  // 4. 結果画面へ
  document.getElementById("submit-btn").addEventListener("click", () => {
    let maxType = "childlike";
    let maxScore = -1;
    for (const [type, score] of Object.entries(scores)) {
      if (score > maxScore) { maxScore = score; maxType = type; }
    }

    const idVal = document.getElementById("type-input").value.trim();
    if (idVal) {
      document.getElementById("result-identity").style.display = "block";
      document.getElementById("result-identity").innerText = `あなたの自認：${idVal}`;
    }

    const res = resultsData[maxType];
    document.getElementById("result-content").innerHTML = `
      <div class="result-title">${res.title}</div>
      <div class="desc-text">${res.desc}</div>
      <div class="gemi-comment"><strong><i class="fa-solid fa-comment-dots"></i> 解説：</strong><br>${res.gemi}</div>
    `;

    roomScreen.classList.remove("active");
    resultScreen.classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // リトライ
  document.getElementById("retry-btn").addEventListener("click", () => {
    location.reload();
  });
});