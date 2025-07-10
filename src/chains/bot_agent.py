from langgraph.graph import StateGraph, END
from agents.bot_agent.schema import BotInput, BotOutput
from agents.bot_agent.conversation import chat_with_rag

def start_node(state: dict) -> dict:
    return state

def run_rag_chat(state: dict) -> dict:
    bot_input = BotInput(**state["input"])
    result = chat_with_rag(bot_input)
    
    return {
        "input": state["input"],
        "response": result.response,
        "resume_text": result.resume_text,
        "error": result.error,
        "sources": []
    }

def build_bot_graph():
    graph = StateGraph(dict)
    
    graph.add_node("start", start_node)
    graph.add_node("rag_chat", run_rag_chat)
    
    graph.set_entry_point("start")
    graph.add_edge("start", "rag_chat")
    graph.add_edge("rag_chat", END)
    
    return graph.compile()