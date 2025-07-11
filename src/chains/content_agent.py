from langgraph.graph import StateGraph, END
from typing import TypedDict
from agents.content_agent.schema import ContentInput, ContentOutput

from agents.content_agent.linkedin_agent import generate_linkedin_post
from agents.content_agent.github_agent import generate_readme
from agents.content_agent.twitter_agent import generate_tweet
from agents.content_agent.other_agent import generate_other_content


# Graph state type
class GraphState(TypedDict):
    input: ContentInput
    output: ContentOutput


# Node functions
def router_node(state: GraphState) -> GraphState:
    # Just pass the input forward
    return state

def decide_next_node(state: GraphState) -> str:
    category = state["input"].category
    return {
        "linkedin": "linkedin_node",
        "github": "github_node",
        "twitter": "twitter_node"
    }.get(category, "other_node")


def linkedin_node(state: GraphState) -> GraphState:
    output_text = generate_linkedin_post(state["input"].linkedin)
    return {
        "input": state["input"],
        "output": ContentOutput(generated_text=str(output_text.content))  
    }


def github_node(state: GraphState) -> GraphState:
    output_text = generate_readme(state["input"].github)
    return {"input": state["input"], "output": ContentOutput(generated_text=output_text)}

def twitter_node(state: GraphState) -> GraphState:
    output_text = generate_tweet(state["input"].twitter)  
    return {
        "input": state["input"],
        "output": ContentOutput(generated_text=str(output_text.content)) 
    }


def other_node(state: GraphState) -> GraphState:
    output_text = generate_other_content(state["input"].other)
    return {"input": state["input"], "output": ContentOutput(generated_text=str(output_text.content))}


# LangGraph builder
def build_content_graph():
    graph = StateGraph(GraphState)

    graph.add_node("router", router_node)
    graph.add_node("linkedin_node", linkedin_node)
    graph.add_node("github_node", github_node)
    graph.add_node("twitter_node", twitter_node)
    graph.add_node("other_node", other_node)

    graph.set_entry_point("router")

    graph.add_conditional_edges(
        "router",
        decide_next_node,
        {
            "linkedin_node": "linkedin_node",
            "github_node": "github_node",
            "twitter_node": "twitter_node",
            "other_node": "other_node"
        }
    )

    for node in ["linkedin_node", "github_node", "twitter_node", "other_node"]:
        graph.add_edge(node, END)

    return graph.compile()
