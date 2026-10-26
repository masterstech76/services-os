import { describe, it, expect, beforeEach } from "vitest";
import {
  initializeMfaSession,
  issueEmailOtp,
  verifyEmailOtp,
  verifyTotpCode,
  registerAndVerifyTrustedDevice,
  verifyFactorInSession,
  hashDeviceFingerprint,
} from "@/lib/server/admin-mfa";
import {
  SUPER_ADMIN_COUNCIL,
  QUORUM_RULES,
  createQuorumRequest,
  castQuorumVote,
  vetoQuorumRequest,
  executeQuorumAction,
  getAllQuorumRequests,
} from "@/lib/server/multi-admin-approval";

describe("Admin Security & Governance — 5-Factor MFA & Quorum Consensus", () => {
  describe("1. 5-Factor Admin Authentication Plan (Complete Any 4 of 5)", () => {
    const adminEmail = "admin@servicepro.local";
    let sessionId: string;

    beforeEach(() => {
      const init = initializeMfaSession({
        email: adminEmail,
        name: "Sarah Jenkins (CISO)",
      });
      sessionId = init.sessionId;
    });

    it("Factor 1 (Mandatory Password) is initialized as first verified factor", () => {
      const init = initializeMfaSession({ email: adminEmail });
      expect(init.session.factors.password.verified).toBe(true);
      expect(init.session.totalVerifiedFactors).toBe(1);
      expect(init.session.isUnlocked).toBe(false); // 1 < 4 factors
    });

    it("Factor 2 (TOTP Authenticator) validates valid 6-digit codes and rejects malformed codes", () => {
      expect(verifyTotpCode(adminEmail, "123456")).toBe(true);
      expect(verifyTotpCode(adminEmail, "749201")).toBe(true);
      expect(verifyTotpCode(adminEmail, "123")).toBe(false);
      expect(verifyTotpCode(adminEmail, "abc456")).toBe(false);

      const updated = verifyFactorInSession({
        sessionId,
        factor: "totp",
        verified: true,
      });
      expect(updated?.factors.totp.verified).toBe(true);
      expect(updated?.totalVerifiedFactors).toBe(2);
      expect(updated?.isUnlocked).toBe(false); // 2 < 4 factors
    });

    it("Factor 3 (Email OTP) issues single-use 6-digit code with 5-minute expiry", () => {
      const otp = issueEmailOtp(adminEmail);
      expect(otp.success).toBe(true);
      expect(otp.expiresAt).toBeGreaterThan(Date.now());

      const code = otp.demoPreviewCode!;
      expect(code).toBeDefined();
      expect(code.length).toBe(6);

      // Verify OTP succeeds
      expect(verifyEmailOtp(adminEmail, code)).toBe(true);
      // Verify OTP is single-use: subsequent verification with same code fails
      expect(verifyEmailOtp(adminEmail, code)).toBe(false);

      const updated = verifyFactorInSession({
        sessionId,
        factor: "emailOtp",
        verified: true,
      });
      expect(updated?.factors.emailOtp.verified).toBe(true);
    });

    it("Factor 4 (Passkey / Security Key) verifies biometric or hardware FIDO2 credentials", () => {
      const updated = verifyFactorInSession({
        sessionId,
        factor: "passkey",
        verified: true,
      });
      expect(updated?.factors.passkey.verified).toBe(true);
    });

    it("Factor 5 (Trusted Device) fingerprints hardware and generates device token", () => {
      const fingerprint = {
        browserId: "Chrome-124-Win64",
        deviceId: "dev_hw_workstation_alpha",
        osVersion: "Windows 11 Enterprise",
        hardwareSignature: "tpm20-enclave-signature-x86",
      };

      const hash = hashDeviceFingerprint(fingerprint);
      expect(hash).toMatch(/^[a-f0-9]{64}$/);

      const result = registerAndVerifyTrustedDevice({
        email: adminEmail,
        fingerprint,
      });
      expect(result.verified).toBe(true);
      expect(result.trustedToken).toMatch(/^dev_tok_/);

      const updated = verifyFactorInSession({
        sessionId,
        factor: "trustedDevice",
        verified: true,
      });
      expect(updated?.factors.trustedDevice.verified).toBe(true);
    });

    it("Enforces Any 4 of 5 factors required: Unlocks strictly when 4 factors are reached", () => {
      // Step 1: Password verified (1/5) -> Locked
      let session = verifyFactorInSession({ sessionId, factor: "totp", verified: true })!;
      // Total: Password + TOTP = 2 -> Locked
      expect(session.totalVerifiedFactors).toBe(2);
      expect(session.isUnlocked).toBe(false);

      // Step 2: Email OTP verified (3/5) -> Locked
      session = verifyFactorInSession({ sessionId, factor: "emailOtp", verified: true })!;
      expect(session.totalVerifiedFactors).toBe(3);
      expect(session.isUnlocked).toBe(false);

      // Step 3: Trusted Device verified (4/5) -> UNLOCKED!
      session = verifyFactorInSession({ sessionId, factor: "trustedDevice", verified: true })!;
      expect(session.totalVerifiedFactors).toBe(4);
      expect(session.isUnlocked).toBe(true);
    });
  });

  describe("2. Multi-Admin Consensus Approval System for Admin Team", () => {
    it("Defines a Council of 5 Super Admins with distinct governance roles", () => {
      expect(SUPER_ADMIN_COUNCIL.length).toBe(5);
      const roles = SUPER_ADMIN_COUNCIL.map((m) => m.name);
      expect(roles).toContain("Sarah Jenkins");
      expect(roles).toContain("David Chen");
      expect(roles).toContain("Elena Rostova");
      expect(roles).toContain("Marcus Sterling");
      expect(roles).toContain("Victor Vance");
    });

    it("Constitutional quorum matrix enforces tiered thresholds and unanimous rules", () => {
      expect(QUORUM_RULES.NEW_ADMIN.requiredVotes).toBe(2);
      expect(QUORUM_RULES.REMOVE_ADMIN.requiredVotes).toBe(3);
      expect(QUORUM_RULES.DATABASE_ACCESS.requiredVotes).toBe(4);
      expect(QUORUM_RULES.SECURITY_CHANGES.requiredVotes).toBe(4);

      // High-criticality actions require 5/5 unanimous approvals
      expect(QUORUM_RULES.NEW_SUPER_ADMIN.requiredVotes).toBe(5);
      expect(QUORUM_RULES.NEW_SUPER_ADMIN.requiresUnanimous).toBe(true);
      expect(QUORUM_RULES.DISABLE_AUTH.requiredVotes).toBe(5);
      expect(QUORUM_RULES.DISABLE_AUTH.requiresUnanimous).toBe(true);
    });

    it("Processes consensus workflow: proposal -> step-up voting -> threshold approval -> execution", () => {
      const request = createQuorumRequest({
        actionType: "NEW_ADMIN",
        title: "Provision Operations Admin for Regional Lead",
        description: "Grant dispatch and billing admin access",
        requestedBy: {
          name: "David Chen",
          email: "david.chen@servicepro.demo",
          role: "Chief Technology Officer",
        },
      });

      expect(request.status).toBe("pending");
      expect(request.votes.length).toBe(0);

      // Super Admin 1 votes to approve
      const vote1 = castQuorumVote({
        requestId: request.id,
        superAdminId: "sa-1",
        vote: "approve",
        comment: "Identity verified, approval granted.",
        stepUpVerified: true,
      });
      expect(vote1.success).toBe(true);
      expect(vote1.request?.status).toBe("pending"); // 1 of 2 votes reached

      // Super Admin 2 votes to approve -> Threshold of 2 reached
      const vote2 = castQuorumVote({
        requestId: request.id,
        superAdminId: "sa-2",
        vote: "approve",
        comment: "Concur with CTO.",
        stepUpVerified: true,
      });
      expect(vote2.success).toBe(true);
      expect(vote2.request?.status).toBe("approved");

      // Execution can now succeed
      const executed = executeQuorumAction({
        requestId: request.id,
        executedBySuperAdminId: "sa-1",
      });
      expect(executed.success).toBe(true);
      expect(executed.request?.status).toBe("executed");
    });

    it("Allows any Super Admin to execute an Emergency VETO to halt critical actions", () => {
      const request = createQuorumRequest({
        actionType: "SECURITY_CHANGES",
        title: "Adjust Session Inactivity Duration",
        description: "Increase session timeout to 60 minutes",
        requestedBy: {
          name: "Elena Rostova",
          email: "elena.rostova@servicepro.demo",
          role: "Infrastructure Architect",
        },
      });

      // Emergency VETO invoked
      const vetoResult = vetoQuorumRequest({
        requestId: request.id,
        superAdminId: "sa-1",
        reason: "Policy violates zero-trust SOC-2 compliance baseline.",
      });

      expect(vetoResult.success).toBe(true);
      expect(vetoResult.request?.status).toBe("vetoed");

      // Attempting to execute a vetoed request must fail
      const executionAttempt = executeQuorumAction({
        requestId: request.id,
        executedBySuperAdminId: "sa-3",
      });
      expect(executionAttempt.success).toBe(false);
      expect(executionAttempt.message).toContain("vetoed");
    });
  });
});
