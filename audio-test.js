// 获取主题背景
var body = document.getElementById("body");
// 获取音频播放器对象
var audio = document.getElementById("audioTag");

// 歌曲名
var musicTitle = document.getElementById("music-title");
//歌曲海报
var recordImg = document.getElementById("record-img");
// 歌曲作者
var author = document.getElementById('author-name');

// 进度条
var progress = document.getElementById('progress');
// 总进度条
var progressTotal = document.getElementById('progress-total');

// 已进行时长
var playedTime = document.getElementById('playedTime');
// 总时长
var audioTime = document.getElementById('audioTime');

// 播放模式按钮
var mode = document.getElementById('playMode');
// 上一首
var skipForward = document.getElementById('skipForward');
// 暂停按钮
var pause = document.getElementById('playPause');
// 下一首
var skipBackward = document.getElementById('skipBackward');
// 音量调节
var volume = document.getElementById('volume');
// 音量调节滑块
var volumeTogger = document.getElementById('volumn-togger');

// 列表
var list = document.getElementById('list');
// 倍速
var speed = document.getElementById('speed');


// 左侧关闭面板
var closeList = document.getElementById('close-list');
// 右侧关闭面板
var closeList2 = document.getElementById('close-list2');
// 音乐列表面板
var musicList = document.getElementById('music-list');
//进度条悬浮
let  hover_time = document.querySelector(".hover-time");
let  hover_bar = document.querySelector(".hover-bar");

let progress_t, //鼠标在进度条上悬停的位置
  progress_loc, //鼠标在进度条上悬停的音频位置
  c_m, //悬停音频位置(分钟)
  ct_minutes, //悬停播放位置(分)
  ct_seconds; //悬停播放位置(秒)

  // 进度条鼠标移动事件
 progressTotal.addEventListener("mousemove", function (e) {
   showHover(e);
 });
  // 进度条鼠标离开事件
  progressTotal.addEventListener("mouseout", hideHover);
  // 进度条点击事件
  progressTotal.addEventListener("click", playFromClickedPos);
//   // 音频播放位置改变事件
//   audio.addEventListener("timeupdate", updateCurTime);
// 显示悬停播放位置弹层
function showHover(e) {
  // 计算鼠标在进度条上的悬停位置(当前鼠标的X坐标-进度条在窗口中的left位置)
  progress_t = e.clientX - progressTotal.getBoundingClientRect().left;
  // 计算鼠标在进度条上悬停时的音频位置
  // audio.duration 音频总时长
  progress_loc =
    audio.duration * (progress_t / progressTotal.getBoundingClientRect().width);
  // 设置悬停进度条的宽度(较深部分)
  hover_bar.style.width = progress_t + "px";
  // 将悬停音频位置转为分钟
  c_m = progress_loc / 60;
  ct_minutes = Math.floor(c_m); //分
  ct_seconds = Math.floor(progress_loc - ct_minutes * 60); //秒

  if (ct_minutes < 10) {
    ct_minutes = "0" + ct_minutes;
  }
  if (ct_seconds < 10) {
    ct_seconds = "0" + ct_seconds;
  }
  if (isNaN(ct_minutes) || isNaN(ct_seconds)) {
    hover_time.innerText = "--:--";
  } else {
    hover_time.innerText = ct_minutes + ":" + ct_seconds;
  }

  // 设置悬停播放位置弹层的位置并显示
  hover_time.style.left = progress_t + "px";
  hover_time.style.marginLeft = "-20px";
  hover_time.style.display = "block";
}
// 隐藏悬停播放位置弹层
function hideHover() {
  hover_bar.style.width = "0px";
  hover_time.innerText = "00:00";
  hover_time.style.left = "0px";
  hover_time.style.marginLeft = "0px";
  hover_time.style.display = "none";
}
// 从点击的位置开始播放
function playFromClickedPos() {
  // 设置当前播放时间
  audio.currentTime = progress_loc;
  // 设置进度条宽度
  progress.style.width = progress_t + "px";
  // 隐藏悬停播放位置弹层
  hideHover();
}
// 改变当前播放时间
function updateCurTime() {

}

function initPlay(){
//播放功能与暂停
pause.onclick = function (e){
    if(audio.paused){
        audio.play();
        //唱片动画
        rotateRecord();
        pause.classList.remove("icon-play");
        pause.classList.add("icon-pause");
    }else{
        audio.pause();
        rotateRecordStop();
        pause.classList.remove("icon-pause");
        pause.classList.add("icon-play");
    }
}
}
initPlay();

