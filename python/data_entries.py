from pathlib import Path
import yaml

# --- Paths ---
posts_dir = Path("_posts")
visualizations_dir = Path("_visualizations")
posts_file = Path("_data/posts.yml")
projects_file = Path("_data/projects.yml")

# --- Step 1: Process posts ---
posts = []

for md_file in posts_dir.glob("*.md"):
    with open(md_file, "r", encoding="utf-8") as f:
        lines = f.readlines()

    if lines and lines[0].strip() == "---":
        fm_lines = []
        for line in lines[1:]:
            if line.strip() == "---":
                break
            fm_lines.append(line)

        front_matter = yaml.safe_load("".join(fm_lines)) or {}

        title = front_matter.get("title", md_file.stem.replace("-", " ").title())
        visualization_url = front_matter.get("visualization_url")
        description = front_matter.get("description", "")
        date = str(front_matter.get("date", ""))

        # Build post_url from date + slug
        slug = md_file.stem.split("-", 3)[-1]
        post_url = None
        if date and len(date.split("-")) >= 3:
            y, m, d = date.split("-")[:3]
            post_url = f"/{y}/{m}/{d}/{slug}.html"

        # Thumbnail from visualization filename if available
        if visualization_url:
            vis_name = Path(visualization_url).stem
            thumbnail = f"/assets/images/{vis_name}.png"
        else:
            thumbnail = f"/assets/images/{slug}.png"

        post_entry = {
            "title": title,
            "author": "Jasper Taal",  # default
            "thumbnail": thumbnail,
            "post_url": post_url,
            "visualization_url": visualization_url,
            "description": description
        }
        posts.append(post_entry)

# Sort posts alphabetically
posts.sort(key=lambda p: p["title"])

# Step 2: Write posts.yml (one entry per block, blank line between)
with open(posts_file, "w", encoding="utf-8") as f:
    for post in posts:
        yaml.dump([post], f, sort_keys=False, allow_unicode=True)
        f.write("\n")

print(f"✅ Generated {len(posts)} post entries in {posts_file}")

# --- Step 3: Process projects ---
projects = []

for f in visualizations_dir.glob("*.html"):
    title = f.stem.replace('-', ' ').title()
    project = {
        "title": title,
        "author": "Jasper Taal",
        "thumbnail": f"/assets/images/{f.stem}.png",
        "visualization_url": f"/visualizations/{f.name}",
    }
    projects.append(project)

# Sort projects alphabetically
projects.sort(key=lambda p: p["title"])

# Step 4: Write projects.yml (one entry per block, blank line between)
with open(projects_file, "w", encoding="utf-8") as f:
    for project in projects:
        yaml.dump([project], f, sort_keys=False, allow_unicode=True)
        f.write("\n")

print(f"✅ Generated {len(projects)} project entries in {projects_file}")
