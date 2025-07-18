import json
import os
import sys
from pathlib import Path

# Add the script directory to Python path
script_dir = Path(__file__).parent
sys.path.append(str(script_dir))

from breackdownsheetGenerator import *

# Read test data
with open(os.path.join(script_dir, 'test_data.json'), 'r') as f:
    data = json.load(f)

try:
    # Create document
    doc = create_document()
    create_header(doc)
    create_title_section(doc)
    create_object_section(doc)
    create_table_section(doc, data)
    create_footer(doc, data)

    # Save the document
    filename = f"BreakdownSheet_{data.get('fileName', 'FICHE PANNE')}.docx"
    file_path = os.path.join(FILES_DIR, filename)
    
    # Save the document
    doc.save(file_path)
    
    print(json.dumps({
        "success": True,
        "message": "Document created successfully",
        "filepath": file_path,
        "filename": filename,
    }))

except Exception as e:
    print(json.dumps({
        "success": False,
        "message": str(e),
    })) 