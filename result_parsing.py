import re

def planner_agent_parse_markdown(markdown: str):
    weeks = []
    week_matches = re.split(r"### Week (\d+):? ?", markdown)[1:]

    for i in range(0, len(week_matches), 2):
        week_number = int(week_matches[i])
        content = week_matches[i + 1]

        week = {
            "week": week_number,
            "focus_goal": "",
            "concepts": [],
            "resources": [],
            "mini_project": "",
            "tips": []
        }

        # Focus Goal
        focus_match = re.search(r"📌\s+\*\*Focus Goal:\*\*\s*(.+)", content)
        if focus_match:
            week["focus_goal"] = focus_match.group(1).strip()

        # Concepts
        concepts_match = re.search(r"🧠\s+\*\*Tech Stack/Concepts to learn:\*\*\s*(.*?)\n[-💻🔧💡]", content, re.DOTALL)
        if concepts_match:
            concept_lines = re.findall(r"-\s*(.+)", concepts_match.group(1))
            week["concepts"] = [line.strip() for line in concept_lines]

        # Resources
        resource_block = re.search(r"🔧\s+\*\*Resources:\*\*\s*(.*?)\n[-💻💡]", content, re.DOTALL)
        if resource_block:
            links = re.findall(r"\[([^\]]+)\]\(([^)]+)\)", resource_block.group(1))
            week["resources"] = [{"name": name.strip(), "url": url.strip()} for name, url in links]

        # Mini Project
        project_match = re.search(r"💻\s+\*\*Mini Project Idea:\*\*\s*(.+?)(?:\n-|\n💡|\n$)", content, re.DOTALL)
        if project_match:
            week["mini_project"] = project_match.group(1).strip().replace("\n", " ")

        # Tips
        tips_block = re.search(r"💡\s+\*\*Tips or common mistakes:\*\*\s*(.*?)($|\n###)", content, re.DOTALL)
        if tips_block:
            tips = re.findall(r"-\s*(.+)", tips_block.group(1))
            week["tips"] = [t.strip() for t in tips]

        weeks.append(week)

    return weeks
