'use client'

import { createContext, useContext } from 'react'
import type { UserProfile } from '@/lib/supabase/profile'

export interface CommunityContextValue {
  userProfile: UserProfile | null
  marketInsights: any
  isLoadingChrome: boolean
}

export const CommunityContext = createContext<CommunityContextValue>({
  userProfile: null,
  marketInsights: null,
  isLoadingChrome: true,
})

export const useCommunity = () => useContext(CommunityContext)
