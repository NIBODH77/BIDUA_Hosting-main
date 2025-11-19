import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, File, AlertCircle, CheckCircle } from 'lucide-react';

interface UploadResponse {
  id: number;
  filename: string;
  size: number;
  mime_type: string;
  is_safe: boolean;
  scan_status: string;
  uploaded_at: string;
}

interface FileUploadProps {
  ticketId: number;
  messageId?: number;
  onUploadComplete?: (file: UploadResponse) => void;
  maxFileSizeMB?: number;
  allowedExtensions?: string[];
}

interface UploadingFile {
  file: File;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  error?: string;
  id?: number;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  ticketId,
  messageId,
  onUploadComplete,
  maxFileSizeMB = 10,
  allowedExtensions = [
    'jpg', 'jpeg', 'png', 'gif', 'pdf', 'docx', 'xlsx', 'zip', 'log', 'json'
  ]
}) => {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Check file size
    const maxSizeBytes = maxFileSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return `File size exceeds ${maxFileSizeMB}MB limit`;
    }

    // Check file extension
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension || !allowedExtensions.includes(extension)) {
      return `File type .${extension} is not allowed. Allowed types: ${allowedExtensions.join(', ')}`;
    }

    return null;
  };

  const uploadFile = async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setUploadingFiles(prev => [
        ...prev,
        { file, progress: 0, status: 'error', error: validationError }
      ]);
      return;
    }

    // Add file to uploading list
    setUploadingFiles(prev => [
      ...prev,
      { file, progress: 0, status: 'uploading' }
    ]);

    try {
      const formData = new FormData();
      formData.append('file', file);
      if (messageId) {
        formData.append('message_id', messageId.toString());
      }

      const token = localStorage.getItem('access_token');
      
      const xhr = new XMLHttpRequest();

      // Track upload progress
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100);
          setUploadingFiles(prev =>
            prev.map(f =>
              f.file === file ? { ...f, progress } : f
            )
          );
        }
      });

      // Handle completion
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          setUploadingFiles(prev =>
            prev.map(f =>
              f.file === file
                ? { ...f, progress: 100, status: 'success', id: response.id }
                : f
            )
          );
          
          if (onUploadComplete) {
            onUploadComplete(response);
          }

          // Remove from list after 3 seconds
          setTimeout(() => {
            setUploadingFiles(prev => prev.filter(f => f.file !== file));
          }, 3000);
        } else {
          const error = JSON.parse(xhr.responseText);
          setUploadingFiles(prev =>
            prev.map(f =>
              f.file === file
                ? { ...f, status: 'error', error: error.detail || 'Upload failed' }
                : f
            )
          );
        }
      });

      // Handle errors
      xhr.addEventListener('error', () => {
        setUploadingFiles(prev =>
          prev.map(f =>
            f.file === file
              ? { ...f, status: 'error', error: 'Network error' }
              : f
          )
        );
      });

      xhr.open('POST', `http://localhost:8000/api/v1/attachments/tickets/${ticketId}/attachments`);
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.send(formData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setUploadingFiles(prev =>
        prev.map(f =>
          f.file === file
            ? { ...f, status: 'error', error: errorMessage }
            : f
        )
      );
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    files.forEach(uploadFile);
  }, [uploadFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(uploadFile);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const removeFile = (file: File) => {
    setUploadingFiles(prev => prev.filter(f => f.file !== file));
  };

  return (
    <div className="space-y-3">
      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
          transition-colors duration-200
          ${isDragging
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          accept={allowedExtensions.map(ext => `.${ext}`).join(',')}
        />
        
        <Upload className="mx-auto h-10 w-10 text-gray-400 mb-2" />
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Drop files here or click to browse
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
          Max {maxFileSizeMB}MB • {allowedExtensions.join(', ')}
        </p>
      </div>

      {/* Uploading Files List */}
      {uploadingFiles.length > 0 && (
        <div className="space-y-2">
          {uploadingFiles.map((uploadingFile, index) => (
            <div
              key={index}
              className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 space-y-2"
            >
              <div className="flex items-start gap-3">
                <File className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {uploadingFile.file.name}
                    </p>
                    
                    {uploadingFile.status === 'uploading' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(uploadingFile.file);
                        }}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                    
                    {uploadingFile.status === 'success' && (
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    )}
                    
                    {uploadingFile.status === 'error' && (
                      <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                    )}
                  </div>
                  
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatFileSize(uploadingFile.file.size)}
                  </p>

                  {uploadingFile.status === 'uploading' && (
                    <div className="mt-2">
                      <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-blue-500 h-full transition-all duration-300"
                          style={{ width: `${uploadingFile.progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {uploadingFile.progress}%
                      </p>
                    </div>
                  )}

                  {uploadingFile.status === 'error' && uploadingFile.error && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                      {uploadingFile.error}
                    </p>
                  )}

                  {uploadingFile.status === 'success' && (
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                      Upload complete
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
