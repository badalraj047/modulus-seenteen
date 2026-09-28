import React, { useState } from 'react';
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
import { RootStackParamList } from '../../types';
import { useAuth } from '../../context/AuthContext';
import AppTextInput from '../../components/AppTextInput';
import AppButton from '../../components/AppButton';
import { colors, spacing, typography } from '../../theme/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

// Basic client-side email format check, purely for fast feedback -
// the backend is the source of truth for validation.
const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

export default function LoginScreen({ navigation }: Props) {
  const { login, isSubmitting } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  const validate = (): boolean => {
    const errors: { email?: string; password?: string } = {};
    if (!email.trim()) errors.email = 'Email is required';
    else if (!EMAIL_REGEX.test(email.trim())) errors.email = 'Enter a valid email address';
    if (!password) errors.password = 'Password is required';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    try {
      await login(email.trim(), password);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      Alert.alert('Login failed', message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.logo}>✓</Text>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Log in to keep tracking your tasks</Text>
        </View>

        <View style={styles.form}>
          <AppTextInput
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            error={fieldErrors.email}
            autoCapitalize="none"
            keyboardType="email-address"
            autoCorrect={false}
          />
          <AppTextInput
            label="Password"
            placeholder="Your password"
            value={password}
            onChangeText={setPassword}
            error={fieldErrors.password}
            secureTextEntry
            autoCapitalize="none"
          />

          <AppButton title="Log In" onPress={handleLogin} loading={isSubmitting} style={styles.loginBtn} />

          <AppButton
            title="Don't have an account? Sign up"
            onPress={() => navigation.navigate('Register')}
            variant="ghost"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  container: {
    flexGrow: 1,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logo: {
    fontSize: 40,
    color: colors.primary,
    marginBottom: spacing.md,
    fontWeight: '900',
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  loginBtn: {
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
});
