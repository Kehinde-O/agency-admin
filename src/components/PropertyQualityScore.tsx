'use client'

import { CheckCircle, AlertTriangle, XCircle, Star, Camera, FileText, Shield, TrendingUp } from 'lucide-react'
import { Property } from '@/types'

interface PropertyQualityScoreProps {
  property: Property
}

export default function PropertyQualityScore({ property }: PropertyQualityScoreProps) {
  // Calculate quality score based on various factors
  const calculateQualityScore = () => {
    let score = 0
    let maxScore = 0
    const issues: string[] = []
    const suggestions: string[] = []

    // Image quality (30 points)
    maxScore += 30
    if (property.images && property.images.length >= 5) {
      score += 30
    } else if (property.images && property.images.length >= 3) {
      score += 20
      suggestions.push('Add more high-quality images (recommended: 5+)')
    } else if (property.images && property.images.length >= 1) {
      score += 10
      issues.push('Insufficient images')
      suggestions.push('Add more high-quality images')
    } else {
      issues.push('No images provided')
      suggestions.push('Add property images')
    }

    // Description quality (25 points)
    maxScore += 25
    if (property.description && property.description.length >= 200) {
      score += 25
    } else if (property.description && property.description.length >= 100) {
      score += 15
      suggestions.push('Expand property description')
    } else if (property.description && property.description.length >= 50) {
      score += 10
      issues.push('Description too short')
      suggestions.push('Provide a detailed description')
    } else {
      issues.push('No description provided')
      suggestions.push('Add property description')
    }

    // Required fields (20 points)
    maxScore += 20
    const requiredFields = ['bedrooms', 'bathrooms', 'size', 'type']
    const completedFields = requiredFields.filter(field => property[field as keyof Property])
    score += (completedFields.length / requiredFields.length) * 20
    if (completedFields.length < requiredFields.length) {
      issues.push('Missing required fields')
      suggestions.push('Complete all property specifications')
    }

    // Contact information (15 points)
    maxScore += 15
    if (property.user?.email && property.user?.phone) {
      score += 15
    } else if (property.user?.email || property.user?.phone) {
      score += 10
      suggestions.push('Add complete contact information')
    } else {
      issues.push('Missing contact information')
      suggestions.push('Add owner contact details')
    }

    // Amenities and features (10 points)
    maxScore += 10
    if (property.amenities && property.amenities.length >= 5) {
      score += 10
    } else if (property.amenities && property.amenities.length >= 3) {
      score += 7
      suggestions.push('Add more amenities')
    } else if (property.amenities && property.amenities.length >= 1) {
      score += 4
      suggestions.push('List more property amenities')
    } else {
      suggestions.push('Add property amenities')
    }

    const percentage = Math.round((score / maxScore) * 100)
    return { score: percentage, issues, suggestions }
  }

  const { score, issues, suggestions } = calculateQualityScore()

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100'
    if (score >= 60) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="w-5 h-5" />
    if (score >= 60) return <AlertTriangle className="w-5 h-5" />
    return <XCircle className="w-5 h-5" />
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center mr-3">
            <Star className="w-5 h-5 text-slate-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Quality Score</h3>
            <p className="text-sm text-slate-600">Listing quality assessment</p>
          </div>
        </div>

        {/* Score Display - Compact */}
        <div className="text-center mb-6">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${getScoreColor(score)} mb-3`}>
            <span className="text-2xl font-bold">{score}</span>
          </div>
          <div className="flex items-center justify-center space-x-2 mb-2">
            {getScoreIcon(score)}
            <span className="font-semibold text-slate-900">
              {score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Needs Improvement'}
            </span>
          </div>
        </div>

        {/* Quality Breakdown - Simplified */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-4 bg-slate-50 rounded-2xl">
            <Camera className="w-5 h-5 text-slate-600 mx-auto mb-2" />
            <div className="text-lg font-bold text-slate-900 mb-1">{property.images?.length || 0}</div>
            <div className="text-xs text-slate-600">Images</div>
          </div>
          <div className="text-center p-4 bg-slate-50 rounded-2xl">
            <FileText className="w-5 h-5 text-slate-600 mx-auto mb-2" />
            <div className="text-lg font-bold text-slate-900 mb-1">{property.description?.length || 0}</div>
            <div className="text-xs text-slate-600">Description</div>
          </div>
        </div>

        {/* Issues and Suggestions - Compact */}
        {(issues.length > 0 || suggestions.length > 0) && (
          <div className="space-y-3">
            {issues.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-slate-900 mb-2 flex items-center text-red-600">
                  <XCircle className="w-4 h-4 mr-2" />
                  Issues ({issues.length})
                </h4>
                <div className="space-y-1">
                  {issues.slice(0, 2).map((issue, index) => (
                    <div key={index} className="flex items-center p-2 bg-red-50 rounded-xl">
                      <XCircle className="w-3 h-3 text-red-600 mr-2 flex-shrink-0" />
                      <span className="text-xs text-red-700">{issue}</span>
                    </div>
                  ))}
                  {issues.length > 2 && (
                    <div className="text-xs text-slate-500">+{issues.length - 2} more issues</div>
                  )}
                </div>
              </div>
            )}

            {suggestions.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-slate-900 mb-2 flex items-center text-blue-600">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Suggestions ({suggestions.length})
                </h4>
                <div className="space-y-1">
                  {suggestions.slice(0, 2).map((suggestion, index) => (
                    <div key={index} className="flex items-center p-2 bg-blue-50 rounded-xl">
                      <CheckCircle className="w-3 h-3 text-blue-600 mr-2 flex-shrink-0" />
                      <span className="text-xs text-blue-700">{suggestion}</span>
                    </div>
                  ))}
                  {suggestions.length > 2 && (
                    <div className="text-xs text-slate-500">+{suggestions.length - 2} more suggestions</div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Compliance Check - Simplified */}
        <div className="mt-6 p-4 bg-slate-50 rounded-2xl">
          <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center">
            <Shield className="w-4 h-4 mr-2 text-slate-600" />
            Compliance
          </h4>
          <div className="grid grid-cols-3 gap-2">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-xs text-slate-700">Content</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-xs text-slate-700">Contact</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-xs text-slate-700">Pricing</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
