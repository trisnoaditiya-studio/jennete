#!/usr/bin/env python3
"""Build tokens.css + tokens.js from tokens/design-tokens.json.

Usage:  python3 design-system/build-tokens.py
design-tokens.json is the single source of truth — never edit the outputs by hand.
"""
import json, re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SRC = ROOT / "tokens" / "design-tokens.json"
OUT_CSS = ROOT / "tokens" / "tokens.css"
OUT_JS = ROOT / "tokens" / "tokens.js"

data = json.loads(SRC.read_text())


def walk(node, path=()):
    """Yield (path, token) for every leaf that has a $value."""
    for k, v in node.items():
        if k.startswith("$") or not isinstance(v, dict):
            continue
        if "$value" in v:
            yield path + (k,), v
        else:
            yield from walk(v, path + (k,))


def var_name(path):
    p = list(path)
    if p[:2] == ["color", "primitive"]:
        rest = p[2:]
        return "--" + "-".join(rest if rest[0] != "alpha" else ["alpha"] + rest[1:])
    if p[:2] == ["color", "semantic"]:
        return "--color-" + p[2]
    if p[:2] == ["font", "family"]:
        return "--font" if p[2] == "base" else "--font-" + p[2]
    if p[:2] == ["font", "weight"]:
        return "--fw-" + p[2]
    if p[0] == "text":
        return "--text-" + p[1]
    if p[0] == "motion":
        return "--ease" if p[1] == "ease" else "--dur-" + p[1]
    prefix = {"gradient": "gradient", "space": "space", "size": "size", "radius": "radius",
              "shadow": "shadow", "blur": "blur", "breakpoint": "bp", "z": "z"}[p[0]]
    return f"--{prefix}-" + "-".join(p[1:])


tokens = list(walk(data))
names = {".".join(path): var_name(path) for path, _ in tokens}
ref = re.compile(r"\{([^}]+)\}")


def css_value(v):
    return ref.sub(lambda m: f"var({names[m.group(1)]})", str(v))


lines, js = [], {}
section = None
for path, tok in tokens:
    group = path[0] if path[0] != "color" else "color/" + path[1]
    if group != section:
        lines.append(f"\n  /* {group} */")
        section = group
    v = tok["$value"]
    if isinstance(v, dict):  # typography composite
        base = "--text-" + path[1]
        for key, suffix in (("fontSize", "size"), ("lineHeight", "lh"), ("letterSpacing", "ls"), ("fontWeight", "fw")):
            lines.append(f"  {base}-{suffix}: {v[key]};")
    else:
        lines.append(f"  {var_name(path)}: {css_value(v)};")
    js[".".join(path)] = {"var": var_name(path),
                          "value": v, "type": tok.get("$type"), "description": tok.get("$description", "")}

legacy = """
  /* legacy aliases — keep existing site CSS working unchanged */
  --ink: var(--color-text); --ink-2: var(--color-text-secondary); --ink-3: var(--color-text-muted);
  --bg: var(--color-bg); --soft: var(--color-bg-soft); --soft-2: var(--color-bg-soft-2); --line: var(--color-border);
  --dark: var(--color-bg-inverse); --dark-2: var(--color-bg-inverse-raised); --dark-line: var(--color-border-inverse-strong);
  --wa: var(--color-whatsapp);
  --brand: var(--color-brand); --brand-soft: var(--color-brand-soft); --brand-line: var(--color-brand-line);
  --r: var(--radius-sm); --r-l: var(--radius-md);"""

OUT_CSS.write_text(
    "/* Jennete Rent Design System — GENERATED from design-tokens.json by build-tokens.py. Do not edit. */\n"
    "/* Note: CSS variables cannot be used inside @media; breakpoints are exposed for JS/reference only. */\n"
    ":root{" + "\n".join(lines) + "\n" + legacy + "\n}\n"
)

# Typography types are reported in JS too, keyed by text.<name>
OUT_JS.write_text("/* GENERATED from design-tokens.json — do not edit. */\nwindow.JR_TOKENS = "
                  + json.dumps(js, ensure_ascii=False, indent=1) + ";\n")
print(f"{len(tokens)} tokens → {OUT_CSS.name}, {OUT_JS.name}")
