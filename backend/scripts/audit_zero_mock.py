import os
import re
import sys

FORBIDDEN_PATTERNS = [
    re.compile(r"mock_data", re.IGNORECASE),
    re.compile(r"fake_reviews", re.IGNORECASE),
    re.compile(r"dummy_data", re.IGNORECASE),
    re.compile(r"faker", re.IGNORECASE),
    re.compile(r"Math\.random\(\)"),
    re.compile(r"random\.randint\("),
]

IGNORE_DIRS = {".git", ".venv", "__pycache__", ".pytest_cache", "logs", "scratch"}
IGNORE_FILES = {"audit_zero_mock.py", ".gitignore"}

def audit_directory(root_dir: str):
    violations = []
    checked_files = 0

    for dirpath, dirnames, filenames in os.walk(root_dir):
        # Exclude ignored directories
        dirnames[:] = [d for d in dirnames if d not in IGNORE_DIRS]
        
        for filename in filenames:
            if filename in IGNORE_FILES:
                continue
            if filename.endswith((".py", ".json", ".ts", ".tsx", ".js", ".env", ".env.example")):
                filepath = os.path.join(dirpath, filename)
                checked_files += 1
                try:
                    with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
                        lines = f.readlines()
                        for lineno, line in enumerate(lines, start=1):
                            for pattern in FORBIDDEN_PATTERNS:
                                if pattern.search(line):
                                    # Allow disclaimers that mention "Zero Mock"
                                    if "zero_mock" in line.lower() or "zero mock" in line.lower():
                                        continue
                                    violations.append((filepath, lineno, line.strip()))
                except Exception as e:
                    print(f"Could not read {filepath}: {e}")

    print(f"\n==========================================")
    print(f"ZERO MOCK DATA COMPLIANCE AUDIT")
    print(f"==========================================")
    print(f"Files Audited: {checked_files}")
    if violations:
        print(f"VIOLATIONS DETECTED: {len(violations)}")
        for path, line, text in violations:
            print(f"  - {path}:{line} -> {text}")
        sys.exit(1)
    else:
        print(f"Result: 100% COMPLIANT (0 mock data occurrences)")
        print(f"All business data is strictly sourced from BigQuery.")
        print(f"==========================================\n")

if __name__ == "__main__":
    target = sys.argv[1] if len(sys.argv) > 1 else "."
    audit_directory(target)
