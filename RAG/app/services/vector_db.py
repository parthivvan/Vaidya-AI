import json
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer

print("Loading embedding model...")
embedding_model = SentenceTransformer('all-MiniLM-L6-v2')

def build_and_save_vector_db(text_chunks):
    embeddings = embedding_model.encode(text_chunks)
    embeddings_array = np.array(embeddings).astype('float32')
    
    dimension = len(embeddings[0])
    index = faiss.IndexFlatL2(dimension)
    index.add(embeddings_array)
    
    faiss.write_index(index, "db/vector_db.faiss")
    with open("db/chunks.json", "w") as f:
        json.dump(text_chunks, f)

def get_embedding(text):
    """Helper function to convert a question into an array for searching."""
    return np.array(embedding_model.encode([text])).astype('float32')