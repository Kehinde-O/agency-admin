'use client'

import { useState, useEffect } from 'react'

interface DashboardMetrics {
  totalUsers: number
  activeProperties: number
  pendingReviews: number
  monthlyRevenue: number
  userGrowth: number
  propertyGrowth: number
  revenueGrowth: number
  approvalGrowth: number
}

interface RealTimeData {
  metrics: DashboardMetrics
  lastUpdated: Date
  isLoading: boolean
  error: string | null
}

export function useRealTimeData() {
  const [data, setData] = useState<RealTimeData>({
    metrics: {
      totalUsers: 0,
      activeProperties: 0,
      pendingReviews: 0,
      monthlyRevenue: 0,
      userGrowth: 0,
      propertyGrowth: 0,
      revenueGrowth: 0,
      approvalGrowth: 0
    },
    lastUpdated: new Date(),
    isLoading: true,
    error: null
  })

  const fetchData = async () => {
    try {
      setData(prev => ({ ...prev, isLoading: true, error: null }))
      
      // Simulate API call with realistic data
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockData: DashboardMetrics = {
        totalUsers: Math.floor(Math.random() * 1000) + 2000,
        activeProperties: Math.floor(Math.random() * 500) + 1000,
        pendingReviews: Math.floor(Math.random() * 50) + 30,
        monthlyRevenue: Math.floor(Math.random() * 10000000) + 30000000,
        userGrowth: Math.random() * 20 + 5,
        propertyGrowth: Math.random() * 15 + 3,
        revenueGrowth: Math.random() * 30 + 10,
        approvalGrowth: Math.random() * 25 + 5
      }
      
      setData({
        metrics: mockData,
        lastUpdated: new Date(),
        isLoading: false,
        error: null
      })
    } catch (error) {
      setData(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to fetch data'
      }))
    }
  }

  useEffect(() => {
    fetchData()
    
    // Set up real-time updates every 30 seconds
    const interval = setInterval(fetchData, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const refresh = () => {
    fetchData()
  }

  return {
    ...data,
    refresh
  }
}

export function useSystemStatus() {
  const [status, setStatus] = useState({
    overall: 'operational' as 'operational' | 'degraded' | 'outage',
    services: [
      { name: 'API Server', status: 'operational' as const, uptime: '99.9%' },
      { name: 'Database', status: 'operational' as const, uptime: '99.8%' },
      { name: 'File Storage', status: 'operational' as const, uptime: '99.9%' },
      { name: 'Email Service', status: 'degraded' as const, uptime: '95.2%' }
    ],
    lastChecked: new Date()
  })

  useEffect(() => {
    // Simulate system status updates
    const interval = setInterval(() => {
      setStatus(prev => ({
        ...prev,
        lastChecked: new Date()
      }))
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  return status
}

export function useActivityFeed() {
  const [activities, setActivities] = useState<any[]>([])

  useEffect(() => {
    // Simulate new activities being added
    const interval = setInterval(() => {
      const newActivity = {
        id: Date.now().toString(),
        action: 'System update',
        description: 'Automated system maintenance completed',
        user: 'System',
        time: 'Just now',
        type: 'system',
        priority: 'low'
      }
      
      setActivities(prev => [newActivity, ...prev.slice(0, 9)])
    }, 120000) // Add new activity every 2 minutes

    return () => clearInterval(interval)
  }, [])

  return activities
}