//进度条
audio.addEventListener('timeupdate', updateProgress); // 监听音频播放时间并更新进度条
function updateProgress(){
    var value = audio.currentTime / audio.duration;
    progress.style.width = value * 100 + '%';
    playedTime.innerText = transTime(audio.currentTime);
}

//音频播放时间换算
function transTime(value) {
    var time = "";
    var h = parseInt(value / 3600);
    value %= 3600;
    var m = parseInt(value / 60);
    var s = parseInt(value % 60);
    //判断是否有小时
    if (h > 0) {
        //格式化时间
        time = formatTime(h + ":" + m + ":" + s);
    } else {
      //格式化时间
      time = formatTime(m + ":" + s);
    }

    return time;
}
//补零且格式化时间
function formatTime(value){
    var time = "";
    var s  = value.split(':');
    var i = 0;
    //判断字符长度是否为1，为1说明为一位数进行补零
    for(;i < s.length - 1;i++){
        time += s[i].length == 1 ? ("0" + s[i]) : s[i];
        time += ':';
    }
    time += s[i].length == 1 ? ("0" + s[i]) : s[i];

    return time;
}

// 点击进度条跳到指定点播放(gai)
progressTotal.addEventListener("mousedown", function (event) {
  // 只有音乐开始播放后才可以调节，已经播放过但暂停了的也可以
  if (!audio.paused || audio.currentTime != 0) {
    var pgsWidth = parseFloat(
      window.getComputedStyle(progressTotal, null).width.replace("px", "")
    );
    var rate = event.offsetX / pgsWidth;
    audio.currentTime = audio.duration * rate;
    updateProgress(audio);
  }
});

// 点击列表展开音乐列表
list.addEventListener('click', function (event) {
    musicList.classList.remove("list-card-hide");
    musicList.classList.add("list-card-show");
    musicList.style.display = "flex";
    closeList.style.display = "flex";
    closeList2.style.display = "flex";
    closeList2.addEventListener("click", closeListBoard);
    closeList.addEventListener('click', closeListBoard);
});

// 点击关闭面板关闭音乐列表
function closeListBoard() {
    musicList.classList.remove("list-card-show");
    musicList.classList.add("list-card-hide");
    closeList.style.display = "none";
    closeList2.style.display = "none";
   
    // musicList.style.display = "none";
}

// 存储当前播放的音乐序号
var musicId = 0;

// 后台音乐列表
let musicData = [
  ["ドライフラワー (干花)", "優里"],
];

//初始化音乐
function initMusic(){
    //设置路径
    audio.src = "mp3/優里 - ドライフラワー (干花).mp3";
    audio.load();
    recordImg.classList.remove('rotate-play');
    audio.ondurationchange = function(){
      musicTitle.innerText = musicData[0][0];
      author.innerText = musicData[0][1];
      recordImg.style.backgroundImage = "url('img/dry flower.jpg')";
      body.style.backgroundImage = "url('img/dry flower.jpg')";
      audioTime.innerText = transTime(audio.duration);
      // 重置进度条
      audio.currentTime = 0;
      updateProgress();
      refreshRotate();
    }
}
initMusic();

// 初始化并播放
function initAndPlay() {
    initMusic();
    pause.classList.remove('icon-play');
    pause.classList.add('icon-pause');
    audio.play();
    rotateRecord();
}

// 播放模式设置
var modeId = 1;
mode.addEventListener('click', function (event) {
    modeId = modeId + 1;
    if (modeId > 3) {
        modeId = 1;
    }
    	var winWide = window.screen.width;  //获取当前屏幕分辨率
	
	if(winWide <= 765){  
	mode.style.backgroundImage = "url('img/mode" + modeId.toString() + "2.png";
	}
	else{  
	mode.style.backgroundImage = "url('img/mode" + modeId.toString() + ".png";
	}
    
});

audio.onended = function () {
  if (modeId == 2) {
    // 跳转至下一首歌
    musicId = (musicId + 1);//gai
  } else if (modeId == 3) {
    // 随机生成下一首歌的序号
    var oldId = musicId;
    while (true) {
      musicId = Math.floor(Math.random() * 3) + 0;
      if (musicId != oldId) {
        break;
      }
    }
  }
  initAndPlay();
};

