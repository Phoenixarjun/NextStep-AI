import os
from pathlib import Path
import logging

logging.basicConfig(level=logging.INFO, format='[%(asctime)s]: %(message)s:')

project_name = "nextstep_ai"

list_of_files = [

    f"src/__init__.py",
    f"src/config.py",
    f"src/logging.py",
    f"src/agents/planner_agent.py",
    f"src/agents/interview_agent.py",
    f"src/agents/resume_agent.py",
    f"src/agents/job_match_agent.py",
    f"src/agents/__init__.py",
    f"src/agents/calendar_agent.py",

    f"src/chains/pipleline.py",

    f"src/utils/preprocess.py",
    f"src/utils/embeddings.py",
    f"src/utils/vector_store.py",
    f"src/utils/__init__.py",

    "research/nlp_embeddings.ipynb",
    "research/resume_similarity.ipynb",
    "research/job_parser_tests.ipynb",
    "requirements.txt",
    "setup.py",
    "app.py",
    "Dockerfile",
    ".env"
]

if __name__ == '__main__':
    for filepath in list_of_files:
        filepath = Path(filepath)
        filedir, filename = os.path.split(filepath)

        if filedir:
            os.makedirs(filedir, exist_ok=True)
            logging.info(f"Created directory: {filedir}")

        if not os.path.exists(filepath) or os.path.getsize(filepath) == 0:
            with open(filepath, "w") as f:
                pass
            logging.info(f"Created empty file: {filepath}")

        else:
            logging.info(f"{filename} already exists.")
