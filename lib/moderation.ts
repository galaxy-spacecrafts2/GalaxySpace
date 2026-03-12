/**
 * Content Moderation System
 * 
 * This is a local, rule-based content moderation system that works without external APIs.
 * It uses pattern matching, keyword detection, and heuristics to identify potentially
 * harmful content.
 */

interface ModerationResult {
  isClean: boolean
  score: number // 0-100, higher = more problematic
  flags: string[]
  message?: string
}

// Categories of problematic content
const PROFANITY_PATTERNS = [
  // English profanity (basic patterns)
  /\b(f+u+c+k+|f+[*@#$%]+c+k+|fuk|fck)\b/gi,
  /\b(sh+i+t+|sh+[*@#$%]+t+|sht)\b/gi,
  /\b(a+s+s+h+o+l+e+|a+[*@#$%]+s+h+o+l+e+)\b/gi,
  /\b(b+i+t+c+h+|b+[*@#$%]+t+c+h+)\b/gi,
  /\b(d+a+m+n+|d+[*@#$%]+m+n+)\b/gi,
  /\b(c+u+n+t+)\b/gi,
  /\b(d+i+c+k+|d+[*@#$%]+c+k+)\b/gi,
  
  // Portuguese profanity
  /\b(porra|caralho|foda|foder|merda|bosta|cuzão|buceta|puta|viado|desgraça)\b/gi,
  /\b(p+u+t+a+|m+e+r+d+a+|c+a+r+a+l+h+o+)\b/gi,
  
  // Spanish profanity
  /\b(mierda|puta|coño|joder|pendejo|chingada|cabron|verga)\b/gi,
]

const HATE_SPEECH_PATTERNS = [
  // Slurs and hate terms (keeping minimal for demonstration)
  /\b(nazi|hitler|kill\s*(all|every|them))\b/gi,
  /\b(hate\s*(you|them|all)|death\s*to)\b/gi,
  /\b(terrorist|bomb\s*(threat|them))\b/gi,
]

const SPAM_PATTERNS = [
  // Crypto/financial scams
  /\b(free\s*bitcoin|crypto\s*giveaway|double\s*your\s*money)\b/gi,
  /\b(click\s*here|check\s*my\s*bio|link\s*in\s*bio)\b/gi,
  /\b(make\s*money\s*fast|get\s*rich\s*quick)\b/gi,
  
  // URL spam detection
  /(bit\.ly|tinyurl|goo\.gl|t\.co)\/[a-z0-9]+/gi,
  
  // Excessive caps (spam indicator)
  /[A-Z]{10,}/g,
  
  // Repeated characters (spam indicator)
  /(.)\1{5,}/g,
]

const HARASSMENT_KEYWORDS = [
  'kill yourself',
  'kys',
  'go die',
  'end yourself',
  'nobody likes you',
  'worthless',
  'loser',
  'pathetic',
]

const ADULT_CONTENT_PATTERNS = [
  /\b(porn|xxx|nsfw|nude|naked|sex\s*tape)\b/gi,
  /\b(onlyfans|fansly|camgirl)\b/gi,
]

// Contextual patterns that might indicate toxic behavior
const TOXIC_PHRASES = [
  /you('re|\s+are)\s+(stupid|dumb|idiot|moron|retard)/gi,
  /shut\s*(up|the\s*f)/gi,
  /nobody\s*(asked|cares)/gi,
  /get\s*(lost|out|away)/gi,
]

/**
 * Calculate a toxicity score for the given text
 */
function calculateToxicityScore(text: string): { score: number; flags: string[] } {
  const flags: string[] = []
  let score = 0
  const normalizedText = text.toLowerCase()

  // Check profanity
  for (const pattern of PROFANITY_PATTERNS) {
    if (pattern.test(text)) {
      flags.push('profanity')
      score += 25
      break
    }
  }

  // Check hate speech
  for (const pattern of HATE_SPEECH_PATTERNS) {
    if (pattern.test(text)) {
      flags.push('hate_speech')
      score += 50
      break
    }
  }

  // Check spam
  let spamScore = 0
  for (const pattern of SPAM_PATTERNS) {
    if (pattern.test(text)) {
      spamScore += 15
    }
  }
  if (spamScore > 0) {
    flags.push('spam')
    score += Math.min(spamScore, 40)
  }

  // Check harassment
  for (const keyword of HARASSMENT_KEYWORDS) {
    if (normalizedText.includes(keyword)) {
      flags.push('harassment')
      score += 40
      break
    }
  }

  // Check adult content
  for (const pattern of ADULT_CONTENT_PATTERNS) {
    if (pattern.test(text)) {
      flags.push('adult_content')
      score += 35
      break
    }
  }

  // Check toxic phrases
  for (const pattern of TOXIC_PHRASES) {
    if (pattern.test(text)) {
      flags.push('toxic_behavior')
      score += 20
      break
    }
  }

  // Check for excessive caps (shouting)
  const capsRatio = (text.match(/[A-Z]/g) || []).length / text.length
  if (text.length > 10 && capsRatio > 0.7) {
    flags.push('excessive_caps')
    score += 10
  }

  // Check for character spam
  if (/(.)\1{7,}/.test(text)) {
    flags.push('character_spam')
    score += 10
  }

  return { score: Math.min(score, 100), flags: [...new Set(flags)] }
}

/**
 * Generate a user-friendly message based on flags
 */
function generateMessage(flags: string[]): string {
  if (flags.includes('hate_speech')) {
    return 'Your message contains hate speech and cannot be posted.'
  }
  if (flags.includes('harassment')) {
    return 'Your message appears to contain harassment. Please be respectful to others.'
  }
  if (flags.includes('profanity')) {
    return 'Please avoid using profanity in your messages.'
  }
  if (flags.includes('adult_content')) {
    return 'Adult content is not allowed on this platform.'
  }
  if (flags.includes('spam')) {
    return 'Your message appears to be spam. Please post genuine content.'
  }
  if (flags.includes('toxic_behavior')) {
    return 'Please maintain a respectful tone in your messages.'
  }
  if (flags.includes('excessive_caps')) {
    return 'Please avoid using excessive capital letters.'
  }
  return 'Your message was flagged for review. Please modify and try again.'
}

/**
 * Main moderation function
 * 
 * @param content - The text content to moderate
 * @param threshold - Score threshold for blocking (default: 30)
 * @returns ModerationResult with isClean status, score, flags, and message
 */
export function moderateContent(content: string, threshold: number = 30): ModerationResult {
  // Empty or very short content is fine
  if (!content || content.trim().length < 2) {
    return { isClean: true, score: 0, flags: [] }
  }

  const { score, flags } = calculateToxicityScore(content)

  return {
    isClean: score < threshold,
    score,
    flags,
    message: flags.length > 0 ? generateMessage(flags) : undefined,
  }
}

/**
 * Check if content is safe for posting
 * Simple boolean version for quick checks
 */
export function isContentSafe(content: string): boolean {
  return moderateContent(content).isClean
}

/**
 * Sanitize content by removing/replacing problematic parts
 * Note: This is a simple implementation - use with caution
 */
export function sanitizeContent(content: string): string {
  let sanitized = content

  // Replace profanity with asterisks
  for (const pattern of PROFANITY_PATTERNS) {
    sanitized = sanitized.replace(pattern, (match) => '*'.repeat(match.length))
  }

  // Remove excessive caps
  if ((sanitized.match(/[A-Z]/g) || []).length / sanitized.length > 0.7) {
    sanitized = sanitized.toLowerCase()
    // Capitalize first letter of sentences
    sanitized = sanitized.replace(/(^|\. )([a-z])/g, (_, p1, p2) => p1 + p2.toUpperCase())
  }

  // Remove excessive repeated characters
  sanitized = sanitized.replace(/(.)\1{4,}/g, '$1$1$1')

  return sanitized
}

export type { ModerationResult }
