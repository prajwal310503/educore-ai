'use client'
import { useRef, useState } from 'react'
import { Upload, X, ImageIcon, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface ThumbnailUploadProps {
  value?: string | null
  onChange: (value: string) => void
}

export function ThumbnailUpload({ value, onChange }: ThumbnailUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  function handleFile(file: File) {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB')
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => onChange(e.target?.result as string)
    reader.readAsDataURL(file)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    e.target.value = ''
  }

  if (value) {
    return (
      <div className="relative rounded-xl overflow-hidden border border-border group h-40">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={value} alt="Course thumbnail" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-8 text-xs border-white/30 text-white bg-transparent hover:bg-white/20 hover:text-white"
            onClick={() => inputRef.current?.click()}
          >
            <Upload className="h-3.5 w-3.5 mr-1.5" /> Change
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-8 text-xs border-white/30 text-white bg-transparent hover:bg-red-500/40 hover:text-white hover:border-red-400/50"
            onClick={() => onChange('')}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleChange} />
      </div>
    )
  }

  return (
    <div
      onDragOver={e => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`h-40 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-3 ${
        dragging
          ? 'border-indigo-400 bg-indigo-500/10 scale-[1.01]'
          : 'border-border hover:border-indigo-500/50 hover:bg-indigo-500/5'
      }`}
    >
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleChange} />
      <div className={`p-3 rounded-xl border transition-colors ${dragging ? 'bg-indigo-500/20 border-indigo-400/40' : 'bg-indigo-500/10 border-indigo-500/20'}`}>
        <ImageIcon className={`h-6 w-6 ${dragging ? 'text-indigo-300' : 'text-indigo-400'}`} />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium">Drop image or click to upload</p>
        <p className="text-xs text-muted-foreground mt-0.5">PNG, JPG, WEBP · Max 5MB</p>
      </div>
      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20">
        <Sparkles className="h-3 w-3 text-violet-400" />
        <span className="text-xs text-violet-400 font-medium">AI will auto-generate if skipped</span>
      </div>
    </div>
  )
}
