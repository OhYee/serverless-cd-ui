import React, { useEffect, useState } from 'react';
import { StrictModeProps } from './types';
import { map, get, noop, isEmpty, keys, uniqueId } from 'lodash';
import { Radio, Input } from '@alicloud/console-components';
import {
  TriggerTypes,
  TriggerTypeCheckedLabel,
  TriggerType,
  MatchTypeCheckedLabel,
  MatchTypes,
  MatchType,
  branchValuePlaceholder,
} from './constants';
import './index.less';

const RadioGroup = Radio.Group;

const StrictMatch = (props) => {
  const [initRadioValue, setInitRadio] = useState(MatchType.BRANCHES);
  const { triggerChecked, labelKey, matchValues, onChange = noop } = props;
  const [matchRuleList, setMatchRuleList] = useState([]);

  useEffect(() => {
    const triggerTypes = keys(matchValues);
    if (!isEmpty(keys(matchValues))) {
      setInitRadio(triggerTypes[0]);
    } else {
      setInitRadio(MatchType.BRANCHES);
    }
    formtMatchValues(matchValues[initRadioValue]);
  }, [matchValues]);

  const formtMatchValues = (values) => {
    if (!isEmpty(values)) {
      const MatchRuleTypes = keys(values);
      const MatchRuleValues = [];
      map(MatchRuleTypes, (type) => {
        const branchValues = isEmpty(values[type])
          ? [{ type, value: '', id: uniqueId() }]
          : map(values[type], (value) => ({ type, value, id: uniqueId() }));
        MatchRuleValues.push(...branchValues);
      });
      setMatchRuleList(MatchRuleValues);
    } else {
      setMatchRuleList([]);
    }
  };

  const matchChange = (matchType) => {
    const matchTypeValueKey = matchType === MatchType.BRANCHES ? 'precise' : 'prefix';
    setInitRadio(matchType);
    onChange({ [matchType]: { [matchTypeValueKey]: [] } });
  };

  const onBranchValueChange = (value, id, matchLabelKey) => {
    const changeValues = map(matchRuleList, (item) => {
      item.value = item.id === id ? value : item.value;
      return item;
    });
    if (!isEmpty(changeValues)) {
      const formaValues = {};
      map(changeValues, (item) => {
        if (isEmpty(formaValues[item.type])) formaValues[item.type] = [];
        item.value && formaValues[item.type].push(item.value);
      });
      onChange(formaValues);
    }
    setMatchRuleList(changeValues);
  };

  return (
    <RadioGroup
      value={initRadioValue}
      onChange={matchChange}
      style={{ display: triggerChecked ? 'block' : 'none' }}
    >
      {map(MatchTypes, (matchLabelKey) => (
        <div
          style={{ margin: '16px 0 16px 26px', display: 'flex', height: 32, alignItems: 'center' }}
        >
          <Radio value={matchLabelKey}>{MatchTypeCheckedLabel[matchLabelKey]}</Radio>
          {initRadioValue === matchLabelKey && (
            <div style={{ display: initRadioValue === matchLabelKey ? 'block' : 'none', flex: 1 }}>
              {map(matchRuleList, (value) => {
                const matchType = get(value, 'type', 'prefix');
                const placeholder = branchValuePlaceholder[matchLabelKey][matchType];
                const branchValue = get(value, 'value', '');
                const id = get(value, 'id', uniqueId());
                return (
                  <Input
                    style={{ width: '100%' }}
                    placeholder={placeholder}
                    value={branchValue}
                    onChange={(value) => onBranchValueChange(value, id, matchLabelKey)}
                  />
                );
              })}
            </div>
          )}
        </div>
      ))}
    </RadioGroup>
  );
};

const StrictModeTrigger = (props: StrictModeProps) => {
  const [initRadioValue, setInitRadio] = useState(TriggerType.PUSH);
  const { value, onChange, triggerValues } = props;

  useEffect(() => {
    const triggerTypes = keys(triggerValues);
    if (!isEmpty(keys(triggerValues))) {
      setInitRadio(triggerTypes[0]);
    } else {
      setInitRadio(TriggerType.PUSH);
    }
  }, [triggerValues]);

  const triggerChange = (typeKey) => {
    setInitRadio(typeKey);
    onChange({ [typeKey]: { branches: { precise: [] } } });
  };

  return (
    <RadioGroup value={initRadioValue} onChange={triggerChange} style={{ width: '100%' }}>
      {map(TriggerTypes, (labelKey) => {
        return (
          <div className="trigger-content">
            <Radio value={labelKey}>{TriggerTypeCheckedLabel[labelKey]}</Radio>
            {labelKey === initRadioValue && (
              <StrictMatch
                labelKey={labelKey}
                triggerChecked={labelKey === initRadioValue}
                matchValues={get(value, labelKey, {})}
                onChange={(v) => onChange({ [labelKey]: v })}
              />
            )}
          </div>
        );
      })}
    </RadioGroup>
  );
};

export default StrictModeTrigger;