// 上一首(gai)
skipForward.addEventListener('click', function (event) {
    musicId = musicId - 1;
    if (musicId < 0) {
        musicId = 4;
    }
    initAndPlay();
});

// 下一首(gai)
skipBackward.addEventListener('click', function (event) {
    musicId = musicId + 1;
    if (musicId > 4) {
        musicId = 0;
    }
    initAndPlay();
});


// 倍速功能（这里直接暴力解决了）
speed.addEventListener('click', function (event) {
    var speedText = speed.innerText;
    if (speedText == "1.0X") {
        speed.innerText = "1.5X";
        audio.playbackRate = 1.5;
    }
    else if (speedText == "1.5X") {
        speed.innerText = "2.0X";
        audio.playbackRate = 2.0;
    }
    else if (speedText == "2.0X") {
        speed.innerText = "0.5X";
        audio.playbackRate = 0.5;
    }
    else if (speedText == "0.5X") {
        speed.innerText = "1.0X";
        audio.playbackRate = 1.0;
    }
});

// 刷新唱片旋转角度
function refreshRotate() {
    recordImg.classList.add('rotate-play');
}

// 使唱片旋转
function rotateRecord() {
    recordImg.style.animationPlayState = "running"
}

// 停止唱片旋转
function rotateRecordStop() {
    recordImg.style.animationPlayState = "paused"
}


// 滑块调节音量
audio.addEventListener('timeupdate', updateVolumn);
function updateVolumn() {
    audio.volume = volumeTogger.value / 70;
}

// 点击音量调节设置静音
let count = 0;
// let count2 = 0;
volume.addEventListener('click', setNoVolumn);
function setNoVolumn() {
    count++;
    // count2++;
    if(count === 1){
      volumeTogger.style.display = 'block';
    }else if(count == 2){ volumeTogger.style.display = "none";count = 0}
    // if(count2 == 2){
    // if (volumeTogger.value == 0) {
    //     if (lastVolumn == 0) {
    //         lastVolumn = 70;
    //     }
    //     volumeTogger.value = lastVolumn;
    //     volume.style.backgroundImage = "url('img/音量.png')";
    // }
    // else {
    //     lastVolumn = volumeTogger.value;
    //     volumeTogger.value = 0;
    //     volume.style.backgroundImage = "url('img/静音.png')";
    // }}
}

//列表播放
// 暴力捆绑列表音乐
document.getElementById("music0").addEventListener('click', function (event) {
    musicId = 0;
    initAndPlay();
});

