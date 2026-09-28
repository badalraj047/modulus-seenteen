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

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export default function RegisterScreen({ navigation }: Props) {
  const { register, isSubmitting } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const errors: FormErrors = {};
    if (!name.trim()) errors.name = 'Name is required';
    if (!email.trim()) errors.email = 'Email is required';
    else if (!EMAIL_REGEX.test(email.trim())) errors.email = 'Enter a valid email address';
    if (!password) errors.password = 'Password is required';
    else if (password.length < 6) errors.password = 'Password must be at least 6 characters';
    if (confirmPassword !== password) errors.confirmPassword = 'Passwords do not match';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    try {
      await register(name.trim(), email.trim(), password);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      Alert.alert('Registration failed', message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>Create account</Text>
          <Text style={styles.subtitle}>Start organizing your tasks today</Text>
        </View>

        <View style={styles.form}>
          <AppTextInput
            label="Name"
            placeholder="Your full name"
            value={name}
            onChangeText={setName}
            error={fieldErrors.name}
            autoCapitalize="words"
          />
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
            placeholder="At least 6 characters"
            value={password}
            onChangeText={setPassword}
            error={fieldErrors.password}
            secureTextEntry
            autoCapitalize="none"
          />
          <AppTextInput
            label="Confirm Password"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            error={fieldErrors.confirmPassword}
            secureTextEntry
            autoCapitalize="none"
          />

          <AppButton
            title="Sign Up"
            onPress={handleRegister}
            loading={isSubmitting}
            style={styles.registerBtn}
          />

          <AppButton
            title="Already have an account? Log in"
            onPress={() => navigation.navigate('Login')}
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
  registerBtn: {
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
});
