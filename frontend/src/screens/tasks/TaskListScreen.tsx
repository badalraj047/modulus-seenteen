import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Alert,
  StatusBar,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { RootStackParamList, Task, SortOption } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useTasks } from '../../context/TaskContext';
import TaskCard from '../../components/TaskCard';
import FilterSortBar, { FilterOption } from '../../components/FilterSortBar';
import { colors, radius, spacing, typography, shadow } from '../../theme/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'TaskList'>;

export default function TaskListScreen({ navigation }: Props) {
  const { user, logout } = useAuth();
  const { tasks, isLoading, error, loadTasks, toggleTask, removeTask, sortBy, setSortBy } =
    useTasks();

  const [filter, setFilter] = useState<FilterOption>('all');
  const [refreshing, setRefreshing] = useState(false);

  // Reload whenever the screen gains focus (e.g. returning from add/edit) or sort changes.
  useFocusEffect(
    useCallback(() => {
      loadTasks(sortBy);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sortBy])
  );

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadTasks(sortBy);
    setRefreshing(false);
  };

  const handleSortChange = (s: SortOption) => {
    setSortBy(s);
  };

  const handleDelete = (task: Task) => {
    Alert.alert('Delete Task', `Delete "${task.title}"? This cannot be undone.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => removeTask(task._id).catch(() => {}),
      },
    ]);
  };

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: () => logout() },
    ]);
  };

  const filteredTasks = useMemo(() => {
    if (filter === 'active') return tasks.filter((t) => !t.completed);
    if (filter === 'completed') return tasks.filter((t) => t.completed);
    return tasks;
  }, [tasks, filter]);

  const activeCount = tasks.filter((t) => !t.completed).length;

  const statusBarHeight = StatusBar.currentHeight ?? 0;

  return (
    <View style={[styles.container, { paddingTop: statusBarHeight + spacing.md }]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.greeting}>Hi, {user?.name?.split(' ')[0]} 👋</Text>
          <Text style={styles.subGreeting}>
            {activeCount} task{activeCount === 1 ? '' : 's'} pending
          </Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>

      <FilterSortBar
        filter={filter}
        onFilterChange={setFilter}
        sortBy={sortBy}
        onSortChange={handleSortChange}
      />

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.primary} />
        }
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            onToggle={() => toggleTask(item._id).catch(() => {})}
            onPress={() => navigation.navigate('TaskForm', { taskId: item._id })}
            onDelete={() => handleDelete(item)}
          />
        )}
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📝</Text>
              <Text style={styles.emptyTitle}>
                {filter === 'completed' ? 'No completed tasks yet' : 'No tasks yet'}
              </Text>
              <Text style={styles.emptySubtitle}>
                {filter === 'completed'
                  ? 'Finish a task to see it here'
                  : 'Tap the + button to add your first task'}
              </Text>
            </View>
          ) : undefined
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('TaskForm', undefined)}
        activeOpacity={0.85}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  subGreeting: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  logoutBtn: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  logoutText: {
    ...typography.caption,
    color: colors.danger,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 100,
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.xxl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  emptySubtitle: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.xl,
    width: 58,
    height: 58,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.card,
  },
  fabIcon: {
    fontSize: 30,
    color: colors.white,
    fontWeight: '400',
    marginTop: -2,
  },
});
