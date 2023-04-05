import BattleScene from "./scenes/BattleScene";
import {getSettings} from "./userConfig";

export default class Tempo {
  private phase = 0;
  private intervals: Array<NodeJS.Timer> = [];
  private megaWaveIntensity = 0;

  constructor(private scene: BattleScene) {}

  pulse(time: number) {
    if (this.phase === 0) {
      this.phase = 1;
      this.phase1();
    // } else if (time > 60 && this.phase === 1) {
    //   this.endPhase();
    //   this.phase = 2;
    //   this.phase2();
    // } else if (time > 120 && this.phase === 2) {
    //   this.endPhase();
    //   this.phase = 3;
    //   this.phase3();
    }
  }

  endPhase() {
    this.intervals.forEach((interval) => clearInterval(interval));
  }

  private phase1() {
    const settings = getSettings();
    this.megaWaveIntensity = 0;
    this.intervals.push(setInterval(() => this.scene.sendWave(), settings.sendSmallWave));
    this.intervals.push(setInterval(() => {
      this.scene.sendMegaWave(this.megaWaveIntensity);
      this.megaWaveIntensity++;
    }, settings.sendMegaWave));
    this.intervals.push(setInterval(() => this.scene.create1Up(), 16000));
    this.intervals.push(setInterval(() => this.scene.createPowerUp(), 10000));
    this.intervals.push(setInterval(() => this.scene.createBomb(), 18000));
    this.intervals.push(setInterval(() => this.scene.createFly(), 1000));
    setTimeout(
      () => this.intervals.push(setInterval(() => this.scene.createHornet(), 4000)),
      settings.hornetAppear,
    );
    setTimeout(
      () => this.intervals.push(setInterval(() => this.scene.createDragonfly(), 6000)),
      settings.dragonflyAppear,
    );
    setTimeout(
      () => this.intervals.push(setInterval(() => this.scene.createBeetle(), 7000)),
      settings.beetleAppear,
    );
  }

  private phase2() {
    this.intervals.push(setInterval(() => this.scene.createHornet(), 3000));
    this.intervals.push(setInterval(() => this.scene.createBeetle(), 4000));
    setTimeout(() => {
      const amount = Phaser.Math.Between(3, 10);
      for (let i = 0; i < amount; i ++) {
        this.scene.createFly();
      }
    }, 5000);
    this.intervals.push(setInterval(() => this.scene.sendMegaWave(3), 7500));
    this.intervals.push(setInterval(() => this.scene.sendWave(), 6000));
    this.intervals.push(setInterval(() => this.scene.createBomb(), 12000));
  }

  private phase3() {
    this.scene.createQueen();
  }
}
