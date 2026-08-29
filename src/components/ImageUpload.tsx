import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  Image as ImageIcon,
  X,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Trash2,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { uploadImage, deleteImage, CloudinaryImageData } from '../services/uploadService';

interface ImageUploadProps {
  value?: string;
  publicId?: string;
  onImageUploaded: (data: { url: string; imageData?: CloudinaryImageData }) => void;
  onImageRemoved?: () => void;
  folder?: string;
  label?: string;
  className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value = '',
  publicId = '',
  onImageUploaded,
  onImageRemoved,
  label = 'Product Image',
  className = '',
}) => {
  const [preview, setPreview] = useState<string>(value);
  const [currentPublicId, setCurrentPublicId] = useState<string>(publicId);
  const [uploading, setUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync internal state if prop value changes externally
  React.useEffect(() => {
    if (value && value !== preview) {
      setPreview(value);
    }
  }, [value]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processUpload(file);
    }
  };

  const processUpload = async (file: File) => {
    setError(null);
    setUploading(true);
    setProgress(10);

    // Show instant local preview
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    try {
      // Send FormData to backend -> Cloudinary upload_stream
      const uploadedData = await uploadImage(file, (p) => setProgress(p));

      // Clean up object URL
      URL.revokeObjectURL(objectUrl);

      setPreview(uploadedData.url);
      setCurrentPublicId(uploadedData.public_id);
      setError(null);

      // Pass URL and full Cloudinary metadata to parent component
      onImageUploaded({
        url: uploadedData.url,
        imageData: uploadedData,
      });
    } catch (err: any) {
      console.error('[ImageUpload Component Error]', err);
      setError(err.message || 'Image upload failed. Please try again.');
      // Revert preview on failure if previous value wasn't valid
      if (!value) setPreview('');
    } finally {
      setUploading(false);
      setProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      await processUpload(file);
    }
  };

  const handleRemove = async () => {
    if (currentPublicId) {
      // Optionally delete from Cloudinary
      deleteImage(currentPublicId).catch(console.error);
    }

    setPreview('');
    setCurrentPublicId('');
    setError(null);

    if (onImageRemoved) {
      onImageRemoved();
    } else {
      onImageUploaded({ url: '', imageData: undefined });
    }
  };

  return (
    <div className={`space-y-2 text-xs ${className}`}>
      {label && (
        <label className="block text-slate-700 font-semibold flex items-center justify-between">
          <span>{label}</span>
          <span className="text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md font-mono flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" /> Cloudinary Stream
          </span>
        </label>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Upload Zone / Preview Area */}
      {preview ? (
        <div className="relative group rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 shadow-md">
          <img
            src={preview}
            alt="Uploaded Preview"
            className={`w-full h-44 object-cover transition-all ${
              uploading ? 'opacity-40 blur-sm' : 'group-hover:opacity-90'
            }`}
          />

          {/* Upload Progress Overlay */}
          {uploading && (
            <div className="absolute inset-0 bg-slate-900/80 flex flex-col items-center justify-center space-y-2 p-4 text-white">
              <RefreshCw className="w-6 h-6 animate-spin text-amber-400" />
              <p className="text-xs font-bold">Uploading to Cloudinary...</p>
              <div className="w-full max-w-[160px] bg-slate-700 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-amber-400 h-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Controls Bar Overlay */}
          {!uploading && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-md px-3 py-1.5 rounded-xl font-bold text-[11px] flex items-center gap-1 transition-all cursor-pointer border border-white/30"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Replace
                </button>
                <a
                  href={preview}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-md p-1.5 rounded-xl transition-all border border-white/30"
                  title="View full resolution Cloudinary image"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <button
                type="button"
                onClick={handleRemove}
                className="bg-red-600/90 hover:bg-red-600 text-white px-3 py-1.5 rounded-xl font-bold text-[11px] flex items-center gap-1 transition-all cursor-pointer shadow-md"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          )}
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
            isDragOver
              ? 'border-[#0A3825] bg-emerald-50/70 scale-[1.01]'
              : 'border-slate-300 hover:border-[#D4AF37] bg-slate-50/80 hover:bg-slate-100/80'
          }`}
        >
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-200 flex items-center justify-center text-[#0A3825]">
              <UploadCloud className="w-6 h-6 text-[#0A3825]" />
            </div>

            <div>
              <p className="text-xs font-bold text-slate-800">
                Click to browse or drag & drop image
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Supports JPG, PNG, WEBP (Max 10MB) • Direct stream to Cloudinary
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Alert Box */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-3 text-xs flex items-start gap-2 animate-shake">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold">Upload Error</p>
            <p className="text-[11px] text-red-700">{error}</p>
          </div>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-red-500 hover:text-red-800"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
