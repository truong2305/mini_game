/** @format */

const app = Vue.createApp({
  data() {
    return {
      champs: [
        {
          name: "krixi",
          avt: "./imgs/krixi.jpg",
          img: "./imgs/kribg.png",
          dame: 6,
          armor: 5,
          ap: 15,
          critical: 0,
          skill: {
            name: "Mưa sao băng",
            title: "Mưa sao băng: Gây 4 đợt sát thương liên tiếp bằng phép thuật",
            active: "mưa sao băng",
          },
        },
        {
          name: "zuka",
          avt: "./imgs/zuka.jpg",
          img: "./imgs/zk.png",
          dame: 10,
          armor: 10,
          ap: 0,
          critical: 0,
          skill: {
            name: "Trầm trọng lực",
            title: "Trầm trọng lực: Gây 2 lần sát thương, lần 2 yếu hơn",
            active: "trầm trọng lực",
          },
        },
        {
          name: "skud",
          avt: "./imgs/skud.jpg",
          img: "./imgs/sk.png",
          dame: 8,
          armor: 15,
          ap: 0,
          critical: 0,
          skill: {
            name: "Găng hung thần",
            title: "Găng hung thần: miễn thương 100%",
            active: "miễn thương",
          },
        },
        {
          name: "wish",
          avt: "./imgs/wi.jpg",
          img: "./imgs/wish.png",
          dame: 8,
          armor: 5,
          ap: 0,
          critical: 10,
          skill: {
            name: "Pháo cao xạ",
            title: "Pháo cao xạ: 100% chí mạng + 50% hút máu",
            active: "pháo cao xạ",
          },
        },
      ],
      levels: [1, 2, 3, 4, 5, 6],
      score: {
        champ: 0,
        thanos: 0,
      },
      items: [
        {
          img: "./imgs/sach.png",
          name: "sách thánh",
          title: "+ 15 SMPT",
          dame: 0,
          ap: 15,
          armor: 0,
          critical: 0,
        },
        {
          img: "./imgs/khien.png",
          name: "khiên huyền thoai",
          title: "+ 18% giảm ST",
          dame: 0,
          ap: 0,
          armor: 18,
          critical: 0,
        },
        {
          img: "./imgs/thanhkiem.png",
          name: "thánh kiếm",
          title: "+ 5 ST và 12% chí mạng",
          dame: 6,
          ap: 0,
          armor: 0,
          critical: 12,
        },
        {
          img: "./imgs/kiem.png",
          name: "kiếm fenrir",
          title: "+ 10 ST",
          dame: 10,
          ap: 0,
          armor: 0,
          critical: 0,
        },
      ],
      set: [],
      champ: {},

      champHeart: 100,
      thanosHeart: 100,
      heartThanosLoss: 0,
      heartChampLoss: 0,
      coin: 0,

      chooseChamp: true,
      starting: false,
      isLose: false,
      countDown: 3,
      isCountDown: false,
      end: false,
      isRun: false,

      attacking: false,
      isThanosAttack: false,
      waitAttack: false,
      isCritical: false,

      currentLevel: 1,
      lv6: false,
      audio: false,
      useSkill: false,
      countTimeSkill: 3,
      skillOfChamp: "",
      skillActive: 1,
      skilling: false,
    };
  },
  methods: {
    reset() {
      this.champHeart = 100;
      this.thanosHeart = 100;
      this.end = false;
      this.isThanosAttack = false;
    },
    moveToStart(champ) {
      this.reset();
      this.chooseChamp = false;
      this.champ = champ;
      this.audio = true;
      this.lv6 = false;
      this.starting = false;
      if (this.currentLevel === 6) {
        this.currentLevel = 1;
      }
    },
    start() {
      this.reset();
      this.isCountDown = true;
      this.waitAttack = false;
      this.countTimeSkill = 3;
      this.skillActive = 1;
      let interval = setInterval(() => {
        this.countDown -= 1;
      }, 1500);
      this.starting = true;
      setTimeout(() => {
        clearInterval(interval);
        this.isCountDown = false;
        this.countDown = 3;
        if (this.currentLevel === 6) this.thanosAttack();
      }, 3900);
    },
    result(checkLose, checkRun = false) {
      if (this.currentLevel === 6) return;
      else {
        this.isLose = checkLose;
        this.starting = false;
        if (checkLose) {
          this.champHeart = 0;
          ++this.score.thanos;
        } else {
          ++this.currentLevel;
          ++this.score.champ;
        }
        this.end = true;
        this.isRun = checkRun;
        if (checkRun) {
          let audio = new Audio("./sounds/thanos.mp3");
          audio.volume = 0.1;
          this.isThanosAttack = true;
          audio.play();
        }
      }
    },
    backHome() {
      this.chooseChamp = true;
      this.isLose = false;
    },
    thanosAttack() {
      let randomDame = Math.round(7 * this.currentLevel + Math.random() * (10 + this.currentLevel * 2));
      let dameThanos = randomDame - Math.round((randomDame / 100) * this.champ.armor);
      let audio = new Audio("./sounds/thanos.mp3");
      audio.volume = 0.1;
      if (this.currentLevel === 6) {
        dameThanos = 99;
        audio.volume = 1;
        setTimeout(() => {
          audio = new Audio("./sounds/sad.mp3");
          audio.play();
          this.lv6 = true;
        }, 2000);
      }
      this.champHeart -= dameThanos;
      audio.play();
      this.isThanosAttack = true;

      if (this.champHeart < 1) {
        this.champHeart = 0;
        let loseAudio = new Audio("./sounds/lose.mp3");
        loseAudio.volume = 0.2;
        loseAudio.play();
        this.result(true);
      } else {
        this.heartChampLoss = dameThanos;
        setTimeout(() => {
          this.heartChampLoss = 0;
          this.waitAttack = false;
        }, 600);
      }
    },
    champAttack() {
      if (this.waitAttack || this.currentLevel === 6) return;
      else {
        this.waitAttack = true;
        let randomDame = this.champ.dame + Math.random() * 10;
        let dame = Math.round(randomDame - (13 * this.currentLevel * randomDame) / 100);
        this.attacking = true;
        this.isThanosAttack = false;
        let audio = new Audio("./sounds/champ.mp3");
        audio.volume = 0.1;
        if (this.skillOfChamp.name !== "" && this.useSkill === true) {
          this.skilling = true;
          if (this.skillOfChamp.name == "skud") {
            setTimeout(() => {
              this.skilling = false;
            }, 4000);
          } else {
            setTimeout(() => {
              this.skilling = false;
            }, 2000);
          }
        }
        setTimeout(() => {
          this.attacking = false;
          if (this.skillOfChamp.name === "wish") {
            let critical = 100 - this.champ.critical;
            this.champ.critical += critical;
            this.champHeart += dame;
            if (this.champHeart > 100) this.champHeart = 100;
            setTimeout(() => {
              this.champ.critical -= critical;
            }, 2000);
          }
          if (Math.random() < this.champ.critical / 100) {
            this.isCritical = true;
            dame *= 2;
          }
          if (this.skillOfChamp.name === "zuka") {
            this.thanosHeart -= Math.round(dame / 1.3);
            this.coin += Math.round(dame / 1.3);
          }
          if (this.skillOfChamp.name === "skud") {
            let armor = 100 - this.champ.armor;
            this.champ.armor += armor;
            setTimeout(() => {
              this.champ.armor -= armor;
            }, 2000);
          }
          if (this.skillOfChamp.name === "krixi") {
            let dameAp = this.champ.ap / 1.2;
            dame += 3 * Math.round(dameAp - (this.currentLevel * 11 * dameAp) / 100);
          }

          this.thanosHeart -= dame;
          this.coin += dame;
          audio.play();
          if (this.thanosHeart < 1) {
            let winAudio = new Audio("./sounds/win.mp3");
            winAudio.volume = 0.2;
            winAudio.play();
            this.isCritical = false;
            this.thanosHeart = 0;
            this.result(false);
          } else {
            this.heartThanosLoss = dame;
            setTimeout(() => {
              this.heartThanosLoss = 0;
            }, 600);
            setTimeout(() => {
              this.isCritical = false;
              this.thanosAttack();
            }, 1500);
          }
        }, 1000);
      }
    },
    skill(champ) {
      if (this.countTimeSkill === 3 && this.useSkill === false && this.currentLevel !== 6) {
        let interval = setInterval(() => {
          this.countTimeSkill -= 1;
        }, 1000);
        this.skillActive = 0;
        this.skillOfChamp = champ;
        this.useSkill = true;
        setTimeout(() => {
          clearInterval(interval);
          this.useSkill = false;
          setTimeout(() => {
            this.skillOfChamp = "";
          }, 1000);
        }, 2900);
      }
    },
    buyItem(item) {
      if (this.set.length < 4 && this.coin > 99) {
        this.set.push(item);
        this.coin -= 100;
        this.champ.dame += item.dame;
        this.champ.armor += item.armor;
        this.champ.ap += item.ap;
        this.champ.critical += item.critical;
      }
    },
    removeItem(index) {
      this.coin += 100;
      this.champ.dame -= this.set[index].dame;
      this.champ.armor -= this.set[index].armor;
      this.champ.ap -= this.set[index].ap;
      this.champ.critical -= this.set[index].critical;
      this.set.splice(index, 1);
    },
  },
  watch: {
    champ(current, pre) {
      let coin = 0;
      this.set.forEach((value) => {
        coin += 100;
        if (pre.dame) {
          pre.dame -= value.dame;
          pre.ap -= value.ap;
          pre.critical -= value.critical;
          pre.armor -= value.armor;
        }
      });
      this.coin += coin;
      this.set = [];
    },
    audio() {
      let audio = new Audio("./sounds/bg.mp3");
      audio.play();
      audio.volume = 0.1;
      audio.loop = true;
    },
  },
}).mount("#app");
