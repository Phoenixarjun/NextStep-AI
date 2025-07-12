from pathlib import Path
from agents.bot_agent.schema import BotInput
from agents.bot_agent.conversation import chat_with_rag
import logging



def run_bot_agent(user_input: BotInput) -> dict:
    output = chat_with_rag(user_input)
    return {
        "input": user_input.model_dump(),
        "response": output.response,
        "resume_text": output.resume_text,
        "error": output.error,
        "sources": getattr(output, "sources", [])
    }

if __name__ == "__main__":
    STAGE_NAME = "bot_agent"
    logging.basicConfig(level=logging.INFO)
    logging.info(f"Running {STAGE_NAME}...")
    while True:
        query = input("🤖 Ask the AI Coach anything: ").strip()
        if query == "exit":
            print("👋 Goodbye!")
            break
        resume_input = input("📄 Enter path to your resume (optional, press Enter to skip): ").strip()
        resume_path = Path(resume_input) if resume_input else None

        if resume_path and not resume_path.exists():
            raise FileNotFoundError(f"❌ Resume file not found at {resume_path}")

        user_input = BotInput(
            query=query,
            resume_text=resume_path.read_text() if resume_path else None
        )

        output = run_bot_agent(user_input)
        logging.info(f"Output from {STAGE_NAME}: {output}")

        print("\n🧠 Response:\n")
        print(output["response"] or "❌ No response generated.")

        if output.get("sources"):
            print("\n📚 Sources Referenced:")
            for src in output["sources"]:
                print(f"🔗 {src}")

        if output.get("error"):
            print("\n⚠️ Error:\n", output["error"])

        print("\n✅ Chat complete.")
        logging.info("Chat complete.")
