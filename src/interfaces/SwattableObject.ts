import Swatter from "../objects/Swatter";

export default interface SwattableObject {
  swat(): void;
  isUnderneath(swatter: Swatter): boolean;
  x: number;
  y: number;
  active: boolean;
}
