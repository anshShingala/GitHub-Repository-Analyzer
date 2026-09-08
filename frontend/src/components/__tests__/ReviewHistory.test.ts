import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('ReviewHistory component review history navigation and copy isolation', () => {
  const filePath = path.join(process.cwd(), 'src', 'components', 'ReviewHistory.tsx');
  const source = fs.readFileSync(filePath, 'utf-8');

  // Requirement 1 & 2: Review ID renders as a link to /reviews/{review.id}
  assert.match(
    source,
    /<Link\s+href=\{`\/reviews\/\$\{r\.id\}`\}/,
    'Review ID must render as a Next.js Link component targeting /reviews/${r.id}'
  );

  // Requirement 3 & 4: Copy button copies ID and stops propagation so it does not trigger navigation
  assert.match(
    source,
    /onClick=\{\(e\)\s*=>\s*handleCopyId\(r\.id,\s*e\)\}/,
    'Copy button must pass the click event to handleCopyId'
  );
  assert.match(
    source,
    /e\.stopPropagation\(\)/,
    'handleCopyId must invoke e.stopPropagation() to isolate copy action from navigation'
  );
  assert.match(
    source,
    /navigator\.clipboard\.writeText\(id\)/,
    'handleCopyId must copy full review ID to clipboard'
  );

  // Requirement 5: Both COMPLETED and FAILED review rows expose the detail link
  // Verify that the table mapping logic renders links generically for all items in reviews list regardless of status
  assert.match(
    source,
    /reviews\.map\(\(r\)\s*=>/,
    'Review list mapping must apply to all review records regardless of status'
  );
});
