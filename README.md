# AI Photo Editor Pro

A professional photo editing application powered by Google's Gemini 3 Pro Image Preview through OpenRouter. Edit photos using natural language instructions and AI assistance.

## Features

- **Image Upload** - Drag & drop or file picker with preview
- **AI-Powered Editing** - Natural language photo editing instructions
- **Quick Actions** - Pre-configured editing shortcuts
- **Edit History** - Undo/redo functionality
- **High-Quality Export** - Download edited images
- **Modern UI** - Beautiful gradient interface with Tailwind CSS

## Tech Stack

- **Frontend**: React 18 + Vite 6
- **Styling**: Tailwind CSS 3
- **AI SDK**: Vercel AI SDK
- **Model**: `google/gemini-3-pro-image-preview` via OpenRouter
- **Icons**: Lucide React
- **Image Processing**: Canvas API + File Reader

## Prerequisites

- Node.js 18+ and npm
- OpenRouter API key (get one at [openrouter.ai](https://openrouter.ai/keys))

## Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd photo-editing
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

1. **Enter API Key**: Input your OpenRouter API key in the designated field
2. **Upload Image**: Drag & drop or click to upload a photo (PNG, JPG, WebP)
3. **Enter Instructions**: Type natural language editing instructions or use quick actions
4. **Apply Edit**: Click "Apply Edit" or press Enter to process the image
5. **Download**: Click the download button to save your edited image

### Example Prompts

- "Remove the background"
- "Enhance colors and increase brightness"
- "Add vintage filter with warm tones"
- "Make it look more professional"
- "Fix the lighting and increase sharpness"
- "Convert to black and white"
- "Add portrait mode blur effect"

## Quick Actions

The app includes pre-configured quick action buttons:
- Remove background
- Enhance colors
- Add vintage filter
- Make professional
- Increase sharpness
- Fix lighting
- Portrait mode
- Add blur effect

## Project Structure

```
photo-editing/
├── src/
│   ├── App.jsx           # Main application component
│   ├── main.jsx          # React entry point
│   └── index.css         # Tailwind CSS imports
├── public/               # Static assets
├── index.html            # HTML template
├── package.json          # Dependencies
├── vite.config.js        # Vite configuration
├── tailwind.config.js    # Tailwind configuration
└── postcss.config.js     # PostCSS configuration
```

## Components

### App Component
Main application component managing state and orchestrating all features.

### ApiKeyInput
Secure API key input with show/hide toggle.

### ImageUploader
Drag-and-drop file uploader with visual feedback.

### EditorCanvas
Side-by-side view of original and edited images with controls.

## Build for Production

```bash
npm run build
```

Build output will be in the `dist/` directory. Deploy to any static hosting service:
- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages

## Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## API Configuration

The app uses OpenRouter as a proxy to access Google's Gemini 3 Pro model:

- **Base URL**: `https://openrouter.ai/api/v1`
- **Model**: `google/gemini-3-pro-image-preview`
- **Max Tokens**: 4096

## Features Roadmap

- [ ] Canvas-based real-time image editing
- [ ] Multiple preset filters
- [ ] Batch image processing
- [ ] Save edit presets
- [ ] Export in multiple formats
- [ ] Image comparison slider
- [ ] Advanced editing controls
- [ ] Cloud storage integration

## Security Notes

- API keys are stored in component state (not persisted)
- Never commit API keys to version control
- Use environment variables for production deployments
- Implement rate limiting for production use

## Troubleshooting

**Build fails**: Ensure you have Node.js 18+ installed
```bash
node --version
```

**API errors**: Verify your OpenRouter API key is valid and has credits

**Image not uploading**: Check file size (max 10MB) and format (PNG, JPG, WebP)

**Slow performance**: Large images may take longer to process - consider resizing before upload

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - See LICENSE file for details

## Support

For issues and questions:
- Open an issue on GitHub
- Check OpenRouter documentation: [openrouter.ai/docs](https://openrouter.ai/docs)
- Review Vercel AI SDK docs: [sdk.vercel.ai](https://sdk.vercel.ai)

## Acknowledgments

- Google Gemini for AI capabilities
- OpenRouter for API access
- Vercel for the AI SDK
- Tailwind CSS for styling
- Lucide for icons

---

Built with ❤️ using React and AI
