export default interface UpdateableObject {
  updateObject(): void;
}

export function instanceOfUpdateableObject(obj: any): boolean {
  return 'updateObject' in obj;
}
