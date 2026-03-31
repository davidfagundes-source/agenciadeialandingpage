import zipfile
import xml.etree.ElementTree as ET

try:
    with zipfile.ZipFile('Prompt.docx') as z:
        root = ET.fromstring(z.read('word/document.xml'))
        ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
        text = '\n'.join([node.text for node in root.iter(f'{{{ns["w"]}}}t') if node.text])
        print(text)
except Exception as e:
    print(f"Error: {e}")
