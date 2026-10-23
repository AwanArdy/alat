import React, { useState } from 'react';

const BACKEND_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8787';

export const SummarizeTranslatePdf: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [targetLang, setTargetLang] = useState('Indonesia');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleProcess = async (action: 'summarize' | 'translate') => {
    if (!file) return alert('Pilih file PDF terlebih dahulu');
    setLoading(true);
    setResult('');

    const formData = new FormData();
    formData.append('file', file);
    if (action === 'translate') {
      formData.append('targetLang', targetLang);
    }

    const t0 = performance.now();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 180_000); // timeout 3 menit

    try {
      console.log(`[${action}] 1. POST ${BACKEND_URL}/api/${action} (${(file.size / 1024).toFixed(1)} KB)`);
      const response = await fetch(`${BACKEND_URL}/api/${action}`, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });
      console.log(`[${action}] 2. HTTP ${response.status} (${(performance.now() - t0).toFixed(0)} ms)`);

      const data = await response.json();
      if (!response.ok) {
        console.error(`[${action}] 3. error:`, data.error || 'Terjadi kesalahan');
        throw new Error(data.error || 'Terjadi kesalahan');
      }

      setResult(data.summary || data.translation);
      console.log(`[${action}] 4. selesai (${(performance.now() - t0).toFixed(0)} ms)`);
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.error(`[${action}] dibatalkan: timeout 3 menit`);
        alert('Permintaan melebihi 3 menit dan dibatalkan. Coba PDF lebih kecil.');
      } else {
        alert(err.message);
      }
    } finally {
      clearTimeout(timeout);
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-100 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-white font-semibold">
          ✦
        </div>
        <div>
          <h2 className="text-xl font-bold text-zinc-900">Analisis PDF dengan AI</h2>
          <p className="text-sm text-zinc-500">Ringkas atau terjemahkan dokumen PDF secara instan</p>
        </div>
      </div>

      <div className="border border-dashed border-zinc-300 rounded-xl p-6 text-center mb-6 hover:border-zinc-800 transition-colors bg-zinc-50/50">
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="block w-full text-sm text-zinc-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-zinc-900 file:text-white hover:file:bg-zinc-800 cursor-pointer"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => handleProcess('summarize')}
          disabled={loading}
          className="flex-1 py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-medium rounded-xl transition-all active:scale-[0.99] disabled:opacity-50"
        >
          {loading ? 'Memproses...' : 'Ringkas PDF'}
        </button>

        <div className="flex-1 flex gap-2">
          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className="bg-zinc-50 border border-zinc-300 text-zinc-900 text-sm rounded-xl px-3 focus:outline-none focus:border-zinc-900"
          >
            <option value="Indonesia">Indonesia</option>
            <option value="Inggris">Inggris</option>
            <option value="Jepang">Jepang</option>
          </select>
          <button
            onClick={() => handleProcess('translate')}
            disabled={loading}
            className="flex-1 py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-medium rounded-xl transition-all active:scale-[0.99] border border-zinc-300 disabled:opacity-50"
          >
            {loading ? '...' : 'Terjemahkan'}
          </button>
        </div>
      </div>

      {result && (
        <div className="mt-6 p-5 bg-zinc-50 rounded-xl border border-zinc-200/60">
          <h3 className="text-sm font-bold text-zinc-800 uppercase tracking-wider mb-3">Hasil Analisis AI</h3>
          <p className="whitespace-pre-wrap leading-relaxed text-sm text-zinc-700">{result}</p>
        </div>
      )}
    </div>
  );
};
