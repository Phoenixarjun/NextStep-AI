from langchain_community.document_loaders import PyPDFLoader

def load_resume(file_path: str) -> str:
    """
    Load and parse the resume from a PDF file.

    Args:
        file_path (str): Path to the PDF file containing the resume.

    Returns:
        str: Concatenated text content of all pages in the resume.
    """
    loader = PyPDFLoader(file_path)
    documents = loader.load()
    
    if not documents:
        raise ValueError("No content found in the PDF file.")

    full_text = "\n".join(doc.page_content.strip() for doc in documents if doc.page_content.strip())

    if not full_text:
        raise ValueError("Parsed resume is empty after processing.")

    return full_text
