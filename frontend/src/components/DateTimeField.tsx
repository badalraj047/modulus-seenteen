import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { colors, radius, spacing, typography } from '../theme/theme';
import { formatDateTime } from '../utils/date';

interface Props {
  label: string;
  value: Date;
  onChange: (date: Date) => void;
  error?: string;
}

// A tap-to-open date + time picker field. Android shows the native date dialog
// then the native time dialog in sequence (this is the standard RN pattern,
// since Android's DateTimePicker only supports one mode per dialog at a time).
export default function DateTimeField({ label, value, onChange, error }: Props) {
  const [showPicker, setShowPicker] = useState<'date' | 'time' | null>(null);

  const openPicker = () => setShowPicker('date');

  const handleChange = (event: DateTimePickerEvent, selected?: Date) => {
    if (event.type === 'dismissed' || !selected) {
      setShowPicker(null);
      return;
    }

    if (showPicker === 'date') {
      // Keep the previously chosen time, just update the date portion, then ask for time next.
      const merged = new Date(value);
      merged.setFullYear(selected.getFullYear(), selected.getMonth(), selected.getDate());
      onChange(merged);
      setShowPicker(Platform.OS === 'android' ? 'time' : null);
    } else {
      const merged = new Date(value);
      merged.setHours(selected.getHours(), selected.getMinutes());
      onChange(merged);
      setShowPicker(null);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={[styles.field, error ? styles.fieldError : null]}
        onPress={openPicker}
        activeOpacity={0.7}
      >
        <Text style={styles.value}>{formatDateTime(value.toISOString())}</Text>
      </TouchableOpacity>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {showPicker && (
        <DateTimePicker
          value={value}
          mode={showPicker}
          is24Hour={false}
          display="default"
          onChange={handleChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    fontWeight: '600',
  },
  field: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  fieldError: {
    borderColor: colors.danger,
  },
  value: {
    ...typography.body,
    color: colors.textPrimary,
  },
  errorText: {
    ...typography.small,
    color: colors.danger,
    marginTop: spacing.xs,
  },
});
