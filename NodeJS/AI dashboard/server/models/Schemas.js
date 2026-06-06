import mongoose from 'mongoose';

const Schema = mongoose.Schema;

// 1. Client Schema
const ClientSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  status: { type: String, default: 'Active', enum: ['Active', 'Pending', 'Cancelled'] },
  amount: { type: Number, default: 0 },
  date: { type: String, default: () => new Date().toISOString().split('T')[0] }
});

// 2. Audit Log Schema
const AuditLogSchema = new Schema({
  actionType: { type: String, required: true },
  actor: { type: String, default: 'SYSTEM' },
  details: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  ip: { type: String, default: '127.0.0.1' },
  location: { type: String, default: 'Local Server' }
});

// 3. Session Schema
const SessionSchema = new Schema({
  device: { type: String, required: true },
  browser: { type: String },
  ip: { type: String },
  location: { type: String },
  activeAt: { type: String, default: 'Just now' },
  isCurrent: { type: Boolean, default: false }
});

// 4. Action Flow Schema
const FlowSchema = new Schema({
  name: { type: String, required: true },
  trigger: { type: String, required: true },
  condition: { type: String, required: true },
  action: { type: String, required: true },
  active: { type: Boolean, default: false },
  logs: { type: [String], default: [] }
});

// 5. Permission / RBAC Schema
const PermissionSchema = new Schema({
  role: { type: String, required: true, unique: true },
  read: { type: Boolean, default: true },
  write: { type: Boolean, default: false },
  delete: { type: Boolean, default: false },
  system: { type: Boolean, default: false },
  export: { type: Boolean, default: false }
});

export const Client = mongoose.model('Client', ClientSchema);
export const AuditLog = mongoose.model('AuditLog', AuditLogSchema);
export const Session = mongoose.model('Session', SessionSchema);
export const Flow = mongoose.model('Flow', FlowSchema);
export const Permission = mongoose.model('Permission', PermissionSchema);
