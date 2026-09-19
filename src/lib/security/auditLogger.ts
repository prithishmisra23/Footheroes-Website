import { createClient } from "@/utils/supabase/server";
import crypto from "crypto";

export type AuditAction = 
  | 'login' 
  | 'logout' 
  | 'profile_update' 
  | 'match_event_add' 
  | 'match_event_delete' 
  | 'tournament_create' 
  | 'scout_contact' 
  | 'report_generate' 
  | 'file_upload' 
  | 'account_delete';

interface AuditLogPayload {
  action: AuditAction;
  userId: string;
  resourceId?: string;
  resourceType?: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

// Utility to hash sensitive data (e.g., email)
const hashData = (data: string) => {
  return crypto.createHash('sha256').update(data).digest('hex');
};

// Utility to mask phone numbers to last 4 digits
const maskPhone = (phone: string) => {
  if (!phone || phone.length < 4) return phone;
  return '*'.repeat(phone.length - 4) + phone.slice(-4);
};

// Clean sensitive fields from metadata before logging
const sanitizeMetadata = (metadata: Record<string, any>) => {
  const sanitized = { ...metadata };
  
  // Never log passwords, tokens, or OTPs
  const forbiddenKeys = ['password', 'token', 'otp', 'access_token', 'refresh_token', 'secret'];
  for (const key of Object.keys(sanitized)) {
    if (forbiddenKeys.some(fk => key.toLowerCase().includes(fk))) {
      sanitized[key] = '[REDACTED]';
    }
  }

  // Hash emails if present
  if (sanitized.email) {
    sanitized.email = hashData(sanitized.email);
  }

  // Mask phone numbers if present
  if (sanitized.phone) {
    sanitized.phone = maskPhone(sanitized.phone);
  }

  return sanitized;
};

export const logAuditAction = async (payload: AuditLogPayload) => {
  try {
    const supabase = createClient();
    
    const sanitizedMetadata = payload.metadata ? sanitizeMetadata(payload.metadata) : {};

    const { error } = await supabase
      .from('audit_log')
      .insert({
        action: payload.action,
        user_id: payload.userId,
        resource_id: payload.resourceId,
        resource_type: payload.resourceType,
        metadata: sanitizedMetadata,
        ip_address: payload.ipAddress,
        user_agent: payload.userAgent,
      });

    if (error) {
      console.error('Failed to write to audit log:', error);
    }
  } catch (error) {
    console.error('Audit Logger exception:', error);
  }
};
