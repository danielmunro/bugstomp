import Settings from './settings/Settings';
import EasySettings from "./settings/EasySettings";
import NormalSettings from "./settings/NormalSettings";
import HardSettings from "./settings/HardSettings";

let chosenDifficulty = 'normal';

function getSettings() : Settings {
  switch (chosenDifficulty) {
    case 'easy': return EasySettings;
    case 'normal': return NormalSettings;
    case 'hard': return HardSettings;
  }
}

function setDifficulty(difficulty: string) {
  chosenDifficulty = difficulty;
}

export {
  chosenDifficulty,
  setDifficulty,
  getSettings,
};
