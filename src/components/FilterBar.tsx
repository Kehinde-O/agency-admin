'use client'

import { useState } from 'react'
import { 
  Search, 
  Filter, 
  X, 
  ChevronDown, 
  MapPin, 
  DollarSign,
  Home,
  Building,
  Car,
  Wifi,
  Shield,
  TreePine,
  Waves,
  Sun,
  Snowflake,
  Wind,
  Zap,
  Wrench
} from 'lucide-react'

interface FilterBarProps {
  onFiltersChange?: (filters: FilterState) => void
  onSearch?: (query: string) => void
  className?: string
}

interface FilterState {
  search: string
  location: string
  propertyType: string[]
  priceRange: { min: number; max: number }
  bedrooms: number[]
  bathrooms: number[]
  amenities: string[]
  features: string[]
}

const PROPERTY_TYPES = [
  { value: 'apartment', label: 'Apartment', icon: Building },
  { value: 'house', label: 'House', icon: Home },
  { value: 'condo', label: 'Condo', icon: Building },
  { value: 'townhouse', label: 'Townhouse', icon: Home },
  { value: 'commercial', label: 'Commercial', icon: Building },
  { value: 'land', label: 'Land', icon: TreePine }
]

const AMENITIES = [
  { value: 'wifi', label: 'WiFi', icon: Wifi },
  { value: 'parking', label: 'Parking', icon: Car },
  { value: 'security', label: 'Security', icon: Shield },
  { value: 'garden', label: 'Garden', icon: TreePine },
  { value: 'pool', label: 'Pool', icon: Waves },
  { value: 'balcony', label: 'Balcony', icon: Sun },
  { value: 'ac', label: 'Air Conditioning', icon: Snowflake },
  { value: 'fan', label: 'Fan', icon: Wind },
  { value: 'electricity', label: 'Electricity', icon: Zap },
  { value: 'maintenance', label: 'Maintenance', icon: Wrench }
]

