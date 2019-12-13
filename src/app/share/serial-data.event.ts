export interface SerialDataEvent {
  name: string;
}

export interface StimulatorStateEvent extends SerialDataEvent {
  state: number;
  timestamp: number;
}

export interface IOEvent extends SerialDataEvent {
  ioType: 'input' | 'output';
  state: 'on' | 'off';
  index: number;
  timestamp: number;
}