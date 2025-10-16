'use client'

import { TrendingUp, TrendingDown, DollarSign, BarChart3, Target, AlertCircle } from 'lucide-react'
import { Property } from '@/types'

interface PropertyPriceAnalysisProps {
  property: Property
  similarProperties?: Property[]
}

export default function PropertyPriceAnalysis({ property, similarProperties = [] }: PropertyPriceAnalysisProps) {
  // Mock market analysis data - in real implementation, this would come from API
  const safePrice = property.price || 0
  const safeSize = property.size || 1
  
  const marketAnalysis = {
    averagePrice: safePrice * 0.95, // 5% below current price
    medianPrice: safePrice * 0.98, // 2% below current price
    priceRange: {
      min: safePrice * 0.8,
      max: safePrice * 1.2
    },
    marketTrend: 'increasing', // 'increasing', 'decreasing', 'stable'
    pricePerSqft: safeSize ? safePrice / safeSize : 0,
    marketRate: 'at_market' // 'above_market', 'at_market', 'below_market'
  }

  const getMarketRateColor = (rate: string) => {
    switch (rate) {
      case 'above_market':
        return 'text-red-600 bg-red-100'
      case 'at_market':
        return 'text-green-600 bg-green-100'
      case 'below_market':
        return 'text-blue-600 bg-blue-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getMarketRateIcon = (rate: string) => {
    switch (rate) {
      case 'above_market':
        return <TrendingUp className="w-4 h-4" />
      case 'at_market':
        return <Target className="w-4 h-4" />
      case 'below_market':
        return <TrendingDown className="w-4 h-4" />
      default:
        return <BarChart3 className="w-4 h-4" />
    }
  }

  const formatPrice = (price: number, currency: string = 'NGN') => {
    if (!price || isNaN(price)) return 'N/A'
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 overflow-hidden">
      <div className="p-8">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-2xl flex items-center justify-center mr-4">
            <BarChart3 className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Price Analysis</h3>
            <p className="text-sm text-slate-600">Market comparison and pricing insights</p>
          </div>
        </div>

        {/* Current Price vs Market */}
        <div className="mb-8 p-6 bg-gradient-to-r from-slate-50 to-white rounded-2xl border border-slate-200/50">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-slate-900">Current Price</h4>
            <span className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-semibold ${getMarketRateColor(marketAnalysis.marketRate)}`}>
              {getMarketRateIcon(marketAnalysis.marketRate)}
              <span className="ml-1 capitalize">{marketAnalysis.marketRate.replace('_', ' ')}</span>
            </span>
          </div>
              <div className="text-3xl font-bold text-slate-900 mb-2">
                {formatPrice(safePrice, property.currency)}
              </div>
          <div className="text-sm text-slate-600">
            {property.size && `${formatPrice(marketAnalysis.pricePerSqft, property.currency)} per sq ft`}
          </div>
        </div>

        {/* Market Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="text-center p-4 bg-blue-50 rounded-xl">
            <div className="text-2xl font-bold text-blue-700 mb-1">
              {formatPrice(marketAnalysis.averagePrice, property.currency)}
            </div>
            <div className="text-sm text-blue-600 font-medium">Market Average</div>
            <div className="text-xs text-blue-500 mt-1">
              {marketAnalysis.averagePrice > 0 ? ((safePrice - marketAnalysis.averagePrice) / marketAnalysis.averagePrice * 100).toFixed(1) : '0.0'}% difference
            </div>
          </div>

          <div className="text-center p-4 bg-green-50 rounded-xl">
            <div className="text-2xl font-bold text-green-700 mb-1">
              {formatPrice(marketAnalysis.medianPrice, property.currency)}
            </div>
            <div className="text-sm text-green-600 font-medium">Market Median</div>
            <div className="text-xs text-green-500 mt-1">
              {marketAnalysis.medianPrice > 0 ? ((safePrice - marketAnalysis.medianPrice) / marketAnalysis.medianPrice * 100).toFixed(1) : '0.0'}% difference
            </div>
          </div>

          <div className="text-center p-4 bg-purple-50 rounded-xl">
            <div className="text-2xl font-bold text-purple-700 mb-1">
              {marketAnalysis.marketTrend === 'increasing' ? '+' : marketAnalysis.marketTrend === 'decreasing' ? '-' : '='}
            </div>
            <div className="text-sm text-purple-600 font-medium">Market Trend</div>
            <div className="text-xs text-purple-500 mt-1 capitalize">
              {marketAnalysis.marketTrend}
            </div>
          </div>
        </div>

        {/* Price Range */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-slate-900 mb-4">Market Price Range</h4>
          <div className="relative">
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full relative"
                style={{ 
                  width: '100%',
                  background: `linear-gradient(to right, 
                    #3B82F6 0%, 
                    #8B5CF6 50%, 
                    #EC4899 100%)`
                }}
              />
              <div 
                className="absolute top-0 w-4 h-4 bg-white border-2 border-purple-600 rounded-full transform -translate-y-0.5"
                style={{ 
                  left: `${marketAnalysis.priceRange.max > marketAnalysis.priceRange.min ? ((safePrice - marketAnalysis.priceRange.min) / (marketAnalysis.priceRange.max - marketAnalysis.priceRange.min)) * 100 : 50}%` 
                }}
              />
            </div>
            <div className="flex justify-between mt-2 text-sm text-slate-600">
              <span>{formatPrice(marketAnalysis.priceRange.min, property.currency)}</span>
              <span className="font-semibold text-slate-900">{formatPrice(safePrice, property.currency)}</span>
              <span>{formatPrice(marketAnalysis.priceRange.max, property.currency)}</span>
            </div>
          </div>
        </div>

        {/* Similar Properties */}
        {similarProperties.length > 0 && (
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-slate-900 mb-4">Similar Properties</h4>
            <div className="space-y-3">
              {similarProperties.slice(0, 3).map((similar, index) => (
                <div key={similar.id || index} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div>
                    <div className="font-medium text-slate-900">{similar.title}</div>
                    <div className="text-sm text-slate-600">{similar.location}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-slate-900">
                      {formatPrice(similar.price, similar.currency)}
                    </div>
                    <div className="text-sm text-slate-600">
                      {similar.size && `${similar.size} sq ft`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        <div className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl">
          <h4 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2 text-purple-600" />
            Pricing Recommendations
          </h4>
          <div className="space-y-3">
            {marketAnalysis.marketRate === 'above_market' && (
              <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg border border-red-200">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium text-red-800">Price Above Market</div>
                  <div className="text-sm text-red-700">
                    Consider reducing price by {formatPrice(safePrice - marketAnalysis.averagePrice, property.currency)} to align with market rates
                  </div>
                </div>
              </div>
            )}
            
            {marketAnalysis.marketRate === 'below_market' && (
              <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium text-blue-800">Price Below Market</div>
                  <div className="text-sm text-blue-700">
                    You could potentially increase price by up to {formatPrice(marketAnalysis.averagePrice - safePrice, property.currency)}
                  </div>
                </div>
              </div>
            )}

            {marketAnalysis.marketRate === 'at_market' && (
              <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <Target className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium text-green-800">Well-Priced</div>
                  <div className="text-sm text-green-700">
                    Your price is competitive and aligned with market rates
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <BarChart3 className="w-5 h-5 text-slate-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-slate-800">Market Insights</div>
                <div className="text-sm text-slate-700">
                  Properties in this area typically sell within 30-60 days at current market rates
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
