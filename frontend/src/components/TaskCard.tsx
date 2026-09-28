import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Task } from '../types';
import { colors, radius, spacing, typography, priorityColor, shadow } from '../theme/theme';
import { formatShortDate, timeUntil, isOverdue } from '../utils/date';

interface Props {
  task: Task;
  onToggle: () => void;
  onPress: () => void;
  onDelete: () => void;
}

// A single task row: checkbox, title/description, and metadata chips for
// priority, deadline countdown, and overdue warning.
export default function TaskCard({ task, onToggle, onPress, onDelete }: Props) {
  const overdue = !task.completed && isOverdue(task.deadline);
  const pColor = priorityColor(task.priority);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <TouchableOpacity
        onPress={onToggle}
        style={[
          styles.checkbox,
          { borderColor: pColor },
          task.completed && { backgroundColor: pColor },
        ]}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        {task.completed && <Text style={styles.checkmark}>✓</Text>}
      </TouchableOpacity>

      <View style={styles.content}>
        <Text
          style={[styles.title, task.completed && styles.titleCompleted]}
          numberOfLines={1}
        >
          {task.title}
        </Text>

        {task.description ? (
          <Text style={styles.description} numberOfLines={2}>
            {task.description}
          </Text>
        ) : null}

        <View style={styles.metaRow}>
          <View style={[styles.badge, { backgroundColor: pColor + '22', borderColor: pColor }]}>
            <Text style={[styles.badgeText, { color: pColor }]}>
              {task.priority.toUpperCase()}
            </Text>
          </View>

          <Text style={styles.metaText}>{formatShortDate(task.deadline)}</Text>

          {!task.completed && (
            <Text style={[styles.metaText, overdue && styles.overdueText]}>
              {timeUntil(task.deadline)}
            </Text>
          )}
        </View>
      </View>

      <TouchableOpacity
        onPress={onDelete}
        style={styles.deleteBtn}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text style={styles.deleteIcon}>✕</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadow.card,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: radius.full,
    borderWidth: 2,
    marginRight: spacing.md,
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '900',
  },
  content: {
    flex: 1,
  },
  title: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
  },
  description: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  badge: {
    borderRadius: radius.sm,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  badgeText: {
    ...typography.small,
    fontWeight: '700',
  },
  metaText: {
    ...typography.small,
    color: colors.textMuted,
  },
  overdueText: {
    color: colors.danger,
    fontWeight: '700',
  },
  deleteBtn: {
    padding: spacing.xs,
    marginLeft: spacing.sm,
  },
  deleteIcon: {
    color: colors.textMuted,
    fontSize: 16,
    fontWeight: '700',
  },
});
