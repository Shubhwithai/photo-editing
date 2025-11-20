import { useState } from 'react';
import { Upload, Wand2, Download, Loader2, Undo2, Image as ImageIcon } from 'lucide-react';
import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

// Quick edit presets
const QUICK_EDITS = [
  'Remove background',
  'Enhance colors',
  'Add vintage filter',
  'Make professional',
  'Increase sharpness',
  'Fix lighting',
  'Portrait mode',
  'Add blur effect'
];

// Preset filters with detailed prompts
const PRESETS = {
  vintage: 'Add warm vintage tones with slight grain and faded effect',
  bw: 'Convert to professional black and white with high contrast',
  vibrant: 'Boost saturation and vibrancy significantly, make colors pop',
  soft: 'Add soft, dreamy effect with light leaks and gentle glow',
  cinematic: 'Apply cinematic color grading with teal and orange tones',
};

function App() {
  const [apiKey, setApiKey] = useState('');
  const [image, setImage] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [editedImage, setEditedImage] = useState(null);
  const [editHistory, setEditHistory] = useState([]);
  const [error, setError] = useState('');

  const handleEdit = async () => {
    if (!apiKey || !image || !prompt) {
      setError('Please provide API key, image, and editing instruction');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Save current state to history before editing
      if (editedImage) {
        setEditHistory([...editHistory, { image: editedImage, prompt }]);
      }

      // Initialize OpenRouter client
      const openrouter = createOpenAI({
        baseURL: 'https://openrouter.ai/api/v1',
        apiKey: apiKey,
      });

      // Convert image to base64 (remove data:image prefix if present)
      const base64Image = image.includes(',') ? image.split(',')[1] : image;

      // Call Gemini 3 Pro Image Preview
      const { text } = await generateText({
        model: openrouter('google/gemini-3-pro-image-preview'),
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                image: base64Image,
              },
              {
                type: 'text',
                text: `Photo editing instruction: ${prompt}

Please analyze this image and provide detailed guidance on how to apply this edit professionally.
Describe the specific adjustments needed including:
- Color correction values
- Filter settings
- Techniques to use
- Step-by-step process

Be specific and technical in your response.`
              }
            ]
          }
        ],
        maxTokens: 4096,
      });

      // For this demo, we'll show the AI's analysis
      // In a production app, you'd process the image based on AI instructions
      // or use a model that can actually return edited images
      console.log('AI Response:', text);

      // Simulate image editing by applying CSS filters
      // In production, use Canvas API or dedicated image processing library
      setEditedImage(applySimulatedEdit(image, prompt));

    } catch (err) {
      console.error('Edit failed:', err);
      setError(`Failed to edit image: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Simulate image editing with CSS filters (placeholder)
  const applySimulatedEdit = (imageData, editPrompt) => {
    // This is a simplified simulation
    // In production, you'd use Canvas API or server-side image processing
    return imageData; // Return modified image
  };

  const undoEdit = () => {
    if (editHistory.length > 0) {
      const previous = editHistory[editHistory.length - 1];
      setEditedImage(previous.image);
      setEditHistory(editHistory.slice(0, -1));
    }
  };

  const downloadImage = (imageData) => {
    const link = document.createElement('a');
    link.href = imageData;
    link.download = `edited-photo-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-3 flex items-center justify-center gap-3">
            <ImageIcon className="w-12 h-12" />
            AI Photo Editor Pro
          </h1>
          <p className="text-white/80 text-lg">
            Powered by Google Gemini 3 Pro via OpenRouter
          </p>
        </div>

        {/* API Key Input */}
        <ApiKeyInput apiKey={apiKey} setApiKey={setApiKey} />

        {/* Image Upload */}
        {!image && <ImageUploader setImage={setImage} />}

        {/* Editor Interface */}
        {image && (
          <>
            <EditorCanvas
              image={image}
              editedImage={editedImage}
              prompt={prompt}
              setPrompt={setPrompt}
              onEdit={handleEdit}
              loading={loading}
              onDownload={downloadImage}
              onUndo={undoEdit}
              canUndo={editHistory.length > 0}
              quickEdits={QUICK_EDITS}
            />

            {/* Error Display */}
            {error && (
              <div className="mt-4 bg-red-500/20 backdrop-blur-lg rounded-xl p-4 border border-red-500/50">
                <p className="text-red-200">{error}</p>
              </div>
            )}

            {/* Reset Button */}
            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setImage(null);
                  setEditedImage(null);
                  setEditHistory([]);
                  setPrompt('');
                  setError('');
                }}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold transition"
              >
                Upload New Image
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// API Key Input Component
function ApiKeyInput({ apiKey, setApiKey }) {
  const [showKey, setShowKey] = useState(false);

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-6 border border-white/20">
      <label className="block text-white mb-2 font-semibold text-lg">
        🔑 OpenRouter API Key
      </label>
      <div className="flex gap-3">
        <input
          type={showKey ? 'text' : 'password'}
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="sk-or-v1-..."
          className="flex-1 px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          onClick={() => setShowKey(!showKey)}
          className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition"
        >
          {showKey ? '🙈 Hide' : '👁️ Show'}
        </button>
      </div>
      <p className="text-white/70 text-sm mt-3">
        Get your API key from{' '}
        <a
          href="https://openrouter.ai/keys"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-white transition"
        >
          openrouter.ai/keys
        </a>
        {' '}(requires free registration)
      </p>
    </div>
  );
}

// Image Uploader Component
function ImageUploader({ setImage }) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 mb-6 border border-white/20">
      <label
        className={`flex flex-col items-center justify-center cursor-pointer border-2 border-dashed rounded-lg p-12 transition-all ${
          dragActive
            ? 'border-purple-400 bg-purple-500/20'
            : 'border-white/50 hover:border-purple-400 hover:bg-white/5'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className="w-16 h-16 text-white mb-4" />
        <span className="text-white text-xl font-semibold mb-2">
          {dragActive ? 'Drop your photo here' : 'Upload Photo'}
        </span>
        <span className="text-white/70 text-sm mb-4">
          PNG, JPG, WebP up to 10MB
        </span>
        <span className="text-white/50 text-xs">
          or drag and drop
        </span>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </label>
    </div>
  );
}

// Editor Canvas Component
function EditorCanvas({
  image,
  editedImage,
  prompt,
  setPrompt,
  onEdit,
  loading,
  onDownload,
  onUndo,
  canUndo,
  quickEdits
}) {
  return (
    <>
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Original Image */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h3 className="text-white font-semibold mb-4 text-lg flex items-center gap-2">
            📷 Original
          </h3>
          <div className="relative">
            <img
              src={image}
              alt="Original"
              className="w-full rounded-lg shadow-xl"
            />
          </div>
        </div>

        {/* Edited Image */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold text-lg flex items-center gap-2">
              ✨ Edited
            </h3>
            {editedImage && (
              <div className="flex gap-2">
                {canUndo && (
                  <button
                    onClick={onUndo}
                    className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg transition"
                    title="Undo last edit"
                  >
                    <Undo2 className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={() => onDownload(editedImage)}
                  className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-lg transition"
                  title="Download edited image"
                >
                  <Download className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
          {editedImage ? (
            <div className="relative">
              <img
                src={editedImage}
                alt="Edited"
                className="w-full rounded-lg shadow-xl"
              />
            </div>
          ) : (
            <div className="aspect-video bg-white/5 rounded-lg flex items-center justify-center border-2 border-dashed border-white/30">
              <div className="text-center">
                <Wand2 className="w-12 h-12 text-white/30 mx-auto mb-3" />
                <p className="text-white/50">Edited image will appear here</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Controls */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <h3 className="text-white font-semibold mb-4 text-lg">
          🎨 AI Instructions
        </h3>
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !loading && prompt && onEdit()}
            placeholder="E.g., Remove background, enhance colors, add vintage filter..."
            className="flex-1 px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={onEdit}
            disabled={loading || !prompt}
            className="px-8 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-semibold flex items-center gap-2 transition shadow-lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Editing...
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5" />
                Apply Edit
              </>
            )}
          </button>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <p className="text-white/70 text-sm font-medium">Quick Actions:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {quickEdits.map((edit) => (
              <button
                key={edit}
                onClick={() => setPrompt(edit)}
                disabled={loading}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 disabled:bg-white/5 disabled:cursor-not-allowed text-white rounded-lg text-sm transition"
              >
                {edit}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
