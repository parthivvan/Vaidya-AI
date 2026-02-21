import os
import shutil
from fastapi import UploadFile, HTTPException
from langchain_groq import ChatGroq
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv

load_dotenv()

# 1. Setup the "Brain" (Groq - Llama 3 8B)
# Ensure GROQ_API_KEY is in your .env file
llm = ChatGroq(
    temperature=0.3,
    model_name="llama-3.3-70b-versatile",
    api_key=os.getenv("GROQ_API_KEY")
)

# 2. Setup the "Translator" (Embeddings)
# This runs locally on CPU. It turns text into numbers.
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

# Folder to store the "memory" of each patient
DB_FOLDER = "faiss_indexes"
os.makedirs(DB_FOLDER, exist_ok=True)

async def ingest_lab_report(file: UploadFile, patient_id: str):
    """
    1. Saves the PDF temporarily.
    2. Reads the text.
    3. Splits it into chunks.
    4. Saves it as a Vector Database for that patient.
    """
    temp_filename = f"temp_{patient_id}_{file.filename}"
    
    try:
        # Save uploaded file to disk temporarily
        with open(temp_filename, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Load PDF
        loader = PyPDFLoader(temp_filename)
        docs = loader.load()
        
        # Split text into chunks (Llama 3 has a context window, but smaller chunks are better for search)
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        splits = text_splitter.split_documents(docs)
        
        # Create Vector Store (The "Memory")
        vectorstore = FAISS.from_documents(documents=splits, embedding=embeddings)
        
        # Save locally with patient ID
        save_path = os.path.join(DB_FOLDER, f"patient_{patient_id}")
        vectorstore.save_local(save_path)
        
        return {"status": "success", "message": "Lab report processed. You can now chat with it."}
        
    except Exception as e:
        print(f"Error ingesting report: {e}")
        raise HTTPException(status_code=500, detail="Failed to process lab report.")
        
    finally:
        # Cleanup temp file
        if os.path.exists(temp_filename):
            os.remove(temp_filename)

async def ask_ai_doctor(query: str, patient_id: str):
    """
    1. Loads the patient's specific Vector Database.
    2. Searches for text relevant to the query.
    3. Sends the Query + Relevant Text to Llama 3.
    """
    index_path = os.path.join(DB_FOLDER, f"patient_{patient_id}")
    
    if not os.path.exists(index_path):
        return {"answer": "I don't have any lab reports for you yet. Please upload one first."}
    
    try:
        # Load the Vector Store
        vectorstore = FAISS.load_local(index_path, embeddings, allow_dangerous_deserialization=True)
        retriever = vectorstore.as_retriever()

        # Create the Medical Prompt
        system_prompt = (
            "You are an expert medical AI assistant for MediFlow AI. "
            "Use the following pieces of retrieved context from the patient's lab report to answer the question. "
            "If the answer is not in the context, say you don't know. "
            "Keep your answer concise and professional. "
            "\n\n"
            "{context}"
        )
        
        prompt = ChatPromptTemplate.from_messages([
            ("system", system_prompt),
            ("human", "{input}"),
        ])

        # Create the Chain
        question_answer_chain = create_stuff_documents_chain(llm, prompt)
        rag_chain = create_retrieval_chain(retriever, question_answer_chain)

        # Run the Chain
        response = rag_chain.invoke({"input": query})
        return {"answer": response["answer"]}

    except Exception as e:
        print(f"Error in chat: {e}")
        return {"answer": "I encountered an error while analyzing your report."}
