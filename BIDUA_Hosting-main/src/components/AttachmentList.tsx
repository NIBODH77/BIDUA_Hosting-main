import React, { useState, useEffect } from 'react';
import { Download, Trash2, File, AlertCircle, Loader2 } from 'lucide-react';
import { api } from '../lib/api';

interface Attachment {
  id: number;
  filename: string;
  size: number;
  mime_type: string;
  extension: string;
  is_safe: boolean;
  scan_status: string;
  uploaded_at: string;
  downloaded_count: number;
  message_id?: number;
  status: string;  // 'pending' or 'sent'
}

interface AttachmentListProps {
  ticketId: number;
  onDelete?: () => void;
}

export const AttachmentList: React.FC<AttachmentListProps> = ({ ticketId, onDelete }) => {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingIds, setDownloadingIds] = useState<Set<number>>(new Set());
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    loadAttachments();
  }, [ticketId]);

  const loadAttachments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      const response = await fetch(
        `http://localhost:8000/api/v1/attachments/tickets/${ticketId}/attachments`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setAttachments(data);
      }
    } catch (error) {
      console.error('Failed to load attachments:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadAttachment = async (attachment: Attachment) => {
    try {
      setDownloadingIds(prev => new Set(prev).add(attachment.id));
      
      const token = localStorage.getItem('access_token');
      const response = await fetch(
        `http://localhost:8000/api/v1/attachments/attachments/${attachment.id}/download`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Download failed');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = attachment.filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      // Reload to update download count
      loadAttachments();
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download file');
    } finally {
      setDownloadingIds(prev => {
        const next = new Set(prev);
        next.delete(attachment.id);
        return next;
      });
    }
  };

  const deleteAttachment = async (attachment: Attachment) => {
    // Cannot delete sent attachments
    if (attachment.status === 'sent') {
      alert('Cannot delete attachments that have been sent with messages.');
      return;
    }

    if (!confirm(`Are you sure you want to delete ${attachment.filename}?`)) {
      return;
    }

    try {
      setDeletingIds(prev => new Set(prev).add(attachment.id));
      
      const token = localStorage.getItem('access_token');
      const response = await fetch(
        `http://localhost:8000/api/v1/attachments/attachments/${attachment.id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Delete failed');
      }
      
      await loadAttachments();
      if (onDelete) {
        onDelete();
      }
    } catch (error) {
      console.error('Delete failed:', error);
      alert(`Failed to delete file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setDeletingIds(prev => {
        const next = new Set(prev);
        next.delete(attachment.id);
        return next;
      });
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) {
      return '🖼️';
    } else if (mimeType.includes('pdf')) {
      return '📄';
    } else if (mimeType.includes('word') || mimeType.includes('document')) {
      return '📝';
    } else if (mimeType.includes('sheet') || mimeType.includes('excel')) {
      return '📊';
    } else if (mimeType.includes('zip') || mimeType.includes('archive')) {
      return '📦';
    } else {
      return '📎';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (attachments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
        No attachments yet
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {attachments.map((attachment) => (
        <div
          key={attachment.id}
          className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 flex items-center gap-3"
        >
          <div className="text-2xl">{getFileIcon(attachment.mime_type)}</div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {attachment.filename}
              </p>
              
              {!attachment.is_safe && (
                <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" title="File may be unsafe" />
              )}
              
              {attachment.status === 'sent' && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/30">
                  Sent
                </span>
              )}
              
              {attachment.status === 'pending' && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border border-yellow-500/30">
                  Pending
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
              <span>{formatFileSize(attachment.size)}</span>
              <span>•</span>
              <span>{new Date(attachment.uploaded_at).toLocaleDateString()}</span>
              {attachment.downloaded_count > 0 && (
                <>
                  <span>•</span>
                  <span>{attachment.downloaded_count} download{attachment.downloaded_count !== 1 ? 's' : ''}</span>
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => downloadAttachment(attachment)}
              disabled={downloadingIds.has(attachment.id)}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 
                       disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Download"
            >
              {downloadingIds.has(attachment.id) ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
            </button>
            
            <button
              onClick={() => deleteAttachment(attachment)}
              disabled={deletingIds.has(attachment.id) || attachment.status === 'sent'}
              className={`p-2 transition-colors
                ${attachment.status === 'sent' 
                  ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400'
                }
                disabled:opacity-50 disabled:cursor-not-allowed`}
              title={attachment.status === 'sent' ? 'Cannot delete sent attachments' : 'Delete'}
            >
              {deletingIds.has(attachment.id) ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

// Hook to reload attachments when new files are uploaded
export const useAttachmentRefresh = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  
  const refresh = () => setRefreshKey(prev => prev + 1);
  
  return { refreshKey, refresh };
};
