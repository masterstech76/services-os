import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/technician_model.dart';
import '../repositories/technician_repository.dart';

final technicianRepositoryProvider = Provider<ITechnicianRepository>((ref) {
  return TechnicianRepository();
});

class TechDispatchState {
  final bool isOnline;
  final TechnicianModel? currentTechnician;
  final bool hasActiveBroadcast;
  final int broadcastCountdownSeconds;
  final double incomingPayout;
  final String customerAddress;
  final String serviceDescription;
  final bool isJobActive;
  final int workTimerSeconds;
  final bool isTimerRunning;
  final List<String> beforePhotos;
  final List<String> afterPhotos;
  final String? customerSignatureBase64;
  final double walletBalance;
  final double weeklyEarnings;

  const TechDispatchState({
    this.isOnline = false,
    this.currentTechnician,
    this.hasActiveBroadcast = false,
    this.broadcastCountdownSeconds = 60,
    this.incomingPayout = 0.00,
    this.customerAddress = '',
    this.serviceDescription = '',
    this.isJobActive = false,
    this.workTimerSeconds = 0,
    this.isTimerRunning = false,
    this.beforePhotos = const [],
    this.afterPhotos = const [],
    this.customerSignatureBase64,
    this.walletBalance = 0.00,
    this.weeklyEarnings = 0.00,
  });

  TechDispatchState copyWith({
    bool? isOnline,
    TechnicianModel? currentTechnician,
    bool? hasActiveBroadcast,
    int? broadcastCountdownSeconds,
    double? incomingPayout,
    String? customerAddress,
    String? serviceDescription,
    bool? isJobActive,
    int? workTimerSeconds,
    bool? isTimerRunning,
    List<String>? beforePhotos,
    List<String>? afterPhotos,
    String? customerSignatureBase64,
    double? walletBalance,
    double? weeklyEarnings,
  }) {
    return TechDispatchState(
      isOnline: isOnline ?? this.isOnline,
      currentTechnician: currentTechnician ?? this.currentTechnician,
      hasActiveBroadcast: hasActiveBroadcast ?? this.hasActiveBroadcast,
      broadcastCountdownSeconds: broadcastCountdownSeconds ?? this.broadcastCountdownSeconds,
      incomingPayout: incomingPayout ?? this.incomingPayout,
      customerAddress: customerAddress ?? this.customerAddress,
      serviceDescription: serviceDescription ?? this.serviceDescription,
      isJobActive: isJobActive ?? this.isJobActive,
      workTimerSeconds: workTimerSeconds ?? this.workTimerSeconds,
      isTimerRunning: isTimerRunning ?? this.isTimerRunning,
      beforePhotos: beforePhotos ?? this.beforePhotos,
      afterPhotos: afterPhotos ?? this.afterPhotos,
      customerSignatureBase64: customerSignatureBase64 ?? this.customerSignatureBase64,
      walletBalance: walletBalance ?? this.walletBalance,
      weeklyEarnings: weeklyEarnings ?? this.weeklyEarnings,
    );
  }
}

class TechDispatchNotifier extends StateNotifier<TechDispatchState> {
  final ITechnicianRepository _repository;
  Timer? _countdownTimer;
  Timer? _workTimer;

  TechDispatchNotifier(this._repository) : super(const TechDispatchState()) {
    _loadProfile();
  }

  Future<void> _loadProfile() async {
    final tech = await _repository.getTechnicianById('tech_01');
    state = state.copyWith(currentTechnician: tech);
  }

  Future<void> toggleDuty(bool isOnline) async {
    state = state.copyWith(isOnline: isOnline);
    if (state.currentTechnician != null) {
      await _repository.updateDutyStatus(state.currentTechnician!.id, isOnline);
    }
  }

  void triggerBroadcastAlert() {
    _countdownTimer?.cancel();
    state = state.copyWith(
      hasActiveBroadcast: true,
      broadcastCountdownSeconds: 60,
    );

    _countdownTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (state.broadcastCountdownSeconds <= 1) {
        timer.cancel();
        state = state.copyWith(hasActiveBroadcast: false);
      } else {
        state = state.copyWith(
          broadcastCountdownSeconds: state.broadcastCountdownSeconds - 1,
        );
      }
    });
  }

  void acceptIncomingJob() {
    _countdownTimer?.cancel();
    state = state.copyWith(
      hasActiveBroadcast: false,
      isJobActive: true,
      workTimerSeconds: 0,
      isTimerRunning: true,
    );
    _startWorkTimer();
  }

  void declineIncomingJob() {
    _countdownTimer?.cancel();
    state = state.copyWith(hasActiveBroadcast: false);
  }

  void _startWorkTimer() {
    _workTimer?.cancel();
    _workTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (state.isTimerRunning) {
        state = state.copyWith(workTimerSeconds: state.workTimerSeconds + 1);
      }
    });
  }

  void toggleTimer() {
    state = state.copyWith(isTimerRunning: !state.isTimerRunning);
  }

  void addBeforePhoto(String photoPath) {
    state = state.copyWith(beforePhotos: [...state.beforePhotos, photoPath]);
  }

  void addAfterPhoto(String photoPath) {
    state = state.copyWith(afterPhotos: [...state.afterPhotos, photoPath]);
  }

  void captureSignature(String signatureBase64) {
    state = state.copyWith(customerSignatureBase64: signatureBase64);
  }

  void completeJobAndReleasePayout() {
    _workTimer?.cancel();
    final newBalance = state.walletBalance + state.incomingPayout;
    final newWeekly = state.weeklyEarnings + state.incomingPayout;

    state = state.copyWith(
      isJobActive: false,
      isTimerRunning: false,
      walletBalance: newBalance,
      weeklyEarnings: newWeekly,
    );
  }

  @override
  void dispose() {
    _countdownTimer?.cancel();
    _workTimer?.cancel();
    super.dispose();
  }
}

final techDispatchProvider = StateNotifierProvider<TechDispatchNotifier, TechDispatchState>((ref) {
  final repo = ref.watch(technicianRepositoryProvider);
  return TechDispatchNotifier(repo);
});