export default function FilterBar({ onFiltersChange, onSearch, className = '' }: FilterBarProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    location: '',
    propertyType: [],
    priceRange: { min: 0, max: 10000000 },
    bedrooms: [],
    bathrooms: [],
    amenities: [],
    features: []
  })
  
  const [showFilters, setShowFilters] = useState(false)
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updated = { ...filters, ...newFilters }
    setFilters(updated)
    onFiltersChange?.(updated)
  }

  const toggleArrayFilter = (array: string[], value: string, setter: (arr: string[]) => void) => {
    const newArray = array.includes(value) 
      ? array.filter(item => item !== value)
      : [...array, value]
    setter(newArray)
  }

  const toggleNumberArrayFilter = (array: number[], value: number, setter: (arr: number[]) => void) => {
    const newArray = array.includes(value) 
      ? array.filter(item => item !== value)
      : [...array, value]
    setter(newArray)
  }

  const addActiveFilter = (filter: string) => {
    if (!activeFilters.includes(filter)) {
      setActiveFilters(prev => [...prev, filter])
    }
  }

  const removeActiveFilter = (filter: string) => {
    setActiveFilters(prev => prev.filter(f => f !== filter))
  }

  const clearAllFilters = () => {
    setFilters({
      search: '',
      location: '',
      propertyType: [],
      priceRange: { min: 0, max: 10000000 },
      bedrooms: [],
      bathrooms: [],
      amenities: [],
      features: []
    })
    setActiveFilters([])
  }

  return (
    <div className={`bg-white border-b border-slate-200/50 ${className}`}>
      <div className="px-6 py-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Active Filters */}
          {activeFilters.map((filter) => (
            <div key={filter} className="flex items-center bg-slate-800 text-white px-3 py-1.5 rounded-full text-sm">
              <span>{filter}</span>
              <button
                onClick={() => removeActiveFilter(filter)}
                className="ml-2 hover:bg-slate-700 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          
          {/* Search Input */}
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search properties..."
                value={filters.search}
                onChange={(e) => {
                  updateFilters({ search: e.target.value })
                  onSearch?.(e.target.value)
                }}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all"
              />
            </div>
          </div>
          
          {/* Filter Dropdowns */}
          <div className="flex items-center space-x-2">
            <select 
              value={filters.location}
              onChange={(e) => {
                updateFilters({ location: e.target.value })
                if (e.target.value) addActiveFilter(`Area: ${e.target.value}`)
              }}
              className="px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-700 focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
            >
              <option value="">Area</option>
              <option value="Lagos">Lagos</option>
              <option value="Abuja">Abuja</option>
              <option value="Port Harcourt">Port Harcourt</option>
              <option value="Kano">Kano</option>
              <option value="Ibadan">Ibadan</option>
            </select>
            
            <select className="px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-700 focus:ring-2 focus:ring-slate-500 focus:border-slate-500">
              <option>Floor</option>
              <option>Ground Floor</option>
              <option>1st Floor</option>
              <option>2nd Floor</option>
              <option>3rd Floor</option>
            </select>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <Filter className="w-4 h-4 text-slate-600" />
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 p-4 bg-slate-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Property Type */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Property Type</label>
                <div className="space-y-2">
                  {PROPERTY_TYPES.map((type) => {
                    const Icon = type.icon
                    return (
                      <label key={type.value} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={filters.propertyType.includes(type.value)}
                          onChange={() => {
                            toggleArrayFilter(filters.propertyType, type.value, (arr) => 
                              updateFilters({ propertyType: arr })
                            )
                            if (!filters.propertyType.includes(type.value)) {
                              addActiveFilter(`Type: ${type.label}`)
                            }
                          }}
                          className="rounded border-slate-300 text-slate-600 focus:ring-slate-500"
                        />
                        <Icon className="w-4 h-4 text-slate-600" />
                        <span className="text-sm text-slate-700">{type.label}</span>
                      </label>
                    )
                  })}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Price Range</label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-slate-600" />
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.priceRange.min || ''}
                      onChange={(e) => {
                        const min = parseInt(e.target.value) || 0
                        updateFilters({ priceRange: { ...filters.priceRange, min } })
                        if (min > 0) addActiveFilter(`Min: ₦${min.toLocaleString()}`)
                      }}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-slate-600" />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.priceRange.max || ''}
                      onChange={(e) => {
                        const max = parseInt(e.target.value) || 10000000
                        updateFilters({ priceRange: { ...filters.priceRange, max } })
                        if (max < 10000000) addActiveFilter(`Max: ₦${max.toLocaleString()}`)
                      }}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Bedrooms */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Bedrooms</label>
                <div className="grid grid-cols-2 gap-2">
                  {[1, 2, 3, 4, 5, '5+'].map((beds) => (
                    <label key={beds} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={filters.bedrooms.includes(typeof beds === 'number' ? beds : 5)}
                        onChange={() => {
                          const value = typeof beds === 'number' ? beds : 5
                          toggleNumberArrayFilter(filters.bedrooms, value, (arr) => 
                            updateFilters({ bedrooms: arr })
                          )
                          if (!filters.bedrooms.includes(value)) {
                            addActiveFilter(`${beds} bed`)
                          }
                        }}
                        className="rounded border-slate-300 text-slate-600 focus:ring-slate-500"
                      />
                      <span className="text-sm text-slate-700">{beds} bed{beds !== 1 ? 's' : ''}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Amenities</label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {AMENITIES.map((amenity) => {
                    const Icon = amenity.icon
                    return (
                      <label key={amenity.value} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={filters.amenities.includes(amenity.value)}
                          onChange={() => {
                            toggleArrayFilter(filters.amenities, amenity.value, (arr) => 
                              updateFilters({ amenities: arr })
                            )
                            if (!filters.amenities.includes(amenity.value)) {
                              addActiveFilter(amenity.label)
                            }
                          }}
                          className="rounded border-slate-300 text-slate-600 focus:ring-slate-500"
                        />
                        <Icon className="w-4 h-4 text-slate-600" />
                        <span className="text-sm text-slate-700">{amenity.label}</span>
                      </label>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Filter Actions */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200">
              <button
                onClick={clearAllFilters}
                className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
              >
                Clear all filters
              </button>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowFilters(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
