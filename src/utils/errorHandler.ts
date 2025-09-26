export interface ErrorModalData {
  title: string;
  message: string;
  type: 'error' | 'warning' | 'info';
}

let errorCallback: ((error: ErrorModalData) => void) | null = null;

export function setErrorHandler(callback: (error: ErrorModalData) => void) {
  errorCallback = callback;
}

export function showErrorModal(title: string, message: string, type: 'error' | 'warning' | 'info' = 'error') {
  if (errorCallback) {
    errorCallback({ title, message, type });
  } else {
    console.error(`${type.toUpperCase()}: ${title} - ${message}`);
  }
}

export function handleFileUploadError(error: any) {
  if (error.message === 'Unsupported file type') {
    showErrorModal(
      'Invalid File Type',
      'Please upload a PDF or DOCX file.',
      'warning'
    );
  } else {
    showErrorModal(
      'File Upload Error',
      'There was an error processing your resume. Please try again.',
      'error'
    );
  }
}

export function handleApiError(error: any) {
  showErrorModal(
    'Connection Error',
    'Unable to connect to AI service. Please check your internet connection and try again.',
    'error'
  );
}

export function handleTimerError() {
  showErrorModal(
    'Timer Interrupted',
    'The timer was interrupted. Your answer has been automatically submitted.',
    'info'
  );
}