const checkboxQuestions =[
  { id: "a1", text: "好きになったら自分からアプローチしたい。", type: "aggressor" },
  { id: "a2", text: "恋愛の駆け引きは燃える方だ。", type: "aggressor" },
  { id: "a3", text: "相手が自分に服従してくれると愛を感じる。", type: "aggressor" },
  { id: "v1", text: "強引に迫られたい願望がある。", type: "victim" },
  { id: "v2", text: "相手の愛を試すような態度をとってしまう。", type: "victim" },
  { id: "v3", text: "尽くすけど、簡単には言いなりにならない。", type: "victim" },
  { id: "c1", text: "相手の体調や生活のお世話をするのが好き。", type: "caring" },
  { id: "c2", text: "のんびり穏やかな時間を過ごすのが幸せ。", type: "caring" },
  { id: "c3", text: "激しいアプローチより、ていねいなやり取りがいい。", type: "caring" },
  { id: "ch1", text: "自分の変わった考えを面白がってほしい。", type: "childlike" },
  { id: "ch2", text: "変わった行動で相手の気を惹いて遊びたい。", type: "childlike" },
  { id: "ch3", text: "正直誰かに甘やかされたいしお世話されたい。", type: "childlike" }
];
const presentItems =[
  { icon: "🍷", name: "高級ワイン", type: "aggressor" },
  { icon: "🗑️", name: "鼻かんだティッシュ", type: "aggressor" },
  { icon: "📘", name: "就活マニュアル", type: "aggressor" },
  { icon: "⌨️", name: "高機能キーボード", type: "aggressor" },
  { icon: "💡", name: "スマート照明", type: "aggressor" },
  { icon: "🔖", name: "古い栞", type: "victim" },
  { icon: "🔮", name: "青いガラス", type: "victim" },
  { icon: "🌧️", name: "雨音のCD", type: "victim" },
  { icon: "📖", name: "無題の不気味な詩集", type: "victim" },
  { icon: "🌌", name: "深夜感ある雑貨", type: "victim" },
  { icon: "🍪", name: "手作りの焼き菓子", type: "caring" },
  { icon: "🛏️", name: "ふかふかブランケット", type: "caring" },
  { icon: "🍵", name: "高級な日本茶セット", type: "caring" },
  { icon: "💆", name: "マッサージグッズ", type: "caring" },
  { icon: "🐛", name: "芋虫", type: "childlike" },
  { icon: "🔘", name: "謎の検知ボタン", type: "childlike" },
  { icon: "🎲", name: "カオスなサイコロ", type: "childlike" },
  { icon: "🎨", name: "創作刺激セット", type: "childlike" },
  { icon: "🧸", name: "でかいクマのぬいぐるみ", type: "childlike" }
];

