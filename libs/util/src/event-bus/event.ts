export interface IEvent<T extends object, K extends keyof T = keyof T> {
  type: K;
  payload: T[K];
}
export interface Event<T extends object, K extends keyof T = keyof T> {
  type: K;
  payload: T[K];
}
