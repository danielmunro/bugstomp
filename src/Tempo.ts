import BattleScene from "./scenes/BattleScene";
import {getSettings} from "./userConfig";

export default class Tempo {
  private phase = 0;
  private intervals: Array<NodeJS.Timer> = [];
  private megaWaveIntensity = 0;

  constructor(private scene: BattleScene) {}

  pulse(time: number) {
    if (time > 60) {
      this.endPhase();
    }
    if (this.phase === 0) {
      this.phase = 1;
      this.phase1();
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
      () => this.intervals.push(setInterval(() => this.scene.createBeetle(), 5000)),
      settings.beetleAppear,
    );
  }
}
