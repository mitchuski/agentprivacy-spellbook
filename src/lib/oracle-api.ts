/**
 * Oracle Swordsman API Client
 * Connects frontend to Oracle backend for submission tracking
 */

const ORACLE_API_URL = process.env.NEXT_PUBLIC_ORACLE_API_URL || 'http://localhost:3001';

export interface SubmissionStatus {
  status: 'pending' | 'verified' | 'inscribed' | 'rejected' | 'failed';
  tracking_code: string;
  quality_score?: number | null;
  matched_act?: string | null;
  reasoning?: string | null;
  txid?: string;
  created_at?: string;
  verified_at?: string | null;
}

export interface SubmissionResponse {
  success: boolean;
  payment_address: string;
  amount: number;
  memo: string;
  tracking_code: string;
  tale_id: string;
  instructions?: {
    step1: string;
    step2: string;
    step3: string;
    step4: string;
    step5: string;
  };
}

/**
 * Submit proverb for processing
 */
export async function submitProverb(
  proverb: string,
  taleId: string,
  trackingCode?: string
): Promise<SubmissionResponse> {
  try {
    const response = await fetch(`${ORACLE_API_URL}/api/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        proverb,
        taleId,
        trackingCode,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error('Error submitting proverb:', error);
    throw error;
  }
}

/**
 * Check submission status
 */
export async function checkStatus(trackingCode: string): Promise<SubmissionStatus> {
  try {
    const response = await fetch(`${ORACLE_API_URL}/api/status/${trackingCode}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return {
          status: 'pending',
          tracking_code: trackingCode,
        };
      }
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error('Error checking status:', error);
    // Return pending status on error
    return {
      status: 'pending',
      tracking_code: trackingCode,
    };
  }
}

/**
 * Get statistics
 */
export async function getStats(): Promise<any> {
  try {
    const response = await fetch(`${ORACLE_API_URL}/api/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      // Silently return null for non-200 responses
      return null;
    }

    return await response.json();
  } catch (error: any) {
    // Silently handle network errors (API endpoint may not be available)
    // Don't log to console to avoid cluttering error output
    return null;
  }
}

/**
 * Get static inscriptions data (fallback)
 */
function getStaticInscriptions(): {
  inscriptions: any[];
  total: number;
  countByAct: Record<number, number>;
} {
  // Try to load from static JSON file
  try {
    // This will be available at /data/inscriptions.json after build
    // For now, return empty data - will be populated when you add the JSON file
    return {
      inscriptions: [],
      total: 0,
      countByAct: {},
    };
  } catch (error) {
    return {
      inscriptions: [],
      total: 0,
      countByAct: {},
    };
  }
}

/**
 * Get onchain inscriptions from the inscription indexer
 * Hybrid approach: Try API first, fallback to static data
 */
export async function getInscriptions(): Promise<{
  inscriptions: any[];
  total: number;
  countByAct: Record<number, number>;
} | null> {
  // Try API first (if ORACLE_API_URL is set and not localhost)
  const isProduction = typeof window !== 'undefined' && 
    !window.location.hostname.includes('localhost') &&
    !window.location.hostname.includes('127.0.0.1');
  
  if (ORACLE_API_URL && ORACLE_API_URL !== 'http://localhost:3003' && isProduction) {
    try {
      const response = await fetch(`${ORACLE_API_URL}/api/inscriptions`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Add timeout for production
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Loaded inscriptions from API');
        return data;
      }
    } catch (error: any) {
      // API unavailable, fall back to static data
      console.warn('Oracle API unavailable, using static data:', error.message);
    }
  }

  // Fallback: Try to load static data from JSON file
  // In Next.js static export, public/ files are served from root
  try {
    const response = await fetch('/data/inscriptions.json', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-cache', // Don't cache the JSON file
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Loaded inscriptions from static data');
      return data;
    } else {
      console.warn(`Static data file returned ${response.status}: ${response.statusText}`);
    }
  } catch (error: any) {
    // Static file also unavailable
    console.warn('Static inscriptions data unavailable:', error.message);
  }

  // Final fallback: return empty data
  return getStaticInscriptions();
}

