const GAS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxAakJQ2ilukUtgIreHXp7f3hXO4YX9bxUN3j-g_Zw7CKymGUq_3h1Zp9VHwKAA29k/exec"; // ←みつきのURLのままで！

document.addEventListener("DOMContentLoaded", () => {
  const scores = { aggressor: 0, victim: 0, caring: 0, childlike: 0 };
  let itemsDone = 0;
  let timerInterval;

  const actionLog = { checkboxes:[], events: {} };

  const modalOverlay = document.getElementById("modal-overlay");
  const modalContent = document.getElementById("modal-content");
  const customAlert = document.getElementById("custom-alert");
  const alertMsg = document.getElementById("alert-msg");

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  document.getElementById("start-btn").addEventListener("click", () => {
    document.getElementById("start-screen").classList.remove("active");
    document.getElementById("checkbox-screen").classList.add("active");
    const cbContainer = document.getElementById("checkbox-container");
    cbContainer.innerHTML = "";
    shuffle([...checkboxQuestions]).forEach(q => {
      const label = document.createElement("label");
      label.className = "checkbox-item";
      label.innerHTML = `<input type="checkbox" value="${q.type}" data-text="${q.text}"><span class="checkmark"></span>${q.text}`;
      cbContainer.appendChild(label);
    });
  });

  function updateGauge() {
    let maxScore = 1;
    for (const v of Object.values(scores)) { if (Math.abs(v) > maxScore) maxScore = Math.abs(v); }
    const types = ["aggressor", "victim", "caring", "childlike"];
    types.forEach(type => {
      const bar = document.getElementById("bar-" + type);
      const score = scores[type];
      bar.style.width = ((Math.abs(score) / maxScore) * 100) + "%";
      if (score < 0) { bar.classList.add("negative"); bar.innerHTML = `${score}`; } 
      else { bar.classList.remove("negative"); bar.innerHTML = score > 0 ? `${score}` : ""; }
    });
  }

  document.getElementById("to-room-btn").addEventListener("click", () => {
    document.querySelectorAll('#checkbox-container input:checked').forEach(cb => {
      scores[cb.value]++;
      actionLog.checkboxes.push(cb.dataset.text);
    });
    updateGauge();
    document.getElementById("checkbox-screen").classList.remove("active");
    document.getElementById("room-screen").classList.add("active");

    const idVal = document.getElementById("type-input").value.trim().toUpperCase();
    if (idVal.includes("LII")) {
      setTimeout(() => {
        showTauntAlert("👩🏻‍💻 ダーリンちゃん<br>「あら、あなた『LII』なの？<br>感情の言語化が苦手で素直になれないんでしょ？ふふっ、いーっぱい弄ばせてもらうわね♡」");
      }, 500);
    }
  });

  function showTauntAlert(msg, callback) {
    alertMsg.innerHTML = msg;
    customAlert.classList.remove("hidden");
    document.getElementById("alert-close").onclick = () => {
      customAlert.classList.add("hidden");
      if(callback) callback();
    };
  }

  function closeModal(itemId) {
    modalOverlay.classList.add("hidden");
    modalOverlay.classList.remove("modal-pressure-bg");
    modalContent.classList.remove("modal-pressure-content");
    document.body.classList.remove("extreme-pressure");

    const btn = document.getElementById("item-" + itemId);
    if(btn) {
      btn.classList.add("done");
      itemsDone++;
      if (itemsDone === 7) {
        document.getElementById("room-guide").innerHTML = "<b>すべての探索が完了したよ！結果を見よう！</b>";
        document.getElementById("submit-btn").classList.remove("hidden");
      }
    }
  }

  function showPressureEffect(callback) {
    const overlay = document.createElement("div");
    overlay.id = "pressure-overlay";
    overlay.innerHTML = `<div class="sle-pressure">「付き合って欲しいのか？<br>10万💰」</div>
      <div class="lie-pressure" style="display:none;">「……お前の未来ごと、包囲する。」</div>`;
    document.body.appendChild(overlay);
    setTimeout(() => { document.querySelector(".sle-pressure").style.display = "none"; document.querySelector(".lie-pressure").style.display = "block"; }, 2000);
    setTimeout(() => { document.body.removeChild(overlay); callback(); }, 4500);
  }

  document.querySelectorAll(".room-item").forEach(item => {
    item.addEventListener("click", () => {
      if (item.classList.contains("done")) return;
      const itemId = item.id.replace("item-", "");
      const data = roomQuestions[itemId];
      if(itemId === "pc") showPressureEffect(() => { openModal(itemId, data); });
      else openModal(itemId, data);
    });
  });

  function openModal(itemId, data) {
    modalOverlay.classList.remove("hidden");
    modalContent.innerHTML = "";
    if(itemId === "pc") { 
      modalOverlay.classList.add("modal-pressure-bg"); 
      modalContent.classList.add("modal-pressure-content"); 
      document.body.classList.add("extreme-pressure"); 
    }

    // ★ ここから通常の選択肢処理 ★
    if (data.type === "normal") {
      let html = `<h3>${data.text}</h3><p>${data.question}</p>`;
      shuffle([...data.options]).forEach(opt => {
        const sc = opt.scoreChange !== undefined ? opt.scoreChange : 2;
        const btnClass = itemId === "pc" ? "option-btn pressure-btn" : "option-btn";
        html += `<button class="${btnClass}" data-type="${opt.scoreType}" data-scorechange="${sc}" data-text="${opt.text}">${opt.text}</button>`;
      });
      modalContent.innerHTML = html;
      modalContent.querySelectorAll(".option-btn").forEach(btn => {
        btn.addEventListener("click", function() {
          const sChange = parseInt(this.dataset.scorechange);
          scores[this.dataset.type] += sChange;
          actionLog.events[data.text] = this.dataset.text; 
          
          // ★ ENTJ圧（pc）の場合のセリフ分岐！ ★
          if (itemId === "pc") {
            const selectedText = this.dataset.text;
            if (sChange < 0) {
              showTauntAlert("💦 システム通知<br>「強烈なSe圧に耐えられなかったため【侵略者】スコアが減点されました…（マイナス時はバーが凍結します）」", () => { updateGauge(); closeModal(itemId); });
            } else if (selectedText.includes("好き勝手")) {
              showTauntAlert("👔 ENTJたち<br>「おや、マイペースに遊ぶ？……逃がすわけないだろ？」<br><small>（背後からとんでもない圧を感じる…！）</small>", () => { updateGauge(); closeModal(itemId); });
            } else if (selectedText.includes("おもろｗｗ")) {
              showTauntAlert("👔 ENTJたち<br>「ふっ、観察してるつもりか？……すでに俺の包囲網の中だぞ？」<br><small>（気づけば退路が完全に塞がれていた…！）</small>", () => { updateGauge(); closeModal(itemId); });
            } else if (selectedText.includes("煽り返す")) {
              showTauntAlert("👔 SLE<br>「ほう、乗ってくるか。面白え（ニヤリ）」<br><small>（ゴリゴリのSe圧が迫ってくる…！）</small>", () => { updateGauge(); closeModal(itemId); });
            } else {
              updateGauge(); closeModal(itemId);
            }
          } else {
            // PC以外（通常アイテム）の処理
            updateGauge(); closeModal(itemId);
          }
        });
      });

    } else if (data.type === "free_text") {
      let html = `<h3>${data.text}</h3>
        <div class="timer-bar-container"><div class="timer-bar" id="chat-timer"></div></div>
        <div class="chat-container"><div class="chat-bubble">${data.chatMsg}</div></div>
        <p>${data.question}</p>
        <input type="text" id="free-input" class="free-text-input" placeholder="入力してね！">
        <button id="send-free" class="btn">送信！</button>`;
      modalContent.innerHTML = html;

      const timerBar = document.getElementById("chat-timer");
      const freeInput = document.getElementById("free-input");
      
      // ★フリーズ対策！CSSアニメーションでバーを減らす
      timerBar.style.width = "100%";
      setTimeout(() => {
        timerBar.style.transition = "width 15s linear"; // ★15秒に延長！
        timerBar.style.width = "0%";
      }, 50);

      // ★判定・送信処理を関数化！
      const processReply = (text, isTimeout) => {
        actionLog.events["LINE返信"] = text || "（無言）";
        
        // ★時間切れ書きかけ送信用の追加煽り
        let timeoutPrefix = isTimeout ? "<strong style='color:#ff4757;'>「ちょっと、途中で送ってきなや！焦りすぎちゃう？ｗｗ」</strong><br><br>" : "";

        let applied = false;
        for (const rule of darlingLineLogic) {
          let match = false;
          if (rule.keywords && rule.keywords.length > 0) match = rule.keywords.some(kw => text.includes(kw));
          else if (rule.condition) match = rule.condition(text);
          else if (!rule.keywords && !rule.condition) match = true;
          
          if (match) {
            scores[rule.scoreType] += rule.scoreChange;
            let replyMsg = rule.reply;
            const idVal = document.getElementById("type-input").value.trim().toUpperCase();
            if (idVal.includes("LII") && rule.scoreType === "childlike") {
              replyMsg += "<br><br><small>（LII特有の感情迷子、バッチリ観測したわよ♡）</small>";
            }
            showTauntAlert("👩🏻‍💻 ダーリンちゃん<br>" + timeoutPrefix + replyMsg, () => { updateGauge(); closeModal(itemId); });
            applied = true; break;
          }
        }
      };

      // ★15秒後の処理（ループを使わないから固まらない！）
      timerInterval = setTimeout(() => {
        const text = freeInput.value.trim();
        if (text.length > 0) {
          // 何か入力していたら、書きかけで強制送信！
          processReply(text, true);
        } else {
          // 何も入力していなければ、時間切れ放置
          actionLog.events["LINE返信"] = "【時間切れ放置】";
          showTauntAlert("👩🏻‍💻 ダーリンちゃん<br>「時間切れ〜♡ フリーズしちゃった？」", () => { scores.childlike += 2; updateGauge(); closeModal(itemId); });
        }
      }, 15000); // 15秒

      // ★手動で送信ボタンを押した時の処理
      document.getElementById("send-free").addEventListener("click", () => {
        clearTimeout(timerInterval); // 時間切れ処理をキャンセル
        timerBar.style.transition = "none"; // アニメーションを止める
        const text = freeInput.value.trim();
        processReply(text, false);
      });

    } else if (data.type === "slider") { // ←ここから下は前のコードと同じ！
      let html = `<h3>${data.text}</h3><p>${data.question}</p>
        <div class="slider-container">
          <div class="slider-labels"><span>完全に委ねたい</span><span>ゴリゴリに支配したい</span></div>
          <input type="range" id="love-slider" min="0" max="100" value="50">
          <span id="slider-msg">「さりげなくサポートしたいな…」</span>
          <button id="slider-submit" class="btn" style="margin-top:15px;">決定！</button>
        </div>`;
      modalContent.innerHTML = html;
      const slider = document.getElementById("love-slider");
      const msgLabel = document.getElementById("slider-msg");
      slider.addEventListener("input", () => {
        const v = slider.value;
        if(v <= 25) msgLabel.innerText = "「どうしていいかわからんから全部委ねるわ…」";
        else if(v <= 50) msgLabel.innerText = "「さりげなくサポートに回りたいな…」";
        else if(v <= 75) msgLabel.innerText = "「リードしたいけどやり方が…とりあえず様子見で反応実験だ！」";
        else msgLabel.innerText = "「私の言う通りにしなさい！力で支配する！」";
      });
      document.getElementById("slider-submit").addEventListener("click", () => {
        const v = parseInt(slider.value);
        actionLog.events["主導権スライダー"] = `数値: ${v}`;
        if (v <= 25) scores.victim += 2; else if (v <= 50) scores.caring += 2; else if (v <= 75) scores.childlike += 2; else scores.aggressor += 2;
        updateGauge(); closeModal(itemId);
      });

    } else if (data.type === "throw") {
      let html = `<h3>${data.text}</h3><p>${data.question}</p>
        <div class="darling-area" id="darling-reaction"><span style="font-size:40px;">👩🏻‍💻</span><p style="margin:5px 0 0 0; font-weight:bold;">「はよ投げてーや。」</p></div>
        <p style="font-size:12px; color:#666;">（横にスクロールしてアイテムを選んでタップ！）</p>
        <div class="throw-items">`;
      shuffle([...presentItems]).forEach(item => {
        html += `<button class="throw-btn" data-icon="${item.icon}" data-name="${item.name}">
            <div class="throw-icon">${item.icon}</div><div class="throw-name">${item.name}</div>
          </button>`;
      });
      html += `</div>`;
      modalContent.innerHTML = html;
      document.querySelectorAll(".throw-btn").forEach(btn => {
        btn.addEventListener("click", function() {
          const icon = this.dataset.icon;
          actionLog.events["プレゼント"] = this.dataset.name;
          const darlingArea = document.getElementById("darling-reaction");
          const reactionData = darlingThrowReactions[icon];
          const reaction = reactionData ? reactionData.reaction : "「おっ、もろとくわ。」";
          const type = reactionData ? reactionData.type : "victim";

          if(reactionData && reactionData.isBug) {
            setTimeout(() => { showTauntAlert("🐛 LSI芋虫<br>「誰がキモいだと？僕のTi-Seによる完璧なフォルムを理解できないとは、お前のFeは浅はかだな。」", () => { closeModal(itemId); }); }, 2000);
          }
          darlingArea.innerHTML = `<span style="font-size:40px;">👩🏻‍💻</span><p style="margin:5px 0 0 0; font-weight:bold;">${reaction}</p>`;
          scores[type] += 3; updateGauge();
          if(!reactionData || !reactionData.isBug) { setTimeout(() => { closeModal(itemId); }, 2500); }
        });
      });

    } else if (data.type === "hold_game") {
      let html = `<h3>${data.text}</h3><p>${data.question}</p>
        <div id="stare-area" style="background:#ffcccc; width:150px; height:150px; border-radius:50%; margin: 20px auto; display:flex; align-items:center; justify-content:center; font-size:60px; cursor:pointer; user-select:none; box-shadow: 0 5px 15px rgba(0,0,0,0.2); transition: 0.1s;">👩🏻‍💻</div>
        <p id="stare-msg" style="font-weight:bold; color:var(--primary-color);">顔を長押ししてね！</p>`;
      modalContent.innerHTML = html;

      const stareArea = document.getElementById("stare-area");
      const stareMsg = document.getElementById("stare-msg");
      let holdTimer; let holdTime = 0; let isHolding = false;

      const startHold = (e) => {
        e.preventDefault();
        isHolding = true; holdTime = 0;
        stareMsg.innerText = "見つめ合い中...👀";
        holdTimer = setInterval(() => { 
          holdTime += 100; 
          if(holdTime > 3000) { stareArea.classList.add("pressure-heartbeat"); stareMsg.innerText = "圧が強くなってきた…！🔥"; }
          if(holdTime > 6000) { 
            stareArea.style.transform = `scale(${1 + (holdTime/10000)})`; 
            stareMsg.innerText = "逃げられないよ…？♡"; 
            document.body.classList.add("extreme-pressure");
          }
        }, 100);
      };

const endHold = () => {
        if (!isHolding) return;
        isHolding = false; clearInterval(holdTimer);
        stareArea.classList.remove("pressure-heartbeat"); stareArea.style.transform = "scale(1)"; stareArea.style.background = "#ffcccc";
        document.body.classList.remove("extreme-pressure");
        
        actionLog.events["見つめ合い"] = `${holdTime} ミリ秒`; 

        let scoreType = ""; let msg = "";
        // ★ 判定ロジックのさらなる微調整！
        if (holdTime < 3000) { 
          scoreType = "caring"; 
          msg = "👩🏻‍💻 ダーリンちゃん<br>「ふふ、すぐ目そらした。優しく見守ってくれたんやね〜」"; 
        }
        else if (holdTime < 8000) { // 8秒までは「面白がってる」子どもタイプ！
          scoreType = "childlike"; 
          msg = "👩🏻‍💻 ダーリンちゃん<br>「圧出してから離したやろ！観察して遊んでたんやな？おもろい奴♡」"; 
        }
        else if (holdTime < 12000) { // 12秒までは「バチバチ」の侵略者！
          scoreType = "aggressor"; 
          msg = "👩🏻‍💻 ダーリンちゃん<br>「バチバチやん！その強い視線の圧、嫌いじゃないで🔥」"; 
        }
        else { // 12秒を超えたら「畏怖を突き抜けて屈服」の犠牲者判定！
          scoreType = "victim"; 
          msg = "👩🏻‍💻 ダーリンちゃん<br>「……そこまで耐えるなんて、完全に私に屈服されたがってるやん♡（畏怖）」"; 
        }
        
        scores[scoreType] += 2; updateGauge();
        showTauntAlert(msg, () => { closeModal(itemId); });
      };
      stareArea.addEventListener("mousedown", startHold); stareArea.addEventListener("touchstart", startHold);
      stareArea.addEventListener("mouseup", endHold); stareArea.addEventListener("touchend", endHold);
      stareArea.addEventListener("mouseleave", endHold);
    }
  }

  // 🐛 芋虫ギミック
  let bugClicks = 0;
  const bug = document.getElementById("item-bug");
  const bugSpeech = document.getElementById("bug-speech");
  let speechTimeout;

  function showBugMsg(msg) {
    bugSpeech.innerText = msg; bugSpeech.classList.remove("hidden");
    clearTimeout(speechTimeout);
    speechTimeout = setTimeout(() => { bugSpeech.classList.add("hidden"); }, 2000);
  }

  bug.addEventListener("click", () => {
    if(bug.classList.contains("dead")) return;
    bugClicks++;
    
    if(bugClicks === 1) showBugMsg("LSIのNiサブタイプだ。静かにしてくれ。");
    else if(bugClicks === 5) showBugMsg("お前、僕を怒らせたいのか？");
    else if(bugClicks === 10) showBugMsg("おい、ツンツンするな。Tiで分析するぞ。");
    else if(bugClicks === 20) showBugMsg("しつこいな！お前はSLEか！？やめろ！");
    else if(bugClicks >= 30) {
      bug.innerText = "💥"; bug.classList.add("dead");
      showBugMsg("グシャッ…（強烈なSe圧により潰された）");
      scores.aggressor += 10; updateGauge();
      actionLog.events["隠し要素"] = "芋虫を30回タップして潰した";
      showTauntAlert("🐛 システム通知<br>「無惨にも芋虫を潰したため、あなたの【侵略者(Se)】スコアが +10 されました。」");
    }
  });

  document.getElementById("submit-btn").addEventListener("click", () => {
    let maxType = "childlike"; let maxScore = -1;
    for (const [type, score] of Object.entries(scores)) {
      if (score > maxScore) { maxScore = score; maxType = type; }
    }
    const idVal = document.getElementById("type-input").value.trim() || "未入力";
    document.getElementById("result-identity").style.display = "block";
    document.getElementById("result-identity").innerText = `自認：${idVal}`;

    let res = resultsData[maxType];
    let finalComment = res.gemi;
    
    if (idVal.toUpperCase().includes("LII")) {
      let liiMsg = "";
      if(maxType === "childlike") liiMsg = "「Ti（論理）でガチガチに武装してるくせに、本当は素直に甘やかされたいんじゃない♡ やっぱり本来の『子どもタイプ』ね、可愛いわ🥺」";
      else if(maxType === "victim") liiMsg = "「『犠牲者タイプなんて全く理解できない』って言ってたのに、実は深いところで屈服させられたい願望隠してたのね……ふふっ、最高♡」";
      else if(maxType === "aggressor") liiMsg = "「あら、あなたLIIなのに『侵略者』なの？頭の中だけじゃなくて、現実でもゴリゴリに支配したかったなんて……ギャップ萌えね🔥」";
      else if(maxType === "caring") liiMsg = "「意外と『保護者タイプ』なのね。論理で相手を分析しつつ、なんだかんだお世話焼いちゃうオカン気質……嫌いじゃないわよ♡」";
      finalComment += "<br><br><strong style='color:#ff4757;'>👩🏻‍💻 ダーリンちゃんからの総評：</strong><br>" + liiMsg;
    }

    document.getElementById("result-content").innerHTML = `
      <div class="result-title">${res.title}</div><p>${res.desc}</p>
      <div class="gemi-comment"><strong>🐿️ 解説：</strong><br>${finalComment}</div>`;
    
    document.getElementById("room-screen").classList.remove("active");
    document.getElementById("result-screen").classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });

    // ★GAS送信処理★
    if(GAS_WEB_APP_URL && GAS_WEB_APP_URL.startsWith("https://script.google.com/")) {
      fetch(GAS_WEB_APP_URL, {
        method: "POST", mode: "no-cors", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identity: idVal, resultType: res.title, scores: scores, actionLog: actionLog })
      }).catch(e => console.log("GAS送信エラー", e));
    }
  });

  document.getElementById("save-img-btn").addEventListener("click", () => {
    const target = document.getElementById("capture-area");
    html2canvas(target).then(canvas => {
      const imgData = canvas.toDataURL("image/png");
      if(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
        const imgEl = document.getElementById("result-image");
        imgEl.src = imgData; document.getElementById("img-output-area").classList.remove("hidden");
      } else {
        const link = document.createElement("a");
        link.download = "love-type-result.png"; link.href = imgData; link.click();
      }
    });
  });

  document.getElementById("share-nav-btn").addEventListener("click", () => {
    // 現在の結果タイプ名を取得（結果画面に表示されているタイトル）
    const resultTitle = document.querySelector(".result-title").innerText;
    
    const shareData = {
      title: 'ソシオニクス恋愛スタイル診断',
      text: `私のソシオニクス恋愛スタイルは【${resultTitle}】でした！\n#ソシオニクス恋愛診断\n`,
      url: 'https://mofu-mitsu.github.io/love-type-diagnosis'
    };

    if (navigator.share) {
      navigator.share(shareData).catch(err => console.log('Share error:', err));
    } else {
      // 非対応ブラウザ用のフォールバック（X/Twitterへ）
      const tweetText = encodeURIComponent(shareData.text);
      const tweetUrl = encodeURIComponent(shareData.url);
      window.open(`https://twitter.com/intent/tweet?text=${tweetText}&url=${tweetUrl}`, "_blank");
    }
  });

  document.getElementById("retry-btn").addEventListener("click", () => { location.reload(); });
});
