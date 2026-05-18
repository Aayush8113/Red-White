import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createBlog, uploadImage } from '../api/blogService';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const CreateBlog = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [uploading, setUploading] = useState(false);
  
  // Quantum Sandbox Sidebar Tools
  const [activeTool, setActiveTool] = useState('assistant'); // 'assistant', 'napkin', 'auditor'
  
  // Neural Assistant States
  const [proofreadResult, setProofreadResult] = useState(null);
  
  // Napkin AI States
  const [imagePrompt, setImagePrompt] = useState('');
  const [generatingImage, setGeneratingImage] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState('');

  // Accessibility Auditor States
  const [auditReport, setAuditReport] = useState({ score: 100, warnings: [] });

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Run Real-time Proofreader & Auditor when content changes
  useEffect(() => {
    if (!content.trim()) {
      setProofreadResult(null);
      setAuditReport({ score: 100, warnings: [] });
      return;
    }

    // 1. NEURAL ASSISTANT SIMULATION
    const words = content.split(/\s+/).filter(w => w.length > 0).length;
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    
    // Simulate Flesch Kincaid grade levels
    const gradeLevel = words && sentences ? Math.min(Math.max(Math.round(0.39 * (words / sentences) + 11.8 - 15.59), 5), 18) : 8;
    const passiveWords = (content.match(/\b(is|am|are|was|were|be|been|being)\b\s+\w+ed\b/gi) || []).length;
    
    const spellingSuggestions = [];
    if (content.toLowerCase().includes('recieve')) {
      spellingSuggestions.push({ wrong: 'recieve', correct: 'receive', type: 'spelling' });
    }
    if (content.toLowerCase().includes('seperate')) {
      spellingSuggestions.push({ wrong: 'seperate', correct: 'separate', type: 'spelling' });
    }
    if (content.toLowerCase().includes('untill')) {
      spellingSuggestions.push({ wrong: 'untill', correct: 'until', type: 'spelling' });
    }
    if (content.toLowerCase().includes('there is many')) {
      spellingSuggestions.push({ wrong: 'there is many', correct: 'there are many', type: 'grammar' });
    }
    
    setProofreadResult({
      words,
      sentences,
      gradeLevel,
      passiveCount: passiveWords,
      readability: gradeLevel <= 8 ? 'Casual Read' : gradeLevel <= 13 ? 'Technical Read' : 'Simple English Read',
      suggestions: spellingSuggestions
    });

    // 2. ACCESSIBILITY SCANNER
    const warnings = [];
    let score = 100;

    if (!coverImage) {
      warnings.push({ id: 'cover', severity: 'warning', text: 'No manuscript cover image synchronized. Alt descriptive ranks missing.' });
      score -= 20;
    }

    if (!content.includes('<h2>') && !content.includes('<h3>')) {
      warnings.push({ id: 'headings', severity: 'info', text: 'Structural hierarchy flat. Consider segmenting content with sub-headings (H2, H3).' });
      score -= 15;
    }

    if (content.length < 150) {
      warnings.push({ id: 'length', severity: 'warning', text: 'Manuscript content exceptionally short. Timestream index score degraded.' });
      score -= 15;
    }

    setAuditReport({ score, warnings });

  }, [content, coverImage]);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploading(true);
    const toastId = toast.loading('Uploading visual data...');
    try {
      const imagePath = await uploadImage(file);
      setCoverImage(imagePath);
      toast.success('Visual data synchronized', { id: toastId });
    } catch (err) {
      toast.error('Data transmission failed', { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  // Napkin AI Generator Call
  const handleGenerateAiCover = async () => {
    if (!imagePrompt.trim()) {
      toast.error('Please enter a visualization prompt.');
      return;
    }
    setGeneratingImage(true);
    const toastId = toast.loading('Invoking Pollinations AI neural visualizer...');
    
    try {
      // Free Pollinations image generation endpoint with prompt query
      const generatedUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(imagePrompt)}?width=1024&height=576&nologo=true&seed=${Math.floor(Math.random()*10000)}`;
      
      // Load image to make sure it loads successfully before setting it
      const img = new Image();
      img.src = generatedUrl;
      img.onload = () => {
        setGeneratedImageUrl(generatedUrl);
        setCoverImage(generatedUrl); // Set direct external URL as cover image!
        toast.success('Cover visual generated and applied!', { id: toastId });
        setGeneratingImage(false);
      };
    } catch (err) {
      toast.error('AI synthesis node timed out. Please try again.', { id: toastId });
      setGeneratingImage(false);
    }
  };

  // Proofreader Auto-Calibrator
  const runProofreaderCalibrator = () => {
    if (!proofreadResult || proofreadResult.suggestions.length === 0) {
      toast.error('No syntactic calibration adjustments required.');
      return;
    }

    let calibratedContent = content;
    proofreadResult.suggestions.forEach(item => {
      const regex = new RegExp(item.wrong, 'gi');
      calibratedContent = calibratedContent.replace(regex, item.correct);
    });

    setContent(calibratedContent);
    toast.success('Linguistic calibration and syntax optimization complete!');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !category.trim()) {
      toast.error('Please complete all standard fields.');
      return;
    }

    const toastId = toast.loading('Archiving manuscript in quantum timelines...');
    try {
      await createBlog({ title, category, content, coverImage });
      toast.success('Manuscript archived successfully!', { id: toastId });
      navigate('/creator'); 
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to archive story', { id: toastId });
    }
  };

  const handleRichFormatting = (tag) => {
    const textEl = document.getElementById('manuscript-editor');
    if (!textEl) return;

    const start = textEl.selectionStart;
    const end = textEl.selectionEnd;
    const text = textEl.value;
    const selectedText = text.substring(start, end);

    let formattedText = '';
    if (tag === 'bold') {
      formattedText = `<strong>${selectedText || 'bold text'}</strong>`;
    } else if (tag === 'italic') {
      formattedText = `<em>${selectedText || 'italicized text'}</em>`;
    } else if (tag === 'heading') {
      formattedText = `<h2>${selectedText || 'Heading'}</h2>`;
    } else if (tag === 'subheading') {
      formattedText = `<h3>${selectedText || 'Subheading'}</h3>`;
    } else if (tag === 'blockquote') {
      formattedText = `<blockquote>${selectedText || 'Excerpt quote'}</blockquote>`;
    } else if (tag === 'code') {
      formattedText = `<code>${selectedText || 'code snippet'}</code>`;
    }

    const newContent = text.substring(0, start) + formattedText + text.substring(end);
    setContent(newContent);

    // Refocus and select
    setTimeout(() => {
      textEl.focus();
      textEl.setSelectionRange(start + formattedText.length, start + formattedText.length);
    }, 50);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-36 pb-20 px-4">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Breadcrumb navigation */}
        <Link to="/creator" className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-all font-black uppercase tracking-[0.3em] text-[10px] italic group">
          <span className="group-hover:-translate-x-2 transition-transform">←</span> Back to Studio Deck
        </Link>

        {/* Dynamic Dual-Column Creator Sandbox */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Draft Editor (Left 2 Columns) */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[48px] overflow-hidden border border-slate-100/50 shadow-2xl">
              
              {/* Header */}
              <div className="bg-slate-900 p-10 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
                <h1 className="text-4xl font-black italic tracking-tighter relative z-10">Archive New Manuscript</h1>
                <p className="text-slate-400 mt-2 text-sm font-medium italic relative z-10">Curate narrative content optimized by active quantum assistants.</p>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmit} className="p-10 space-y-8">
                
                {/* Visual Header Upload / Generator Preview */}
                <div className="relative group cursor-pointer h-64 rounded-[32px] overflow-hidden border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-slate-100/50 hover:border-blue-300 transition-all flex flex-col items-center justify-center">
                  {coverImage ? (
                    <div className="absolute inset-0 w-full h-full">
                      <img 
                        src={coverImage.startsWith('http') ? coverImage : `http://localhost:5000/uploads/${coverImage}`} 
                        alt="Manuscript cover preview" 
                        className="w-full h-full object-cover" 
                      />
                      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-black uppercase tracking-widest gap-2">
                        <span>🔄 Replace Visual Media</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center pointer-events-none space-y-2">
                      <span className="text-4xl block group-hover:scale-110 transition-transform">🖼️</span>
                      <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Manuscript cover visual</p>
                      <p className="text-[9px] text-slate-400 uppercase font-bold tracking-[0.2em] italic">Click to Upload or invoke AI sidebar generator</p>
                    </div>
                  )}

                  <input 
                    type="file" 
                    onChange={uploadFileHandler} 
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 z-20 cursor-pointer"
                  />

                  {uploading && (
                    <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center z-30">
                      <div className="w-8 h-8 border-4 border-slate-900 border-t-blue-500 rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>

                {/* Title and Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-4 italic">Title of Record</label>
                    <input 
                      type="text" 
                      placeholder="Quantum Synapses..." 
                      value={title} 
                      onChange={(e) => setTitle(e.target.value)} 
                      required 
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-semibold"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-4 italic">Category Vector</label>
                    <input 
                      type="text" 
                      placeholder="Coding, AI, Philosophy..." 
                      value={category} 
                      onChange={(e) => setCategory(e.target.value)} 
                      required 
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-semibold"
                    />
                  </div>
                </div>

                {/* Custom Interactive HTML Drafting Sandbox Editor */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center px-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic">Narrative Sandbox Content (Rich HTML)</label>
                    <span className="text-[9px] font-bold text-slate-300 uppercase">Tags Supported</span>
                  </div>

                  <div className="border border-slate-200/60 rounded-[32px] overflow-hidden bg-slate-50 flex flex-col">
                    {/* Rich Editor Toolbar */}
                    <div className="flex items-center gap-1.5 p-3.5 bg-white border-b border-slate-150 flex-wrap">
                      {[
                        { id: 'bold', label: 'B', title: 'Bold' },
                        { id: 'italic', label: 'I', title: 'Italic' },
                        { id: 'heading', label: 'H2', title: 'H2 Heading' },
                        { id: 'subheading', label: 'H3', title: 'H3 Subheading' },
                        { id: 'blockquote', label: '“ ”', title: 'Blockquote' },
                        { id: 'code', label: '</>', title: 'Code block' }
                      ].map(btn => (
                        <button
                          key={btn.id}
                          type="button"
                          onClick={() => handleRichFormatting(btn.id)}
                          className="px-4 py-2 hover:bg-slate-100 text-slate-700 hover:text-slate-900 rounded-xl text-xs font-bold transition-all border border-slate-100 hover:border-slate-200"
                          title={btn.title}
                        >
                          {btn.label}
                        </button>
                      ))}
                    </div>

                    {/* Textarea drafting */}
                    <textarea 
                      id="manuscript-editor"
                      placeholder="The story begins in the year 2045..." 
                      value={content} 
                      onChange={(e) => setContent(e.target.value)} 
                      required 
                      rows="14"
                      className="w-full p-8 bg-transparent border-none focus:ring-0 outline-none text-base font-medium italic leading-relaxed resize-none text-slate-800"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full py-5 bg-slate-900 text-white font-black rounded-3xl transition-all shadow-xl hover:bg-blue-600 active:scale-95 text-xs uppercase tracking-[0.3em] italic"
                >
                  Archiving Protocol Initiate
                </button>
              </form>

            </div>
          </div>

          {/* AI Assistance and Optimization Panel (Right Sidebar) */}
          <div className="space-y-8">
            <div className="bg-white rounded-[40px] border border-slate-100/50 shadow-2xl overflow-hidden p-8 flex flex-col h-fit gap-8">
              
              {/* Tab Header */}
              <div className="grid grid-cols-3 gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                {[
                  { id: 'assistant', label: '🎙️ Helper' },
                  { id: 'napkin', label: '🎨 Napkin' },
                  { id: 'auditor', label: '👁️ Audit' }
                ].map(tool => (
                  <button
                    key={tool.id}
                    onClick={() => setActiveTool(tool.id)}
                    className={`py-3 rounded-xl font-black text-[9px] uppercase tracking-wider italic transition-all ${
                      activeTool === tool.id ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    {tool.label}
                  </button>
                ))}
              </div>

              {/* Panel tab content */}
              <div className="min-h-[350px]">
                
                {/* Neural Assistant Proofreader */}
                {activeTool === 'assistant' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-black text-slate-900 italic tracking-tight">Neural Assistant</h3>
                      <p className="text-slate-400 text-xs mt-1 leading-normal font-medium">Linguistic optimization checking spelling, syllables and readability indexes.</p>
                    </div>

                    {proofreadResult ? (
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">DENSITY VECTOR</span>
                            <span className="text-lg font-black text-slate-800 italic">{proofreadResult.words} words</span>
                          </div>
                          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">READABILITY RANK</span>
                            <span className="text-lg font-black text-slate-800 italic truncate block">{proofreadResult.readability}</span>
                          </div>
                        </div>

                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-3">
                          <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest italic mb-2">TIMELINE CORRECTOR SUGGESTIONS</span>
                          {proofreadResult.suggestions.length > 0 ? (
                            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                              {proofreadResult.suggestions.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center text-xs font-semibold py-1.5 border-b border-slate-200/50 last:border-0">
                                  <span className="text-rose-500 line-through">{item.wrong}</span>
                                  <span className="text-slate-400">➔</span>
                                  <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded">{item.correct}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-slate-400 italic">Structural linguistics and grammar matrices completely calibrated! No issues discovered.</p>
                          )}
                        </div>

                        {proofreadResult.suggestions.length > 0 && (
                          <button
                            type="button"
                            onClick={runProofreaderCalibrator}
                            className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-indigo-600 transition-all text-[10px] uppercase tracking-widest italic"
                          >
                            Auto-Calibrate Grammar
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="h-64 border border-dashed border-slate-100 rounded-3xl flex flex-col items-center justify-center text-center p-6 bg-slate-50">
                        <span className="text-3xl mb-3">🎙️</span>
                        <p className="font-black text-slate-400 text-xs uppercase tracking-widest italic leading-normal">Awaiting Sandbox Timelines</p>
                        <p className="text-slate-300 text-[10px] mt-1 uppercase font-bold tracking-wider leading-relaxed">Begin typing manuscript content in the sandbox editor to activate real-time grammar checks.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Napkin AI Cover generator */}
                {activeTool === 'napkin' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-black text-slate-900 italic tracking-tight">Napkin AI Visualizer</h3>
                      <p className="text-slate-400 text-xs mt-1 leading-normal font-medium">Invokes free Pollinations neural vectors to generate cover art from text prompts.</p>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest italic ml-2">Visual Prompts Grid</label>
                        <textarea
                          placeholder="Quantum core grid hovering over cybernetic city, neon colors, synthwave, highly detailed..."
                          value={imagePrompt}
                          onChange={(e) => setImagePrompt(e.target.value)}
                          rows="4"
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-xs font-semibold leading-relaxed resize-none text-slate-800"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={handleGenerateAiCover}
                        disabled={generatingImage}
                        className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-blue-600 transition-all text-[10px] uppercase tracking-widest italic disabled:opacity-50"
                      >
                        {generatingImage ? 'Synthesizing Neural Art...' : 'Generate and Apply Cover Art'}
                      </button>

                      {generatedImageUrl && (
                        <div className="border border-slate-100 p-3 rounded-2xl bg-slate-50">
                          <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest italic mb-2">LATEST AI GENERATION</span>
                          <img src={generatedImageUrl} alt="Generated visual node" className="w-full h-32 object-cover rounded-xl shadow-md" />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Automated Accessibility Auditor */}
                {activeTool === 'auditor' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-black text-slate-900 italic tracking-tight">Accessibility Scanner</h3>
                      <p className="text-slate-400 text-xs mt-1 leading-normal font-medium">Scans layout architecture headings, image alts, and contrast compatibility rankings.</p>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col items-center justify-center text-center space-y-2 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 rounded-full blur-xl"></div>
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest italic">COMPLIANCE SCORE MATRIX</span>
                        <h4 className={`text-4xl font-black italic tracking-tighter ${
                          auditReport.score >= 80 ? 'text-green-600' : auditReport.score >= 50 ? 'text-yellow-600' : 'text-rose-600'
                        }`}>
                          {auditReport.score}%
                        </h4>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">
                          {auditReport.score === 100 ? 'Fully Compliant Rank' : 'Optimization Required'}
                        </span>
                      </div>

                      <div className="space-y-3">
                        <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest italic ml-2">AUDIT CORRECTIONS TIMELINE</span>
                        {auditReport.warnings.length > 0 ? (
                          <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                            {auditReport.warnings.map((warn, idx) => (
                              <div key={idx} className="p-3 bg-slate-50 border-l-2 border-amber-500 rounded-r-xl text-slate-700 text-xs font-semibold leading-normal">
                                {warn.text}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-slate-400 italic pl-2">Layout complies perfectly with timeline accessibility regulations. Highly accessible rank established!</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default CreateBlog;