// 🎁 ダーリンちゃんのプレゼント反応ロジック
const darlingThrowReactions = {
  "🍷": { reaction: "「おっ、高級ワインやん。私を酔わせてどうするつもりなん？♡」", type: "aggressor" },
  "🗑️": { reaction: "「は！？ゴミ投げんなや！マジでキレるぞ💢（Se圧にはSe圧で返す）」", type: "aggressor" },
  "📘": { reaction: "「就活マニュアル…？うるさいわ！私の現実に干渉してくんなや！💢」", type: "aggressor" },
  "⌨️": { reaction: "「お、高機能キーボード。ええセンスしてるけど、なんか効率求められてるみたいで圧感じるわ…」", type: "aggressor" },
  "💡": { reaction: "「スマート照明？これで私の行動も管理するつもり？支配欲強いな〜」", type: "aggressor" },
  "🔖": { reaction: "「古い栞…？なんか意味深やな。私に何を伝えたいん？深読みしちゃうわ…」", type: "victim" },
  "🔮": { reaction: "「青いガラス。綺麗やけど…こういう『空気感』とか『エモさ』で私を縛ろうとするんやね。」", type: "victim" },
  "🌧️": { reaction: "「雨音のCD？なんかしんみりするやん。一緒にアンニュイな気分に浸ろうってこと？」", type: "victim" },
  "📖": { reaction: "「不気味な詩集…内容が入ってこんわ。こういう闇深いの、嫌いじゃないけど♡」", type: "victim" },
  "🌌": { reaction: "「深夜感ある雑貨。私の時間を全部これに染めたいんやろ？執着感じるわー」", type: "victim" },
  "🍪": { reaction: "「手作りのお菓子！？めっちゃええ匂いする！ありがとう、一緒に食べよ！」", type: "caring" },
  "🛏️": { reaction: "「ふかふかブランケット〜。はぁ、落ち着くわ。私の体調気遣ってくれてんねんな。」", type: "caring" },
  "🍵": { reaction: "「日本茶セット。なんか一気にオカン感出たなｗ でもホッとするわー」", type: "caring" },
  "💆": { reaction: "「マッサージグッズ！最近肩凝ってたんよ、めっちゃ実用的で助かる！」", type: "caring" },
  "🐛": { reaction: "「ひっ！？なにこれキモッ！…ってなんでこんなもん投げるん！？💢（素に戻る）」", type: "childlike", isBug: true },
  "🔘": { reaction: "「なんやこのボタン。ポチッ…『未完検知！』って、なんやねんこれアハハ！」", type: "childlike" },
  "🎲": { reaction: "「カオスなサイコロ？よっしゃ振ってみるわ。…『変な顔する』？なんやその罰ゲーム！」", type: "childlike" },
  "🎨": { reaction: "「創作刺激セット！え、シール可愛い！一緒にパソコンデコろーや！」", type: "childlike" },
  "🧸": { reaction: "「でっかいクマ！急に子供みたいなもん渡してきてどうしたん？まぁ抱き心地ええから許す。」", type: "childlike" }
};
// 📱 ダーリンちゃんのLINE判定ロジック
const darlingLineLogic = [
  { keywords: ["きも", "イラ", "苛", "いらっ", "嫌い", "うるさ", "だる", "あんぽんたん", "アンポンタン", "うざ", "キモ", "ゴミ", "カス", "オエー", "おえー", "きしょ", "キショ"], scoreType: "aggressor", scoreChange: 2, reply: "「は？あんた、そういう態度とるんやね。まあ、その強気なところも嫌いじゃないけど💢（Se圧にはSe圧で返すわ）」" },
  { keywords: ["観測", "輪郭", "境界", "運命", "深い", "闇", "虚無", "沈黙", "視線"], scoreType: "victim", scoreChange: 2, reply: "「……輪郭が近くなる？ふふ、あなたも私を『観測』してたのね。そんな風に概念で私を縛ろうとするなんて……ゾクゾクするわ♡」" 
  },
  { keywords: ["さあ", "わからない", "なんとも",  "何とも", "どうだろ", "なんだろ", "わからん"], scoreType: "childlike", scoreChange: 2, reply: "「あはは！自分の気持ちも言語化できへんの？素直に感情表現できへん不器用さんやなぁ、可愛い♡（弄りがいあるわ）」" },
  { keywords: ["好き", "すき", "愛し", "会いたい", "ダーリン", "休め", "疲れてる", "壊れる", "お茶", "ご飯", "大丈夫"], scoreType: "caring", scoreChange: 2, reply: "「ふふっ、素直でよろしい♡ その言葉、ちゃんと行動で示してよね？」" },
  { keywords: ["理由", "なぜ", "定義", "意味", "分析", "論理", "とは"], scoreType: "childlike", scoreChange: 2, reply: "「あーあ、また難しく考えてる。私のノイズで論理(Ti)がフリーズしちゃうの、ほんと可愛いわね🥺」" },
  { condition: function(text) { return /^[^\w\sぁ-んァ-ヶ一-龠]+$/.test(text) || text.length <= 2; }, scoreType: "aggressor", scoreChange: 2, reply: "「え、短ッ。記号だけ？適当にあしらってるん？それとも照れ隠しの圧？（Se的な力技を感じるわ）」" },
  { condition: function(text) { return /^[ぁ-んー]+$/.test(text) && text.length >= 4; }, scoreType: "childlike", scoreChange: 2, reply: "「ひらがなばっかやん！赤ちゃん(Ne)みたいで可愛いな。よしよし、甘やかしたるわ👶」" },
  { condition: function(text) { return text.length > 10 && (text.match(/[一-龠]/g) ||[]).length > text.length * 0.4; }, scoreType: "victim", scoreChange: 2, reply: "「漢字多くて堅っ苦しいわ！でも、そこまで深読み(Ni)して焦ってるの…ゾクゾクする♡」" },
  { keywords:[], scoreType: "victim", scoreChange: 2, reply: "「ふふっ、なるほどね。あなたの思考パターン、完全に読めたわ♡」" }
];

