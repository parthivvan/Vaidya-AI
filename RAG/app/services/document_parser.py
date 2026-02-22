import pdfplumber
import pandas as pd

def process_pdf(file_path):
    medical_chunks = []
    with pdfplumber.open(file_path) as pdf:
        for page_num, page in enumerate(pdf.pages):
            # Extract text
            text = page.extract_text(layout=True)
            if text and text.strip():
                medical_chunks.append(f"--- PAGE {page_num + 1} TEXT ---\n{text.strip()}")
                
            # Extract tables
            tables = page.extract_tables()
            for table in tables:
                if not table: continue
                try:
                    df = pd.DataFrame(table[1:], columns=table[0])
                    df.dropna(how='all', inplace=True)
                    medical_chunks.append(f"--- PAGE {page_num + 1} TABLE ---\n{df.to_markdown(index=False)}")
                except:
                    pass
    return medical_chunks