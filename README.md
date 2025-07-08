# ✨ Illude - AI-Powered Interactive Storytelling Platform

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-15.3.5-black?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript" />
  <img src="https://img.shields.io/badge/MongoDB-6.0-green?style=for-the-badge&logo=mongodb" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.0-06B6D4?style=for-the-badge&logo=tailwindcss" />
  <img src="https://img.shields.io/badge/Google_Gemini-2.5_Flash-4285F4?style=for-the-badge&logo=google" />
</div>

<div align="center">
  <h3>🎭 Bring Your Imagination to Life with AI</h3>
  <p><em>An intelligent story generator that crafts evolving narratives in real-time, maintaining character arcs and plot continuity across unlimited chapters.</em></p>
</div>

---

## 🌟 **What Makes Illude Special?**

Illude isn't just another AI writing tool. It's a **living story ecosystem** that:

- 🧠 **Remembers Everything** - Advanced memory system tracks plot points, character development, and story continuity
- 🎨 **Evolves Naturally** - Each chapter builds meaningfully on previous events
- 🤝 **Collaborative Creation** - Choose between AI-driven narrative flow or direct your story's path
- 💾 **Never Lose Progress** - All stories are safely stored in MongoDB with full history
- 🎭 **Rich Character Development** - Watch your characters grow and change across chapters
- ⚡ **Instant Generation** - Powered by Google Gemini 2.5 Flash for lightning-fast story creation

---

## 🚀 **Key Features**

### 📚 **Intelligent Story Management**
- **Story Dashboard** - Beautiful grid view of all your stories with status tracking
- **Multi-Chapter Narratives** - Unlimited chapter generation with perfect continuity
- **Character Arc Tracking** - AI monitors and develops character growth over time
- **Plot Memory System** - Maintains consistency across complex storylines

### 🤖 **Advanced AI Generation**
- **Dual Generation Modes**:
  - 🎯 **AI Direction** - Let AI naturally progress your story
  - ✍️ **User Direction** - Provide specific instructions for story development
- **Context-Aware Writing** - AI considers all previous chapters and character states
- **Automatic Chapter Analysis** - Every chapter is analyzed for key events and plot developments

### 🎨 **Beautiful User Experience**
- **Dark Theme** with elegant emerald accents
- **Responsive Design** - Perfect on desktop and mobile
- **Intuitive Navigation** - Seamlessly move between stories and chapters
- **Real-time Updates** - Watch your stories come to life instantly

### 🧩 **Comprehensive World Building**
- **Character Profiles** - Detailed character creation with relationships and backgrounds
- **World Systems** - Magic systems, technology, power structures, and more
- **Cultural Elements** - History, lore, mythology, and cultural details
- **Setting Management** - Rich environmental and location descriptions

---

## 🛠️ **Tech Stack**

### **Frontend**
- **Next.js 15.3.5** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library

### **Backend**
- **Next.js API Routes** - Serverless backend functions
- **MongoDB** - Document database for story persistence
- **Mongoose** - ODM for MongoDB integration

### **AI Integration**
- **Google Gemini 2.5 Flash** - Advanced language model for story generation
- **Smart Prompting** - Context-aware prompt engineering for consistency

---

## 🎯 **Getting Started**

