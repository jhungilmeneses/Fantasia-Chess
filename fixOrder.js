import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

// remove the hook at the top
content = content.replace(
  "useEffect(() => {\n    if (!gameStarted && hasInteracted && bgmRefMenu.current) {\n      bgmRefMenu.current.play().catch(() => {});\n    }\n  }, [hasInteracted, gameStarted]);\n\n  const [hasInteracted, setHasInteracted]",
  "const [hasInteracted, setHasInteracted]"
);

// and add it back after states
content = content.replace(
  "const [pendingMomentumJump, setPendingMomentumJump] = useState<{square: string, color: string} | null>(null);",
  "const [pendingMomentumJump, setPendingMomentumJump] = useState<{square: string, color: string} | null>(null);\n\n  useEffect(() => {\n    if (!gameStarted && hasInteracted && bgmRefMenu.current) {\n      bgmRefMenu.current.play().catch(() => {});\n    }\n  }, [hasInteracted, gameStarted]);"
);

fs.writeFileSync('src/App.tsx', content);
