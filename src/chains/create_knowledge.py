import os
import re
import glob
from dotenv import load_dotenv
from pathlib import Path
from typing import List

from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.docstore.document import Document
from langchain.vectorstores import FAISS
from langchain_google_genai import GoogleGenerativeAIEmbeddings


class KnowledgeBaseBuilder:
    def __init__(self, data_dir: str = "data", index_dir: str = "knowledge_index"):
        load_dotenv()
        self.data_dir = Path(data_dir)
        self.index_dir = index_dir
        self.embedding_model = GoogleGenerativeAIEmbeddings(model="models/embedding-001")

    def _load_documents(self) -> List[Document]:
        pdf_files = glob.glob(str(self.data_dir / "*.pdf"))
        loaders = [PyPDFLoader(pdf) for pdf in pdf_files]
        documents = []
        for loader in loaders:
            documents.extend(loader.load())
        return documents

    def _clean_text(self, text: str) -> str:
        text = re.sub(r'\s+', ' ', text)
        text = re.sub(r'Page \d+ of \d+', '', text)
        return text.strip()

    def _split_and_clean(self, documents: List[Document]) -> List[Document]:
        splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        chunks = splitter.split_documents(documents)
        cleaned = [
            Document(page_content=self._clean_text(doc.page_content), metadata=doc.metadata)
            for doc in chunks
        ]
        return cleaned

    def build_vector_store(self):
        print("🚀 Starting knowledge base construction...")
        raw_docs = self._load_documents()
        print(f"📄 Loaded {len(raw_docs)} documents.")

        chunks = self._split_and_clean(raw_docs)
        print(f"🧩 Created {len(chunks)} cleaned chunks.")

        vectorstore = FAISS.from_documents(chunks, self.embedding_model)
        vectorstore.save_local(self.index_dir)
        print(f"✅ Saved vector DB to `{self.index_dir}/`")

