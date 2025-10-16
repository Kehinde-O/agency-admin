// Approval logging system for admin actions

export interface ApprovalLog {
  id: string
  propertyId: string
  action: 'approved' | 'rejected'
  adminEmail: string
  adminName: string
  timestamp: string
  reason?: string
  ipAddress?: string
  userAgent?: string
  metadata?: {
    propertyTitle: string
    propertyPrice: number
    propertyType: string
    ownerEmail: string
    ownerName: string
  }
}

export interface ApprovalStats {
  totalApprovals: number
  totalRejections: number
  approvalsToday: number
  rejectionsToday: number
  averageProcessingTime: number
}

class ApprovalLogger {
  private logs: ApprovalLog[] = []
  private readonly STORAGE_KEY = 'admin_approval_logs'

  constructor() {
    this.loadLogs()
  }

  private loadLogs(): void {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (stored) {
        try {
          this.logs = JSON.parse(stored)
        } catch (error) {
          console.error('Failed to load approval logs:', error)
          this.logs = []
        }
      }
    }
  }

  private saveLogs(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.logs))
      } catch (error) {
        console.error('Failed to save approval logs:', error)
      }
    }
  }

  public logApproval(
    propertyId: string,
    action: 'approved' | 'rejected',
    reason?: string,
    metadata?: ApprovalLog['metadata']
  ): ApprovalLog {
    const adminEmail = localStorage.getItem('adminEmail') || 'unknown@agency.com'
    const adminName = 'Admin User' // In real app, get from user profile

    const log: ApprovalLog = {
      id: this.generateId(),
      propertyId,
      action,
      adminEmail,
      adminName,
      timestamp: new Date().toISOString(),
      reason,
      ipAddress: this.getClientIP(),
      userAgent: navigator.userAgent,
      metadata
    }

    this.logs.push(log)
    this.saveLogs()

    // In a real application, you would also send this to your backend API
    this.sendToBackend(log)

    return log
  }

  public getLogs(propertyId?: string): ApprovalLog[] {
    if (propertyId) {
      return this.logs.filter(log => log.propertyId === propertyId)
    }
    return [...this.logs].reverse() // Most recent first
  }

  public getStats(): ApprovalStats {
    const today = new Date().toDateString()
    const todayLogs = this.logs.filter(log => 
      new Date(log.timestamp).toDateString() === today
    )

    const approvals = this.logs.filter(log => log.action === 'approved')
    const rejections = this.logs.filter(log => log.action === 'rejected')
    const approvalsToday = todayLogs.filter(log => log.action === 'approved').length
    const rejectionsToday = todayLogs.filter(log => log.action === 'rejected').length

    return {
      totalApprovals: approvals.length,
      totalRejections: rejections.length,
      approvalsToday,
      rejectionsToday,
      averageProcessingTime: this.calculateAverageProcessingTime()
    }
  }

  public getAdminActivity(adminEmail: string): ApprovalLog[] {
    return this.logs.filter(log => log.adminEmail === adminEmail)
  }

  public getPropertyHistory(propertyId: string): ApprovalLog[] {
    return this.logs
      .filter(log => log.propertyId === propertyId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }

  private generateId(): string {
    return `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private getClientIP(): string {
    // In a real application, you would get this from your backend
    return '127.0.0.1'
  }

  private calculateAverageProcessingTime(): number {
    // This would be calculated based on property creation time vs approval time
    // For now, return a mock value
    return 2.5 // hours
  }

  private async sendToBackend(log: ApprovalLog): Promise<void> {
    try {
      // In a real application, you would send this to your backend API
      console.log('Sending approval log to backend:', log)
      
      // Example API call:
      // await fetch('/api/admin/approval-logs', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(log)
      // })
    } catch (error) {
      console.error('Failed to send approval log to backend:', error)
    }
  }

  public exportLogs(): string {
    return JSON.stringify(this.logs, null, 2)
  }

  public clearLogs(): void {
    this.logs = []
    this.saveLogs()
  }
}

// Export singleton instance
export const approvalLogger = new ApprovalLogger()

// Utility functions
export const formatApprovalDate = (timestamp: string): string => {
  return new Date(timestamp).toLocaleString()
}

export const getApprovalStatus = (logs: ApprovalLog[]): string => {
  if (logs.length === 0) return 'pending'
  
  const latestLog = logs[0]
  return latestLog.action
}

export const getApprovalHistory = (propertyId: string): ApprovalLog[] => {
  return approvalLogger.getPropertyHistory(propertyId)
}
