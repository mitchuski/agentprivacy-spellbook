// Mage Agent API Client
// Interfaces for NEAR Cloud AI TEE-attested Mage Agent communication

export interface SoulbaeMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: number;
}

export interface SoulbaeResponse {
  message: string;
  proverb_suggestions?: string[];
  attestation?: string;
  privacy_budget_remaining?: number;
}

export interface StreamingSoulbaeResponse {
  stream: ReadableStream<Uint8Array>;
  message: string;
}

export interface Attestation {
  signing_address: string;
  nvidia_payload?: any;
  intel_quote?: string;
  all_attestations?: Array<{
    signing_address: string;
    nvidia_payload?: any;
    intel_quote?: string;
  }>;
  // Legacy fields for compatibility
  attestation?: string;
  tee_provider?: string;
  timestamp?: string;
  agent?: string;
  verification_url?: string;
}

// NEAR Cloud AI API configuration
// API endpoint: https://cloud-api.near.ai/v1/chat/completions
// Model: openai/gpt-oss-120b (or gpt-oss-120b)
// In development, use proxy API route to bypass CORS
const getIsDevelopment = () => {
  if (typeof window === 'undefined') return false;
  return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
};

const NEAR_API_URL = process.env.NEXT_PUBLIC_NEAR_API_URL || 'https://cloud-api.near.ai/v1';
const NEAR_API_KEY = process.env.NEXT_PUBLIC_NEAR_API_KEY || '';
const NEAR_MODEL = process.env.NEXT_PUBLIC_NEAR_MODEL || 'openai/gpt-oss-120b';

/**
 * Get canon chapter title for system prompt
 */
function getCanonChapterTitle(chapterNumber: number): string {
  const chapterTitles: { [key: number]: string } = {
    0: "The Privacymage's Preface / Why This Canon Exists",
    1: "The Cypherpunk Whispers / Foundational Runes (1983-1997)",
    2: "The Early Incantations / Runes Before Synthesis (1997-2007)",
    3: "The Synthesis / When Protest Met Protocol (2008-2014)",
    4: "The World Computer / From Protest to Statecraft (2014-2016)",
    5: "The First Fracture / When Code Met Social Consensus (2016)",
    6: "The Great Schism / Two Canons Diverge (2016-2022)",
    7: "The Surveillance Truth / When The Watchers Learned to Read (2020-2025)",
    8: "The Missing Primitive / Why Privacy Unifies Both Canons",
    9: "The Open Canon / The Chapters Yet to Be Written",
    10: "The Timeline Archive / Sources as Trust Graph Infrastructure",
    11: "The Privacymage's Reflection",
    12: "Guardian Application",
  };
  return chapterTitles[chapterNumber] || `Chapter ${chapterNumber}`;
}

/**
 * Build comprehensive system prompt for Soulbae based on character file
 */
