/**
 * DeepSeek-V3.1 Fallback Verification - Manual Alternative
 * Usage: node verify-act-deepseek.js <act_number> "<submitted_proverb>"
 */

const axios = require('axios');

const DEEPSEEK_API_KEY = 'sk-d806db862b0a43288baf6bf1f34519b3';
const DEEPSEEK_MODEL = 'deepseek-ai/DeepSeek-V3.1';
const SPELLBOOK_IPFS = 'https://red-acute-chinchilla-216.mypinata.cloud/ipfs/bafkreib6uuhhhdb2brmoztnav3ebxlbt6phwyy4gh7rg7po3m7i5niarna';

const actNumber = parseInt(process.argv[2]) || 10;
const submittedProverb = process.argv[3] || '';
const emojiSpell = process.argv[4] || '';

async function fetchSpellbook() {
  console.log('Fetching spellbook from IPFS...');
  const response = await axios.get(SPELLBOOK_IPFS, { timeout: 30000 });
  return response.data;
}

async function verify() {
  console.log('=== DeepSeek-V3.1 Fallback Verification ===');
  console.log('Model:', DEEPSEEK_MODEL);
  console.log('');
  console.log('Verifying Act:', actNumber);
  console.log('Submitted Proverb:', submittedProverb || '(none)');
  console.log('Emoji Spell:', emojiSpell || '(none)');
  console.log('');

  const spellbook = await fetchSpellbook();
  console.log('Spellbook version:', spellbook.version);

  const targetAct = spellbook.spellbooks.story.acts.find(a => a.act_number === actNumber);
  if (!targetAct) {
    console.error('Act', actNumber, 'not found!');
    return;
  }

  console.log('');
  console.log('=== Act', actNumber, 'Context ===');
  console.log('ID:', targetAct.id);
  console.log('Title:', targetAct.title);
  console.log('Keywords:', targetAct.keywords.join(', '));
  console.log('Official Proverb:', targetAct.proverb);
  console.log('Spell:', targetAct.spell);
  console.log('');

  if (!submittedProverb) {
    console.log('No proverb submitted - run:');
    console.log(`node verify-act-deepseek.js ${actNumber} "your proverb" "emoji spell"`);
    return;
  }

  // Check emoji spell match
  const spellMatch = emojiSpell === targetAct.spell;
  console.log('Emoji Spell Match:', spellMatch ? 'EXACT MATCH' : 'Different');
  console.log('');

  const prompt = `Act ${actNumber} - ${targetAct.title}:
Title: ${targetAct.title}
Description: ${targetAct.description}
Keywords: ${targetAct.keywords.join(', ')}
Official Proverb: "${targetAct.proverb}"

Submitted Proverb: "${submittedProverb}"
${emojiSpell ? `Submitted Emoji Spell: ${emojiSpell}` : ''}
${spellMatch ? 'Note: Emoji spell matches exactly.' : ''}

Evaluate thematic alignment between the submitted proverb and Act ${actNumber}'s full context.
Return ONLY valid JSON:
{
  "quality_score": 0.0-1.0,
  "matched_act": "${targetAct.id}",
  "matched_act_number": ${actNumber},
  "official_proverb": "${targetAct.proverb}",
  "reasoning": "explanation of thematic connections",
  "approved": true/false
}`;

  console.log('Calling DeepSeek-V3.1...');
  console.log('');

  try {
    const response = await axios.post('https://cloud-api.near.ai/v1/chat/completions', {
      model: DEEPSEEK_MODEL,
      messages: [
        { role: 'system', content: 'You are a proverb verification expert. Analyze thematic similarity. Return valid JSON only.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 800
    }, {
      headers: { 'Authorization': 'Bearer ' + DEEPSEEK_API_KEY },
      timeout: 90000
    });

    const content = response.data.choices?.[0]?.message?.content || '';
    console.log('=== DeepSeek Response ===');

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
      console.log('Raw response:');
      console.log(content);
    }
  } catch (e) {
    console.error('Error:', e.response?.data || e.message);
  }
}

verify().catch(console.error);
