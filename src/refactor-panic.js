import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const target1 = `if (piece.type === "k") {`;
const replace1 = `if (royalPanic && royalPanic.color === piece.color) {
                      canActivateSkill = false;
                      skillRequirementText = "ROYAL PANIC (DISABLED)";
                    } else if (piece.type === "k") {`;
content = content.replace(target1, replace1);

fs.writeFileSync('src/App.tsx', content, 'utf-8');
