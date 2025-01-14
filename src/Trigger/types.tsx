export interface MatchTypeProps {
  triggerChecked: boolean;
  labelKey: string;
  triggerValues: object;
  onChange?: Function;
  key?: string;
  disabled?: boolean;
}

export interface MatchTypeValuesProps {
  triggerTypeChecked: boolean;
  matchRuleList: Array<any>;
  triggerType: string;
  onChange?: Function;
  disabled?: boolean;
}

export interface TriggerTypeProps {
  labelKey: string;
  value?: object | any;
  onChange: Function;
  setValue: Function;
  key?: string;
  disabled?: boolean;
}

export interface TriggersProps {
  value?: object;
  onChange: Function;
  mode?: string;
  disabled?: boolean;
}

export interface StrictModeProps {
  triggerValues: object;
  value?: object | any;
  onChange: Function;
  disabled?: boolean;
}
