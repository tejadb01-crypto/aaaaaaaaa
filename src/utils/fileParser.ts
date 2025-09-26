import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Set worker source for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export interface ParsedResumeData {
  name: string;
  email: string;
  phone: string;
  content: string;
}

export async function parseResume(file: File): Promise<ParsedResumeData> {
  let content = '';
  
  try {
    if (file.type === 'application/pdf') {
      content = await parsePDF(file);
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      content = await parseDOCX(file);
    } else {
      throw new Error('Unsupported file type');
    }

    return extractContactInfo(content);
  } catch (error) {
    console.error('Error parsing resume:', error);
    throw error;
  }
}

async function parsePDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(' ');
    fullText += pageText + '\n';
  }

  return fullText;
}

async function parseDOCX(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

function extractContactInfo(content: string): ParsedResumeData {
  // Email regex
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const emailMatch = content.match(emailRegex);
  
  // Phone regex (various formats)
  const phoneRegex = /(\+?1?[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/g;
  const phoneMatch = content.match(phoneRegex);
  
  // Name extraction (first line that looks like a name)
  const lines = content.split('\n').filter(line => line.trim());
  let name = '';
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    // Skip lines that are clearly not names
    if (trimmedLine.includes('@') || /^\d/.test(trimmedLine) || trimmedLine.length < 2) {
      continue;
    }
    // Look for lines with 2-3 words that could be a name
    const words = trimmedLine.split(/\s+/);
    if (words.length >= 2 && words.length <= 3 && words.every(word => /^[A-Za-z]+$/.test(word))) {
      name = trimmedLine;
      break;
    }
  }

  return {
    name: name || '',
    email: emailMatch ? emailMatch[0] : '',
    phone: phoneMatch ? phoneMatch[0] : '',
    content: content,
  };
}