### **Prerequisites**
- Node.js 18+ 
- MongoDB database (local or cloud)
- Google Gemini API key

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/mansi0xc/illude.git
   cd illude/client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env.local file
   cp .env.example .env.local
   ```
   
   Add your configuration:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   GEMINI_API_KEY=your_google_gemini_api_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🎮 **How to Use Illude**

### **1. Create Your First Story**
- Click **"Start Creating"** on the homepage
- Fill in your story details:
  - **Basic Info**: Title, description, plot, and central conflict
  - **Characters**: Detailed character profiles with goals and relationships
  - **World Building**: Settings, magic systems, rules, and lore
- Generate your first chapter automatically

### **2. Continue Your Adventure**
- Visit **"My Stories"** to see all saved stories
- Click **"Continue Story"** to add new chapters
- Choose your generation mode:
  - **🤖 AI Direction**: Let AI naturally progress the story
  - **✍️ Your Direction**: Tell AI exactly what should happen next

### **3. Read and Manage**
- **Read Full Stories** with beautiful chapter navigation
- **View Story Memory** to see plot points and character arcs
- **Track Character Development** across chapters
- **Delete or Archive** completed stories

---

## 🧠 **Story Memory System**

Illude's revolutionary memory system ensures perfect story continuity:

### **What Gets Tracked:**
- 📊 **Plot Points** - Key story developments and turning points
- 👥 **Character Arcs** - Individual character growth and changes
- 🌍 **World State** - Current state of your story world
- ⚔️ **Active Conflicts** - Ongoing tensions and problems
- 🔍 **Mysteries** - Unresolved elements to address later
- 🔮 **Foreshadowing** - Elements to pay off in future chapters
- 💕 **Relationships** - Character interactions and bonds

### **How It Works:**
1. **Chapter Generation** - AI writes new chapter with full context
2. **Automatic Analysis** - AI analyzes chapter for key elements
3. **Memory Update** - Story memory is updated with new information
4. **Future Reference** - All future chapters use this accumulated knowledge

---

## 🎨 **Screenshots & UI Highlights**

### **🏠 Landing Page**
Elegant dark theme with emerald accents showcasing Illude's capabilities

### **📝 Story Generator**
Comprehensive form for creating rich, detailed stories with dynamic character and world-building sections

### **📚 Story Dashboard**
Beautiful grid layout showing all your stories with status indicators and quick actions

### **📖 Story Reader**
Immersive reading experience with chapter navigation and expandable story details

### **🔮 Story Continuation**
Split-view interface for generating new chapters with memory context and real-time preview

---

## 🗂️ **Project Structure**

```
illude/
├── client/                     # Next.js application
│   ├── app/                   # App Router pages
│   │   ├── api/              # API routes
│   │   │   ├── stories/      # Story CRUD operations
│   │   │   │   └── initStory/    # Initial story generation
│   │   │   └── stories/          # Story management pages
│   │   │       ├── [id]/        # Individual story pages
│   │   │       │   ├── continue/ # Story continuation
│   │   │       │   └── page.tsx  # Story reader
│   │   │       └── page.tsx     # Stories dashboard
│   │   ├── story-generator/  # Story creation
│   │   └── page.tsx         # Landing page
│   ├── components/           # Reusable UI components
│   ├── functions/           # Utility functions
│   ├── lib/                # Database and utilities
│   │   ├── mongodb.ts      # MongoDB connection
│   │   └── models.ts       # Database schemas
│   └── package.json
└── README.md
```

---

## 🔧 **API Reference**

### **Stories**
- `GET /api/stories` - Get all stories
- `POST /api/stories` - Create new story
- `GET /api/stories/[id]` - Get specific story
- `PUT /api/stories/[id]` - Update story
- `DELETE /api/stories/[id]` - Delete story

### **Chapters**
- `POST /api/stories/[id]/chapters` - Generate new chapter
  ```json
  {
    "generateType": "ai" | "user-directed",
    "userDirection": "Optional direction for the story"
  }
  ```

### **Story Generation**
- `POST /api/initStory` - Generate first chapter and create story
  ```json
  {
    "story": {
      "title": "Story Title",
      "description": "Story description",
      "characters": [...],
      "settings": "Story setting",
      // ... other story properties
    }
  }
  ```

---

## 🎭 **Sample Story: "The Echoing Void"**

Try Illude with this ready-to-use story concept:

**Genre**: Sci-Fi Fantasy  
**Setting**: Memoriam - floating city where memories are currency  
**Protagonist**: Kira Ashwind - memory thief seeking the legendary "First Memory"  
**Conflict**: Must choose between power and protecting reality itself  

*Perfect for testing multi-chapter generation and memory continuity!*

---

## 🤝 **Contributing**

We welcome contributions! Here's how you can help:

1. **🐛 Report Bugs** - Use GitHub issues for bug reports
2. **💡 Suggest Features** - Share your ideas for improvements
3. **🔧 Submit PRs** - Help improve the codebase
4. **📖 Improve Docs** - Help make the documentation better

### **Development Guidelines**
- Use TypeScript for type safety
- Follow the existing code style
- Add JSDoc comments for functions
- Test your changes thoroughly

---

## 📋 **Roadmap**

### **🔄 Current Features**
- ✅ AI-powered story generation
- ✅ MongoDB story persistence
- ✅ Multi-chapter continuity
- ✅ Advanced memory system
- ✅ Beautiful responsive UI
- ✅ Character arc tracking

### **🚀 Coming Soon**
- 🔊 **Audio Generation** - Text-to-speech for chapters
- 🎨 **Image Generation** - AI-generated story illustrations
- 👥 **Collaborative Stories** - Multi-user story creation
- 📱 **Mobile App** - Native iOS/Android experience
- 🌐 **Story Sharing** - Public story gallery
- 🎯 **Genre Templates** - Pre-built story frameworks

---

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 **Acknowledgments**

- **Google Gemini** - For powerful AI story generation
- **Next.js Team** - For the amazing React framework
- **Tailwind CSS** - For beautiful, utility-first styling
- **MongoDB** - For reliable data persistence
- **Radix UI** - For accessible component primitives
- **Lucide** - For beautiful, consistent icons

---

<div align="center">
  <h3>🌟 Ready to Create Your Epic Story?</h3>
  <p><em>Visit <a href="https://localhost:3000">Illude</a> and let your imagination run wild!</em></p>
  
  <img src="https://img.shields.io/badge/Made_with-❤️-red?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Powered_by-AI-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Built_for-Storytellers-purple?style=for-the-badge" />
</div>

---

*"Every great story begins with a single word. Let Illude help you find yours."* ✨ 