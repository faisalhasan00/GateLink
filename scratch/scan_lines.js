const fs = require('fs');
const path = require('path');

const targets = [
  { name: 'website', path: 'Application/Frontend/website/src' },
  { name: 'society_admin', path: 'Application/Frontend/society_admin/src' },
  { name: 'super_admin', path: 'Application/Frontend/super_admin/src' },
  { name: 'resident_app', path: 'Application/Frontend/resident_app/lib' },
  { name: 'guard_app', path: 'Application/Frontend/guard_app/lib' },
  { name: 'partner_app', path: 'Application/Frontend/partner_app/lib' },
  { name: 'functions (backend)', path: 'Application/Backend/functions' }
];

const results = {};

function scanDir(dir, groupName) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', 'dist', 'build', '.dart_tool', '.git'].includes(entry.name)) continue;
      scanDir(fullPath, groupName);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name);
      if (['.js', '.jsx', '.ts', '.tsx', '.dart'].includes(ext)) {
        const content = fs.readFileSync(fullPath, 'utf8');
        const lines = content.split('\n').length;
        if (lines > 200) {
          if (!results[groupName]) results[groupName] = [];
          results[groupName].push({
            file: fullPath.replace(/\\/g, '/'),
            lines
          });
        }
      }
    }
  }
}

for (const t of targets) {
  scanDir(path.resolve(t.path), t.name);
}

let grandTotal = 0;
for (const [group, files] of Object.entries(results)) {
  files.sort((a, b) => b.lines - a.lines);
  grandTotal += files.length;
  console.log(`\n===============================================================`);
  console.log(`📂 ${group.toUpperCase()} — ${files.length} files > 200 lines`);
  console.log(`===============================================================`);
  for (const f of files) {
    const rel = f.file.split(group + '/')[1] || path.basename(f.file);
    console.log(`  • ${f.lines.toString().padStart(4, ' ')} lines | ${rel}`);
  }
}

console.log(`\nTotal files exceeding 200 lines across entire codebase: ${grandTotal}`);
