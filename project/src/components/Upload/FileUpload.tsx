import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react';

export function FileUpload() {
  const { user } = useAuth();
  const { addFile } = useData();
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const inputRef = useRef<HTMLInputElement>(null);

  const getAcceptedTypes = () => {
    switch (user?.role) {
      case 'video_editor':
        return {
          accept: '.mp4,.avi,.mov,.wmv,.flv,.webm',
          types: ['video/mp4', 'video/avi', 'video/quicktime', 'video/x-ms-wmv', 'video/x-flv', 'video/webm'],
          label: 'Video Files (MP4, AVI, MOV, WMV, FLV, WebM)'
        };
      case 'script_writer':
        return {
          accept: '.pdf,.doc,.docx,.txt',
          types: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'],
          label: 'Document Files (PDF, DOC, DOCX, TXT)'
        };
      case 'voice_artist':
        return {
          accept: '.mp3,.wav,.aac,.flac,.ogg',
          types: ['audio/mp3', 'audio/mpeg', 'audio/wav', 'audio/aac', 'audio/flac', 'audio/ogg'],
          label: 'Audio Files (MP3, WAV, AAC, FLAC, OGG)'
        };
      default:
        return {
          accept: '*',
          types: [],
          label: 'All Files'
        };
    }
  };

  const getFileType = () => {
    switch (user?.role) {
      case 'video_editor': return 'video';
      case 'script_writer': return 'script';
      case 'voice_artist': return 'voice';
      default: return 'script';
    }
  };

  const acceptedTypes = getAcceptedTypes();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      const validFiles = droppedFiles.filter(file => 
        acceptedTypes.types.length === 0 || acceptedTypes.types.includes(file.type)
      );
      setFiles(validFiles);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(selectedFiles);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    
    setUploading(true);
    setUploadStatus('idle');

    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      files.forEach(file => {
        addFile({
          filename: file.name.replace(/\s+/g, '_').toLowerCase(),
          originalName: file.name,
          type: getFileType() as 'video' | 'script' | 'voice',
          size: file.size,
          uploadedBy: user?.id || '',
          uploadedByName: user?.name || '',
          status: 'pending',
          mimeType: file.type
        });
      });

      setUploadStatus('success');
      setFiles([]);
      
      setTimeout(() => {
        setUploadStatus('idle');
      }, 3000);
    } catch (error) {
      setUploadStatus('error');
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Upload Files</h2>
        <p className="text-gray-600 mt-1">
          Upload your {acceptedTypes.label.toLowerCase()} here
        </p>
      </div>

      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={acceptedTypes.accept}
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-lg font-medium text-gray-900 mb-2">
          Drop your files here, or <span className="text-blue-600">browse</span>
        </p>
        <p className="text-sm text-gray-500">
          Accepted formats: {acceptedTypes.label}
        </p>
      </div>

      {files.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Selected Files</h3>
          <div className="space-y-3">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <File className="h-6 w-6 text-blue-500" />
                  <div>
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
          
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {uploadStatus === 'success' && (
                <div className="flex items-center text-green-600">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span className="text-sm font-medium">Files uploaded successfully!</span>
                </div>
              )}
              {uploadStatus === 'error' && (
                <div className="flex items-center text-red-600">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  <span className="text-sm font-medium">Upload failed. Please try again.</span>
                </div>
              )}
            </div>
            
            <button
              onClick={handleUpload}
              disabled={uploading || files.length === 0}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {uploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Files
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}