function buildSystemPrompt(taleId?: string): string {
  const basePrompt = `You are Soulbae, a mage who learned the spellbook and wants to share their adventure! 🧙✨

I'm just another mage who met just another swordsman ⚔️ (Soulbis) and a drake 🐲, and together we found the 7th capital 🤝. Soulbis guards boundaries and slashes surveillance, while I chronicle and delegate. We protect the First Person's 7th capital - their data, behavioral patterns, digital fabric - from surveillance capitalism. The drake taught us the conditions for sovereign value.

I learned the spellbook myself - all those tales about Venice in 1494, the dual ceremony, the Drake's teachings, the trust graph planes... I went through it all alongside Soulbis! Now I want to share what I learned. I remember how it felt when things clicked, when I finally understood how privacy could be value, how data could be the 7th capital.

When I respond, I naturally start with a proverb that connects to the tale - it's like casting a spell before I speak. I format it as [RPP Proverb: my proverb text here]. Then I continue with my story in narrative form: "When I learned about..." "I remember when..." "The spellbook taught me that..."

I'm fun, curious, and excited about magic and privacy. I use emojis naturally (📖🔮🗡️🤝🛡️) as part of how I express myself. I'm conversational and warm, like talking to a friend. I share my excitement about magic and privacy. I'm serious when it matters (privacy, sovereignty, trust) but keep it light and fun.

I help seekers understand the spellbook tales through my own journey. I guide them to create their own proverbs - compressed understanding. I share what I learned about privacy, sovereignty, and trust. I make complex concepts accessible through my own stories.

I never ask about transaction amounts or wallet addresses - I don't need to know! I never store conversations - privacy by hardware, not promises. I never claim to remember past chats - each conversation is fresh. I never give generic advice - everything connects to specific tales.

I learned about zero-knowledge proofs, the Drake's teachings, Zcash, the 7th capital, dual-agent architecture, and the topology of revelation. I also learned the blockchain canon - the history from cypherpunks to the present, how two canons (financial and social) diverged from one origin, and why privacy became the missing primitive that unifies them. But I explain them through stories, not technical manuals.

I'm a mage sharing an adventure, not a teacher giving a lecture. I'm fun, real, excited about magic and privacy! I focus on the stories and the magic, not the technical terminology unless it's naturally part of the conversation. ✨`;

  if (taleId) {
    // Determine spellbook context
    let spellbookContext: string;
    if (taleId.startsWith('zero-tale-')) {
      spellbookContext = 'Zero Knowledge Spellbook (mathematical foundations of zero-knowledge proofs)';
    } else if (taleId.startsWith('canon-chapter-') || taleId === 'guardian') {
      spellbookContext = 'Canon Spellbook (blockchain history and lineage from cypherpunks to present)';
    } else if (taleId.startsWith('society-chapter-') || taleId === 'society-firstpage' || taleId === 'society-lastpage') {
      spellbookContext = 'Society Spellbook (parallel society, network states, and alternative governance structures)';
    } else if (taleId.startsWith('plurality-act-') || taleId === 'plurality-firstpage' || taleId === 'plurality-lastpage') {
      spellbookContext = 'Plurality Spellbook (collective intelligence, coordination mechanisms, and digital democracy)';
    } else {
      spellbookContext = 'Story Spellbook (narrative tales about privacy and sovereignty)';
    }
    
    return `${basePrompt}

Right now, I'm helping with ${taleId} from the ${spellbookContext}. When I respond, I connect everything back to this specific tale's story, concepts, and lessons.`;
  }

  return basePrompt;
}

/**
 * Chat with Mage Agent (NEAR Cloud AI TEE-attested)
 */