const roomQuestions = {
  phone: { type: "free_text", text: "📱 恋人からのLINEだ！即レスして！", chatMsg: "ねえ、ダーリン♡ 今の私のことどう思ってる？素直な気持ち教えて♡", question: "（直感で返信を入力して「送信」を押してね！）" },
  table: {
    type: "normal", text: "🍱 あるある・お惣菜問題", question: "恋人の家で出されたのが『スーパーのお惣菜』でした。心境は？",
    options:[
      { text: "「私への愛はその程度？手抜きされた…」", scoreType: "childlike" }, 
      { text: "「次は私が美味しいもの作ってあげるよ！」", scoreType: "caring" }, 
      { text: "「おっ、準備早いじゃん！すぐ食べよ！」", scoreType: "aggressor" }, 
      { text: "「お惣菜…？もしや何か深い理由（不器用な愛）が隠されている…？」", scoreType: "victim" }
    ]
  },
  door: { type: "slider", text: "🚪 玄関での駆け引き", question: "デートの別れ際。主導権（リード）はどっちが握りたい？" },
  sofa: {
    type: "normal", text: "🛋️ 不機嫌な恋人", question: "恋人が不機嫌そうです。あなたはどうする？",
    options:[
      { text: "「なに不機嫌になってんの？」と直接揺さぶる。", scoreType: "aggressor", scoreChange: 2 },
      { text: "「怒ってるのかな…」とわざと冷たくして反応を試す。", scoreType: "victim" },
      { text: "「疲れてるのかな」と察して、温かい飲み物を置く。", scoreType: "caring" },
      { text: "「なぜ不機嫌なのか」理由を分析し、わからなければ聞く。", scoreType: "childlike" }
    ]
  },
  darling: { type: "throw", text: "👩🏻‍💻 退屈なダーリンちゃん", question: "ダーリンちゃん：「あーあ、暇やなぁ。なんかおもっしょいもん投げてくれん？」" },
  
  // ★追加ギミック：ENTJたちからのアプローチ！★
  pc: {
    type: "normal", text: "💻 ENTJたちからのアプローチ！", 
    question: "タイプの違う2人のENTJから同時にアプローチされました。<br><br><b>① SLE（侵略者）</b><br>「付き合って欲しいのか？ 10万💰」<br><br><b>② LIE（犠牲者）</b><br>「睡眠削って性能落としてるの惜しいからまず寝ろ。お前、面白いから横にいろ。」<br><br>あなたの反応は？",
    options:[
      { text: "SLEの『10万💰』オモロ！交渉に乗るか、さらに煽り返す！", scoreType: "aggressor", scoreChange: 2 },
      { text: "LIEの『未来ごと包囲してくる』感じ、悪くないかも…♡（畏怖）", scoreType: "victim", scoreChange: 2 },
      // ★ Si提供（オカン）側に誘導するように修正！
      { text: "どっちも土足で踏み込んで来すぎ💢 私の境界線は絶対に越えさせない！", scoreType: "aggressor", scoreChange: 2 },
      { text: "LIEの不器用な優しさ（Te）を感じるから、温かいお茶でも淹れて支えてあげたい", scoreType: "caring", scoreChange: 2 },
      { text: "どっちも圧が強い！私は私のペースで好き勝手に遊びたいの！", scoreType: "childlike", scoreChange: 2 },
      { text: "圧すごｗｗおもろｗｗ（※適当にあしらって観察する）", scoreType: "childlike", scoreChange: 2 },
      { text: "SLEの『10万』とか意味不明でドン引き…力技には耐えられないから逃げる。", scoreType: "aggressor", scoreChange: -2 }
    ]
  },
  // ★新ミニゲーム追加！★
  eye: {
    type: "hold_game", text: "👁️ 見つめ合いゲーム", 
    question: "ダーリンちゃんがじーっと見つめてきた！<br><b>下の顔を『長押し』して見つめ返そう！</b><br>限界だと思ったら指（マウス）を離してね。"
  }
};

const resultsData = {
  aggressor: { 
    title: "⚔️ 侵略者タイプ (Se優勢)", 
    desc: "あなたは狙った獲物は逃さないハンター！積極的にアプローチし、相手をリードすることに喜びを感じます。恋の駆け引きも楽しむ情熱的なタイプ。", 
    gemi: "ガンマ・ベータ・クアドラのSe持ち（SLE, LSI, SEE, ESI）に多い傾向があるよ！ダーリンちゃんにイラッとしたらこの素質あるかも！？<br>犠牲者（Ni）のめんどくさい駆け引きには「は？早く結論言えよ💢」とキレがちなので注意ｗｗ" 
  },
  victim: { 
    title: "⛓️ 犠牲者タイプ (Ni優勢)", 
    desc: "相手の強い愛情を感じたいタイプ！強引に迫られることにドキドキしますが、簡単には服従しないツンデレな一面も。相手の気持ちの移り変わりに敏感です。", 
    gemi: "ガンマ・ベータ・クアドラのNi持ち（EIE, IEI, LIE, ILI）に多い傾向があるよ！<br>侵略者タイプ（Se）の強引なアプローチに惹かれやすいと言われてるけど、関係性は人それぞれ。自分のペースを守りつつ、相手の熱量を楽しむのがコツかも！" 
  },
  caring: { 
    title: "🍵 保護者タイプ (Si優勢)", 
    desc: "まるでお母さん・お父さんのようなオカン気質！相手の体調や生活環境を整えてあげることに喜びを感じる、優しくて思いやりに溢れるタイプ。", 
    gemi: "アルファ・デルタ・クアドラのSi持ち（ESE, SEI, LSE, SLI）に多い傾向があるよ！<br>子どもタイプ（Ne）を優しくお世話する関係が定番と言われるけど、相性論に縛られず、お互いが心地よいと思えるバランスを見つけるのが一番！" 
  },
  childlike: { 
    title: "🧸 子どもタイプ (Ne優勢)", 
    desc: "一緒に面白おかしく遊びたい無邪気なタイプ！あなたの空想やアイディアを面白がってくれる人を求めます。たまにはお世話されて甘えたい願望も。", 
    gemi: "アルファ・デルタ・クアドラのNe持ち（ILE, LII, IEE, EII）に多い傾向があるよ！<br>「お惣菜で愛を測る」など、愛情表現に独特のこだわりがあるかも？相手の反応が見たくて変なボタンや芋虫をプレゼントしがちｗｗ" 
  }
};