//点击唱片跟换歌词
var audio_cover = document.getElementsByClassName("record-container")[0];
var container = document.getElementsByClassName("container")[0];
function change() {
  var winWide = window.screen.width;
  	if (winWide <= 765) {
       if (audio_cover.classList.contains("hidden")) {
         container.classList.add("hidden");
         audio_cover.classList.remove("hidden");
       } else {
         container.classList.remove("hidden");
         audio_cover.classList.add("hidden");
       }
    }

}
//滚动歌词
var lrc = `[00:14]多分（たぶん）、私（わたし）じゃなくていいね
[00:17]余裕（よゆう）のない二人（ふたり）だったし
[00:20]気付（きづ）けば喧嘩（けんか）ばっかりしてさ
[00:23]ごめんね
[00:26]ずっと話（はなし）そうと思（おも）ってた
[00:29]きっと私（わたし）たち合（あ）わないね
[00:32]二人（ふたり）きりしかいない部屋（へや）でさ
[00:35]貴方（あなた）ばかり話（はなし）していたよね
[00:39]もしいつか何処（どこ）かで会（あ）えたら
[00:45]今日（きょう）の事（こと）を笑（わら）ってくれるかな
[00:51]理由（りゆう）もちゃんと話（はな）せないけれど
[00:58]貴方（あなた）が眠（ねむ）った後（あと）に泣（な）くのは嫌（いや）
[01:04]声（こえ）も顔（かお）も不器用（ぶきよう）なとこも
[01:11]全部（ぜんぶ）全部（ぜんぶ）　嫌（きら）いじゃないの
[01:17]ドライフラワーみたい
[01:21]君（きみ）との日々（ひび）もきっときっときっときっと
[01:29]色褪（いろあ）せる
[01:48]多分（たぶん）、君（きみ）じゃなくてよかった
[01:51]もう泣（な）かされることもないし
[01:54]「私（わたし）ばかり」なんて言葉（ことば）も
[01:57]なくなった
[02:00]あんなに悲（かな）しい別（わか）れでも
[02:03]時間（じかん）がたてば忘（わす）れてく
[02:06]新（あたら）しい人（ひと）と並（なら）ぶ君（きみ）は
[02:09]ちゃんとうまくやれているのかな
[02:13]もう顔（かお）も見（み）たくないからさ
[02:19]変（へん）に連絡（れんらく）してこないでほしい
[02:25]都合（つごう）がいいのは変（か）わってないんだね
[02:32]でも無視（むし）できずにまた少（すこ）し返事（へんじ）
[02:38]声（こえ）も顔（かお）も不器用（ぶきよう）なとこも
[02:45]多分（たぶん）今（いま）も　嫌（きら）いじゃないの
[02:51]ドライフラワーみたく
[02:56]時間（じかん）が経（た）てば
[02:58]きっときっときっときっと色褪（いろあ）せる
[03:19]月（つき）灯（あか）りに魔物（まもの）が揺（ゆ）れる
[03:22]きっと私（わたし）もどうかしてる
[03:25]暗闇（くらやみ）に色彩（しきさい）が浮（う）かぶ
[03:31]赤（あか）黄（き）藍（あい）色（いろ）が胸（むね）の奥（おく）
[03:35]ずっと貴方（あなた）の名前（なまえ）を呼（よ）ぶ
[03:38]好（す）きという気持（きも）ち
[03:39]また香（かお）る
[03:43]声（こえ）も顔（かお）も不器用（ぶきよう）なとこも
[03:50]全部（ぜんぶ）全部（ぜんぶ）　大嫌いだよ
[03:56]まだ枯れない花を
[04:00]君に添えてさ
[04:03]ずっとずっとずっとずっと
[04:08]抱えてよ`;
var lrc2 = `[00:14]大概不是我也没问题的吧
[00:17]两人在一起已没有一丝从容
[00:20]回过神来我们仅剩下了吵闹
[00:23]对不起啊
[00:26]一直想和你好好谈谈
[00:29]这一定是我们不合拍罢了
[00:32]待在仅有我们两人的房间里
[00:35]只有你一直在自说自话
[00:39]如果未来某天在某地再次相遇的话
[00:45]对于今天的事情会一笑了之吗
[00:51]还没能说明白自己的理由
[00:58]但也不想在你熟睡后独自哭泣
[01:04]声音也好 面容也好 笨拙的地方也好
[01:11]全部 全部 我并不感到讨厌
[01:17]像是干花一般
[01:21]和你度过的日子 一定 一定 一定 一定
[01:29]已经褪色了
[01:48]大概不是你就好了吧
[01:51]已经连让人潸然泪下的事都荡然无存了
[01:54]「只有我」这样的话也
[01:57]早已消失了
[02:00]尽管那样地悲伤道别
[02:03]时光流逝，这些终将忘却
[02:06]在你遇到新欢之时
[02:09]会好好地做到让ta喜欢吗
[02:13]已经不想再见到你了
[02:19]希望你也别和我有什么反常的联络了
[02:25]尽管依旧方便与你联系
[02:32]但还做不到无视 还会稍微回复你的信息
[02:38]声音也好 面容也好 笨拙的地方也好
[02:45]大概到了现在 我也并不会讨厌吧
[02:51]像是干花一般
[02:56]时间悄然流逝 
[02:58]一定 一定 一定 一定已经褪色了吧
[03:19]明月高照，魔物的身影摇晃
[03:22]一定是我也有了些许异样吧
[03:25]一片黑暗中 各种色彩在眼前浮现
[03:31]红、黄、靛青三色混杂于心中
[03:35]我依旧呼唤着你的名字
[03:38]喜欢你的感情
[03:39]仍然散发芳香
[03:43]声音也好 面容也好 笨拙的地方也好
[03:50]全部全部 我都最讨厌了
[03:56]将这一朵还未枯萎的花
[04:00]伴于你左右
[04:03]一直 一直 一直 一直
[04:08]抱在怀中`;

// 最开始获取到的歌词列表是字符串类型（不好操作）
let lrcArr = lrc.split("\n");
let lrcArr2 = lrc2.split("\n");
// 接收修正后的歌词数组
let result = [];
let result2 = [];
// 获取所要用到的dom列表
const doms = {
  audio: document.querySelector("audio"),
  ul: document.querySelector("ul"),
  container: document.querySelector(".container"),
};

