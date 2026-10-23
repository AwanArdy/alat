import React, { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { diffWords } from 'diff';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export const ComparePdf: React.FC = () => {
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [diffResult, setDiffResult] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const extractText = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      fullText += pageText + '\n';
    }
    return fullText;
  };

  const handleCompare = async () => {
    if (!file1 || !file2) return alert('Pilih 2 file PDF terlebih dahulu');
    setLoading(true);

    try {
      const text1 = await extractText(file1);
      const text2 = await extractText(file2);

      const differences = diffWords(text1, text2);
      setDiffResult(differences);
    } catch (err) {
      alert('Gagal membandingkan PDF');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-100 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-white font-semibold">
          ⇄
        </div>
        <div>
          <h2 className="text-xl font-bold text-zinc-900">Bandingkan PDF</h2>
          <p className="text-sm text-zinc-500">Bandingkan dua versi PDF dan lihat perbedaannya</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="border border-dashed border-zinc-300 rounded-xl p-4 text-center hover:border-zinc-800 transition-colors bg-zinc-50/50">
          <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
            PDF Versi Pertama
          </label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setFile1(e.target.files?.[0] || null)}
            className="block w-full text-sm text-zinc-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-zinc-900 file:text-white hover:file:bg-zinc-800 cursor-pointer"
          />
        </div>

        <div className="border border-dashed border-zinc-300 rounded-xl p-4 text-center hover:border-zinc-800 transition-colors bg-zinc-50/50">
          <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
            PDF Versi Kedua
          </label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setFile2(e.target.files?.[0] || null)}
            className="block w-full text-sm text-zinc-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-zinc-900 file:text-white hover:file:bg-zinc-800 cursor-pointer"
          />
        </div>
      </div>

      <button
        onClick={handleCompare}
        disabled={loading}
        className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-medium rounded-xl transition-all active:scale-[0.99] disabled:opacity-50"
      >
        {loading ? 'Memproses...' : 'Bandingkan Dokumen'}
      </button>

      {diffResult.length > 0 && (
        <div className="mt-6 p-5 bg-zinc-50 rounded-xl border border-zinc-200/60">
          <h3 className="text-sm font-bold text-zinc-800 uppercase tracking-wider mb-3">Hasil Perbandingan</h3>
          <div className="whitespace-pre-wrap leading-relaxed text-sm">
            {diffResult.map((part, index) => {
              // Untuk efek monochrome: teks yang ditambah diberi garis bawah tebal & latar abu terang,
              // sedangkan teks yang dihapus dicoret halus & diberi warna abu buram.
              const style = part.added
                ? 'bg-zinc-200 text-zinc-900 font-medium underline decoration-zinc-900 decoration-2 underline-offset-2'
                : part.removed
                ? 'line-through text-zinc-400 bg-zinc-100'
                : 'text-zinc-700';

              return (
                <span key={index} className={`px-1 py-0.5 rounded transition-colors ${style}`}>
                  {part.value}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