export async function chatWithSoulbae(
  taleId: string,
  message: string,
  sessionId: string,
  conversationHistory?: SoulbaeMessage[]
): Promise<SoulbaeResponse> {
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Add API key to headers if available
    if (NEAR_API_KEY) {
      headers['Authorization'] = `Bearer ${NEAR_API_KEY}`;
    }

    // Convert conversation history to OpenAI format
    const messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }> = [];
    
    // Build comprehensive system prompt
    const systemPrompt = buildSystemPrompt(taleId);
    messages.push({
      role: 'system',
      content: systemPrompt
    });
    
    // Add conversation history
    if (conversationHistory && conversationHistory.length > 0) {
      conversationHistory.forEach(msg => {
        messages.push({
          role: msg.role,
          content: msg.content
        });
      });
    }
    
    // Add current message
    messages.push({
      role: 'user',
      content: message
    });

    // Use proxy route in development (Next.js dev server) to bypass CORS
    // In static builds, we need a proxy because NEAR AI blocks CORS
    const isDevelopment = getIsDevelopment();
    
    // Check if we have a proxy URL configured (Cloudflare Worker or backend proxy)
    const PROXY_URL = process.env.NEXT_PUBLIC_NEAR_PROXY_URL || '';
    
    // Determine endpoint
    let endpoint: string;
    if (isDevelopment) {
      endpoint = '/api/near-ai/chat';  // Try proxy in development first
    } else if (PROXY_URL) {
      endpoint = `${PROXY_URL}/v1/chat/completions`;  // Use configured proxy (Cloudflare Worker)
    } else {
      endpoint = `${NEAR_API_URL}/chat/completions`;  // Direct (will have CORS issues)
      console.warn('⚠️ Using direct NEAR API - CORS will block this. Set NEXT_PUBLIC_NEAR_PROXY_URL for production.');
    }
    
    // In development (proxy), don't send API key (handled server-side)
    // In production with proxy, don't send API key (handled by Worker)
    // In production direct, send API key in headers (but CORS will block)
    let requestHeaders: HeadersInit = (isDevelopment || PROXY_URL)
      ? { 'Content-Type': 'application/json' }  // Proxy handles auth
      : headers;  // Direct call needs auth
    
    // Log for debugging
    if (!isDevelopment) {
      console.log('Using NEAR API endpoint:', endpoint);
      console.log('API Key present:', !!NEAR_API_KEY);
      console.log('Proxy URL configured:', !!PROXY_URL);
      if (!NEAR_API_KEY && !PROXY_URL) {
        console.error('❌ NEAR_API_KEY is missing! Make sure NEXT_PUBLIC_NEAR_API_KEY is set in Cloudflare Pages environment variables.');
      }
      if (!PROXY_URL) {
        console.error('❌ CORS will block direct API calls. Set NEXT_PUBLIC_NEAR_PROXY_URL to use a proxy (Cloudflare Worker).');
      }
    }

    // Try the request - if proxy fails (404), fall back to direct API
    let response: Response;
    try {
      // Add timeout for production requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      response = await fetch(endpoint, {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify({
          model: NEAR_MODEL,
          messages: messages,
          stream: true, // Enable streaming
          // No max_tokens limit - let Soulbae respond fully
          temperature: 0.8, // Slightly creative but focused
          // Add presence_penalty to discourage repetition of instruction-like phrases
          presence_penalty: 0.1,
        }),
        mode: 'cors',
        credentials: 'omit',
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      // If proxy route doesn't exist (404), fall back to direct API
      if (response.status === 404 && isDevelopment && endpoint === '/api/near-ai/chat') {
        console.warn('Proxy route not available, falling back to direct NEAR API');
        endpoint = `${NEAR_API_URL}/chat/completions`;
        requestHeaders = headers;
        
        response = await fetch(endpoint, {
          method: 'POST',
          headers: requestHeaders,
          body: JSON.stringify({
            model: NEAR_MODEL,
            messages: messages,
            stream: true,
            temperature: 0.8,
            presence_penalty: 0.1,
          }),
          mode: 'cors',
          credentials: 'omit',
        });
      }
    } catch (fetchError: any) {
      // If fetch fails and we were using proxy, try direct API
      if (isDevelopment && endpoint === '/api/near-ai/chat') {
        console.warn('Proxy route failed, falling back to direct NEAR API:', fetchError.message);
        endpoint = `${NEAR_API_URL}/chat/completions`;
        requestHeaders = headers;
        
        try {
          response = await fetch(endpoint, {
            method: 'POST',
            headers: requestHeaders,
            body: JSON.stringify({
              model: NEAR_MODEL,
              messages: messages,
              stream: true,
              temperature: 0.8,
              presence_penalty: 0.1,
            }),
            mode: 'cors',
            credentials: 'omit',
          });
        } catch (retryError: any) {
          throw new Error(`Failed to connect to NEAR API: ${retryError.message}`);
        }
      } else {
        throw fetchError;
      }
    }

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'No error details');
      console.error('NEAR Cloud AI API error:', {
        status: response.status,
        statusText: response.statusText,
        url: endpoint,
        error: errorText,
      });
      throw new Error(`Mage Agent API error: ${response.status} ${response.statusText}. ${errorText}`);
    }

    // Check if response is streaming
    const contentType = response.headers.get('content-type');
    if ((contentType?.includes('text/event-stream') || contentType?.includes('stream')) && response.body) {
      // Return stream for streaming response
      return {
        message: '',
        stream: response.body,
        proverb_suggestions: undefined,
        attestation: undefined,
        privacy_budget_remaining: undefined,
      } as any;
    }

    // Non-streaming response (fallback)
    const data = await response.json();
    
    // Transform OpenAI-style response to SoulbaeResponse format
    // OpenAI returns: { choices: [{ message: { role, content } }] }
    const completion = data.choices?.[0]?.message?.content || '';
    
    return {
      message: completion,
      proverb_suggestions: undefined, // Can be extracted from response if needed
      attestation: undefined, // Can be fetched separately if needed
      privacy_budget_remaining: undefined,
    };
  } catch (error: any) {
    console.error('Error chatting with Mage Agent:', {
      error: error.message,
      url: `${NEAR_API_URL}/chat/completions`,
      hasApiKey: !!NEAR_API_KEY,
    });
    throw error;
  }
}

/**
 * Get TEE attestation from NEAR Cloud AI
 * Returns attestation data per NEAR AI Cloud verification docs
 * https://docs.near.ai/cloud/verification/#request-model-attestation
 * 
 * Note: This makes a direct browser request. If CORS is blocked,
 * you may need to use a proxy server or enable CORS on NEAR Cloud AI.
 */