// 将歌词数组转成由对象组成的数组，对象有time和word两个属性（为了方便操作）
for (let i = 0; i < lrcArr.length; i++) {
   if (lrcArr[i] && lrcArr2[i]) { // 确保元素存在
    var lrcData = lrcArr[i].split("]");
    var lrcData2 = lrcArr2[i].split("]");
    if (lrcData.length > 1 && lrcData2.length > 1) { // 确保split后的结果有效
      var lrcTime = lrcData[0].substring(1);
      var lrcTime2 = lrcData2[0].substring(1);
      var obj = {
        time: parseTime(lrcTime),
        word: lrcData[1],
      };
      var obj2 = {
        time: parseTime(lrcTime2),
        word: lrcData2[1],
      };
      result.push(obj);
      result2.push(obj2);
    }
  }
}

// 将tiem转换为秒的形式
function parseTime(lrcTime) {
  if (lrcTime) {
    let lrcTimeArr = lrcTime.split(":");
    if (lrcTimeArr.length >= 2) {
      // 确保时间格式正确
      let seconds =
        +lrcTimeArr[0] * 60 + parseFloat(lrcTimeArr[1].split(".")[0]);
      return seconds;
    }
  }
  return 0; // 如果时间格式不正确，返回0
}
// 获取当前播放到的歌词的下标
function getIndex() {
  let Time = doms.audio.currentTime;
  for (let i = 0; i < result.length; i++) {
    if (result[i].time > Time) {
      return i - 1;
    }
  }
}
// 创建歌词列表
function createElements() {
  let frag = document.createDocumentFragment(); // 文档片段
  for (let i = 0; i < result.length; i++) {
    let liOriginal = document.createElement("li");
    liOriginal.classList.add("original");
    liOriginal.innerText = result[i].word;
    frag.appendChild(liOriginal);

    let liTranslation = document.createElement("li");
    liTranslation.classList.add("translation");
    liTranslation.innerText = result2[i].word;
    frag.appendChild(liTranslation);
  }
  doms.ul.innerHTML = "";
  doms.ul.appendChild(frag);
  doms.ul.style.transform = `translateY(0)`; // 重置滚动位置
}

createElements();
// 获取显示窗口的可视高度
let containerHeight = doms.container.clientHeight;
// 获取歌词列表的可视高度
let liHeight =
  doms.ul.children[0].clientHeight +
  parseFloat(
    getComputedStyle(document.querySelector(".translation")).marginBottom
  );
// 设置最大最小偏移量，防止显示效果不佳
let minOffset = 0;
let maxOffset = doms.ul.clientHeight - containerHeight;
// 控制歌词滚动移动的函数
function setOffset() {
  requestAnimationFrame(() => {
    let index = getIndex();
    let targetLi = doms.ul.children[index * 2];
    if (targetLi) {
      let offset = targetLi.offsetTop - containerHeight / 2 + liHeight / 2;
      if (offset < minOffset) offset = minOffset;
      if (offset > maxOffset) offset = maxOffset;
      doms.ul.style.transform = `translateY(-${offset}px)`;

      // 移除之前的active类
      let activeLiOriginal = doms.ul.querySelector(".original.active");
      let activeLiTranslation = doms.ul.querySelector(".translation.active");
      if (activeLiOriginal) activeLiOriginal.classList.remove("active");
      if (activeLiTranslation) activeLiTranslation.classList.remove("active");

      // 添加新的active类
      targetLi.classList.add("active");
      targetLi.nextElementSibling.classList.add("active");
    }
  });
}
// 当audio的播放时间更新时，触发该事件
doms.audio.addEventListener("timeupdate", setOffset);
// alert("电脑端保持窗口宽度为1000px以上观感最佳")
//滚动时滑块出现
// 获取滚动元素
const scrollableList = document.getElementById('scrollable-list');

// 设置定时器
let timeout = null;

// 滚动时显示滚动条
scrollableList.addEventListener('scroll', () => {
    // 清除之前的定时器
    if (timeout) {
        clearTimeout(timeout);
    }
    
    // 显示滚动条
    scrollableList.classList.add('show-scrollbar');
    
    // 设置定时器，在200ms后隐藏滚动条
    timeout = setTimeout(() => {
        scrollableList.classList.remove('show-scrollbar');
    }, 200);
});

// 鼠标离开时隐藏滚动条
scrollableList.addEventListener('mouseleave', () => {
    if (timeout) {
        clearTimeout(timeout);
    }
    scrollableList.classList.remove('show-scrollbar');
});