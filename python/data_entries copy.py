from pathlib import Path
import yaml

visualizations_dir = Path("_visualizations")
output_file = Path("_data/projects.yml")
# posts_file = Path("_data/posts.yml")

projects = []

# # Step 1: Load existing posts from posts.yml
# if posts_file.exists():
#     with open(posts_file, "r") as f:
#         loaded_posts = yaml.safe_load(f) or []
#         projects.extend(loaded_posts)

# Step 2: Generate entries from visualizations
for f in visualizations_dir.glob("*.html"):
    title = f.stem.replace('-', ' ').title()
    project = {
        "title": title,
        "author": "Jasper Taal",
        "thumbnail": f"/assets/images/{f.stem}.png",
        # "post_url": None,
        "visualization_url": f"/visualizations/{f.name}",
        # "description": "A short description goes here."
    }
    projects.append(project)

# ✅ Sort alphabetically by title
projects.sort(key=lambda p: p["title"])

# Step 3: Write everything to projects.yml
with open(output_file, "w") as f:
    for project in projects:
        yaml.dump([project], f, sort_keys=False)
        f.write("\n")  # blank line between entries

print(f"Generated {len(projects)} project entries in {output_file}")
