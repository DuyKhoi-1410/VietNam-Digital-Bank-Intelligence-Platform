import re, ast
from collections import defaultdict

raw_data = r"C:/Users/Duy Khoi/.gemini/antigravity-cli/brain/790d5766-ed36-428a-a98a-89ab0631526b/.system_generated/steps/1540/output.txt"
with open(raw_data, "r", encoding="utf-8") as f:
    text = f.read()

# Replace datetime.date(2026, 7, 1) with '2026-07-01'
text = re.sub(r"datetime\.date\((\d+),\s*(\d+),\s*(\d+)\)", r"'\1-\2-\3'", text)
items = ast.literal_eval(text)

by_bank = defaultdict(list)
for it in items:
    by_bank[it["Bank"]].append(it)

def parse_ver(v):
    nums = [int(x) for x in re.findall(r"\d+", v["App_Version"])]
    return nums

print("=== BANK VERSION SUMMARY ===")
fewer_than_10 = []
for b, vers in sorted(by_bank.items()):
    total_count = len(vers)
    if total_count < 10:
        fewer_than_10.append((b, total_count))
    sorted_vers = sorted(vers, key=parse_ver)
    last_10 = sorted_vers[-10:] if len(sorted_vers) >= 10 else sorted_vers
    ver_names = [v["App_Version"] for v in last_10]
    print(f"\n{b}:")
    print(f"  - Tong so phien ban co san: {total_count}")
    print(f"  - 10 phien ban gan nhat (tu lau nhat den moi nhat):")
    print("    " + " -> ".join(ver_names))

print("\n=== KET QUA KIEM TRA < 10 PHIEN BAN ===")
if not fewer_than_10:
    print("KHONG CO ngan hang nao it hon 10 phien ban! Tat ca 7 ngan hang deu co >= 13 phien ban.")
else:
    for b, count in fewer_than_10:
        print(f"Nguy co: {b} chi co {count} phien ban (< 10).")
