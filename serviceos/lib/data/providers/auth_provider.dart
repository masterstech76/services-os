import 'package:flutter_riverpod/flutter_riverpod.dart';

enum UserRole { customer, technician }

class AuthState {
  final bool isAuthenticated;
  final UserRole role;
  final String phoneNumber;
  final String displayName;
  final bool biometricEnabled;
  final bool isLoading;

  const AuthState({
    this.isAuthenticated = false,
    this.role = UserRole.customer,
    this.phoneNumber = '',
    this.displayName = '',
    this.biometricEnabled = true,
    this.isLoading = false,
  });

  AuthState copyWith({
    bool? isAuthenticated,
    UserRole? role,
    String? phoneNumber,
    String? displayName,
    bool? biometricEnabled,
    bool? isLoading,
  }) {
    return AuthState(
      isAuthenticated: isAuthenticated ?? this.isAuthenticated,
      role: role ?? this.role,
      phoneNumber: phoneNumber ?? this.phoneNumber,
      displayName: displayName ?? this.displayName,
      biometricEnabled: biometricEnabled ?? this.biometricEnabled,
      isLoading: isLoading ?? this.isLoading,
    );
  }
}

class AuthNotifier extends StateNotifier<AuthState> {
  AuthNotifier() : super(const AuthState());

  void setRole(UserRole role) {
    state = state.copyWith(
      role: role,
    );
  }

  void setDisplayName(String name) {
    state = state.copyWith(displayName: name);
  }

  void updatePhoneNumber(String phone) {
    state = state.copyWith(phoneNumber: phone);
  }

  Future<bool> verifyOtp(String code) async {
    state = state.copyWith(isLoading: true);
    await Future.delayed(const Duration(milliseconds: 400));
    state = state.copyWith(
      isAuthenticated: true,
      isLoading: false,
    );
    return true;
  }

  void toggleBiometrics() {
    state = state.copyWith(biometricEnabled: !state.biometricEnabled);
  }

  void logout() {
    state = state.copyWith(isAuthenticated: false);
  }
}

final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  return AuthNotifier();
});