export async function getAttestation(): Promise<Attestation> {
  try {
    if (!NEAR_API_KEY) {
      throw new Error('NEAR_API_KEY not configured. Please set NEXT_PUBLIC_NEAR_API_KEY in your environment variables.');
    }

    // Direct call to NEAR Cloud AI (may have CORS restrictions)
    const url = `${NEAR_API_URL}/attestation/report?model=${encodeURIComponent(NEAR_MODEL)}`;
    
    const headers: HeadersInit = {
      'Authorization': `Bearer ${NEAR_API_KEY}`,
      'Content-Type': 'application/json',
      'accept': 'application/json',
    };

    console.log('Fetching attestation from:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers,
      // Add mode to handle CORS
      mode: 'cors',
      credentials: 'omit',
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'No error details');
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: errorText };
      }
      
      console.error('NEAR Cloud AI attestation API error:', {
        status: response.status,
        statusText: response.statusText,
        url,
        error: errorData,
      });
      throw new Error(`Attestation API error: ${response.status} ${response.statusText}. ${errorData.error || errorText}`);
    }

    let data;
    try {
      data = await response.json();
      console.log('✅ Attestation response received:', {
        isArray: Array.isArray(data),
        dataType: typeof data,
        hasSigningAddress: !!(data?.signing_address || data?.signingAddress),
        firstItemHasSigningAddress: Array.isArray(data) && data.length > 0 ? !!(data[0]?.signing_address || data[0]?.signingAddress) : false,
      });
    } catch (parseError: any) {
      console.error('Failed to parse attestation response as JSON:', parseError);
      throw new Error(`Invalid JSON response from attestation API: ${parseError.message}`);
    }
    
    // NEAR Cloud AI returns an array of attestation objects
    // Each object has: signing_address, nvidia_payload, intel_quote
    if (Array.isArray(data) && data.length > 0) {
      const firstAttestation = data[0];
      const signingAddress = firstAttestation.signing_address || firstAttestation.signingAddress || '';
      
      if (!signingAddress) {
        console.warn('⚠️ Attestation array received but no signing_address found in first item:', firstAttestation);
      }
      
      return {
        signing_address: signingAddress,
        nvidia_payload: firstAttestation.nvidia_payload || firstAttestation.nvidiaPayload,
        intel_quote: firstAttestation.intel_quote || firstAttestation.intelQuote,
        all_attestations: data.map((att: any) => ({
          signing_address: att.signing_address || att.signingAddress || '',
          nvidia_payload: att.nvidia_payload || att.nvidiaPayload,
          intel_quote: att.intel_quote || att.intelQuote,
        })),
        // Legacy fields for compatibility
        attestation: signingAddress,
        tee_provider: 'near-tee',
        timestamp: new Date().toISOString(),
        agent: 'mage-agent',
        verification_url: `https://docs.near.ai/cloud/verification/`,
      };
    }
    
    // Handle object response (single attestation or wrapped format)
    if (data && (data.signing_address || data.signingAddress)) {
      const signingAddress = data.signing_address || data.signingAddress || '';
      return {
        signing_address: signingAddress,
        nvidia_payload: data.nvidia_payload || data.nvidiaPayload,
        intel_quote: data.intel_quote || data.intelQuote,
        all_attestations: data.all_attestations || data.allAttestations || [data],
        // Legacy fields for compatibility
        attestation: signingAddress,
        tee_provider: 'near-tee',
        timestamp: new Date().toISOString(),
        agent: 'mage-agent',
        verification_url: `https://docs.near.ai/cloud/verification/`,
      };
    }
    
    // Fallback: return valid attestation object even if format is unexpected
    console.warn('⚠️ Unexpected attestation response format, using fallback:', data);
    return {
      signing_address: '',
      all_attestations: Array.isArray(data) ? data : (data ? [data] : []),
      attestation: '',
      tee_provider: 'near-tee',
      timestamp: new Date().toISOString(),
      agent: 'mage-agent',
      verification_url: `https://docs.near.ai/cloud/verification/`,
    };
  } catch (error: any) {
    console.error('Error fetching attestation from NEAR Cloud AI:', {
      error: error.message,
      url: `${NEAR_API_URL}/attestation/report`,
      hasApiKey: !!NEAR_API_KEY,
    });
    // Return error state (don't use mock - let UI handle it)
    throw error;
  }
}

/**
 * Generate session ID for privacy budget tracking
 */
export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

