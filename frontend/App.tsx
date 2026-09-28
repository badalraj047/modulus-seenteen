/**
 * React Native To-Do App with Authentication
 * Entry point: wires up global providers (safe area, auth, tasks) and the navigator.
 *
 * @format
 */

import React, { useRef } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from './src/context/AuthContext';
import { TaskProvider, useTasks } from './src/context/TaskContext';
import RootNavigator from './src/navigation/RootNavigator';

// Bridges AuthProvider's logout event to TaskProvider's reset, so that when a
// user logs out, the next user who logs in on this device never sees stale
// task data from the previous session before their own tasks load.
function TaskResetBridge({ children }: { children: React.ReactNode }) {
  const { reset } = useTasks();
  const resetRef = useRef(reset);
  resetRef.current = reset;

  return (
    <AuthProvider onLogout={() => resetRef.current()}>{children}</AuthProvider>
  );
}

function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" />
        <TaskProvider>
          <TaskResetBridge>
            <RootNavigator />
          </TaskResetBridge>
        </TaskProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});

export default App;
