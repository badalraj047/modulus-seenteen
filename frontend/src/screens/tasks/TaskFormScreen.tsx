import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, Priority } from '../../types';
import { useTasks } from '../../context/TaskContext';
import AppTextInput from '../../components/AppTextInput';
import AppButton from '../../components/AppButton';
import PrioritySelector from '../../components/PrioritySelector';
import DateTimeField from '../../components/DateTimeField';
import { colors, spacing, typography } from '../../theme/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'TaskForm'>;

interface FormErrors {
  title?: string;
  deadline?: string;
}

export default function TaskFormScreen({ navigation, route }: Props) {
  const taskId = route.params?.taskId;
  const { tasks, addTask, editTask, isMutating } = useTasks();

  const existingTask = useMemo(
    () => (taskId ? tasks.find((t) => t._id === taskId) : undefined),
    [taskId, tasks]
  );
  const isEditing = !!existingTask;

  const now = new Date();
  const inOneHour = new Date(now.getTime() + 60 * 60 * 1000);

  const [title, setTitle] = useState(existingTask?.title ?? '');
  const [description, setDescription] = useState(existingTask?.description ?? '');
  const [dateTime, setDateTime] = useState(
    existingTask ? new Date(existingTask.dateTime) : now
  );
  const [deadline, setDeadline] = useState(
    existingTask ? new Date(existingTask.deadline) : inOneHour
  );
  const [priority, setPriority] = useState<Priority>(existingTask?.priority ?? 'medium');
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (deadline.getTime() < dateTime.getTime()) {
      newErrors.deadline = 'Deadline should be after the scheduled date/time';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    const input = {
      title: title.trim(),
      description: description.trim(),
      dateTime: dateTime.toISOString(),
      deadline: deadline.toISOString(),
      priority,
    };

    try {
      if (isEditing && existingTask) {
        await editTask(existingTask._id, input);
      } else {
        await addTask(input);
      }
      navigation.goBack();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save task';
      Alert.alert('Error', message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.heading}>{isEditing ? 'Edit Task' : 'New Task'}</Text>

        <AppTextInput
          label="Title"
          placeholder="What needs to be done?"
          value={title}
          onChangeText={setTitle}
          error={errors.title}
        />

        <AppTextInput
          label="Description (optional)"
          placeholder="Add more details..."
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
          style={styles.textArea}
        />

        <DateTimeField label="Date & Time" value={dateTime} onChange={setDateTime} />

        <DateTimeField
          label="Deadline"
          value={deadline}
          onChange={setDeadline}
          error={errors.deadline}
        />

        <View style={styles.priorityBlock}>
          <Text style={styles.priorityLabel}>Priority</Text>
          <PrioritySelector value={priority} onChange={setPriority} />
        </View>

        <AppButton
          title={isEditing ? 'Save Changes' : 'Add Task'}
          onPress={handleSave}
          loading={isMutating}
          style={styles.saveBtn}
        />
        <AppButton title="Cancel" onPress={() => navigation.goBack()} variant="ghost" />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  container: {
    flexGrow: 1,
    padding: spacing.lg,
  },
  heading: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  priorityBlock: {
    marginBottom: spacing.lg,
  },
  priorityLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    fontWeight: '600',
  },
  saveBtn: {
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
});
