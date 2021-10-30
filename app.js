/** @format */

const app = Vue.createApp({
  data() {
    return {
      champs: [
        {
          name: "krixi",
          avt: "./imgs/krixi.jpg",
          dame: 5,
          armor: 10,
          id: 0,
        },
        {
          name: "zuka",
          avt: "./imgs/zuka.jpg",
          dame: 10,
          armor: 5,
          id: 1,
        },
        {
          name: "skud",
          avt: "./imgs/skud.jpg",
          dame: 9,
          armor: 6,
          id: 2,
        },
      ],
      chooseChamp: true,
      starting: false,
      champ: "",
      avt: "",
      isLose: false,
      countDown: 3,
      isCountDown: false,
      champHeart: 100,
      thanosHeart: 100,
      heartThanosLoss: 0,
      heartChampLoss: 0,
      attacking: false,
      isThanosAttack: false,
      end: false,
      isRun: false,
      waitAttack: false,
      levels: [1, 2, 3, 4, 5, 6],
      currentLevel: 1,
      score: {
        champ: 0,
        thanos: 0,
      },
      audio : false,
      lv6 : false
    };
  },
  methods: {
    moveToStart(champ) {
      this.chooseChamp = false;
      this.name = champ.name;
      this.avt = champ.avt;
      this.champ = champ.id;
      this.isThanosAttack = false;
      this.champHeart = 100;
      this.thanosHeart = 100;
      this.end = false;
      this.audio = true
      this.lv6 = false
      this.starting = false
      if(this.currentLevel === 6) {
          this.currentLevel = 1
      }
    },
    start() {
      this.isCountDown = true;
      this.champHeart = 100;
      this.thanosHeart = 100;
      this.waitAttack = false;
      this.isThanosAttack = false;
      this.end = false;
      let interval = setInterval(() => {
        this.countDown -= 1;
      }, 1500);
      this.starting = true;
      setTimeout(() => {
        clearInterval(interval);
        this.isCountDown = false;
        this.countDown = 3;
        if(this.currentLevel === 6) this.thanosAttack()
      }, 5900);
    },
    result(checkLose, checkRun = false) {
        if(this.currentLevel === 6) return
      else {
        this.isLose = checkLose;
        this.starting = false;
        if (checkLose) {
          this.champHeart = 0;
          this.score.thanos += 1;
        } else {
          this.currentLevel += 1;
          this.score.champ += 1;
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
      let dameThanos = Math.round(6 * this.currentLevel + Math.random() * 12);
      let audio = new Audio('./sounds/thanos.mp3')
      audio.volume = 0.1;
      if (this.currentLevel === 6) {
          dameThanos = 99;
          audio.volume = 1;
          setTimeout(() => {
              audio = new Audio('./sounds/sad.mp3')
              audio.play()
              this.lv6 = true
          },2000)
      }
      this.champHeart -= dameThanos;
        audio.play()
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
        let dame = Math.round(this.champs[this.champ].dame + Math.random() * 10);
        this.attacking = true;
        this.isThanosAttack = false;
        let audio = new Audio("./sounds/champ.mp3");
        audio.volume = 0.1;
        setTimeout(() => {
          this.attacking = false;
          this.thanosHeart -= dame;
          audio.play();
          if (this.thanosHeart < 1) {
            this.thanosHeart = 0;
            this.result(false);
          } else {
            this.heartThanosLoss = dame;
            setTimeout(() => {
              this.heartThanosLoss = 0;
            }, 600);
            setTimeout(() => {
              this.thanosAttack();
            }, 1500);
          }
        }, 1000);
      }
    },
  },
  watch: {
    countDown() {
      if (this.countDown == 0) {
        this.countDown = "start";
      }
    },
    audio() {
        let audio = new Audio("./sounds/bg.mp3");
        audio.play()
        audio.volume = 0.1
        audio.loop = true
    }
  },
}).mount("#app");
