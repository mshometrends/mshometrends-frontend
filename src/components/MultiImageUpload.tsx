import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  Image as ImageIcon,
  X,
  Trash2,
  ExternalLink,
  Sparkles,
  RefreshCw,
  Plus,
  ArrowLeft,
  ArrowRight,
  Star,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { uploadImage } from '../services/uploadService';

interface MultiImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
  label?: string;
  className?: string;
}

export const MultiImageUpload: React.FC<MultiImageUploadProps> = ({
  images = [],
  onChange,
  maxImages = 5,
  label = 'Product Photography & Gallery',
  className = '',
}) => {
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [urlInput, setUrlInput] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const remainingSlots = Math.max(0, maxImages - images.length);

  const handleFiles = async (fileList: FileList | File[]) => {
    setError(null);
    const filesArray = Array.from(fileList);

    if (filesArray.length === 0) return;

    if (remainingSlots <= 0) {
      setError(`Maximum limit of ${maxImages} images already reached. Remove an image to add a new one.`);
      return;
    }

    const filesToUpload = filesArray.slice(0, remainingSlots);
    if (filesArray.length > remainingSlots) {
      setError(`Maximum limit is ${maxImages} pictures. Uploading ${remainingSlots} of ${filesArray.length} selected files.`);
    }

    setUploading(true);
    setStatusMessage(`Uploading ${filesToUpload.length} image${filesToUpload.length > 1 ? 's' : ''} to Cloudinary...`);

    const initialProgress: { [key: string]: number } = {};
    filesToUpload.forEach((f) => {
      initialProgress[f.name] = 10;
    });
    setUploadProgress(initialProgress);

    try {
      const uploadPromises = filesToUpload.map(async (file) => {
        try {
          const res = await uploadImage(file, (percent) => {
            setUploadProgress((prev) => ({ ...prev, [file.name]: percent }));
          });
          return res.url;
        } catch (err: any) {
          console.error(`Failed to upload ${file.name}:`, err);
          throw new Error(`Failed to upload ${file.name}: ${err.message || 'Network error'}`);
        }
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      const updated = [...images, ...uploadedUrls].slice(0, maxImages);
      onChange(updated);
      setStatusMessage('');
      setError(null);
    } catch (err: any) {
      setError(err.message || 'One or more images failed to upload. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress({});
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await handleFiles(e.target.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (remainingSlots > 0 && !uploading) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await handleFiles(e.dataTransfer.files);
    }
  };

  const handleAddUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;

    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      setError('Please enter a valid URL starting with http:// or https://');
      return;
    }

    if (remainingSlots <= 0) {
      setError(`Maximum ${maxImages} images allowed. Remove an existing image first.`);
      return;
    }

    onChange([...images, trimmed].slice(0, maxImages));
    setUrlInput('');
    setError(null);
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const updated = images.filter((_, idx) => idx !== indexToRemove);
    onChange(updated);
    setError(null);
  };

  const handleMakeCover = (index: number) => {
    if (index === 0 || index >= images.length) return;
    const selected = images[index];
    const rest = images.filter((_, idx) => idx !== index);
    onChange([selected, ...rest]);
  };

  const handleMove = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= images.length) return;
    const reordered = [...images];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);
    onChange(reordered);
  };

  return (
    <div className={`space-y-4 text-xs ${className}`}>
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-1 border-b border-slate-100">
        <div>
          <label className="text-slate-800 font-bold text-sm flex items-center gap-2">
            <span>{label}</span>
            <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-full">
              Max {maxImages} Pictures
            </span>
          </label>
          <p className="text-[11px] text-slate-500 mt-0.5">
            The first picture is the primary cover image shown on catalog cards and search results.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`px-2.5 py-1 rounded-lg font-mono font-bold text-xs flex items-center gap-1 ${
              images.length === maxImages
                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                : images.length > 0
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                : 'bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            {images.length} / {maxImages} Added
          </span>
          <span className="hidden sm:inline-flex text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-md font-mono items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" /> Cloudinary Stream
          </span>
        </div>
      </div>

      {/* Hidden Multi-file Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Upload Dropzone (Visible if under maxImages) */}
      {remainingSlots > 0 ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
            isDragOver
              ? 'border-[#0A3825] bg-emerald-50/70 scale-[1.01]'
              : 'border-slate-300 hover:border-[#D4AF37] bg-slate-50/80 hover:bg-slate-100/90'
          }`}
        >
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-200 flex items-center justify-center text-[#0A3825]">
              {uploading ? (
                <RefreshCw className="w-6 h-6 text-amber-600 animate-spin" />
              ) : (
                <UploadCloud className="w-6 h-6 text-[#0A3825]" />
              )}
            </div>

            <div>
              <p className="text-sm font-bold text-slate-800">
                {uploading
                  ? statusMessage || 'Uploading pictures...'
                  : `Click to select up to ${remainingSlots} more picture${remainingSlots > 1 ? 's' : ''} (or drag & drop)`}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Select multiple pictures at once • JPG, PNG, WEBP (Max 10MB each) • Auto-uploaded to Cloudinary
              </p>
            </div>

            {uploading && (
              <div className="w-full max-w-xs space-y-1.5 pt-2">
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#D4AF37] h-full animate-pulse" style={{ width: '100%' }} />
                </div>
                <span className="text-[10px] text-slate-500 font-mono">Processing high-resolution uploads...</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-3 bg-emerald-50/90 border border-emerald-200 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-900 font-semibold text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Maximum 5 pictures added. All photo slots are full.</span>
          </div>
          <span className="text-[11px] text-emerald-700">Delete any picture below to upload a different one.</span>
        </div>
      )}

      {/* Direct Image URL Input Bar */}
      {remainingSlots > 0 && (
        <div className="flex items-center gap-2 bg-white p-2 border border-slate-200 rounded-xl shadow-xs">
          <div className="relative flex-1">
            <input
              type="url"
              placeholder="Or paste external image URL (e.g. https://images.unsplash.com/...)"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddUrl();
                }
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 text-xs focus:outline-none focus:border-[#D4AF37] focus:bg-white"
            />
          </div>
          <button
            type="button"
            onClick={handleAddUrl}
            disabled={!urlInput.trim()}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 disabled:bg-slate-200 text-white disabled:text-slate-400 font-bold text-xs rounded-lg transition-colors flex items-center gap-1 shrink-0 cursor-pointer disabled:cursor-not-allowed"
          >
            <Plus className="w-3.5 h-3.5" />
            Add URL
          </button>
        </div>
      )}

      {/* Error Alert Box */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-3 text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold">Image Upload Notice</p>
            <p className="text-[11px] text-red-700">{error}</p>
          </div>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-red-500 hover:text-red-800 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Picture Slots Grid (Slots 1 to 5) */}
      <div className="space-y-2 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
            Product Photos Gallery ({images.length} of {maxImages})
          </span>
          {images.length > 1 && (
            <span className="text-[10px] text-slate-500">
              Tip: Reorder using arrows or click &quot;Make Cover&quot; to set the first image.
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {Array.from({ length: maxImages }).map((_, slotIndex) => {
            const imgUrl = images[slotIndex];
            const isCover = slotIndex === 0 && !!imgUrl;

            if (imgUrl) {
              return (
                <div
                  key={`slot-${slotIndex}-${imgUrl.slice(-10)}`}
                  className={`group relative rounded-2xl overflow-hidden border bg-white shadow-sm flex flex-col transition-all ${
                    isCover
                      ? 'border-amber-400 ring-2 ring-amber-300/60 shadow-md'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Photo Display */}
                  <div className="relative aspect-square w-full bg-slate-100 overflow-hidden">
                    <img
                      src={imgUrl}
                      alt={`Product preview ${slotIndex + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Slot & Cover Badge */}
                    <div className="absolute top-1.5 left-1.5 flex flex-col gap-1 z-10">
                      {isCover ? (
                        <span className="bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold text-[9px] px-2 py-0.5 rounded-md shadow-sm flex items-center gap-1">
                          <Star className="w-2.5 h-2.5 fill-slate-950" /> Cover Photo
                        </span>
                      ) : (
                        <span className="bg-black/60 backdrop-blur-xs text-white text-[9px] font-mono px-1.5 py-0.5 rounded-md">
                          #{slotIndex + 1}
                        </span>
                      )}
                    </div>

                    {/* Quick View Link */}
                    <a
                      href={imgUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute top-1.5 right-1.5 p-1 bg-black/50 hover:bg-black/80 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      title="View full resolution"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {/* Slot Controls Footer */}
                  <div className="p-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-1 text-[10px]">
                    {/* Make Cover Button (if not already cover) */}
                    {!isCover ? (
                      <button
                        type="button"
                        onClick={() => handleMakeCover(slotIndex)}
                        className="text-amber-800 hover:text-amber-950 hover:bg-amber-100 px-1.5 py-0.5 rounded font-bold transition-colors cursor-pointer flex items-center gap-0.5"
                        title="Set as main cover picture"
                      >
                        <Star className="w-2.5 h-2.5" /> Make Cover
                      </button>
                    ) : (
                      <span className="text-amber-800 font-bold text-[9px]">Primary Image</span>
                    )}

                    <div className="flex items-center gap-0.5 ml-auto">
                      {/* Move Left */}
                      {slotIndex > 0 && (
                        <button
                          type="button"
                          onClick={() => handleMove(slotIndex, slotIndex - 1)}
                          className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded cursor-pointer"
                          title="Move left"
                        >
                          <ArrowLeft className="w-3 h-3" />
                        </button>
                      )}

                      {/* Move Right */}
                      {slotIndex < images.length - 1 && (
                        <button
                          type="button"
                          onClick={() => handleMove(slotIndex, slotIndex + 1)}
                          className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded cursor-pointer"
                          title="Move right"
                        >
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(slotIndex)}
                        className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded cursor-pointer ml-0.5"
                        title="Delete this picture"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            }

            // Empty Placeholder Slot
            return (
              <div
                key={`empty-slot-${slotIndex}`}
                onClick={() => !uploading && fileInputRef.current?.click()}
                className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-slate-100/70 hover:border-amber-400 flex flex-col items-center justify-center p-3 text-center cursor-pointer transition-all group"
              >
                <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-amber-600 group-hover:border-amber-300 transition-colors mb-1.5">
                  <Plus className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold text-slate-600 group-hover:text-amber-800">
                  Slot #{slotIndex + 1}
                </span>
                <span className="text-[9px] text-slate-400">
                  {slotIndex === 0 ? 'Cover Photo' : 'Gallery Photo'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
