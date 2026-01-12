/**
 * NEAR AI Verification Agent - Oracle Swordsman
 *
 * Usage: node verify-act.js <act_number> "<submitted_proverb>" "<emoji_spell>"
 * Example: node verify-act.js 5 "My proverb here" "🗡️ → 🔮"
 */

const axios = require('axios');

const NEAR_API_KEY = 'sk-876c0f435b14449bac47f13583f5fd68';
const SPELLBOOK_IPFS = 'https://red-acute-chinchilla-216.mypinata.cloud/ipfs/bafkreietjoihzy4wnyvhtdfpn2g5n4j2rdcadanu5yinhkqyr2ax27znhy';

// Parse command line args
const actNumber = parseInt(process.argv[2]) || 5;
const submittedProverb = process.argv[3] || '';
const emojiSpell = process.argv[4] || '';

async function fetchSpellbook() {
  console.log('Fetching spellbook from IPFS...');
  const response = await axios.get(SPELLBOOK_IPFS, { timeout: 30000 });
  return response.data;
}

async function verify() {
  console.log('=== NEAR AI Verification Agent (Oracle Swordsman) ===');
  console.log('');
  console.log('Verifying Act:', actNumber);
  console.log('Submitted Proverb:', submittedProverb || '(none provided)');
  console.log('Emoji Spell:', emojiSpell || '(none provided)');
  console.log('');

  // Fetch full spellbook from IPFS
  const spellbook = await fetchSpellbook();
  console.log('Spellbook version:', spellbook.version);
  console.log('');

  // Get target act details
  const targetAct = spellbook.spellbooks.story.acts.find(a => a.act_number === actNumber);

  if (!targetAct) {
    console.error('Act', actNumber, 'not found in spellbook!');
    console.log('Available acts:', spellbook.spellbooks.story.acts.map(a => a.act_number).join(', '));
    return;
  }

  console.log(`=== Act ${actNumber} Full Context ===`);
  console.log('ID:', targetAct.id);
  console.log('Title:', targetAct.title);
  console.log('Description:', targetAct.description);
  console.log('Keywords:', targetAct.keywords.join(', '));
  console.log('Spell:', targetAct.spell);
  console.log('Official Proverb:', targetAct.proverb);
  console.log('');

  // If no proverb submitted, just show the act info
  if (!submittedProverb) {
    console.log('No proverb submitted - showing act info only.');
    console.log('');
    console.log('To verify a proverb, run:');
    console.log(`node verify-act.js ${actNumber} "your proverb here" "emoji spell here"`);
    return;
  }

  // Build full context for all acts
  const actsContext = spellbook.spellbooks.story.acts.map(act =>
    `Act ${act.act_number} (${act.id}):
  Title: ${act.title}
  Description: ${act.description}
  Keywords: ${act.keywords.join(', ')}
  Spell: ${act.spell}
  Proverb: "${act.proverb}"`
  ).join('\n\n');

  const prompt = `You are a proverb verification expert for the Privacy Spellbook.

A shielded memo was received claiming Act ${actNumber} (${targetAct.id}).
The submitted proverb is: "${submittedProverb}"
${emojiSpell ? `The emoji spell is: ${emojiSpell}` : ''}

FULL SPELLBOOK CONTEXT FROM IPFS:
${actsContext}

TASK:
1. Read Act ${actNumber}'s full description, keywords, spell, and official proverb
2. Verify if the submitted proverb thematically aligns with Act ${actNumber}'s FULL context (not just the proverb)
3. Consider thematic alignment with the act's core concepts and keywords
4. Score semantic similarity from 0.0 to 1.0 based on thematic alignment with the ENTIRE act context

Return ONLY valid JSON:
{
  "quality_score": 0.0-1.0,
  "matched_act": "${targetAct.id}",
  "matched_act_number": ${actNumber},
  "official_proverb": "the Act ${actNumber} official proverb",
  "reasoning": "explanation of thematic connections considering the full act context",
  "approved": true/false
}`;

  console.log('Calling NEAR AI with full spellbook context...');
  console.log('');

  try {
    const response = await axios.post('https://cloud-api.near.ai/v1/chat/completions', {
      model: 'openai/gpt-oss-120b',
      messages: [
        { role: 'system', content: 'You are a proverb verification expert. Analyze thematic similarity against the FULL act context, not just the proverb. Return valid JSON only.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 1500
    }, {
      headers: { 'Authorization': 'Bearer ' + NEAR_API_KEY },
      timeout: 90000
    });

    const message = response.data.choices?.[0]?.message;
    const content = message?.content || message?.reasoning_content || '';

    console.log('=== NEAR AI Response ===');

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0]);
      console.log('');
      console.log('Match Score (MS):', result.quality_score, '(' + Math.round(result.quality_score * 100) + '%)');
      console.log('Matched Act:', result.matched_act);
      console.log('Act Number:', result.matched_act_number);
      console.log('Official Proverb:', result.official_proverb);
      console.log('Approved:', result.approved);
      console.log('');
      console.log('Reasoning:', result.reasoning);
      console.log('');
      console.log('=== FOR INSCRIPTION ===');
      console.log('MS:' + result.quality_score);
      return result;
    } else {
      console.log('Raw response (no JSON found):');
      console.log(content);
    }
  } catch (e) {
    console.error('Error:', e.message);
  }
}

verify().catch(console.error);
