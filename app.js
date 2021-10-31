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
          ap: 20,
          critical: 0,
        },
        {
          name: "zuka",
          avt: "./imgs/zuka.jpg",
          img: "./imgs/sk.png",
          dame: 12,
          armor: 10,
          ap: 0,
          critical: 0,
        },
        {
          name: "skud",
          avt: "./imgs/skud.jpg",
          img: "./imgs/sk.png",
          dame: 8,
          armor: 20,
          ap: 0,
          critical: 0,
        },
        {
          name: "wish",
          avt: "./imgs/wi.jpg",
          img: "./imgs/wish.png",
          dame: 10,
          armor: 5,
          ap: 0,
          critical: 20,
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
          title: "+ 20 SMPT",
          dame: 0,
          ap: 20,
          armor: 0,
          critical: 0,
        },
        {
          img: "./imgs/khien.png",
          name: "khiên huyền thoai",
          title: "+ 15% giảm ST",
          dame: 0,
          ap: 0,
          armor: 15,
          critical: 0,
        },
        {
          img: "./imgs/thanhkiem.png",
          name: "thánh kiếm",
          title: "+ 8 ST và 15% chí mạng",
          dame: 8,
          ap: 0,
          armor: 0,
          critical: 15,
        },
        {
          img: "./imgs/kiem.png",
          name: "kiếm fenrir",
          title: "+ 10 sát thương",
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
      isCritical : false,

      currentLevel: 1,
      lv6: false,
      audio: false,
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
      let interval = setInterval(() => {
        this.countDown -= 1;
      }, 1500);
      this.starting = true;
      setTimeout(() => {
        clearInterval(interval);
        this.isCountDown = false;
        this.countDown = 2;
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
      }
    },
    backHome() {
      this.chooseChamp = true;
      this.isLose = false;
    },
    thanosAttack() {
      let randomDame = Math.round(7 * this.currentLevel + Math.random() * (10 + this.currentLevel*2))
      let dameThanos = randomDame - Math.round(randomDame/100*this.champ.armor)
      let audio = new Audio("./sounds/thanos.mp3");
      audio.volume = 0.1;
      if (this.currentLevel === 6) {
        dameThanos = 99;
        audio.volume = 1;
        setTimeout(() => {
          audio = new Audio("./sounds/sad.mp3");
          audio.play();
          this.lv6 = true;
        }, 1000);
      }
      this.champHeart -= dameThanos;
      audio.play();
      this.isThanosAttack = true;
      if (this.champHeart < 1) {
        this.champHeart = 0;
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
        let randomDame = this.champ.dame + Math.random() * 10
        let dame = randomDame - (10*this.currentLevel*randomDame/100);
        this.attacking = true;
        this.isThanosAttack = false;
        let audio = new Audio("./sounds/champ.mp3");
        audio.volume = 0.1;
        setTimeout(() => {
          this.attacking = false;
          if( Math.random() < this.champ.critical/100)
        {
          this.isCritical = true
            dame *= 1.5
            
        }
          this.thanosHeart -= Math.round(dame);
          this.coin += Math.round(dame);
          audio.play();
          if (this.thanosHeart < 1) {
            this.thanosHeart = 0;
            this.result(false);
          } else {
            this.heartThanosLoss = Math.round(dame);
            setTimeout(() => {
              this.heartThanosLoss = 0;
            }, 600);
            setTimeout(() => {
              this.isCritical = false
              this.thanosAttack();
            }, 1500);
          }
        }, 1000);
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
    audio() {
      let audio = new Audio("./sounds/bg.mp3");
      audio.play();
      audio.volume = 0.1;
      audio.loop = true;
    },
  },
}).mount("#app");
