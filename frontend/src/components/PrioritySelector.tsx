import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Priority } from '../types';
import { colors, radius, spacing, priorityColor } from '../theme/theme';

interface Props {
  value: Priority;
  onChange: (p: Priority) => void;
}

const OPTIONS: Priority[] = ['low', 'medium', 'high'];

// Segmented control for choosing task priority. Visually color-codes each
// option so priority is scannable at a glance, matching the badges used on task cards.
export default function PrioritySelector({ value, onChange }: Props) {
  return (
    <View style={styles.row}>
      {OPTIONS.map((option) => {
        const selected = value === option;
        const color = priorityColor(option);
        return (
          <TouchableOpacity
            key={option}
            style={[
              styles.option,
              { borderColor: color },
              selected && { backgroundColor: color },
            ]}
            onPress={() => onChange(option)}
            activeOpacity={0.8}
          >
            <Text style={[styles.label, { color: selected ? colors.background : color }]}>
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  option: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radius.md,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
  },
});
