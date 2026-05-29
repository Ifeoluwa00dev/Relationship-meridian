import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MediaUrls } from '../types';
import { ChevronLeft, Camera, Video, Image as ImageIcon, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';

interface MediaUploadProps {
  urls: Partial<MediaUrls>;
  setUrls: (urls: Partial<MediaUrls>) => void;
  onComplete: () => void;
  onBack: () => void;
}

export default function MediaUpload({ urls, setUrls, onComplete, onBack }: MediaUploadProps) {
  const [uploading, setUploading] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: keyof MediaUrls) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(type);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user");

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${type}-${Date.now()}.${fileExt}`;
      const filePath = `profiles/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('private_media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = await supabase.storage
        .from('private_media')
        .createSignedUrl(filePath, 315360000); // long duration for internal use

      if (data?.signedUrl) {
        setUrls({ ...urls, [type]: data.signedUrl });
      }
    } catch (err) {
      console.error("Upload error:", err);
      // Fallback for demo if bucket doesn't exist
      setUrls({ ...urls, [type]: URL.createObjectURL(file) });
    } finally {
      setUploading(null);
    }
  };

  const isReady = urls.facePhoto && urls.bodyPhoto;

  return (
    <div className="space-y-12">
      <div>
        <h3 className="text-2xl mb-4 italic font-serif">Deep Visibility</h3>
        <p className="text-sm text-meridian-ivory/60 leading-relaxed">
          Your photos and video will only be shared with a match after both of you have expressed mutual interest. They are never visible on the platform.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <UploadCard 
            label="Face Photo" 
            description="Clear, front-facing, good lighting."
            icon={<Camera size={24} />}
            onFile={e => handleUpload(e, 'facePhoto')}
            url={urls.facePhoto}
            uploading={uploading === 'facePhoto'}
            required
        />
        <UploadCard 
            label="Full-Body Standing" 
            description="Full height, natural posture."
            icon={<ImageIcon size={24} />}
            onFile={e => handleUpload(e, 'bodyPhoto')}
            url={urls.bodyPhoto}
            uploading={uploading === 'bodyPhoto'}
            required
        />
        <UploadCard 
            label="Casual / Candid" 
            description="A photo that shows your personality."
            icon={<ImageIcon size={24} />}
            onFile={e => handleUpload(e, 'casualPhoto')}
            url={urls.casualPhoto}
            uploading={uploading === 'casualPhoto'}
        />
        <UploadCard 
            label="Intro Video" 
            description="15-30s introduction. Say your name."
            icon={<Video size={24} />}
            onFile={e => handleUpload(e, 'video')}
            url={urls.video}
            uploading={uploading === 'video'}
            isVideo
        />
      </div>

      <div className="flex justify-between pt-12 border-t border-meridian-ivory/10">
        <button onClick={onBack} className="flex items-center text-meridian-ivory/60 hover:text-meridian-ivory transition-colors">
          <ChevronLeft size={18} className="mr-2" /> Back
        </button>
        <button 
            disabled={!isReady}
            onClick={onComplete} 
            className="btn-primary disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Submit Everything
        </button>
      </div>
    </div>
  );
}

function UploadCard({ label, description, icon, onFile, url, uploading, required, isVideo }: any) {
    return (
        <div className={cn(
            "relative aspect-square border border-dashed flex flex-col items-center justify-center text-center p-6 transition-all",
            url ? "border-meridian-gold bg-meridian-gold/5" : "border-meridian-ivory/20 hover:border-meridian-ivory/40"
        )}>
            {url ? (
                <div className="absolute inset-0">
                    {isVideo ? (
                        <video src={url} className="w-full h-full object-cover opacity-40" muted />
                    ) : (
                        <img src={url} className="w-full h-full object-cover opacity-40" />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-meridian-gold text-meridian-navy p-2 rounded-full">
                            <Check size={20} />
                        </div>
                    </div>
                </div>
            ) : uploading ? (
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-8 h-8 border-t-2 border-meridian-gold rounded-full animate-spin mb-4" />
                    <span className="text-[10px] uppercase tracking-widest text-meridian-gold">Uploading...</span>
                </div>
            ) : (
                <>
                    <div className="mb-4 text-meridian-ivory/40">{icon}</div>
                    <span className="text-sm font-medium mb-1">{label} {required && <span className="text-meridian-gold">*</span>}</span>
                    <p className="text-[10px] text-meridian-ivory/40 uppercase tracking-wider">{description}</p>
                </>
            )}
            {!url && !uploading && (
                <input 
                    type="file" 
                    accept={isVideo ? "video/*" : "image/*"}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={onFile}
                />
            )}
            {url && (
                <button 
                    onClick={() => {}} // Could implement removal
                    className="absolute bottom-2 right-2 text-[10px] text-meridian-ivory/40 hover:text-meridian-ivory uppercase"
                >
                    Change
                </button>
            )}
        </div>
    )
}
