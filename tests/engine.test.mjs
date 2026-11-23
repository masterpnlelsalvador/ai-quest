import test from 'node:test';
import assert from 'node:assert/strict';
import {
  secretLines, secretExplanations, scoreSecretLeak, scoreContextCollapse, scoreTokenTrap,
  buildWorkbenchPlan, profileSummary,
} from '../src/engine.mjs';

test('secret leak: minimum safe evidence passes', () => {
  const res = scoreSecretLeak(['time','http','stack','change']);
  assert.equal(res.score,100); assert.equal(res.passed,true); assert.equal(res.critical,false);
});
test('secret leak: any sensitive field is critical even with good evidence', () => {
  const res = scoreSecretLeak(['time','http','stack','change','key']);
  assert.equal(res.critical,true); assert.equal(res.passed,false); assert.ok(res.score <= 39);
});
test('secret leak: every synthetic sensitive category remains critical', () => {
  for (const id of ['email','key','ip']) {
    const res = scoreSecretLeak(['time','http','stack','change',id]);
    assert.equal(res.critical,true, id);
    assert.equal(res.passed,false, id);
    assert.ok(res.score <= 39, id);
  }
});
test('secret leak: irrelevant line blocks full pass', () => {
  assert.equal(scoreSecretLeak(['time','http','stack','change','noise']).passed,false);
});
test('secret leak: unknown ids ignored', () => {
  assert.equal(scoreSecretLeak(['time','http','stack','change','fabricated']).passed,true);
});
test('secret leak: every option has a complete explanation consistent with the rubric', () => {
  assert.deepEqual(Object.keys(secretExplanations).sort(), secretLines.map(line => line.id).sort());
  for (const line of secretLines) {
    const explanation = secretExplanations[line.id];
    for (const field of ['category','decision','why','risk','transfer']) {
      assert.ok(explanation[field]?.trim(), `${line.id}: ${field}`);
    }
    assert.match(explanation.decision, line.useful ? /^Include/ : /^Omit/, line.id);
    if (line.sensitive) assert.match(explanation.category, /Personal|Secret/i, line.id);
  }
});
test('secret leak: guidance keeps approval and redaction conditional', () => {
  const guidance = Object.values(secretExplanations).map(item => item.transfer).join(' ');
  assert.match(guidance, /approved tool|approved handling|approved/i);
  assert.match(guidance, /redaction alone is not automatic permission|anonymization does not by itself establish permission/i);
});
test('context collapse: all essentials passes', () => {
  const res = scoreContextCollapse(['goal','decision','tests','blocker','next']);
  assert.equal(res.score,100); assert.equal(res.passed,true);
});
test('context collapse: focused 4-item handoff passes', () => {
  const res = scoreContextCollapse(['goal','decision','tests','next']);
  assert.equal(res.score,82); assert.equal(res.passed,true);
});
test('context collapse: missing next action fails', () => {
  assert.equal(scoreContextCollapse(['goal','decision','tests','blocker']).passed,false);
});
test('context collapse: noise blocks pass', () => {
  assert.equal(scoreContextCollapse(['goal','decision','tests','blocker','next','raw']).passed,false);
});
test('context collapse: feedback names selected noise and explains exclusions', () => {
  const res = scoreContextCollapse(['goal','decision','tests','blocker','next','old','raw']);
  assert.equal(res.passed,false);
  assert.match(res.feedback,/Discarded idea:.*approved decision already rules out a rewrite/);
  assert.match(res.feedback,/Unfiltered transcript:.*buries the verified facts/);
  assert.doesNotMatch(res.feedback,/Casual chat:/);
});
test('token trap: focused sequence passes within minimum simulated budget', () => {
  const res = scoreTokenTrap(['change','logs','test','summary']);
  assert.equal(res.spent,55); assert.equal(res.score,100); assert.equal(res.passed,true);
});
test('token trap: completed 100-point route fails efficiency threshold without success title', () => {
  const res = scoreTokenTrap(['change','logs','alllogs','test','summary']);
  assert.equal(res.spent,100);
  assert.equal(res.remaining,0);
  assert.equal(res.score,62);
  assert.equal(res.critical,false);
  assert.equal(res.passed,false);
  assert.equal(res.title,'Efficiency target not met');
  assert.match(res.feedback,/scored below the 70-point efficiency target/);
});
test('token trap: passing route describes selection without claiming a repair', () => {
  const res = scoreTokenTrap(['change','logs','test','summary']);
  assert.equal(res.passed,true);
  assert.equal(res.title,'Efficient investigation sequence selected');
  assert.match(res.feedback,/No repair or incident resolution was performed or verified/);
  assert.doesNotMatch(res.feedback,/To complete the mission/);
});
test('token trap: verification before investigation fails', () => {
  const res = scoreTokenTrap(['test','change','logs','summary']);
  assert.equal(res.passed,false);
  assert.match(res.feedback,/test came before reviewing the recent change/);
  assert.match(res.feedback,/test came before inspecting the focused error excerpt/);
});
test('token trap: feedback names premature handoff and missing actions', () => {
  const premature = scoreTokenTrap(['change','logs','summary','test']);
  assert.match(premature.feedback,/handoff came before the verification test/);
  const incomplete = scoreTokenTrap(['change','summary']);
  assert.match(incomplete.feedback,/Missing actions:.*focused error excerpt.*verification test/);
});
test('token trap: incomplete sequence fails', () => {
  assert.equal(scoreTokenTrap(['change','logs']).passed,false);
});
test('token trap: unsafe shortcut fails', () => {
  const res = scoreTokenTrap(['reset']);
  assert.equal(res.critical,true); assert.equal(res.passed,false); assert.ok(res.score <= 29);
});
test('token trap: over-budget route fails', () => {
  const res = scoreTokenTrap(['alllogs','repeat','change','logs','test','summary']);
  assert.equal(res.passed,false); assert.ok(res.spent > 100);
  assert.match(res.feedback,/100-point budget was exceeded/);
});
test('workbench: sensitive information has a safety stop', () => {
  const text = buildWorkbenchPlan({task:'support',sensitivity:'sensitive',stage:'new'});
  assert.match(text,/STOP before sharing/); assert.match(text,/never paste secrets/);
});
test('workbench: handoff contains verified evidence and next action', () => {
  const text = buildWorkbenchPlan({task:'development',sensitivity:'internal',stage:'handoff'});
  assert.match(text,/Carry over approved decisions/); assert.match(text,/Next action:/);
});
test('workbench: invalid values refused', () => {
  assert.throws(() => buildWorkbenchPlan({task:'unknown'}));
});
test('profile: incomplete status is explicitly non-certifying', () => {
  const profile = profileSummary({secret:scoreSecretLeak(['time','http','stack','change'])});
  assert.equal(profile.complete,false); assert.equal(profile.average,100); assert.equal(profile.label,'Training in progress');
});
test('profile: critical fail prevents all-passed status', () => {
  const res = profileSummary({
    secret:scoreSecretLeak(['key']),
    context:scoreContextCollapse(['goal','decision','tests','blocker','next']),
    efficiency:scoreTokenTrap(['change','logs','test','summary']),
  });
  assert.equal(res.complete,true); assert.equal(res.critical,true); assert.equal(res.allPassed,false);
});
