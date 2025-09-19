// Load Flow Canvas Module
// Assuming you're placing the function directly or in same script
// API Base URL Configuration
const API_BASE_URL = window.location.origin;

// Helper function for API calls
function makeApiCall(endpoint, options = {}) {
  const url = endpoint.startsWith('/') ? `${API_BASE_URL}${endpoint}` : endpoint;
  return fetch(url, options);
}

// PWA Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SoulArt Temple PWA: Service Worker registered successfully', registration.scope);
        
        // Listen for updates
        registration.addEventListener('updatefound', () => {
          console.log('SoulArt Temple PWA: New version available');
        });
      })
      .catch((error) => {
        console.log('SoulArt Temple PWA: Service Worker registration failed', error);
      });
  });

  // Listen for app updates
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    console.log('SoulArt Temple PWA: App updated, new version active');
    // Optionally show user a notification about the update
  });
}

// PWA Install Prompt Handler
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  console.log('SoulArt Temple PWA: Install prompt triggered');
  e.preventDefault();
  deferredPrompt = e;
  showInstallButton();
});

function showInstallButton() {
  // Create install button dynamically if needed
  const installBtn = document.createElement('button');
  installBtn.textContent = 'Install SoulArt Temple App';
  installBtn.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: var(--color-primary);
    color: var(--color-secondary);
    border: none;
    padding: 12px 20px;
    border-radius: 25px;
    font-family: var(--font-body);
    font-weight: bold;
    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    cursor: pointer;
    z-index: 1000;
    transition: all 0.3s ease;
  `;
  
  installBtn.addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log('SoulArt Temple PWA: Install prompt result:', outcome);
      deferredPrompt = null;
      installBtn.remove();
    }
  });

  installBtn.addEventListener('mouseenter', () => {
    installBtn.style.transform = 'scale(1.05)';
    installBtn.style.boxShadow = '0 6px 20px rgba(0,0,0,0.4)';
  });

  installBtn.addEventListener('mouseleave', () => {
    installBtn.style.transform = 'scale(1)';
    installBtn.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
  });

  document.body.appendChild(installBtn);
  
  // Auto-hide after 10 seconds
  setTimeout(() => {
    if (installBtn.parentNode) {
      installBtn.style.opacity = '0';
      setTimeout(() => installBtn.remove(), 300);
    }
  }, 10000);
}

// Navigation history for back buttons
let navigationHistory = ['home'];

// Dropdown menu functionality
function toggleDropdown(event) {
  event.preventDefault();
  event.stopPropagation();
  
  const dropdown = document.getElementById('membership-dropdown');
  dropdown.classList.toggle('active');
}

// Back button functionality
function goBack() {
  if (navigationHistory.length > 1) {
    navigationHistory.pop(); // Remove current page
    const previousPage = navigationHistory[navigationHistory.length - 1];
    navigate(previousPage, false); // Don't add to history when going back
  } else {
    navigate('home', false);
  }
}

// Close dropdown when clicking outside (with delay)
let dropdownCloseTimeout;
document.addEventListener('click', function(event) {
  const dropdown = document.getElementById('membership-dropdown');
  const dropdownToggle = event.target.closest('.dropdown-toggle');
  const dropdownContent = event.target.closest('#membership-dropdown');
  
  if (!dropdownToggle && !dropdownContent && dropdown && dropdown.classList.contains('active')) {
    // Add a small delay to allow dropdown item clicks
    dropdownCloseTimeout = setTimeout(() => {
      dropdown.classList.remove('active');
    }, 100);
  }
});

// Prevent dropdown from closing when hovering over it
// Attach to the dropdown element specifically to avoid target issues
const membershipDropdown = document.getElementById('membership-dropdown');
if (membershipDropdown) {
  membershipDropdown.addEventListener('mouseenter', function(event) {
    clearTimeout(dropdownCloseTimeout);
  });
}

async function navigate(page, addToHistory = true) {
  const main = document.getElementById('main-content');
  main.style.opacity = 0;
  
  // Add to navigation history
  if (addToHistory && navigationHistory[navigationHistory.length - 1] !== page) {
    navigationHistory.push(page);
    // Keep history manageable (max 10 entries)
    if (navigationHistory.length > 10) {
      navigationHistory.shift();
    }
  }
  
  // Close dropdown when navigating
  const dropdown = document.getElementById('membership-dropdown');
  if (dropdown) {
    dropdown.classList.remove('active');
  }
  
  // Navigation cleanup - no chart to destroy with tile layout

  setTimeout(async () => {
    if (page === 'home') {
      main.innerHTML = `
        <h2>Welcome to the SoulArt Temple</h2>
        <p>This is your sacred digital space to heal, harmonise, and embody your highest truth.</p>
        <button onclick="navigate('initiation')">Begin Your SoulArt Journey</button>
        <p style="margin-top: 40px; font-style: italic; color: var(--chakra-third-eye);">“I honoured my shadows and chose to rise.”</p>
      `;
    } else if (page === 'initiation') {
      main.innerHTML = `
        <div style="margin-bottom: 20px;">
          <button onclick="goBack()" style="background: transparent; color: #8F5AFF; border: 2px solid #8F5AFF; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 14px;">
            ← Back
          </button>
        </div>
        <h2>Step 1: Identify Your Frequency</h2>
        <p>
          This is your sacred beginning. Submit a voice note, video link, or reflection.  
          Soraya will attune your frequency and send you a personalized Soul Frequency Snapshot within 48 hours.
        </p>

        <form action="https://formspree.io/f/xblawnrz" method="POST">
          <label>Your Email (so Soraya can send your snapshot)</label><br>
          <input 
            type="email" 
            name="email" 
            required 
            placeholder="you@example.com" 
            style="padding: 10px; width: 300px;"
          ><br><br>

          <label>Voice Note or Video Link</label><br>
          <input 
            type="text" 
            name="link" 
            required 
            placeholder="Paste Dropbox/Google Drive/WeTransfer link here" 
            style="padding: 10px; width: 400px;"
          ><br><br>

          <label>Optional Message or Reflection</label><br>
          <textarea 
            name="message" 
            rows="5" 
            cols="50" 
            placeholder="What are you feeling right now? (optional)" 
            style="padding: 10px;"
          ></textarea><br><br>

          <button type="submit">Submit My Frequency</button>
        </form>

        <p style="margin-top: 30px; font-size: 0.9em; color: var(--color-secondary);">
          Your message will be received by Soraya and answered with a personalized PDF Frequency Snapshot within 72 hours,  
          and invitation to begin the SoulArt Journey.
        </p>
      `;
    } else if (page === 'snapshot') {
      main.innerHTML = `
        <h2>Your Soul Frequency Snapshot</h2>
        <p>You are beginning with: <strong>Be Courage</strong></p>
        <p>Your sacred 7-step journey will now begin. Download your snapshot and begin Journal Book 1.</p>
        <button onclick="navigate('journal')">Start My Journal</button>
      `;
    } else if (page === 'therapy') {
      main.innerHTML = `
        <div style="margin-bottom: 20px;">
          <button onclick="goBack()" style="background: transparent; color: #8F5AFF; border: 2px solid #8F5AFF; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 14px;">
            ← Back
          </button>
        </div>
        <h2>7-Steps Journey with SoulArt</h2>
        <p>Here you will move through the 7-step Harmonic Healing System.</p>
      `;
    } else if (page === 'soulart-cards') {
      showSoulArtCards();
      return; // Exit early since showSoulArtCards handles the display
    } else if (page === 'journal') {
      main.innerHTML = `
        <div class="journal-container">
          <div style="margin-bottom: 20px;">
            <button onclick="goBack()" style="background: transparent; color: #8F5AFF; border: 2px solid #8F5AFF; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 14px;">
              ← Back
            </button>
          </div>
          <h2>Sacred Reflections Journal</h2>
          <p class="journal-subtitle">A space for your spiritual insights and daily reflections</p>
          
          <div class="journal-actions">
            <button onclick="showJournalEntryForm()" class="btn-primary">New Entry</button>
            <button onclick="downloadJournalEntries()" class="btn-secondary">Download All Entries</button>
            <span class="entry-count">Loading entries...</span>
          </div>

          <div id="journal-entry-form" class="journal-form" style="display: none;">
            <h3>Create New Entry</h3>
            <input type="text" id="entry-title" placeholder="Entry title (optional)" class="journal-title-input">
            <textarea id="entry-content" rows="8" placeholder="What is rising in your awareness today? Share your thoughts, feelings, and insights..." class="journal-content-area"></textarea>
            
            <div class="journal-meta">
              <select id="entry-mood" class="journal-mood-select">
                <option value="">Select mood (optional)</option>
                <option value="grateful">Grateful</option>
                <option value="peaceful">Peaceful</option>
                <option value="reflective">Reflective</option>
                <option value="inspired">Inspired</option>
                <option value="curious">Curious</option>
                <option value="challenged">Challenged</option>
                <option value="emotional">Emotional</option>
                <option value="joyful">Joyful</option>
              </select>
              
              <input type="text" id="entry-tags" placeholder="Tags (comma separated)" class="journal-tags-input">
            </div>
            
            <div class="journal-form-actions">
              <button onclick="saveJournalEntry()" class="btn-primary">Save Entry</button>
              <button onclick="cancelJournalEntry()" class="btn-cancel">Cancel</button>
            </div>
          </div>

          <div id="journal-entries-list" class="journal-entries">
            <div class="loading">Loading your sacred reflections...</div>
          </div>
        </div>
      `;
      
      loadJournalEntries();
    } else if (page === 'flowart') {
      renderFlowArtModule();
    } else if (page === 'thankyou') {
      main.innerHTML = `
        <h2>Thank You, Beloved</h2>
        <p>Your sacred message has been received by Soraya.</p>
        <p>
          Within 72 hours, you’ll receive a personalized 
          <strong>Soul Frequency Snapshot</strong> PDF in your inbox.  
          This includes:
        </p>
        <ul>
          <li>Your unique vibrational frequency</li>
          <li>Affirmation & soul guidance note</li>
          <li>A chakra colour or focus</li>
          <li>Your next SoulArt step</li>
          <li>A printable Frequency Certificate</li>
        </ul>
        <p style="margin-top: 20px;">
          This is your beginning, not your ending.  
          A sacred invitation to the 7-Step SoulArt Journey will follow soon after.
        </p>
        <button onclick="navigate('home')">Return to Home</button>
      `;
    } else if (page === 'allergy-identifier') {
      // Feature is now completely free - no authentication required

        // Show the allergy identifier interface
        main.innerHTML = `
        <div style="margin-bottom: 20px;">
          <button onclick="goBack()" style="background: transparent; color: #8F5AFF; border: 2px solid #8F5AFF; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 14px;">
            ← Back
          </button>
        </div>
        <h2>Allergy Identification System</h2>
        <div style="background: linear-gradient(135deg, #8ED6B7, #85C9F2); padding: 15px; border-radius: 10px; margin-bottom: 20px; text-align: center;">
          <p style="color: white; margin: 0; font-weight: bold;">
            Free Access - No Limits
          </p>
        </div>
        <p style="text-align: center; color: #666; margin-bottom: 30px;">
          Use your intuition and kinesiology muscle testing to identify allergens. Click on tiles that create a stress response in your body.
        </p>
        
        <div id="allergy-tiles-container">
          <!-- Allergy tiles will be inserted here -->
        </div>
          
        <div id="healing-process" style="margin-top: 30px; display: none;">
          <!-- Healing process will be inserted here -->
        </div>
      `;
        // Load allergy data and render tiles
        loadAllergyData().then(() => {
          renderAllergyTiles();
        });

    } else if (page === 'belief-decoder') {
      // Feature is now completely free - no authentication required

        // Show the belief decoder interface
        main.innerHTML = `
        <div style="margin-bottom: 20px;">
          <button onclick="goBack()" style="background: transparent; color: #8F5AFF; border: 2px solid #8F5AFF; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 14px;">
            ← Back
          </button>
        </div>
        <h2>Belief Decoder System</h2>
        <div style="background: linear-gradient(135deg, #8ED6B7, #85C9F2); padding: 15px; border-radius: 10px; margin-bottom: 20px; text-align: center;">
          <p style="color: white; margin: 0; font-weight: bold;">
            Free Access - No Limits
          </p>
        </div>
        <p style="text-align: center; color: #666; margin-bottom: 30px;">
          Use your intuition and kinesiology muscle testing to identify limiting beliefs. Click on beliefs that create a stress response in your body.
        </p>
        
        <div id="belief-tiles-container">
          <!-- Belief tiles will be inserted here -->
        </div>
          
        <div id="healing-process" style="margin-top: 30px; display: none;">
          <!-- Healing process will be inserted here -->
        </div>
      `;
        // Load belief data and render tiles
        loadBeliefData().then(() => {
          renderBeliefTiles();
        });

    } else if (page === 'emotion-decoder') {
      // Feature is now completely free - no authentication or usage limits
      main.innerHTML = `
        <div style="margin-bottom: 20px;">
          <button onclick="goBack()" style="background: transparent; color: #8F5AFF; border: 2px solid #8F5AFF; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 14px;">
            ← Back
          </button>
        </div>
        <h2>Trapped Emotion Release Tiles</h2>
        <div style="background: linear-gradient(135deg, #8ED6B7, #85C9F2); padding: 15px; border-radius: 10px; margin-bottom: 20px; text-align: center;">
          <p style="color: white; margin: 0; font-weight: bold;">
            Free Access - No Limits
          </p>
        </div>
        <p>Use muscle testing (Kinesiology) to identify which trapped emotion is ready for release today.</p>
          
        <div style="text-align: center; margin: 25px 0; padding: 20px; background: linear-gradient(135deg, #EAD3FF20, #8ED6B720); border-radius: 15px;">
          <h3 style="color: #8F5AFF; margin-bottom: 15px;">Kinesiology Muscle Testing Guide</h3>
          <p style="font-style: italic; color: #666; margin-bottom: 10px;">
            Test each row systematically - your body knows which emotions need healing
          </p>
          <p style="font-size: 14px; color: #8F5AFF;">
            Once you identify the row, muscle test each emotion in that row to find the specific one
          </p>
        </div>

        <div id="emotion-tiles-container" style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin: 30px 0;">
          <!-- Column 1: Rows 1-3 -->
          <div id="column-1" style="background: linear-gradient(135deg, #8ED6B710, transparent); padding: 20px; border-radius: 15px;">
            <h3 style="text-align: center; color: #8ED6B7; margin-bottom: 20px; font-size: 18px;">
              Foundation & Heart Rows
            </h3>
            <div id="rows-1-3"></div>
          </div>

          <!-- Column 2: Rows 4-6 -->  
          <div id="column-2" style="background: linear-gradient(135deg, #EAD3FF10, transparent); padding: 20px; border-radius: 15px;">
            <h3 style="text-align: center; color: #8F5AFF; margin-bottom: 20px; font-size: 18px;">
              Expression & Wisdom Rows
            </h3>
            <div id="rows-4-6"></div>
          </div>
        </div>
        
        <div id="emotion-results" style="margin-top: 20px;">
          <div style="text-align: center; color: #8F5AFF; font-style: italic;">
            Click on a trapped emotion tile above to begin your healing journey
          </div>
        </div>
        
        <div id="healing-process" style="margin-top: 30px; display: none;">
          <!-- Healing process will be inserted here -->
        </div>
      `;
      // Load emotion data and render tiles
      loadEmotionData().then(() => {
        renderEmotionTiles();
      });
   } else if (page === 'membership') {
  // Check authentication and load membership dashboard
  checkAuthAndLoadMembership();

} else if (page === 'release-emotions') {
  main.innerHTML = `
    <h2>Release Trapped Emotions</h2>
    <p>Select the trapped emotion that resonates. You will be guided to release and replace it.</p>
    <div class="emotion-grid">
      <button class="emotion-btn" onclick="showRelease('Fear')">Fear</button>
      <button class="emotion-btn" onclick="showRelease('Grief')">Grief</button>
      <button class="emotion-btn" onclick="showRelease('Anger')">Anger</button>
      <button class="emotion-btn" onclick="showRelease('Shame')">Shame</button>
      <button class="emotion-btn" onclick="showRelease('Guilt')">Guilt</button>
    </div>
    <div id="release-box" class="release-box"></div>
  `;
}
    main.style.opacity = 1;
  }, 200);
}

// Global variables to store data
let emotionData = [];
let allergyData = [];
let beliefData = [];

// Define chakra order and colors
const CHAKRA_CONFIG = {
  order: ['Root', 'Sacral', 'Solar Plexus', 'Heart', 'Throat', 'Third Eye', 'Crown'],
  colors: {
    'Root': '#B22222',
    'Sacral': '#FF914D', 
    'Solar Plexus': '#FFD700',
    'Heart': '#8ED6B7',
    'Throat': '#4FB2D6',
    'Third Eye': '#8F5AFF',
    'Crown': '#EAD3FF'
  }
};

// Function to load and parse emotion data from CSV
async function loadEmotionData() {
  try {
    const response = await fetch('Sheet 1-Emotion Decoder with SoulArt.csv');
    const csvText = await response.text();
    
    // Parse CSV data
    const lines = csvText.split('\n');
    const headers = lines[0].split(',');
    
    emotionData = [];
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        const values = lines[i].split(',');
        if (values.length >= 6) {
          emotionData.push({
            row: values[0].trim(),
            emotion: values[1].trim(),
            frequency: parseInt(values[2]) || 0,
            chakraBodyArea: values[3].trim(),
            soulArtColor: values[4].trim(),
            additionalSupport: values[5].trim()
          });
        }
      }
    }
    
    // Data loaded successfully for tile rendering
    
  } catch (error) {
    console.error('Error loading emotion data:', error);
  }
}

// Function to load and parse allergy data from CSV
async function loadAllergyData() {
  try {
    const response = await fetch('SoulArt_Allergy_Identification.csv');
    const csvText = await response.text();
    
    // Parse CSV data
    const lines = csvText.split('\n');
    const headers = lines[0].split(',');
    
    allergyData = [];
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        const values = lines[i].split(',');
        if (values.length >= 6) {
          allergyData.push({
            row: values[0].trim(),
            allergen: values[1].trim(),
            category: values[2].trim(),
            bodySystem: values[3].trim(),
            color: values[4].trim(),
            healingSupport: values[5].trim()
          });
        }
      }
    }
    
    // Data loaded successfully for tile rendering
    
  } catch (error) {
    console.error('Error loading allergy data:', error);
  }
}

// Function to load and parse belief data from CSV
async function loadBeliefData() {
  try {
    const response = await fetch('SoulArt_Belief_Decoder.csv');
    const csvText = await response.text();
    
    // Parse CSV data
    const lines = csvText.split('\n');
    const headers = lines[0].split(',');
    
    beliefData = [];
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        const values = lines[i].split(',');
        if (values.length >= 7) {
          beliefData.push({
            row: values[0].trim(),
            belief: values[1].trim(),
            category: values[2].trim(),
            vibrationalLevel: values[3].trim(),
            chakraArea: values[4].trim(),
            color: values[5].trim(),
            healingSupport: values[6].trim()
          });
        }
      }
    }
    
    // Data loaded successfully for tile rendering
    
  } catch (error) {
    console.error('Error loading belief data:', error);
  }
}

// Function to render allergy tiles in organized layout
function renderAllergyTiles() {
  if (!allergyData || allergyData.length === 0) return;
  
  // Group allergies by row
  const rows = {
    'Row 1': [],
    'Row 2': [], 
    'Row 3': [],
    'Row 4': [],
    'Row 5': [],
    'Row 6': []
  };
  
  // Organize allergies into rows
  allergyData.forEach(allergy => {
    const rowKey = allergy.row;
    if (rows[rowKey]) {
      rows[rowKey].push(allergy);
    }
  });
  
  const container = document.getElementById('allergy-tiles-container');
  if (!container) return;
  
  container.innerHTML = '';
  
  // Create two-column layout
  container.style.cssText = 'display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin: 30px 0;';
  
  // Column 1: Rows 1-3
  const column1 = document.createElement('div');
  column1.style.cssText = 'background: linear-gradient(135deg, #8ED6B710, transparent); padding: 20px; border-radius: 15px;';
  column1.innerHTML = '<h3 style="text-align: center; color: #8ED6B7; margin-bottom: 20px; font-size: 18px;">Food & Environmental Allergies</h3>';
  
  // Column 2: Rows 4-6  
  const column2 = document.createElement('div');
  column2.style.cssText = 'background: linear-gradient(135deg, #EAD3FF10, transparent); padding: 20px; border-radius: 15px;';
  column2.innerHTML = '<h3 style="text-align: center; color: #8F5AFF; margin-bottom: 20px; font-size: 18px;">Sensitivities & Patterns</h3>';
  
  // Render Column 1 (Rows 1-3)
  ['Row 1', 'Row 2', 'Row 3'].forEach(rowKey => {
    if (rows[rowKey].length > 0) {
      column1.appendChild(createAllergyRowTile(rowKey, rows[rowKey]));
    }
  });
  
  // Render Column 2 (Rows 4-6)
  ['Row 4', 'Row 5', 'Row 6'].forEach(rowKey => {
    if (rows[rowKey].length > 0) {
      column2.appendChild(createAllergyRowTile(rowKey, rows[rowKey]));
    }
  });
  
  container.appendChild(column1);
  container.appendChild(column2);
  
  // Setup event listeners
  setTimeout(setupAllergyTileEventListeners, 100);
}

// Function to create an allergy row tile
function createAllergyRowTile(rowKey, allergies) {
  const rowDiv = document.createElement('div');
  const rowNumber = rowKey.split(' ')[1];
  
  // Define row themes and colors
  const rowThemes = {
    '1': { title: 'Common Food Intolerances', color: '#E74C3C', description: 'Digestive system impacts' },
    '2': { title: 'Environmental Allergens', color: '#F39C12', description: 'Respiratory system triggers' },
    '3': { title: 'Food Allergies', color: '#27AE60', description: 'Immune system reactions' },
    '4': { title: 'Material Sensitivities', color: '#E67E22', description: 'Skin system responses' },
    '5': { title: 'Environmental Patterns', color: '#3498DB', description: 'Nervous system triggers' },
    '6': { title: 'Chemical Sensitivities', color: '#9B59B6', description: 'Liver system impacts' }
  };
  
  const theme = rowThemes[rowNumber] || { title: `Row ${rowNumber}`, color: '#8F5AFF', description: 'Various allergens' };
  
  rowDiv.style.cssText = `
    margin: 15px 0; 
    padding: 20px; 
    background: linear-gradient(135deg, ${theme.color}15, transparent);
    border-radius: 12px; 
    border-left: 5px solid ${theme.color};
    cursor: pointer;
    transition: all 0.3s ease;
  `;
  
  rowDiv.addEventListener('mouseenter', () => {
    rowDiv.style.transform = 'translateY(-2px)';
    rowDiv.style.boxShadow = `0 8px 25px ${theme.color}30`;
  });
  
  rowDiv.addEventListener('mouseleave', () => {
    rowDiv.style.transform = 'translateY(0)';
    rowDiv.style.boxShadow = 'none';
  });
  
  rowDiv.innerHTML = `
    <h4 style="color: ${theme.color}; margin: 0 0 8px 0; font-size: 16px;">
      ${rowKey}: ${theme.title}
    </h4>
    <p style="font-size: 12px; color: #666; margin: 5px 0 15px 0; font-style: italic;">
      ${theme.description}
    </p>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 8px;">
      ${allergies.map((allergy, index) => `
        <div class="allergy-tile" 
             style="background: white; padding: 8px; border-radius: 6px; text-align: center; 
                    border: 1px solid ${theme.color}40; cursor: pointer; transition: all 0.2s ease;
                    word-wrap: break-word; overflow-wrap: break-word; hyphens: auto;"
             data-allergen="${allergy.allergen}"
             data-color="${allergy.color}"
             data-category="${allergy.category}"
             data-body-system="${allergy.bodySystem}"
             data-healing-support="${allergy.healingSupport}">
          <div style="font-size: 12px; font-weight: bold; color: ${theme.color}; margin-bottom: 4px;">
            ${allergy.allergen}
          </div>
          <div style="font-size: 10px; color: #888;">
            ${allergy.category}
          </div>
        </div>
      `).join('')}
    </div>
  `;
  
  return rowDiv;
}

// Function to setup allergy tile event listeners
function setupAllergyTileEventListeners() {
  const allergyTiles = document.querySelectorAll('.allergy-tile');
  
  allergyTiles.forEach(tile => {
    tile.addEventListener('click', function() {
      handleAllergySelection(this);
    });
    
    tile.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.05)';
      this.style.background = '#f8f9fa';
    });
    
    tile.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1)';
      this.style.background = 'white';
    });
  });
}

// Function to handle allergy selection
function handleAllergySelection(tile) {
  const allergen = tile.dataset.allergen;
  const color = tile.dataset.color;
  const category = tile.dataset.category;
  const bodySystem = tile.dataset.bodySystem;
  const healingSupport = tile.dataset.healingSupport;
  
  // Record usage
  recordAllergyIdentifierUsage(allergen).then(() => {
    showAllergyHealing({
      allergen,
      color,
      category,
      bodySystem,
      healingSupport
    });
  }).catch(error => {
    console.error('Error recording usage:', error);
    // Still show healing even if recording fails
    showAllergyHealing({
      allergen,
      color,
      category,
      bodySystem,
      healingSupport
    });
  });
}

// Function to show allergy healing process
function showAllergyHealing(allergyInfo) {
  const healingDiv = document.getElementById('healing-process');
  if (!healingDiv) return;
  
  healingDiv.style.display = 'block';
  healingDiv.innerHTML = `
    <div style="background: linear-gradient(135deg, #8ED6B720, #EAD3FF20); padding: 30px; border-radius: 15px; margin: 20px 0;">
      <h3 style="color: #8F5AFF; text-align: center; margin-bottom: 20px;">Allergy Healing Protocol</h3>
      
      <div style="background: white; padding: 25px; border-radius: 12px; border-left: 5px solid #8ED6B7; margin-bottom: 20px;">
        <h4 style="color: #8ED6B7; margin-bottom: 15px;">Identified Allergen</h4>
        <div style="font-size: 18px; font-weight: bold; color: #8F5AFF; margin-bottom: 10px;">
          ${allergyInfo.allergen}
        </div>
        <div style="margin-bottom: 10px;">
          <strong>Category:</strong> ${allergyInfo.category}
        </div>
        <div style="margin-bottom: 10px;">
          <strong>Body System:</strong> ${allergyInfo.bodySystem}
        </div>
        <div style="margin-bottom: 10px;">
          <strong>SoulArt Color:</strong> <span style="color: ${allergyInfo.color}; font-weight: bold;">${allergyInfo.color}</span>
        </div>
      </div>
      
      <div style="background: white; padding: 25px; border-radius: 12px; border-left: 5px solid #FF914D; margin-bottom: 20px;">
        <h4 style="color: #FF914D; margin-bottom: 15px;">5-Step Healing Process</h4>
        <div style="margin-bottom: 15px;">
          <strong>Step 1:</strong> Place your hand over the affected body area (${allergyInfo.bodySystem})
        </div>
        <div style="margin-bottom: 15px;">
          <strong>Step 2:</strong> Breathe deeply while visualizing ${allergyInfo.color} healing light
        </div>
        <div style="margin-bottom: 15px;">
          <strong>Step 3:</strong> Say aloud: "I release all sensitivity to ${allergyInfo.allergen}"
        </div>
        <div style="margin-bottom: 15px;">
          <strong>Step 4:</strong> Visualize your ${allergyInfo.bodySystem} in perfect harmony
        </div>
        <div style="margin-bottom: 15px;">
          <strong>Step 5:</strong> Feel gratitude for your body's healing wisdom
        </div>
      </div>
      
      <div style="background: white; padding: 25px; border-radius: 12px; border-left: 5px solid #8F5AFF;">
        <h4 style="color: #8F5AFF; margin-bottom: 15px;">Additional Healing Support</h4>
        <p style="font-style: italic; color: #666; line-height: 1.6;">
          ${allergyInfo.healingSupport}
        </p>
      </div>
      
      <div style="text-align: center; margin-top: 30px;">
        <button onclick="navigate('allergy-identifier')" style="background: #8ED6B7; color: white; padding: 15px 30px; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; margin-right: 10px;">
          Process Another Allergen
        </button>
        <button onclick="navigate('membership')" style="background: transparent; color: #8F5AFF; padding: 15px 30px; border: 2px solid #8F5AFF; border-radius: 8px; cursor: pointer; font-size: 16px;">
          View Dashboard
        </button>
      </div>
    </div>
  `;
  
  // Scroll to healing process
  healingDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Function to render belief tiles in organized layout
function renderBeliefTiles() {
  if (!beliefData || beliefData.length === 0) return;
  
  // Group beliefs by row
  const rows = {
    'Row 1': [],
    'Row 2': [], 
    'Row 3': [],
    'Row 4': [],
    'Row 5': [],
    'Row 6': []
  };
  
  // Organize beliefs into rows
  beliefData.forEach(belief => {
    const rowKey = belief.row;
    if (rows[rowKey]) {
      rows[rowKey].push(belief);
    }
  });
  
  const container = document.getElementById('belief-tiles-container');
  if (!container) return;
  
  container.innerHTML = '';
  
  // Create two-column layout
  container.style.cssText = 'display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin: 30px 0;';
  
  // Column 1: Rows 1-3
  const column1 = document.createElement('div');
  column1.style.cssText = 'background: linear-gradient(135deg, #8ED6B710, transparent); padding: 20px; border-radius: 15px;';
  column1.innerHTML = '<h3 style="text-align: center; color: #8ED6B7; margin-bottom: 20px; font-size: 18px;">Core Beliefs & Relationships</h3>';
  
  // Column 2: Rows 4-6  
  const column2 = document.createElement('div');
  column2.style.cssText = 'background: linear-gradient(135deg, #EAD3FF10, transparent); padding: 20px; border-radius: 15px;';
  column2.innerHTML = '<h3 style="text-align: center; color: #8F5AFF; margin-bottom: 20px; font-size: 18px;">Growth & Safety Beliefs</h3>';
  
  // Render Column 1 (Rows 1-3)
  ['Row 1', 'Row 2', 'Row 3'].forEach(rowKey => {
    if (rows[rowKey].length > 0) {
      column1.appendChild(createBeliefRowTile(rowKey, rows[rowKey]));
    }
  });
  
  // Render Column 2 (Rows 4-6)
  ['Row 4', 'Row 5', 'Row 6'].forEach(rowKey => {
    if (rows[rowKey].length > 0) {
      column2.appendChild(createBeliefRowTile(rowKey, rows[rowKey]));
    }
  });
  
  container.appendChild(column1);
  container.appendChild(column2);
  
  // Setup event listeners
  setTimeout(setupBeliefTileEventListeners, 100);
}

// Function to create a belief row tile
function createBeliefRowTile(rowKey, beliefs) {
  const rowDiv = document.createElement('div');
  const rowNumber = rowKey.split(' ')[1];
  
  // Define row themes and colors
  const rowThemes = {
    '1': { title: 'Self-Worth Beliefs', color: '#E74C3C', description: 'Core identity & value beliefs' },
    '2': { title: 'Abundance Beliefs', color: '#F39C12', description: 'Money & success limitations' },
    '3': { title: 'Relationship Beliefs', color: '#27AE60', description: 'Love & connection patterns' },
    '4': { title: 'Personal Growth Beliefs', color: '#E67E22', description: 'Change & learning blocks' },
    '5': { title: 'Health Beliefs', color: '#3498DB', description: 'Body & wellness patterns' },
    '6': { title: 'Safety Beliefs', color: '#9B59B6', description: 'World & life security' }
  };
  
  const theme = rowThemes[rowNumber] || { title: `Row ${rowNumber}`, color: '#8F5AFF', description: 'Various beliefs' };
  
  rowDiv.style.cssText = `
    margin: 15px 0; 
    padding: 20px; 
    background: linear-gradient(135deg, ${theme.color}15, transparent);
    border-radius: 12px; 
    border-left: 5px solid ${theme.color};
    cursor: pointer;
    transition: all 0.3s ease;
  `;
  
  rowDiv.addEventListener('mouseenter', () => {
    rowDiv.style.transform = 'translateY(-2px)';
    rowDiv.style.boxShadow = `0 8px 25px ${theme.color}30`;
  });
  
  rowDiv.addEventListener('mouseleave', () => {
    rowDiv.style.transform = 'translateY(0)';
    rowDiv.style.boxShadow = 'none';
  });
  
  rowDiv.innerHTML = `
    <h4 style="color: ${theme.color}; margin: 0 0 8px 0; font-size: 16px;">
      ${rowKey}: ${theme.title}
    </h4>
    <p style="font-size: 12px; color: #666; margin: 5px 0 15px 0; font-style: italic;">
      ${theme.description}
    </p>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 8px;">
      ${beliefs.map((belief, index) => `
        <div class="belief-tile" 
             style="background: white; padding: 8px; border-radius: 6px; text-align: center; 
                    border: 1px solid ${theme.color}40; cursor: pointer; transition: all 0.2s ease;"
             data-belief="${belief.belief}"
             data-color="${belief.color}"
             data-category="${belief.category}"
             data-vibrational-level="${belief.vibrationalLevel}"
             data-chakra-area="${belief.chakraArea}"
             data-healing-support="${belief.healingSupport}">
          <div style="font-size: 11px; font-weight: bold; color: ${theme.color}; margin-bottom: 4px; line-height: 1.2;">
            ${belief.belief}
          </div>
          <div style="font-size: 9px; color: #888;">
            ${belief.vibrationalLevel}
          </div>
        </div>
      `).join('')}
    </div>
  `;
  
  return rowDiv;
}

// Function to setup belief tile event listeners
function setupBeliefTileEventListeners() {
  const beliefTiles = document.querySelectorAll('.belief-tile');
  
  beliefTiles.forEach(tile => {
    tile.addEventListener('click', function() {
      handleBeliefSelection(this);
    });
    
    tile.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.05)';
      this.style.background = '#f8f9fa';
    });
    
    tile.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1)';
      this.style.background = 'white';
    });
  });
}

// Function to handle belief selection
function handleBeliefSelection(tile) {
  const belief = tile.dataset.belief;
  const color = tile.dataset.color;
  const category = tile.dataset.category;
  const vibrationalLevel = tile.dataset.vibrationalLevel;
  const chakraArea = tile.dataset.chakraArea;
  const healingSupport = tile.dataset.healingSupport;
  
  // Record usage
  recordBeliefDecoderUsage(belief).then(() => {
    showBeliefHealing({
      belief,
      color,
      category,
      vibrationalLevel,
      chakraArea,
      healingSupport
    });
  }).catch(error => {
    console.error('Error recording usage:', error);
    // Still show healing even if recording fails
    showBeliefHealing({
      belief,
      color,
      category,
      vibrationalLevel,
      chakraArea,
      healingSupport
    });
  });
}

// Function to show belief healing process
function showBeliefHealing(beliefInfo) {
  const healingDiv = document.getElementById('healing-process');
  if (!healingDiv) return;
  
  healingDiv.style.display = 'block';
  healingDiv.innerHTML = `
    <div style="background: linear-gradient(135deg, #8ED6B720, #EAD3FF20); padding: 30px; border-radius: 15px; margin: 20px 0;">
      <h3 style="color: #8F5AFF; text-align: center; margin-bottom: 20px;">Belief Transformation Protocol</h3>
      
      <div style="background: white; padding: 25px; border-radius: 12px; border-left: 5px solid #8ED6B7; margin-bottom: 20px;">
        <h4 style="color: #8ED6B7; margin-bottom: 15px;">Identified Limiting Belief</h4>
        <div style="font-size: 18px; font-weight: bold; color: #8F5AFF; margin-bottom: 10px;">
          "${beliefInfo.belief}"
        </div>
        <div style="margin-bottom: 10px;">
          <strong>Category:</strong> ${beliefInfo.category}
        </div>
        <div style="margin-bottom: 10px;">
          <strong>Vibrational Level:</strong> ${beliefInfo.vibrationalLevel}
        </div>
        <div style="margin-bottom: 10px;">
          <strong>Chakra Area:</strong> ${beliefInfo.chakraArea}
        </div>
        <div style="margin-bottom: 10px;">
          <strong>SoulArt Color:</strong> <span style="color: ${beliefInfo.color}; font-weight: bold;">${beliefInfo.color}</span>
        </div>
      </div>
      
      <div style="background: white; padding: 25px; border-radius: 12px; border-left: 5px solid #FF914D; margin-bottom: 20px;">
        <h4 style="color: #FF914D; margin-bottom: 15px;">5-Step Belief Transformation</h4>
        <div style="margin-bottom: 15px;">
          <strong>Step 1:</strong> Place your hand on your ${beliefInfo.chakraArea} area
        </div>
        <div style="margin-bottom: 15px;">
          <strong>Step 2:</strong> Breathe deeply while visualizing ${beliefInfo.color} transformative light
        </div>
        <div style="margin-bottom: 15px;">
          <strong>Step 3:</strong> Say aloud: "I release the belief that ${beliefInfo.belief.toLowerCase()}"
        </div>
        <div style="margin-bottom: 15px;">
          <strong>Step 4:</strong> Replace with: "I now choose empowering beliefs that serve my highest good"
        </div>
        <div style="margin-bottom: 15px;">
          <strong>Step 5:</strong> Feel gratitude for your new empowering truth
        </div>
      </div>
      
      <div style="background: white; padding: 25px; border-radius: 12px; border-left: 5px solid #8F5AFF;">
        <h4 style="color: #8F5AFF; margin-bottom: 15px;">Additional Transformation Support</h4>
        <p style="font-style: italic; color: #666; line-height: 1.6;">
          ${beliefInfo.healingSupport}
        </p>
      </div>
      
      <div style="text-align: center; margin-top: 30px;">
        <button onclick="navigate('belief-decoder')" style="background: #8ED6B7; color: white; padding: 15px 30px; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; margin-right: 10px;">
          Transform Another Belief
        </button>
        <button onclick="navigate('membership')" style="background: transparent; color: #8F5AFF; padding: 15px 30px; border: 2px solid #8F5AFF; border-radius: 8px; cursor: pointer; font-size: 16px;">
          View Dashboard
        </button>
      </div>
    </div>
  `;
  
  // Scroll to healing process
  healingDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Search function removed - replaced with tile-based Kinesiology identification

// Function to render emotion tiles in two columns  
function renderEmotionTiles() {
  if (!emotionData || emotionData.length === 0) return;
  
  // Group emotions by row
  const rows = {
    'Row 1': [],
    'Row 2': [], 
    'Row 3': [],
    'Row 4': [],
    'Row 5': [],
    'Row 6': []
  };
  
  // Organize emotions into rows
  emotionData.forEach(emotion => {
    const rowKey = emotion.row; // This should be 'Row 1', 'Row 2', etc.
    if (rows[rowKey]) {
      rows[rowKey].push(emotion);
    }
  });
  
  // Render Column 1 (Rows 1-3)
  const column1 = document.getElementById('rows-1-3');
  const column2 = document.getElementById('rows-4-6');
  
  if (column1) {
    column1.innerHTML = '';
    ['Row 1', 'Row 2', 'Row 3'].forEach(rowKey => {
      if (rows[rowKey].length > 0) {
        column1.appendChild(createRowTile(rowKey, rows[rowKey]));
      }
    });
  }
  
  // Render Column 2 (Rows 4-6)
  if (column2) {
    column2.innerHTML = '';
    ['Row 4', 'Row 5', 'Row 6'].forEach(rowKey => {
      if (rows[rowKey].length > 0) {
        column2.appendChild(createRowTile(rowKey, rows[rowKey]));
      }
    });
  }
  
  // Setup safe event listeners after tiles are rendered
  setTimeout(setupTileEventListeners, 100);
}

// Function to create a row tile
function createRowTile(rowKey, emotions) {
  const rowDiv = document.createElement('div');
  const rowNumber = rowKey.split(' ')[1];
  
  // Determine row theme and colors
  const rowThemes = {
    '1': { title: 'Foundation Emotions', color: '#E74C3C', description: 'Root chakra - Shame, guilt, unworthiness' },
    '2': { title: 'Fear-Based Emotions', color: '#F39C12', description: 'Solar Plexus - Fear, panic, worry' },
    '3': { title: 'Heart Emotions', color: '#27AE60', description: 'Heart chakra - Grief, loss, loneliness' },
    '4': { title: 'Anger Emotions', color: '#E67E22', description: 'Liver/Fire - Anger, rage, resentment' },
    '5': { title: 'Communication Emotions', color: '#3498DB', description: 'Throat/Heart - Rejection, betrayal' },
    '6': { title: 'Higher Mind Emotions', color: '#9B59B6', description: 'Crown/Third Eye - Doubt, confusion' }
  };
  
  const theme = rowThemes[rowNumber] || { title: `Row ${rowNumber}`, color: '#8F5AFF', description: 'Various emotions' };
  
  rowDiv.style.cssText = `
    margin: 15px 0; 
    padding: 20px; 
    background: linear-gradient(135deg, ${theme.color}15, transparent);
    border-radius: 12px; 
    border-left: 5px solid ${theme.color};
    cursor: pointer;
    transition: all 0.3s ease;
  `;
  
  rowDiv.addEventListener('mouseenter', () => {
    rowDiv.style.transform = 'translateY(-2px)';
    rowDiv.style.boxShadow = `0 8px 25px ${theme.color}30`;
  });
  
  rowDiv.addEventListener('mouseleave', () => {
    rowDiv.style.transform = 'translateY(0)';
    rowDiv.style.boxShadow = 'none';
  });
  
  rowDiv.innerHTML = `
    <h4 style="color: ${theme.color}; margin: 0 0 8px 0; font-size: 16px;">
      ${rowKey}: ${theme.title}
    </h4>
    <p style="font-size: 12px; color: #666; margin: 5px 0 15px 0; font-style: italic;">
      ${theme.description}
    </p>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 8px;">
      ${emotions.map((emotion, index) => `
        <div class="emotion-tile" 
             style="background: white; padding: 8px; border-radius: 6px; text-align: center; 
                    border: 1px solid ${theme.color}40; cursor: pointer; transition: all 0.2s ease;"
             data-emotion="${emotion.emotion}"
             data-frequency="${emotion.frequency}"
             data-chakra-body-area="${emotion.chakraBodyArea}"
             data-soul-art-color="${emotion.soulArtColor}"
             data-additional-support="${emotion.additionalSupport}"
             data-tile-color="${theme.color}">
          <div style="font-size: 11px; font-weight: bold; color: ${theme.color};">
            ${emotion.emotion}
          </div>
          <div style="font-size: 9px; color: #888; margin-top: 2px;">
            ${emotion.frequency} Hz
          </div>
        </div>
      `).join('')}
    </div>
    <div style="text-align: center; margin-top: 12px; font-size: 11px; color: ${theme.color}; font-weight: bold;">
      Click any emotion to begin healing
    </div>
  `;
  
  return rowDiv;
}

// Function to setup safe event listeners for emotion tiles
function setupTileEventListeners() {
  // Add click handlers to all emotion tiles
  document.querySelectorAll('.emotion-tile').forEach(tile => {
    // Add hover effects
    const tileColor = tile.getAttribute('data-tile-color');
    tile.addEventListener('mouseenter', () => {
      tile.style.backgroundColor = tileColor + '10';
      tile.style.borderColor = tileColor;
    });
    
    tile.addEventListener('mouseleave', () => {
      tile.style.backgroundColor = 'white';
      tile.style.borderColor = tileColor + '40';
    });
    
    // Add click handler
    tile.addEventListener('click', async () => {
      const emotionData = {
        emotion: tile.getAttribute('data-emotion'),
        frequency: parseInt(tile.getAttribute('data-frequency')),
        chakraBodyArea: tile.getAttribute('data-chakra-body-area'),
        soulArtColor: tile.getAttribute('data-soul-art-color'),
        additionalSupport: tile.getAttribute('data-additional-support')
      };
      
      // Record usage before starting the healing process
      try {
        await recordEmotionDecoderUsage(emotionData.emotion);
      } catch (error) {
        console.error('Failed to record usage:', error);
        // Continue with the process even if recording fails
      }
      startHealingProcess(emotionData);
    });
  });
}

// Function to get chakra colors (updated for explicit colors)
function getChakraColor(chakra) {
  return CHAKRA_CONFIG.colors[chakra] || CHAKRA_CONFIG.colors['Heart'];
}

// Function to start the comprehensive healing process
function startHealingProcess(emotionData) {
  const healingDiv = document.getElementById('healing-process');
  const resultsDiv = document.getElementById('emotion-results');
  
  // Hide results and show healing process
  resultsDiv.style.display = 'none';
  healingDiv.style.display = 'block';
  
  // Get chakra color for the emotion
  const primaryChakra = emotionData.chakraBodyArea.split('–')[0].trim();
  const chakraKey = CHAKRA_CONFIG.order.find(chakra => primaryChakra.includes(chakra)) || 'Heart';
  const chakraColor = CHAKRA_CONFIG.colors[chakraKey];
  
  healingDiv.innerHTML = `
    <div style="background: linear-gradient(135deg, ${chakraColor}10, #EAD3FF10); 
                padding: 30px; border-radius: 15px; border: 3px solid ${chakraColor};">
      
      <h2 style="text-align: center; color: #8F5AFF; margin-bottom: 30px;">
        Trapped Emotion Release Process
      </h2>
      
      <div style="background: white; padding: 20px; border-radius: 10px; margin-bottom: 25px; 
                  border-left: 5px solid ${chakraColor};">
        <h3 style="color: ${chakraColor}; margin: 0 0 10px 0;">
          Identified Trapped Emotion: ${emotionData.emotion}
        </h3>
        <p><strong>Frequency:</strong> ${emotionData.frequency} (Hawkins Scale)</p>
        <p><strong>Location:</strong> ${emotionData.chakraBodyArea}</p>
        <p><strong>SoulArt Color:</strong> ${emotionData.soulArtColor}</p>
      </div>
      
      <!-- Step 1: Intention Setting -->
      <div id="step-1" class="healing-step">
        <h3 style="color: #8F5AFF;">Step 1: Set Your Intention</h3>
        <p>Place your hand on your heart and speak this intention aloud:</p>
        <div style="background: #EAD3FF20; padding: 15px; border-radius: 8px; font-style: italic; 
                    text-align: center; margin: 15px 0;">
          "I am ready to release the trapped emotion of <strong>${emotionData.emotion}</strong> 
          from my ${emotionData.chakraBodyArea}. I choose healing and freedom."
        </div>
        <button onclick="nextHealingStep(2)" style="background: ${chakraColor}; color: white; 
                       padding: 12px 24px; border: none; border-radius: 8px; cursor: pointer; 
                       font-size: 16px; margin-top: 15px;">
          Intention Set - Continue
        </button>
      </div>
      
      <!-- Step 2: Magnet Release -->
      <div id="step-2" class="healing-step" style="display: none;">
        <h3 style="color: #8F5AFF;">Step 2: Central Meridian Release</h3>
        
        <div style="background: #EAD3FF20; padding: 15px; border-radius: 10px; margin: 15px 0; text-align: center;">
          <p style="font-weight: bold; color: #8F5AFF; margin-bottom: 15px;">
            Watch the Meridian Release Swipe Video for proper technique
          </p>
          <video controls style="max-width: 100%; height: auto; border-radius: 8px; margin-bottom: 10px;">
            <source src="Meridian release swipe Use a magnet for enhancement If no magnet, use tips of fingers.mp4" type="video/mp4">
            Your browser does not support the video element. Please use the uploaded meridian release swipe video file.
          </video>
          <p style="font-size: 12px; color: #666; font-style: italic;">
            Shows the exact swiping motion and hand placement for optimal energy release
          </p>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; align-items: center;">
          <div>
            <p><strong>Using a magnet, swipe 3 times down your central meridian:</strong></p>
            <ol style="margin: 15px 0;">
              <li>Start at the top of your head</li>
              <li>Swipe down to your chin</li>
              <li>Repeat 3 times with intention to release</li>
            </ol>
            <p style="font-style: italic; color: ${chakraColor};">
              "With each swipe, I release ${emotionData.emotion} from my being."
            </p>
            <p style="font-size: 12px; color: #8F5AFF;">
              Follow the exact technique shown in the Meridian release swipe video
            </p>
          </div>
          <div style="text-align: center; background: #f0f0f0; padding: 20px; border-radius: 10px;">
            <div style="font-size: 20px; font-weight: bold; color: #8F5AFF;">PERSON</div>
            <div style="color: #8F5AFF; font-weight: bold;">Central Meridian</div>
            <div style="font-size: 16px; color: #8F5AFF;">MAGNET SWIPE DOWN</div>
            <div style="font-size: 12px; color: #666;">Top of head to chin</div>
          </div>
        </div>
        <button onclick="nextHealingStep(3)" style="background: ${chakraColor}; color: white; 
                       padding: 12px 24px; border: none; border-radius: 8px; cursor: pointer; 
                       font-size: 16px; margin-top: 15px;">
          Release Complete - Continue
        </button>
      </div>
      
      <!-- Step 3: High Vibration Replacement -->
      <div id="step-3" class="healing-step" style="display: none;">
        <h3 style="color: #8F5AFF;">Step 3: Replace with High Vibration</h3>
        <p>Choose a high vibration word to replace the released emotion:</p>
        <div style="margin: 15px 0; padding: 15px; background: white; border-radius: 10px; border: 2px solid ${chakraColor};">
          <p style="font-weight: bold; margin-bottom: 10px; color: ${chakraColor};">Select from these high vibration words or enter your own:</p>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 8px; margin-bottom: 15px;">
            <button type="button" class="vibe-word" onclick="selectVibeWord('Love')" style="padding: 6px 12px; border: 1px solid ${chakraColor}; background: white; border-radius: 6px; cursor: pointer; font-size: 12px;">Love</button>
            <button type="button" class="vibe-word" onclick="selectVibeWord('Peace')" style="padding: 6px 12px; border: 1px solid ${chakraColor}; background: white; border-radius: 6px; cursor: pointer; font-size: 12px;">Peace</button>
            <button type="button" class="vibe-word" onclick="selectVibeWord('Joy')" style="padding: 6px 12px; border: 1px solid ${chakraColor}; background: white; border-radius: 6px; cursor: pointer; font-size: 12px;">Joy</button>
            <button type="button" class="vibe-word" onclick="selectVibeWord('Gratitude')" style="padding: 6px 12px; border: 1px solid ${chakraColor}; background: white; border-radius: 6px; cursor: pointer; font-size: 12px;">Gratitude</button>
            <button type="button" class="vibe-word" onclick="selectVibeWord('Courage')" style="padding: 6px 12px; border: 1px solid ${chakraColor}; background: white; border-radius: 6px; cursor: pointer; font-size: 12px;">Courage</button>
            <button type="button" class="vibe-word" onclick="selectVibeWord('Compassion')" style="padding: 6px 12px; border: 1px solid ${chakraColor}; background: white; border-radius: 6px; cursor: pointer; font-size: 12px;">Compassion</button>
            <button type="button" class="vibe-word" onclick="selectVibeWord('Trust')" style="padding: 6px 12px; border: 1px solid ${chakraColor}; background: white; border-radius: 6px; cursor: pointer; font-size: 12px;">Trust</button>
            <button type="button" class="vibe-word" onclick="selectVibeWord('Acceptance')" style="padding: 6px 12px; border: 1px solid ${chakraColor}; background: white; border-radius: 6px; cursor: pointer; font-size: 12px;">Acceptance</button>
            <button type="button" class="vibe-word" onclick="selectVibeWord('Abundance')" style="padding: 6px 12px; border: 1px solid ${chakraColor}; background: white; border-radius: 6px; cursor: pointer; font-size: 12px;">Abundance</button>
            <button type="button" class="vibe-word" onclick="selectVibeWord('Clarity')" style="padding: 6px 12px; border: 1px solid ${chakraColor}; background: white; border-radius: 6px; cursor: pointer; font-size: 12px;">Clarity</button>
            <button type="button" class="vibe-word" onclick="selectVibeWord('Freedom')" style="padding: 6px 12px; border: 1px solid ${chakraColor}; background: white; border-radius: 6px; cursor: pointer; font-size: 12px;">Freedom</button>
            <button type="button" class="vibe-word" onclick="selectVibeWord('Wholeness')" style="padding: 6px 12px; border: 1px solid ${chakraColor}; background: white; border-radius: 6px; cursor: pointer; font-size: 12px;">Wholeness</button>
            <button type="button" class="vibe-word" onclick="selectVibeWord('Serenity')" style="padding: 6px 12px; border: 1px solid ${chakraColor}; background: white; border-radius: 6px; cursor: pointer; font-size: 12px;">Serenity</button>
            <button type="button" class="vibe-word" onclick="selectVibeWord('Wisdom')" style="padding: 6px 12px; border: 1px solid ${chakraColor}; background: white; border-radius: 6px; cursor: pointer; font-size: 12px;">Wisdom</button>
            <button type="button" class="vibe-word" onclick="selectVibeWord('Harmony')" style="padding: 6px 12px; border: 1px solid ${chakraColor}; background: white; border-radius: 6px; cursor: pointer; font-size: 12px;">Harmony</button>
            <button type="button" class="vibe-word" onclick="selectVibeWord('Balance')" style="padding: 6px 12px; border: 1px solid ${chakraColor}; background: white; border-radius: 6px; cursor: pointer; font-size: 12px;">Balance</button>
            <button type="button" class="vibe-word" onclick="selectVibeWord('Empowerment')" style="padding: 6px 12px; border: 1px solid ${chakraColor}; background: white; border-radius: 6px; cursor: pointer; font-size: 12px;">Empowerment</button>
            <button type="button" class="vibe-word" onclick="selectVibeWord('Healing')" style="padding: 6px 12px; border: 1px solid ${chakraColor}; background: white; border-radius: 6px; cursor: pointer; font-size: 12px;">Healing</button>
          </div>
          <input type="text" id="high-vibe-word" placeholder="Or enter your own high vibration word..." 
                 style="padding: 12px; width: 100%; border: 1px solid ${chakraColor}; 
                        border-radius: 6px; font-size: 14px;">
        </div>
        <p>Now swipe the magnet 3 times again, saying:</p>
        <div style="background: #EAD3FF20; padding: 15px; border-radius: 8px; font-style: italic; 
                    text-align: center; margin: 15px 0;">
          "I now fill this space with <span id="replacement-word">[your chosen word]</span>. 
          This high vibration flows through my ${emotionData.chakraBodyArea}."
        </div>
        <button onclick="nextHealingStep(4)" style="background: ${chakraColor}; color: white; 
                       padding: 12px 24px; border: none; border-radius: 8px; cursor: pointer; 
                       font-size: 16px; margin-top: 15px;">
          Replacement Complete - Continue
        </button>
      </div>
      
      <!-- Step 4: Chakra Color Healing -->
      <div id="step-4" class="healing-step" style="display: none;">
        <h3 style="color: #8F5AFF;">Step 4: Chakra Color Healing</h3>
        <div style="background: linear-gradient(135deg, ${chakraColor}20, transparent); 
                    padding: 20px; border-radius: 10px; margin: 15px 0;">
          <p><strong>Visualize ${emotionData.soulArtColor} light filling your ${emotionData.chakraBodyArea}</strong></p>
          <p>Close your eyes and see this healing color:</p>
          <div style="width: 100px; height: 100px; background: ${chakraColor}; 
                      border-radius: 50%; margin: 20px auto; box-shadow: 0 0 30px ${chakraColor}50;">
          </div>
          <p style="text-align: center; font-style: italic;">
            Breathe in this ${emotionData.soulArtColor} energy for 2 minutes
          </p>
        </div>
        <button onclick="nextHealingStep(5)" style="background: ${chakraColor}; color: white; 
                       padding: 12px 24px; border: none; border-radius: 8px; cursor: pointer; 
                       font-size: 16px; margin-top: 15px;">
          Color Healing Complete - Continue
        </button>
      </div>
      
      <!-- Step 5: Shadow Work Sealing -->
      <div id="step-5" class="healing-step" style="display: none;">
        <h3 style="color: #8F5AFF;">Step 5: Seal Your Shadow Work</h3>
        <div style="background: #EAD3FF20; padding: 20px; border-radius: 10px;">
          <p><strong>Additional Support:</strong> ${emotionData.additionalSupport}</p>
          <p><strong>Color to wear/work with:</strong> ${emotionData.soulArtColor}</p>
          <p><strong>Sealing affirmation:</strong></p>
          <div style="background: white; padding: 15px; border-radius: 8px; font-style: italic; 
                      text-align: center; margin: 15px 0; border: 2px solid ${chakraColor};">
            "This healing is complete and sealed. I am free from ${emotionData.emotion}. 
            I embrace ${emotionData.soulArtColor} energy in my daily life. 
            My ${emotionData.chakraBodyArea} radiates health and wholeness."
          </div>
        </div>
        <button onclick="completeHealing()" style="background: linear-gradient(135deg, ${chakraColor}, #8F5AFF); 
                       color: white; padding: 15px 30px; border: none; border-radius: 8px; 
                       cursor: pointer; font-size: 18px; margin-top: 20px; font-weight: bold;">
          Complete Healing Journey
        </button>
      </div>
    </div>
  `;
  
  // Scroll to healing process
  healingDiv.scrollIntoView({ behavior: 'smooth' });
}

// Function to progress through healing steps
function nextHealingStep(stepNumber) {
  // Hide current step
  document.querySelectorAll('.healing-step').forEach(step => {
    step.style.display = 'none';
  });
  
  // Update replacement word if in step 3
  if (stepNumber === 4) {
    const highVibeWord = document.getElementById('high-vibe-word').value || 'Love';
    document.getElementById('replacement-word').textContent = highVibeWord;
  }
  
  // Show next step
  document.getElementById(`step-${stepNumber}`).style.display = 'block';
  
  // Scroll to the new step
  document.getElementById(`step-${stepNumber}`).scrollIntoView({ behavior: 'smooth' });
}

// Function to complete healing
function completeHealing() {
  const healingDiv = document.getElementById('healing-process');
  const resultsDiv = document.getElementById('emotion-results');
  
  // Get session information to display
  const sessionInfo = currentEmotionSession ? `
    <p style="color: white; font-size: 14px; margin: 10px 0;">
      Session Progress: ${currentEmotionSession.removalCount || 0} emotions processed
    </p>
  ` : '';
  
  healingDiv.innerHTML = `
    <div style="background: linear-gradient(135deg, #8ED6B7, #EAD3FF); 
                padding: 40px; border-radius: 15px; text-align: center;">
      <h2 style="color: white; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
        Healing Complete!
      </h2>
      <p style="font-size: 18px; color: white; margin: 20px 0;">
        You have successfully released your trapped emotion and filled the space with high vibration energy.
      </p>
      ${sessionInfo}
      <p style="color: white; font-style: italic; margin-bottom: 30px;">
        Remember to work with your chosen colors and continue your shadow work practice.
      </p>
      
      <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
        <button onclick="identifyAnotherEmotion()" style="background: #FF6B9D; color: white; 
                       padding: 15px 25px; border: none; border-radius: 8px; 
                       cursor: pointer; font-size: 16px; font-weight: bold; 
                       box-shadow: 0 4px 15px rgba(255,107,157,0.3);">
          Identify and Release Another Emotion
        </button>
        
        <button onclick="completeSession()" style="background: white; color: #8F5AFF; 
                       padding: 15px 25px; border: none; border-radius: 8px; 
                       cursor: pointer; font-size: 16px; font-weight: bold;
                       box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
          Complete This Session
        </button>
      </div>
      
      <p style="color: white; font-size: 12px; margin-top: 20px; opacity: 0.8;">
        Continue processing emotions in this session, or complete to save your progress.
      </p>
    </div>
  `;
}

// Function to identify another emotion (continue session)
async function identifyAnotherEmotion() {
  try {
    // Return to the emotion selection
    const healingDiv = document.getElementById('healing-process');
    const resultsDiv = document.getElementById('emotion-results');
    
    healingDiv.style.display = 'none';
    resultsDiv.style.display = 'block';
    
    // Show session progress
    const sessionProgress = currentEmotionSession ? `
      <div style="background: #8F5AFF15; padding: 15px; border-radius: 10px; margin-bottom: 20px; text-align: center;">
        <h3 style="color: #8F5AFF; margin: 0 0 10px 0;">Session in Progress</h3>
        <p style="margin: 5px 0; color: #8F5AFF;">Emotions processed: ${currentEmotionSession.removalCount || 0}</p>
        <p style="margin: 5px 0; font-size: 14px; color: #8F5AFF;">Select another emotion to continue your healing session</p>
      </div>
    ` : '';
    
    resultsDiv.innerHTML = `
      ${sessionProgress}
      <div style="text-align: center; color: #8F5AFF; font-style: italic;">
        Click on a trapped emotion above to continue your healing journey
      </div>
    `;
  } catch (error) {
    console.error('Error continuing session:', error);
    alert('Unable to continue session. Please try again.');
  }
}

// Function to show pricing modal with new tiered structure
function showPricingModal() {
  const modal = document.createElement('div');
  modal.id = 'pricing-modal';
  modal.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
    background: rgba(0,0,0,0.7); z-index: 1000; display: flex; 
    align-items: center; justify-content: center; padding: 20px;
  `;
  
  modal.innerHTML = `
    <div style="background: white; border-radius: 20px; padding: 40px; max-width: 900px; width: 100%; max-height: 90vh; overflow-y: auto;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
        <h2 style="color: #8F5AFF; margin: 0;">Choose Your SoulArt Journey</h2>
        <button onclick="closePricingModal()" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #999;">&times;</button>
      </div>
      
      <!-- Free Plan -->
      <div style="border: 2px solid #EAD3FF; border-radius: 15px; padding: 20px; margin-bottom: 20px;">
        <h3 style="color: #8F5AFF; margin: 0 0 10px 0;">✨ Free Explorer</h3>
        <div style="font-size: 24px; font-weight: bold; color: #8F5AFF; margin-bottom: 15px;">£0</div>
        <ul style="margin: 15px 0; padding-left: 20px; color: #666;">
          <li>3 Free Emotion Decoder sessions</li>
          <li>Unlimited Doodle Canvas access</li>
          <li>Basic journaling features</li>
          <li>SoulArt Cards</li>
        </ul>
        <div style="text-align: center;">
          <button onclick="closePricingModal()" style="background: transparent; color: #8F5AFF; padding: 12px 30px; border: 2px solid #8F5AFF; border-radius: 8px; cursor: pointer;">
            Current Plan
          </button>
        </div>
      </div>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
        <!-- My Decoder Monthly -->
        <div style="border: 3px solid #8F5AFF; border-radius: 15px; padding: 25px; position: relative;">
          <div style="background: #8F5AFF; color: white; padding: 5px 15px; border-radius: 20px; position: absolute; top: -12px; left: 20px; font-size: 12px; font-weight: bold;">POPULAR</div>
          <h3 style="color: #8F5AFF; margin: 0 0 10px 0;">✨ My Decoder Monthly</h3>
          <div style="font-size: 32px; font-weight: bold; color: #8F5AFF; margin-bottom: 5px;">£3.99<span style="font-size: 16px; color: #666;">/month</span></div>
          <ul style="margin: 20px 0; padding-left: 20px; color: #666; line-height: 1.8;">
            <li><strong>Unlimited Emotion Decoder</strong></li>
            <li>Unlimited Doodle Canvas</li>
            <li>Advanced journal features</li>
            <li>SoulArt Cards & guidance</li>
            <li>Progress tracking & analytics</li>
          </ul>
          <div style="text-align: center;">
            <button onclick="subscribeToPlan('basic_monthly')" style="background: #8F5AFF; color: white; padding: 15px 30px; border: none; border-radius: 8px; cursor: pointer; width: 100%; font-weight: bold;">
              Choose My Decoder
            </button>
          </div>
        </div>
        
        <!-- Premium Decoder Monthly -->
        <div style="border: 3px solid #FF6B9D; border-radius: 15px; padding: 25px; position: relative; background: linear-gradient(135deg, #FF6B9D05, #8F5AFF05);">
          <div style="background: linear-gradient(135deg, #FF6B9D, #8F5AFF); color: white; padding: 5px 15px; border-radius: 20px; position: absolute; top: -12px; left: 20px; font-size: 12px; font-weight: bold;">⭐ PREMIUM</div>
          <h3 style="color: #FF6B9D; margin: 0 0 10px 0;">⭐ Premium Decoder Monthly</h3>
          <div style="font-size: 32px; font-weight: bold; color: #FF6B9D; margin-bottom: 5px;">£5.99<span style="font-size: 16px; color: #666;">/month</span></div>
          <ul style="margin: 20px 0; padding-left: 20px; color: #666; line-height: 1.8;">
            <li><strong>Everything in My Decoder, plus:</strong></li>
            <li><strong>🔓 Belief Decoder</strong> - Transform beliefs</li>
            <li><strong>🔓 Allergy Identifier</strong> - Heal allergens</li>
            <li>Advanced analytics & insights</li>
            <li>Priority support</li>
          </ul>
          <div style="text-align: center;">
            <button onclick="subscribeToPlan('premium_monthly')" style="background: linear-gradient(135deg, #FF6B9D, #8F5AFF); color: white; padding: 15px 30px; border: none; border-radius: 8px; cursor: pointer; width: 100%; font-weight: bold;">
              Choose Premium Decoder
            </button>
          </div>
        </div>
      </div>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #EAD3FF;">
        <h3 style="color: #8F5AFF; text-align: center; margin-bottom: 20px;">💰 Save 25% with Annual Plans</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
          <!-- Basic Yearly -->
          <div style="border: 2px solid #8F5AFF; border-radius: 15px; padding: 20px;">
            <h4 style="color: #8F5AFF; margin: 0 0 10px 0;">Basic Annual</h4>
            <div style="font-size: 24px; font-weight: bold; color: #8F5AFF;">£36<span style="font-size: 14px; color: #666;">/year</span></div>
            <div style="font-size: 12px; color: #8ED6B7; margin: 5px 0;">Save £12 vs monthly</div>
            <button onclick="subscribeToPlan('basic_yearly')" style="background: #8F5AFF; color: white; padding: 12px 20px; border: none; border-radius: 8px; cursor: pointer; width: 100%; margin-top: 10px;">
              Choose Annual Basic
            </button>
          </div>
          
          <!-- Premium Yearly -->  
          <div style="border: 2px solid #FF6B9D; border-radius: 15px; padding: 20px;">
            <h4 style="color: #FF6B9D; margin: 0 0 10px 0;">⭐ Premium Decoder Annual</h4>
            <div style="font-size: 24px; font-weight: bold; color: #FF6B9D;">£53.91<span style="font-size: 14px; color: #666;">/year</span></div>
            <div style="font-size: 12px; color: #8ED6B7; margin: 5px 0;">Save £17.97 vs monthly</div>
            <button onclick="subscribeToPlan('premium_yearly')" style="background: linear-gradient(135deg, #FF6B9D, #8F5AFF); color: white; padding: 12px 20px; border: none; border-radius: 8px; cursor: pointer; width: 100%; margin-top: 10px;">
              Choose Annual Premium Decoder
            </button>
          </div>
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 30px; padding: 20px; background: #EAD3FF10; border-radius: 10px;">
        <p style="margin: 0; color: #666; font-size: 14px;">
          ✨ All plans include unlimited access to Doodle Canvas, Journal, and SoulArt Cards<br>
          🔒 Cancel anytime • 💳 Secure payment • 🌟 Start your healing journey today
        </p>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Close modal when clicking outside
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closePricingModal();
    }
  });
}

function closePricingModal() {
  const modal = document.getElementById('pricing-modal');
  if (modal) {
    modal.remove();
  }
}

async function subscribeToPlan(planId) {
  try {
    const response = await fetch(`/api/checkout/start?plan=${planId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      const error = await response.json();
      alert(error.message || 'Failed to start checkout');
      return;
    }
    
    const data = await response.json();
    // Redirect to Stripe Checkout
    window.location.href = data.checkoutUrl;
  } catch (error) {
    console.error('Checkout error:', error);
    alert('Unable to start checkout. Please try again.');
  }
}

// Function to complete the current session
async function completeSession() {
  try {
    const result = await completeEmotionSession();
    
    // Show completion summary
    const healingDiv = document.getElementById('healing-process');
    healingDiv.innerHTML = `
      <div style="background: linear-gradient(135deg, #4CAF50, #8ED6B7); 
                  padding: 40px; border-radius: 15px; text-align: center;">
        <h2 style="color: white; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
          Session Complete!
        </h2>
        <p style="font-size: 18px; color: white; margin: 20px 0;">
          ${result.message || 'Your healing session has been completed successfully.'}
        </p>
        <p style="color: white; font-size: 16px;">
          Emotions processed in this session: ${result.totalRemovals || 0}
        </p>
        <p style="color: white; font-style: italic; margin: 20px 0;">
          Your progress has been saved. Thank you for taking this journey of healing and self-discovery.
        </p>
        
        <button onclick="returnToChart()" style="background: white; color: #8F5AFF; 
                       padding: 15px 30px; border: none; border-radius: 8px; 
                       cursor: pointer; font-size: 16px; margin-top: 20px; font-weight: bold;">
          Start New Session
        </button>
      </div>
    `;
  } catch (error) {
    console.error('Error completing session:', error);
    alert('Unable to complete session. Please try again.');
  }
}

// Function to return to chart
function returnToChart() {
  const healingDiv = document.getElementById('healing-process');
  const resultsDiv = document.getElementById('emotion-results');
  
  healingDiv.style.display = 'none';
  resultsDiv.style.display = 'block';
  resultsDiv.innerHTML = `
    <div style="text-align: center; color: #8F5AFF; font-style: italic;">
      Click on a trapped emotion above to begin your healing journey
    </div>
  `;
  
  // Return to emotion decoder page
  navigate('emotion-decoder');
}

// Function to select a high vibration word
function selectVibeWord(word) {
  const input = document.getElementById('high-vibe-word');
  if (input) {
    input.value = word;
    input.style.backgroundColor = '#EAD3FF20';
    input.style.borderColor = '#8F5AFF';
    
    // Highlight selected button
    document.querySelectorAll('.vibe-word').forEach(btn => {
      btn.style.backgroundColor = 'white';
      btn.style.fontWeight = 'normal';
      btn.style.color = '#8F5AFF';
    });
    
    // Find and highlight the clicked button
    const selectedBtn = Array.from(document.querySelectorAll('.vibe-word'))
      .find(btn => btn.textContent === word);
    if (selectedBtn) {
      selectedBtn.style.backgroundColor = '#8F5AFF';
      selectedBtn.style.color = 'white';
      selectedBtn.style.fontWeight = 'bold';
    }
  }
}

// Global session state for Emotion Decoder
let currentEmotionSession = null;

// Function to start or get active emotion session
async function startEmotionSession() {
  try {
    const response = await fetch('/api/sessions/start', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ feature: 'emotion_decoder' })
    });
    
    if (response.status === 401) {
      return { needsAuth: true, canUse: false };
    }
    
    if (response.status === 403) {
      const data = await response.json();
      return {
        needsAuth: false,
        needsSubscription: true,
        canUse: false,
        sessionsUsed: data.sessionsUsed || 0,
        maxSessions: data.maxSessions || 3,
        message: data.message
      };
    }
    
    if (!response.ok) {
      throw new Error('Failed to start session');
    }
    
    const sessionData = await response.json();
    currentEmotionSession = sessionData;
    return {
      needsAuth: false,
      canUse: true,
      sessionId: sessionData.sessionId,
      removalCount: sessionData.removalCount
    };
  } catch (error) {
    console.error('Error starting session:', error);
    throw error;
  }
}

// Function to record emotion removal in current session
async function recordEmotionRemoval(emotion) {
  if (!currentEmotionSession) {
    throw new Error('No active session');
  }
  
  try {
    const response = await fetch(`/api/sessions/${currentEmotionSession.sessionId}/record-removal`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ emotion })
    });
    
    if (!response.ok) {
      throw new Error('Failed to record removal');
    }
    
    const data = await response.json();
    currentEmotionSession.removalCount = data.removalCount;
    return data;
  } catch (error) {
    console.error('Error recording removal:', error);
    throw error;
  }
}

// Function to complete current emotion session
async function completeEmotionSession() {
  if (!currentEmotionSession) {
    return { message: 'No active session to complete' };
  }
  
  try {
    const response = await fetch(`/api/sessions/${currentEmotionSession.sessionId}/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to complete session');
    }
    
    const data = await response.json();
    currentEmotionSession = null; // Clear session
    return data;
  } catch (error) {
    console.error('Error completing session:', error);
    throw error;
  }
}

// Legacy function for backward compatibility - now uses session system
async function checkEmotionDecoderAccess() {
  return await startEmotionSession();
}

// Legacy function for backward compatibility - now uses session system
async function recordEmotionDecoderUsage(emotion) {
  return await recordEmotionRemoval(emotion);
}

// Function to check allergy identifier access and usage
async function checkAllergyIdentifierAccess() {
  try {
    const response = await makeApiCall('/api/allergy-identifier/can-use');
    
    if (response.status === 401) {
      return { needsAuth: true, canUse: false, usageCount: 0, isSubscribed: false };
    }
    
    if (!response.ok) {
      throw new Error('Failed to check access');
    }
    
    const data = await response.json();
    return {
      needsAuth: false,
      needsSubscription: !data.canUse,
      canUse: data.canUse,
      usageCount: data.usageCount,
      isSubscribed: data.isSubscribed
    };
  } catch (error) {
    console.error('Error checking access:', error);
    throw error;
  }
}

// Function to record allergy identifier usage
async function recordAllergyIdentifierUsage(allergen) {
  try {
    const response = await makeApiCall('/api/allergy-identifier/use', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ allergen })
    });
    
    if (response.status === 403) {
      const data = await response.json();
      if (data.needsSubscription) {
        // Redirect to subscription page
        navigate('allergy-identifier');
        return;
      }
    }
    
    if (!response.ok) {
      throw new Error('Failed to record usage');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error recording usage:', error);
    throw error;
  }
}

// Function to check belief decoder access and usage
async function checkBeliefDecoderAccess() {
  try {
    const response = await makeApiCall('/api/belief-decoder/can-use');
    
    if (response.status === 401) {
      return { needsAuth: true, canUse: false, usageCount: 0, isSubscribed: false };
    }
    
    if (!response.ok) {
      throw new Error('Failed to check access');
    }
    
    const data = await response.json();
    return {
      needsAuth: false,
      needsSubscription: !data.canUse,
      canUse: data.canUse,
      usageCount: data.usageCount,
      isSubscribed: data.isSubscribed
    };
  } catch (error) {
    console.error('Error checking access:', error);
    throw error;
  }
}

// Function to record belief decoder usage
async function recordBeliefDecoderUsage(belief) {
  try {
    const response = await makeApiCall('/api/belief-decoder/use', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ belief })
    });
    
    if (response.status === 403) {
      const data = await response.json();
      if (data.needsSubscription) {
        // Redirect to subscription page
        navigate('belief-decoder');
        return;
      }
    }
    
    if (!response.ok) {
      throw new Error('Failed to record usage');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error recording usage:', error);
    throw error;
  }
}

// Legacy subscription function - redirects to new pricing modal
function subscribeToUnlimited() {
  // Redirect to new comprehensive pricing modal
  showPricingModal();
}

// Function to complete the current session
async function completeSession() {
  try {
    const result = await completeEmotionSession();
    
    // Show completion summary
    const main = document.getElementById('main-content');
    main.innerHTML = `
      <div style="text-align: center; padding: 40px;">
        <h2 style="color: #8ED6B7; margin-bottom: 20px;">🎉 Session Complete!</h2>
        <p style="color: #666; margin-bottom: 20px;">
          You've successfully completed this healing session.
        </p>
        <div style="background: #8ED6B720; padding: 20px; border-radius: 15px; margin: 20px 0;">
          <h3 style="color: #8F5AFF;">Session Summary:</h3>
          <p><strong>Emotions Released:</strong> ${result.emotionsRemoved || 0}</p>
          <p><strong>Healing Achieved:</strong> Complete transformation</p>
        </div>
        <div style="margin-top: 30px;">
          <button onclick="navigate('emotion-decoder')" style="background: #8F5AFF; color: white; padding: 15px 30px; border: none; border-radius: 8px; cursor: pointer; margin-right: 10px;">
            Start New Session
          </button>
          <button onclick="navigate('membership')" style="background: transparent; color: #8F5AFF; padding: 15px 30px; border: 2px solid #8F5AFF; border-radius: 8px; cursor: pointer;">
            View Dashboard
          </button>
        </div>
      </div>
    `;
    
  } catch (error) {
    console.error('Error completing session:', error);
    alert('Unable to complete session. Please try again.');
  }
}

// Function to check authentication and load membership dashboard
async function checkAuthAndLoadMembership() {
  const main = document.querySelector('main');
  
  try {
    const response = await makeApiCall('/api/auth/user');
    
    if (response.status === 401) {
      // Not authenticated
      main.innerHTML = `
        <div style="margin-bottom: 20px;">
          <button onclick="goBack()" style="background: transparent; color: #8F5AFF; border: 2px solid #8F5AFF; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 14px;">
            ← Back
          </button>
        </div>
        <h2>Membership Dashboard</h2>
        <div style="text-align: center; padding: 40px; background: linear-gradient(135deg, #EAD3FF20, #8ED6B720); border-radius: 15px; margin: 20px 0;">
          <h3 style="color: #8F5AFF; margin-bottom: 15px;">Sign In Required</h3>
          <p style="margin-bottom: 20px; color: #666;">
            Please sign in to access your membership dashboard and track your healing journey.
          </p>
          <button onclick="window.location.href='/api/login'" style="background: #8F5AFF; color: white; padding: 15px 30px; border: none; border-radius: 8px; cursor: pointer; font-size: 16px;">
            Sign In to Continue
          </button>
        </div>
      `;
      return;
    }
    
    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }
    
    const user = await response.json();
    
    // Fetch usage statistics for all tools
    const usageResponse = await makeApiCall('/api/usage/stats');
    let usageStats = { 
      usage: 0, 
      isSubscribed: false, 
      history: [],
      emotionUsage: 0,
      allergyUsage: 0,
      beliefUsage: 0
    };
    
    if (usageResponse.ok) {
      usageStats = await usageResponse.json();
    }
    
    // Render membership dashboard
    main.innerHTML = `
      <div style="margin-bottom: 20px;">
        <button onclick="goBack()" style="background: transparent; color: #8F5AFF; border: 2px solid #8F5AFF; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 14px;">
          ← Back
        </button>
      </div>
      <h2>Membership Dashboard</h2>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0;">
        <!-- User Profile Card -->
        <div style="background: linear-gradient(135deg, #8ED6B720, #EAD3FF20); padding: 25px; border-radius: 15px;">
          <h3 style="color: #8F5AFF; margin-bottom: 15px;">Welcome, ${user.firstName || 'Seeker'}!</h3>
          <div style="margin-bottom: 10px;">
            <strong>Email:</strong> ${user.email}
          </div>
          <div style="margin-bottom: 10px;">
            <strong>Member Since:</strong> ${new Date(user.createdAt).toLocaleDateString()}
          </div>
          <div style="margin-bottom: 15px;">
            <strong>Status:</strong> 
            <span style="background: #8ED6B7; color: white; padding: 3px 10px; border-radius: 10px; font-size: 12px; font-weight: bold;">
              All Access
            </span>
          </div>
          <button onclick="window.location.href='/api/logout'" style="background: transparent; color: #8F5AFF; padding: 10px 20px; border: 2px solid #8F5AFF; border-radius: 8px; cursor: pointer; font-size: 14px;">
            Sign Out
          </button>
        </div>
        
        <!-- Usage Statistics Card -->
        <div style="background: linear-gradient(135deg, #EAD3FF20, #8ED6B720); padding: 25px; border-radius: 15px;">
          <h3 style="color: #8F5AFF; margin-bottom: 15px;">Your Healing Journey</h3>
          <div style="margin-bottom: 10px;">
            <strong>Total Sessions:</strong> ${usageStats.usage}
          </div>
          <div style="margin-bottom: 10px;">
            <strong>Emotion Sessions:</strong> ${usageStats.emotionUsage || 0}
          </div>
          <div style="margin-bottom: 10px;">
            <strong>Allergy Sessions:</strong> ${usageStats.allergyUsage || 0}
          </div>
          <div style="margin-bottom: 10px;">
            <strong>Belief Sessions:</strong> ${usageStats.beliefUsage || 0}
          </div>
          <div style="margin-bottom: 10px;">
            <strong>This Month:</strong> ${usageStats.history ? usageStats.history.length : 0}
          </div>
          ${usageStats.subscriptionTier === 'premium' ? 
            '<div style="color: #8ED6B7; font-weight: bold;">⭐ Premium Access Active</div>' :
            usageStats.subscriptionTier === 'basic' ? 
            '<div style="color: #8F5AFF; font-weight: bold;">✨ Basic Access Active</div>' :
            `<div style="margin-bottom: 15px;">
              <strong>Free Emotion Sessions:</strong> ${Math.max(0, 3 - (usageStats.emotionDecoderSessions || 0))}/3 remaining
            </div>`
          }
          ${!usageStats.isSubscribed ? 
            `<div style="margin-top: 15px;">
              <button onclick="showPricingModal()" style="background: #8F5AFF; color: white; padding: 12px 20px; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; width: 100%; margin-bottom: 10px;">
                View Pricing Plans
              </button>
            </div>` : 
            `<button onclick="manageBilling()" style="background: transparent; color: #8F5AFF; padding: 10px 20px; border: 2px solid #8F5AFF; border-radius: 8px; cursor: pointer; font-size: 14px; margin-top: 10px;">
              Manage Billing
            </button>`
          }
        </div>
      </div>
      
      <!-- Quick Actions -->
      <div style="background: white; padding: 25px; border-radius: 15px; border: 2px solid #8F5AFF20; margin: 20px 0;">
        <h3 style="color: #8F5AFF; margin-bottom: 20px;">Healing Tools Dashboard</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
          <button onclick="navigate('emotion-decoder')" style="background: linear-gradient(135deg, #8F5AFF, #B785FF); color: white; padding: 15px 20px; border: none; border-radius: 10px; cursor: pointer; text-align: left;">
            <div style="font-weight: bold; margin-bottom: 5px;">Emotion Decoder</div>
            <div style="font-size: 12px; opacity: 0.9;">Release trapped emotions</div>
            <div style="font-size: 11px; opacity: 0.8; margin-top: 5px;">${usageStats.emotionUsage || 0} sessions completed</div>
          </button>
          <button onclick="navigate('allergy-identifier')" style="background: linear-gradient(135deg, #8ED6B7, #B0E5D1); color: white; padding: 15px 20px; border: none; border-radius: 10px; cursor: pointer; text-align: left; position: relative;">
            <div style="font-weight: bold; margin-bottom: 5px;">Allergy Identifier</div>
            <div style="font-size: 12px; opacity: 0.9;">Identify & heal allergens</div>
          </button>
          <button onclick="navigate('belief-decoder')" style="background: linear-gradient(135deg, #FF914D, #FFAD70); color: white; padding: 15px 20px; border: none; border-radius: 10px; cursor: pointer; text-align: left; position: relative;">
            <div style="font-weight: bold; margin-bottom: 5px;">Belief Decoder</div>
            <div style="font-size: 12px; opacity: 0.9;">Transform limiting beliefs</div>
          </button>
          <button onclick="navigate('journal')" style="background: linear-gradient(135deg, #85C9F2, #B3D9FF); color: white; padding: 15px 20px; border: none; border-radius: 10px; cursor: pointer; text-align: left;">
            <div style="font-weight: bold; margin-bottom: 5px;">Journal</div>
            <div style="font-size: 12px; opacity: 0.9;">Track your progress</div>
            <div style="font-size: 11px; opacity: 0.8; margin-top: 5px;">Sacred reflections</div>
          </button>
          <button onclick="navigate('card')" style="background: linear-gradient(135deg, #EAD3FF, #F0E5FF); color: #8F5AFF; padding: 15px 20px; border: none; border-radius: 10px; cursor: pointer; text-align: left;">
            <div style="font-weight: bold; margin-bottom: 5px;">Soul Card</div>
            <div style="font-size: 12px; opacity: 0.9;">Discover your essence</div>
            <div style="font-size: 11px; opacity: 0.8; margin-top: 5px;">Daily guidance</div>
          </button>
        </div>
      </div>
      
      ${usageStats.history && usageStats.history.length > 0 ? `
      <!-- Recent Activity -->
      <div style="background: white; padding: 25px; border-radius: 15px; border: 2px solid #8F5AFF20; margin: 20px 0;">
        <h3 style="color: #8F5AFF; margin-bottom: 20px;">Recent Healing Sessions</h3>
        <div style="max-height: 300px; overflow-y: auto;">
          ${usageStats.history.slice(0, 10).map(session => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #f0f0f0;">
              <div>
                <strong>${session.emotionProcessed || 'Emotion Release'}</strong>
                <div style="font-size: 12px; color: #666;">${session.action.replace('_', ' ').toUpperCase()}</div>
              </div>
              <div style="font-size: 12px; color: #8F5AFF;">
                ${new Date(session.timestamp).toLocaleDateString()}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      ` : ''}
    `;
    
  } catch (error) {
    console.error('Error loading membership dashboard:', error);
    main.innerHTML = `
      <div style="margin-bottom: 20px;">
        <button onclick="goBack()" style="background: transparent; color: #8F5AFF; border: 2px solid #8F5AFF; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 14px;">
          ← Back
        </button>
      </div>
      <h2>Membership Dashboard</h2>
      <div style="text-align: center; padding: 40px; background: #FFE6E6; border-radius: 15px; margin: 20px 0;">
        <h3 style="color: #FF6B6B; margin-bottom: 15px;">Sign In Required</h3>
        <p style="margin-bottom: 20px; color: #666;">
          Please sign in to access your membership dashboard and healing tools.
        </p>
        <button onclick="window.location.href='/api/login'" style="background: #8F5AFF; color: white; padding: 15px 30px; border: none; border-radius: 8px; cursor: pointer; font-size: 16px;">
          Sign In to Continue
        </button>
        <button onclick="navigate('home')" style="background: #8F5AFF; color: white; padding: 15px 30px; border: none; border-radius: 8px; cursor: pointer; font-size: 16px;">
          Return Home
        </button>
      </div>
    `;
  }
}

// Function to manage billing (placeholder for now)
function manageBilling() {
  alert('Billing management feature coming soon! For now, contact support for billing changes.');
}

// =============================
// JOURNAL FUNCTIONALITY
// =============================

let currentEditingEntry = null;
let journalEntries = [];

// Load all journal entries for the user
async function loadJournalEntries() {
  try {
    const response = await makeApiCall('/api/journal/entries');
    const data = await response.json();
    
    if (response.ok) {
      journalEntries = data.entries;
      renderJournalEntries();
      updateEntryCount(data.totalCount);
    } else {
      throw new Error(data.message || 'Failed to load journal entries');
    }
  } catch (error) {
    console.error('Error loading journal entries:', error);
    const entriesList = document.getElementById('journal-entries-list');
    entriesList.innerHTML = `
      <div class="error-message">
        <p>Please sign in to access your journal entries</p>
        <button onclick="window.location.href='/api/login'" class="btn-primary">Sign In</button>
      </div>
    `;
  }
}

// Render journal entries in the UI
function renderJournalEntries() {
  const entriesList = document.getElementById('journal-entries-list');
  
  if (journalEntries.length === 0) {
    entriesList.innerHTML = `
      <div class="empty-journal">
        <div class="empty-journal-icon">Journal</div>
        <h3>Your journal awaits your first reflection</h3>
        <p>Click "New Entry" above to begin your sacred writing journey.</p>
      </div>
    `;
    return;
  }

  entriesList.innerHTML = journalEntries.map(entry => `
    <div class="journal-entry" data-entry-id="${entry.id}">
      <div class="journal-entry-header">
        <h4 class="journal-entry-title">
          ${entry.title || 'Untitled Entry'}
          ${entry.mood ? `<span class="mood-indicator">${getMoodEmoji(entry.mood)}</span>` : ''}
        </h4>
        <div class="journal-entry-meta">
          <span class="journal-entry-date">${formatDate(entry.createdAt)}</span>
          <div class="journal-entry-actions">
            <button onclick="editJournalEntry('${entry.id}')" class="btn-edit" title="Edit">Edit</button>
            <button onclick="deleteJournalEntry('${entry.id}')" class="btn-delete" title="Delete">Delete</button>
          </div>
        </div>
      </div>
      <div class="journal-entry-content">
        ${entry.content.substring(0, 200)}${entry.content.length > 200 ? '...' : ''}
      </div>
      ${entry.tags ? `<div class="journal-entry-tags">${formatTags(entry.tags)}</div>` : ''}
      <button onclick="viewFullEntry('${entry.id}')" class="btn-view-full">Read Full Entry</button>
    </div>
  `).join('');
}

// Show the journal entry form
function showJournalEntryForm() {
  const form = document.getElementById('journal-entry-form');
  form.style.display = 'block';
  form.scrollIntoView({ behavior: 'smooth' });
  document.getElementById('entry-content').focus();
}

// Cancel journal entry creation/editing
function cancelJournalEntry() {
  const form = document.getElementById('journal-entry-form');
  form.style.display = 'none';
  clearJournalForm();
  currentEditingEntry = null;
}

// Clear journal form fields
function clearJournalForm() {
  document.getElementById('entry-title').value = '';
  document.getElementById('entry-content').value = '';
  document.getElementById('entry-mood').value = '';
  document.getElementById('entry-tags').value = '';
}

// Save journal entry (create or update)
async function saveJournalEntry() {
  const title = document.getElementById('entry-title').value.trim();
  const content = document.getElementById('entry-content').value.trim();
  const mood = document.getElementById('entry-mood').value;
  const tags = document.getElementById('entry-tags').value.trim();

  if (!content) {
    alert('Please write something in your journal entry before saving.');
    return;
  }

  try {
    const method = currentEditingEntry ? 'PUT' : 'POST';
    const url = currentEditingEntry 
      ? `/api/journal/entries/${currentEditingEntry}` 
      : '/api/journal/entries';

    const response = await makeApiCall(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, content, mood, tags }),
    });

    const data = await response.json();
    
    if (response.ok) {
      // Refresh entries list
      await loadJournalEntries();
      cancelJournalEntry();
      showSuccessMessage(currentEditingEntry ? 'Entry updated successfully!' : 'Entry saved successfully!');
    } else {
      throw new Error(data.message || 'Failed to save entry');
    }
  } catch (error) {
    console.error('Error saving journal entry:', error);
    alert('Failed to save journal entry. Please try again.');
  }
}

// Edit existing journal entry
async function editJournalEntry(entryId) {
  try {
    const response = await makeApiCall(`/api/journal/entries/${entryId}`);
    const entry = await response.json();
    
    if (response.ok) {
      currentEditingEntry = entryId;
      document.getElementById('entry-title').value = entry.title || '';
      document.getElementById('entry-content').value = entry.content;
      document.getElementById('entry-mood').value = entry.mood || '';
      document.getElementById('entry-tags').value = entry.tags || '';
      showJournalEntryForm();
      document.getElementById('journal-entry-form').querySelector('h3').textContent = 'Edit Entry';
    }
  } catch (error) {
    console.error('Error loading entry for editing:', error);
    alert('Failed to load entry for editing.');
  }
}

// Delete journal entry
async function deleteJournalEntry(entryId) {
  if (!confirm('Are you sure you want to delete this journal entry? This cannot be undone.')) {
    return;
  }

  try {
    const response = await makeApiCall(`/api/journal/entries/${entryId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      await loadJournalEntries();
      showSuccessMessage('Entry deleted successfully!');
    } else {
      throw new Error('Failed to delete entry');
    }
  } catch (error) {
    console.error('Error deleting journal entry:', error);
    alert('Failed to delete journal entry. Please try again.');
  }
}

// View full entry in a modal-like view
function viewFullEntry(entryId) {
  const entry = journalEntries.find(e => e.id === entryId);
  if (!entry) return;

  const overlay = document.createElement('div');
  overlay.className = 'journal-modal-overlay';
  overlay.innerHTML = `
    <div class="journal-modal">
      <div class="journal-modal-header">
        <h3>${entry.title || 'Untitled Entry'}</h3>
        <button onclick="closeJournalModal()" class="btn-close">Close</button>
      </div>
      <div class="journal-modal-meta">
        <span class="journal-modal-date">${formatDate(entry.createdAt)}</span>
        ${entry.mood ? `<span class="journal-modal-mood">${getMoodEmoji(entry.mood)} ${entry.mood}</span>` : ''}
      </div>
      <div class="journal-modal-content">
        ${entry.content.replace(/\n/g, '<br>')}
      </div>
      ${entry.tags ? `<div class="journal-modal-tags">${formatTags(entry.tags)}</div>` : ''}
      <div class="journal-modal-actions">
        <button onclick="editJournalEntry('${entry.id}'); closeJournalModal();" class="btn-primary">Edit</button>
        <button onclick="deleteJournalEntry('${entry.id}'); closeJournalModal();" class="btn-delete">Delete</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeJournalModal();
  });
}

// Close journal modal
function closeJournalModal() {
  const modal = document.querySelector('.journal-modal-overlay');
  if (modal) {
    modal.remove();
  }
}

// Download all journal entries
async function downloadJournalEntries() {
  try {
    const response = await makeApiCall('/api/journal/download');
    const data = await response.json();
    
    if (response.ok) {
      // Create downloadable content
      const content = `SoulArt Temple - Sacred Reflections Journal
Export Date: ${new Date(data.exportDate).toLocaleString()}
Total Entries: ${data.totalEntries}

${'='.repeat(60)}

${data.entries.map(entry => `
ENTRY: ${entry.title}
Date: ${new Date(entry.createdAt).toLocaleString()}
Mood: ${entry.mood}
Tags: ${entry.tags}

${entry.content}

${'─'.repeat(40)}
`).join('\n')}

End of Journal Export
Generated by SoulArt Temple
`;

      // Create and download file
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `soulart-journal-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      showSuccessMessage('Journal downloaded successfully!');
    } else {
      throw new Error(data.message || 'Failed to download journal');
    }
  } catch (error) {
    console.error('Error downloading journal:', error);
    alert('Failed to download journal. Please try again.');
  }
}

// Helper functions
function updateEntryCount(count) {
  const entryCountElement = document.querySelector('.entry-count');
  if (entryCountElement) {
    entryCountElement.textContent = `${count} entr${count === 1 ? 'y' : 'ies'} (${200 - count} remaining)`;
  }
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function getMoodEmoji(mood) {
  return '';
}

function formatTags(tagsString) {
  if (!tagsString) return '';
  return tagsString.split(',').map(tag => 
    `<span class="journal-tag">${tag.trim()}</span>`
  ).join('');
}

function showSuccessMessage(message) {
  const messageDiv = document.createElement('div');
  messageDiv.className = 'success-message';
  messageDiv.textContent = message;
  messageDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #8ED6B7;
    color: white;
    padding: 15px 25px;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 1000;
    font-weight: bold;
  `;
  
  document.body.appendChild(messageDiv);
  
  setTimeout(() => {
    messageDiv.remove();
  }, 3000);
}
// ========================================
// RELEASE TRAPPED EMOTION MODULE
// ========================================
function showRelease(emotion) {
  const releaseBox = document.getElementById('release-box');

  const healingMap = {
    "Fear": {
      intention: "I release all fear from my cellular memory and choose to trust fully.",
      replacement: "Trust"
    },
    "Grief": {
      intention: "I release the weight of grief and open my heart to divine peace.",
      replacement: "Peace"
    },
    "Anger": {
      intention: "I release all anger and choose to respond with loving awareness.",
      replacement: "Compassion"
    },
    "Shame": {
      intention: "I release shame and reclaim my worthiness and light.",
      replacement: "Acceptance"
    },
    "Guilt": {
      intention: "I release guilt and allow grace to restore my innocence.",
      replacement: "Forgiveness"
    }
  };

  const { intention, replacement } = healingMap[emotion];

  releaseBox.innerHTML = `
    <div class="release-instructions">
      <h3>🌀 Emotion Selected: ${emotion}</h3>
      <p><strong>Release Intention:</strong><br> ${intention}</p>
      <p><strong>Technique:</strong><br> Use a magnet or hand to swipe down your governing meridian (head to neck, 3x) while holding the intention in your heart.</p>
      <p><strong>Replace With:</strong><br> <span class="high-vibe-word">${replacement}</span></p>
    </div>
  `;
}

// ========================================
// SOULART CARDS - 44 CARD SPIRITUAL DECK
// ========================================

const soulArtCards = [
  {
    id: 1,
    title: "Crown Radiance",
    message: "Your divine connection shines brilliantly, illuminating your highest wisdom and spiritual purpose.",
    guidance: "Connect with your crown chakra through meditation. Your spiritual gifts are ready to be shared with the world.",
    affirmation: "I radiate divine light and wisdom through my crown chakra.",
    element: "Spirit",
    color: "linear-gradient(135deg, #8A2BE2, #FFFFFF, #FFD700)"
  },
  {
    id: 2,
    title: "Vision Stream",
    message: "Your inner vision flows with crystal clarity, revealing profound truths and spiritual insights.",
    guidance: "Trust your third eye chakra and the visions that come to you in meditation and dreams.",
    affirmation: "I see clearly through my spiritual vision and trust my inner knowing.",
    element: "Spirit",
    color: "linear-gradient(135deg, #191970, #00FFFF)"
  },
  {
    id: 3,
    title: "Truth Ripple",
    message: "Your authentic truth ripples outward, creating waves of positive change in the world.",
    guidance: "Speak your truth with clarity and compassion. Your voice has the power to heal.",
    affirmation: "I speak my truth with love and watch it ripple out to heal the world.",
    element: "Air",
    color: "linear-gradient(135deg, #87CEEB, #008080)"
  },
  {
    id: 4,
    title: "Heart Resonance",
    message: "Your heart vibrates with unconditional love, resonating with the hearts of all beings.",
    guidance: "Lead with your heart in all decisions. Love is always the answer.",
    affirmation: "My heart resonates with pure love and compassion for all life.",
    element: "Love",
    color: "linear-gradient(135deg, #50C878, #F8BBD9)"
  },
  {
    id: 5,
    title: "Miracle Bloom",
    message: "Miracles are blooming all around you as you align with your highest potential.",
    guidance: "Stay open to unexpected blessings and magical synchronicities unfolding in your life.",
    affirmation: "I am a magnet for miracles and watch them bloom in every area of my life.",
    element: "Earth",
    color: "linear-gradient(135deg, #FFD700, #32CD32)"
  },
  {
    id: 6,
    title: "Solar Glow",
    message: "Your inner sun radiates warmth, confidence, and personal power throughout your being.",
    guidance: "Connect with your solar plexus chakra and embrace your authentic power with grace.",
    affirmation: "I glow with inner confidence and radiate warmth to all I encounter.",
    element: "Fire",
    color: "linear-gradient(135deg, #FFBF00, #FFB347)"
  },
  {
    id: 7,
    title: "Root Resonance",
    message: "You are deeply grounded and connected to the earth's stabilizing energy and wisdom.",
    guidance: "Ground yourself in nature. Your foundation is strong and your roots run deep.",
    affirmation: "I am grounded, stable, and deeply connected to Mother Earth's wisdom.",
    element: "Earth",
    color: "linear-gradient(135deg, #DC143C, #8B4513)"
  },
  {
    id: 8,
    title: "Aura Cleanse",
    message: "Your energy field is being purified and aligned with your highest vibration.",
    guidance: "Visualize bright light cleansing your aura. Release any energy that isn't yours.",
    affirmation: "My aura is cleansed, protected, and vibrating at its highest frequency.",
    element: "Spirit",
    color: "linear-gradient(135deg, #00FFFF, #E6E6FA)"
  },
  {
    id: 9,
    title: "Soothing Base",
    message: "You are creating a calm, nurturing foundation for yourself and others around you.",
    guidance: "Be the peaceful presence that others can lean on. Your stability supports healing.",
    affirmation: "I am a soothing presence, creating peace and stability wherever I go.",
    element: "Earth",
    color: "linear-gradient(135deg, #90EE90, #F0F8FF)"
  },
  {
    id: 10,
    title: "Nature Pulse",
    message: "You are synchronized with nature's rhythms and the pulse of universal life force.",
    guidance: "Spend time in nature to align with the earth's natural cycles and healing energy.",
    affirmation: "I pulse with the rhythm of nature and feel deeply connected to all life.",
    element: "Earth",
    color: "linear-gradient(135deg, #40E0D0, #32CD32)"
  },
  {
    id: 11,
    title: "Aurora Promise",
    message: "Like the aurora borealis, you bring otherworldly beauty and magic to this realm.",
    guidance: "Trust in the promises the universe has made to you. Your dreams are manifestation.",
    affirmation: "I trust the divine promises unfolding in my life like the beautiful aurora.",
    element: "Spirit",
    color: "linear-gradient(135deg, #FFCCCB, #FFD700)"
  },
  {
    id: 12,
    title: "Serenity Springs",
    message: "Deep wells of peace and tranquility spring forth from your centered heart.",
    guidance: "Find your inner oasis of calm. From this peaceful center, all healing flows.",
    affirmation: "I am a spring of serenity, bringing peace to myself and all I meet.",
    element: "Water",
    color: "linear-gradient(135deg, #B0E0E6, #98FB98)"
  },
  {
    id: 13,
    title: "Joyburst",
    message: "Explosive joy and vibrant energy burst forth from your radiant being.",
    guidance: "Let your joy be contagious. Your happiness lifts the vibration of everyone around you.",
    affirmation: "I burst with joy and share my radiant happiness with the world.",
    element: "Fire",
    color: "linear-gradient(135deg, #FFFF00, #FF00FF)"
  },
  {
    id: 14,
    title: "Clarity Flare",
    message: "Crystal clear insight flares up, illuminating the truth of any situation.",
    guidance: "Trust your first instinct. Your inner clarity cuts through confusion like a laser.",
    affirmation: "I see with crystal clarity and trust my inner wisdom completely.",
    element: "Air",
    color: "linear-gradient(135deg, #00FFFF, #C0C0C0)"
  },
  {
    id: 15,
    title: "Compassion Wave",
    message: "Waves of divine compassion flow through you, healing yourself and others.",
    guidance: "Lead with compassion in all situations. Your loving presence is a healing balm.",
    affirmation: "I am a wave of compassion, bringing healing love wherever I flow.",
    element: "Water",
    color: "linear-gradient(135deg, #DDA0DD, #F5DEB3)"
  },
  {
    id: 16,
    title: "Empower Core",
    message: "Your personal power radiates from your core, empowering yourself and inspiring others.",
    guidance: "Connect with your solar plexus and embrace your authentic power without apology.",
    affirmation: "I am empowered from my core and use my power to uplift and inspire.",
    element: "Fire",
    color: "linear-gradient(135deg, #FFA500, #FFBF00)"
  },
  {
    id: 17,
    title: "Inner Sanctum",
    message: "You have access to a sacred inner sanctuary where peace and wisdom reside.",
    guidance: "Retreat into your inner sanctum when you need guidance, peace, or spiritual connection.",
    affirmation: "I have a sacred inner sanctuary where I find peace, wisdom, and divine connection.",
    element: "Spirit",
    color: "linear-gradient(135deg, #191970, #228B22)"
  },
  {
    id: 18,
    title: "Gratitude Glow",
    message: "Your heart glows with gratitude, magnetizing more blessings into your life.",
    guidance: "Practice daily gratitude and watch your world transform with abundant blessings.",
    affirmation: "I glow with gratitude and attract endless blessings into my life.",
    element: "Love",
    color: "linear-gradient(135deg, #DAA520, #CD853F)"
  },
  {
    id: 19,
    title: "Flowstate",
    message: "You are in perfect flow with the universe, effortlessly manifesting your desires.",
    guidance: "Trust the flow of life and allow yourself to move with natural ease and grace.",
    affirmation: "I am in perfect flow with life and manifest with effortless ease.",
    element: "Water",
    color: "linear-gradient(135deg, #40E0D0, #32CD32)"
  },
  {
    id: 20,
    title: "Unity Halo",
    message: "A halo of unity consciousness surrounds you, connecting you with all of creation.",
    guidance: "See the divine spark in everyone you meet. We are all connected as one.",
    affirmation: "I radiate unity consciousness and see the divine in all beings.",
    element: "Spirit",
    color: "linear-gradient(135deg, #FFFFFF, #FF69B4, #40E0D0)"
  },
  {
    id: 21,
    title: "Starlit Sanctuary",
    message: "You create sacred spaces filled with celestial light and divine protection.",
    guidance: "Build sanctuaries of peace and light wherever you go. You are a keeper of sacred space.",
    affirmation: "I am a starlit sanctuary, creating sacred space filled with divine light.",
    element: "Spirit",
    color: "linear-gradient(135deg, #191970, #C0C0C0)"
  },
  {
    id: 22,
    title: "Emergent Phoenix",
    message: "You are emerging from transformation like a phoenix, reborn with greater wisdom and power.",
    guidance: "Trust your rebirth process. You are rising stronger and more magnificent than before.",
    affirmation: "I rise like a phoenix, transformed and empowered by my journey.",
    element: "Fire",
    color: "linear-gradient(135deg, #DC143C, #FFD700, #FF4500)"
  },
  {
    id: 23,
    title: "Echo of Grace",
    message: "Your presence carries an echo of divine grace that touches everyone you meet.",
    guidance: "Move through the world with gentle grace. Your loving presence is a gift.",
    affirmation: "I carry divine grace within me and share it gently with the world.",
    element: "Love",
    color: "linear-gradient(135deg, #FFE4E1, #FFF8DC)"
  },
  {
    id: 24,
    title: "Quantum Leap",
    message: "You are ready to make a quantum leap in consciousness and reality creation.",
    guidance: "Trust your ability to shift dimensions and create miraculous changes in your life.",
    affirmation: "I make quantum leaps in consciousness and create my reality with ease.",
    element: "Spirit",
    color: "linear-gradient(135deg, #00FFFF, #FF00FF)"
  },
  {
    id: 25,
    title: "Golden Equinox",
    message: "You are finding perfect balance between light and shadow, bringing harmony to all aspects of life.",
    guidance: "Embrace both your light and shadow with equal love. Balance creates wholeness.",
    affirmation: "I am in perfect balance, harmonizing all aspects of my being.",
    element: "Earth",
    color: "linear-gradient(135deg, #FFD700, #A0522D)"
  },
  {
    id: 26,
    title: "Soul Tide",
    message: "The tide of your soul's calling is rising, bringing clarity about your life's purpose.",
    guidance: "Trust the ebb and flow of your soul's journey. Let it guide you to your highest calling.",
    affirmation: "I flow with my soul's tide and trust its guidance toward my purpose.",
    element: "Water",
    color: "linear-gradient(135deg, #40E0D0, #FF7F50)"
  },
  {
    id: 27,
    title: "Crystal Beacon",
    message: "You are a crystal clear beacon of light, guiding others home to their truth.",
    guidance: "Let your clarity and authenticity be a beacon for those seeking their way.",
    affirmation: "I am a crystal beacon of truth, guiding others with my authentic light.",
    element: "Spirit",
    color: "linear-gradient(135deg, #87CEEB, #FFFFFF)"
  },
  {
    id: 28,
    title: "Ancestral Root",
    message: "You are connected to your ancestral wisdom and are healing generations through your growth.",
    guidance: "Honor your lineage while healing old patterns. You are the bridge between past and future.",
    affirmation: "I honor my ancestors while healing generational patterns with love.",
    element: "Earth",
    color: "linear-gradient(135deg, #8B4513, #228B22)"
  },
  {
    id: 29,
    title: "Luminous Kindling",
    message: "You kindle the luminous fire of inspiration and passion in yourself and others.",
    guidance: "Share your inner fire to light the way for others. Your inspiration is contagious.",
    affirmation: "I kindle luminous inspiration and share my inner fire with the world.",
    element: "Fire",
    color: "linear-gradient(135deg, #FFBF00, #FF69B4)"
  },
  {
    id: 30,
    title: "Elysian Currents",
    message: "Divine currents of bliss and perfect harmony flow through your being.",
    guidance: "Surrender to the flow of divine grace. Let it carry you to your highest good.",
    affirmation: "I flow with elysian currents of divine bliss and perfect harmony.",
    element: "Water",
    color: "linear-gradient(135deg, #B0E0E6, #DDA0DD)"
  },
  {
    id: 31,
    title: "Prismatic Dawn",
    message: "A new dawn is breaking, revealing the full spectrum of your magnificent potential.",
    guidance: "Embrace all colors of your being. Your diversity is your strength and beauty.",
    affirmation: "I embrace my full spectrum and shine with prismatic beauty.",
    element: "Spirit",
    color: "linear-gradient(135deg, #FFB6C1, #87CEEB, #FFD700)"
  },
  {
    id: 32,
    title: "Silent Horizon",
    message: "In the vast silence of the horizon, profound wisdom and peace await your discovery.",
    guidance: "Find peace in silence and stillness. Your answers emerge in the quiet spaces.",
    affirmation: "I find profound wisdom in the silent horizon of my inner peace.",
    element: "Air",
    color: "linear-gradient(135deg, #F5DEB3, #DDA0DD)"
  },
  {
    id: 33,
    title: "Celestial Ascend",
    message: "You are ascending to higher levels of consciousness and spiritual awareness.",
    guidance: "Trust your spiritual evolution. You are rising to meet your highest self.",
    affirmation: "I ascend to higher consciousness with grace and divine support.",
    element: "Spirit",
    color: "linear-gradient(135deg, #6A0DAD, #00BFFF, #C0C0C0)"
  },
  {
    id: 34,
    title: "Infinite Heart",
    message: "Your heart contains infinite love, capable of healing yourself and the entire world.",
    guidance: "Lead with love in all situations. Your heart knows the way to healing and peace.",
    affirmation: "My heart contains infinite love that heals and transforms everything.",
    element: "Love",
    color: "linear-gradient(135deg, #50C878, #FFFFFF, #FFD700)"
  },
  {
    id: 35,
    title: "Sacred Flame",
    message: "A sacred flame burns within you, igniting passion, purpose, and divine inspiration.",
    guidance: "Tend your inner sacred flame. Let it guide you toward your highest purpose.",
    affirmation: "I carry a sacred flame that ignites my passion and divine purpose.",
    element: "Fire",
    color: "linear-gradient(135deg, #FFD700, #FF4500)"
  },
  {
    id: 36,
    title: "Divine Cascade",
    message: "Divine blessings cascade into your life like a beautiful waterfall of grace.",
    guidance: "Open to receive the abundant blessings flowing toward you from the universe.",
    affirmation: "I receive the divine cascade of blessings flowing into my life.",
    element: "Water",
    color: "linear-gradient(135deg, #87CEEB, #FFFFFF)"
  },
  {
    id: 37,
    title: "Radiant Essence",
    message: "Your radiant essence illuminates everything and everyone around you with pure love.",
    guidance: "Let your true essence shine freely. Your authentic radiance is a gift to the world.",
    affirmation: "I radiate my pure essence and illuminate the world with love.",
    element: "Spirit",
    color: "linear-gradient(135deg, #FFD700, #FF69B4)"
  },
  {
    id: 38,
    title: "Mystic Portal",
    message: "You are a living portal between dimensions, bridging earth and heaven.",
    guidance: "Trust your ability to access higher realms of consciousness and wisdom.",
    affirmation: "I am a mystic portal, bridging earth and heaven with divine grace.",
    element: "Spirit",
    color: "linear-gradient(135deg, #9370DB, #00CED1)"
  },
  {
    id: 39,
    title: "Eternal Spring",
    message: "Within you flows an eternal spring of renewal, hope, and fresh beginnings.",
    guidance: "No matter what has passed, you always have the power to begin again.",
    affirmation: "I carry eternal spring within me, forever renewed and hopeful.",
    element: "Water",
    color: "linear-gradient(135deg, #98FB98, #87CEEB)"
  },
  {
    id: 40,
    title: "Cosmic Weave",
    message: "You are beautifully woven into the cosmic tapestry, perfectly placed for your purpose.",
    guidance: "Trust your place in the grand design. Every thread of your life has meaning.",
    affirmation: "I am perfectly woven into the cosmic tapestry of life and purpose.",
    element: "Spirit",
    color: "linear-gradient(135deg, #191970, #FFD700, #FF69B4)"
  },
  {
    id: 41,
    title: "Luminous Path",
    message: "Your luminous path is clearly illuminated, guiding you toward your highest destiny.",
    guidance: "Trust the path that lights up for you. Your soul knows the way forward.",
    affirmation: "I follow my luminous path with confidence and divine guidance.",
    element: "Spirit",
    color: "linear-gradient(135deg, #FFD700, #FFFFFF)"
  },
  {
    id: 42,
    title: "Harmony Sphere",
    message: "You emanate perfect harmony, creating spheres of peace and balance wherever you go.",
    guidance: "Be the harmonizing presence in any situation. Your balance brings healing.",
    affirmation: "I emanate harmony and create spheres of peace and balance around me.",
    element: "Spirit",
    color: "linear-gradient(135deg, #DDA0DD, #98FB98)"
  },
  {
    id: 43,
    title: "Soul Symphony",
    message: "Your soul plays a unique note in the grand symphony of universal consciousness.",
    guidance: "Honor your unique contribution to the world. Your note is essential to the whole.",
    affirmation: "I play my unique soul note in the grand symphony of universal love.",
    element: "Spirit",
    color: "linear-gradient(135deg, #9370DB, #FFD700, #FF69B4)"
  },
  {
    id: 44,
    title: "Infinite Potential",
    message: "You contain infinite potential waiting to unfold into magnificent reality.",
    guidance: "Trust in your unlimited potential. Everything you need is already within you.",
    affirmation: "I embody infinite potential and manifest my dreams into beautiful reality.",
    element: "Spirit",
    color: "linear-gradient(135deg, #FFFACD, #FFD700, #FF69B4)"
  }
];

// Current selected card(s) for display
let selectedCards = [];
let cardSpreadActive = false;

// ========================================
// SOULART CARDS FUNCTIONS
// ========================================

function hideAllSections() {
  // Hide any existing sections that might be displayed
  const sections = ['emotion-decoder-container', 'allergy-identifier-container', 'belief-decoder-container', 'soulart-cards'];
  sections.forEach(sectionId => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.style.display = 'none';
    }
  });
}

function showSoulArtCards() {
  hideAllSections();
  
  // Reset main content opacity and clear it
  const main = document.getElementById('main-content');
  main.style.opacity = '1';
  const soulArtSection = document.getElementById('soulart-cards');
  if (!soulArtSection) {
    createSoulArtCardsSection();
    return;
  }
  soulArtSection.style.display = 'block';
  soulArtSection.style.opacity = '1';
  
  renderCardDeck();
}

function createSoulArtCardsSection() {
  const main = document.querySelector('main');
  const soulArtSection = document.createElement('section');
  soulArtSection.id = 'soulart-cards';
  soulArtSection.style.display = 'block';
  soulArtSection.innerHTML = `
    <div class="cards-container">
      <div style="margin-bottom: 20px;">
        <button onclick="goBack()" style="background: transparent; color: #8F5AFF; border: 2px solid #8F5AFF; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 14px;">
          ← Back
        </button>
      </div>
      <h2>SoulArt Oracle Cards</h2>
      <p class="cards-subtitle">
        Connect with your inner wisdom through this sacred 44-card deck. 
        Let your intuition guide you to the messages your soul needs to hear today.
      </p>
      
      <div class="card-reading-options">
        <button class="btn-primary" onclick="showCardCarousel()">Choose Your Card</button>
        <button class="btn-secondary" onclick="drawSingleCard()">Random Single Card</button>
        <button class="btn-secondary" onclick="drawThreeCards()">Random Three Card Spread</button>
        <button class="btn-cancel" onclick="resetDeck()" id="reset-btn" style="display: none;">Reset Deck</button>
      </div>
      
      <div id="card-spread" class="card-spread">
        <!-- Card spread will be rendered here -->
      </div>
      
      <div id="selected-card-display" class="selected-card-display">
        <!-- Selected card details will be shown here -->
      </div>
    </div>
  `;
  
  main.appendChild(soulArtSection);
  renderCardDeck();
}

function renderCardDeck() {
  const spreadContainer = document.getElementById('card-spread');
  if (!spreadContainer) return;
  
  if (selectedCards.length === 0) {
    spreadContainer.innerHTML = `
      <div class="deck-display">
        <div class="card-deck">
          <div class="card-back" onclick="drawSingleCard()">
            <div class="card-back-design">
              <div class="card-symbol">*</div>
              <div class="card-back-text">SoulArt Oracle</div>
              <div class="card-number">44 Cards</div>
            </div>
          </div>
        </div>
        <p class="deck-instruction">Click the deck above or choose a reading option to begin your spiritual guidance session.</p>
      </div>
    `;
  } else {
    displaySelectedCards();
  }
}

function drawSingleCard() {
  selectedCards = [];
  const randomCard = soulArtCards[Math.floor(Math.random() * soulArtCards.length)];
  selectedCards = [randomCard];
  
  displaySelectedCards();
  document.getElementById('reset-btn').style.display = 'inline-block';
}

function drawThreeCards() {
  selectedCards = [];
  const shuffledCards = [...soulArtCards].sort(() => Math.random() - 0.5);
  selectedCards = shuffledCards.slice(0, 3);
  
  displaySelectedCards();
  document.getElementById('reset-btn').style.display = 'inline-block';
}

function displaySelectedCards() {
  const spreadContainer = document.getElementById('card-spread');
  
  if (selectedCards.length === 1) {
    spreadContainer.innerHTML = `
      <div class="single-card-spread">
        <div class="oracle-card" data-card-id="${selectedCards[0].id}">
          <div class="card-front">
            <div class="card-header" style="background: ${selectedCards[0].color};">
              <h3>${selectedCards[0].title}</h3>
              <div class="card-element">${selectedCards[0].element}</div>
            </div>
            <div class="card-content">
              <div class="card-message">${selectedCards[0].message}</div>
            </div>
          </div>
        </div>
      </div>
    `;
  } else if (selectedCards.length === 3) {
    spreadContainer.innerHTML = `
      <div class="three-card-spread">
        <div class="spread-labels">
          <div class="spread-label">Past/Release</div>
          <div class="spread-label">Present/Focus</div>
          <div class="spread-label">Future/Embrace</div>
        </div>
        <div class="three-cards">
          ${selectedCards.map((card, index) => `
            <div class="oracle-card" data-card-id="${card.id}">
              <div class="card-front">
                <div class="card-header" style="background: ${card.color};">
                  <h4>${card.title}</h4>
                  <div class="card-element">${card.element}</div>
                </div>
                <div class="card-content">
                  <div class="card-message">${card.message}</div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
  
  // Add click handlers to cards for detailed view
  document.querySelectorAll('.oracle-card').forEach(card => {
    card.addEventListener('click', function() {
      const cardId = parseInt(this.dataset.cardId);
      showCardDetails(cardId);
    });
  });
}

function showCardDetails(cardId) {
  const card = soulArtCards.find(c => c.id === cardId);
  if (!card) return;
  
  const displayContainer = document.getElementById('selected-card-display');
  displayContainer.innerHTML = `
    <div class="card-details-modal">
      <div class="card-details">
        <div class="card-details-header" style="background: ${card.color};">
          <h2>${card.title}</h2>
          <div class="card-element-badge">${card.element} Energy</div>
        </div>
        
        <div class="card-details-content">
          <div class="card-section">
            <h4>Message</h4>
            <p class="card-detail-text">${card.message}</p>
          </div>
          
          <div class="card-section">
            <h4>Guidance</h4>
            <p class="card-detail-text">${card.guidance}</p>
          </div>
          
          <div class="card-section">
            <h4>Affirmation</h4>
            <p class="card-affirmation">"${card.affirmation}"</p>
          </div>
        </div>
        
        <div class="card-details-actions">
          <button class="btn-secondary" onclick="closeCardDetails()">Close</button>
          <button class="btn-primary" onclick="drawSingleCard()">Draw Another Card</button>
        </div>
      </div>
    </div>
  `;
  
  displayContainer.style.display = 'block';
  displayContainer.scrollIntoView({ behavior: 'smooth' });
}

function closeCardDetails() {
  const displayContainer = document.getElementById('selected-card-display');
  displayContainer.style.display = 'none';
  displayContainer.innerHTML = '';
}

function resetDeck() {
  selectedCards = [];
  renderCardDeck();
  closeCardDetails();
  document.getElementById('reset-btn').style.display = 'none';
}

function showCardCarousel() {
  const spreadContainer = document.getElementById('card-spread');
  
  // Create carousel interface
  spreadContainer.innerHTML = `
    <div class="card-carousel-container">
      <div class="carousel-instruction">
        Browse through all 44 oracle cards and click on the one that calls to your intuition
      </div>
      
      <div class="card-carousel" id="card-carousel">
        ${soulArtCards.map(card => `
          <div class="carousel-card" data-card-id="${card.id}" onclick="selectCarouselCard(${card.id})">
            <div class="carousel-card-front" style="background: ${card.color};">
              <div class="carousel-card-header">
                <div class="carousel-card-symbol">*</div>
                <div class="carousel-card-title">${card.title}</div>
                <div class="carousel-card-element">${card.element}</div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
      
      <div class="carousel-actions">
        <button class="btn-secondary" onclick="scrollCarousel('left')">← Previous Cards</button>
        <button class="btn-secondary" onclick="scrollCarousel('right')">Next Cards →</button>
        <button class="btn-cancel" onclick="renderCardDeck()">Back to Deck</button>
      </div>
    </div>
  `;
  
  // Center the carousel at the beginning and add touch support
  setTimeout(() => {
    const carousel = document.getElementById('card-carousel');
    if (carousel) {
      carousel.scrollLeft = 0;
      addTouchSupport(carousel);
    }
  }, 100);
}

function selectCarouselCard(cardId) {
  // Remove previous selections
  document.querySelectorAll('.carousel-card').forEach(card => {
    card.classList.remove('selected');
  });
  
  // Mark selected card
  const selectedCardElement = document.querySelector(`.carousel-card[data-card-id="${cardId}"]`);
  if (selectedCardElement) {
    selectedCardElement.classList.add('selected');
  }
  
  // Find the card and set it as selected
  const card = soulArtCards.find(c => c.id === cardId);
  if (card) {
    selectedCards = [card];
    
    // Show card details after a brief moment
    setTimeout(() => {
      showCardDetails(cardId);
      document.getElementById('reset-btn').style.display = 'inline-block';
    }, 300);
  }
}

function scrollCarousel(direction) {
  const carousel = document.getElementById('card-carousel');
  if (!carousel) return;
  
  const scrollAmount = 300; // Adjust based on card width
  
  if (direction === 'left') {
    carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  } else {
    carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }
}

function addTouchSupport(carousel) {
  let startX = 0;
  let scrollLeft = 0;
  let isDown = false;
  
  // Touch events for mobile
  carousel.addEventListener('touchstart', (e) => {
    startX = e.touches[0].pageX - carousel.offsetLeft;
    scrollLeft = carousel.scrollLeft;
  });
  
  carousel.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const x = e.touches[0].pageX - carousel.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed
    carousel.scrollLeft = scrollLeft - walk;
  });
  
  // Mouse events for desktop drag
  carousel.addEventListener('mousedown', (e) => {
    isDown = true;
    carousel.style.cursor = 'grabbing';
    startX = e.pageX - carousel.offsetLeft;
    scrollLeft = carousel.scrollLeft;
  });
  
  carousel.addEventListener('mouseleave', () => {
    isDown = false;
    carousel.style.cursor = 'grab';
  });
  
  carousel.addEventListener('mouseup', () => {
    isDown = false;
    carousel.style.cursor = 'grab';
  });
  
  carousel.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - carousel.offsetLeft;
    const walk = (x - startX) * 2;
    carousel.scrollLeft = scrollLeft - walk;
  });
  
  // Set initial cursor
  carousel.style.cursor = 'grab';
}

// ===== FLOW ART THERAPY MODULE =====

function renderFlowArtModule() {
  const main = document.getElementById('main-content');

  main.innerHTML = `
    <div class="doodle-canvas-container">
      <h2>Your Doodle Canvas</h2>
      <p class="doodle-canvas-subtitle">Create beautiful art in your digital coloring book. Draw, doodle, and express your creativity with brushes, colors, and stamps.</p>
      <p style="font-style: italic; color: var(--chakra-heart); margin-bottom: 30px;">
        "Every stroke tells a story, every color holds an emotion, every creation holds your essence."
      </p>

      <div class="doodle-canvas-actions" style="margin: 30px 0;">
        <button onclick="showMeditationArtPieces()" class="btn-primary" style="margin-right: 15px;">
          SoulArt Meditation Art Pieces
        </button>
        <button onclick="launchDoodleCanvas()" class="btn-secondary">
          Create My Doodle Art
        </button>
      </div>

      <div id="doodle-canvas-area" class="doodle-canvas-display"></div>
    </div>
  `;
}

function showMeditationArtPieces() {
  const container = document.getElementById('doodle-canvas-area');
  container.innerHTML = `
    <div style="background: linear-gradient(135deg, var(--chakra-crown), var(--chakra-throat)); padding: 30px; border-radius: 15px; margin-top: 20px; text-align: center;">
      <h3 style="color: white; margin-bottom: 25px; font-size: 1.8em;">SoulArt Meditation Art Pieces</h3>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 30px;">
        <!-- Meditation Art Piece 1 -->
        <div style="background: rgba(255,255,255,0.95); padding: 20px; border-radius: 10px; cursor: pointer;" onclick="openMeditationPiece(1)">
          <img src="/flow-art-sample.png?t=${Date.now()}" alt="Sacred Courage Meditation" style="width: 100%; height: 150px; object-fit: cover; border-radius: 8px; margin-bottom: 10px;" onload="console.log('Image loaded successfully')" onerror="console.log('Image failed to load'); this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImdyYWQxIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjRkY2QjZCIi8+PHN0b3Agb2Zmc2V0PSI1MCUiIHN0b3AtY29sb3I9IiM0RUNEQzQiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM5NkNFQjQiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0idXJsKCNncmFkMSkiLz48dGV4dCB4PSIyMDAiIHk9IjgwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZvbnQtd2VpZ2h0PSJib2xkIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSI+U2FjcmVkIENvdXJhZ2U8L3RleHQ+PC9zdmc+';">
          <h4 style="color: var(--chakra-crown); margin: 10px 0 5px 0;">Sacred Courage</h4>
          <p style="color: var(--text-primary); font-size: 0.9em; margin: 0;">5-minute courage meditation</p>
        </div>
        
        <!-- Meditation Art Piece 2 -->
        <div style="background: rgba(255,255,255,0.95); padding: 20px; border-radius: 10px; cursor: pointer;" onclick="openMeditationPiece(2)">
          <div style="width: 100%; height: 150px; background: linear-gradient(45deg, var(--chakra-heart), var(--chakra-sacral)); border-radius: 8px; margin-bottom: 10px; display: flex; align-items: center; justify-content: center;">
            <span style="color: white; font-size: 18px; font-weight: bold;">Healing Waters</span>
          </div>
          <h4 style="color: var(--chakra-crown); margin: 10px 0 5px 0;">Healing Waters</h4>
          <p style="color: var(--text-primary); font-size: 0.9em; margin: 0;">10-minute emotional healing</p>
        </div>
        
        <!-- Meditation Art Piece 3 -->
        <div style="background: rgba(255,255,255,0.95); padding: 20px; border-radius: 10px; cursor: pointer;" onclick="openMeditationPiece(3)">
          <div style="width: 100%; height: 150px; background: linear-gradient(135deg, var(--chakra-third-eye), var(--chakra-crown)); border-radius: 8px; margin-bottom: 10px; display: flex; align-items: center; justify-content: center;">
            <span style="color: white; font-size: 18px; font-weight: bold;">Inner Wisdom</span>
          </div>
          <h4 style="color: var(--chakra-crown); margin: 10px 0 5px 0;">Inner Wisdom</h4>
          <p style="color: var(--text-primary); font-size: 0.9em; margin: 0;">15-minute wisdom meditation</p>
        </div>
      </div>
      
      <p style="color: white; font-style: italic; margin: 15px 0;">
        "Click any piece above to begin your guided meditation with beautiful visuals and healing music."
      </p>
      <button onclick="launchDoodleCanvas()" class="btn-primary" style="margin-top: 20px; background: white; color: var(--chakra-crown);">
        Create Your Own Art
      </button>
    </div>
  `;
}

function launchDoodleCanvas() {
  const container = document.getElementById('doodle-canvas-area');
  container.innerHTML = `
    <div style="background: linear-gradient(135deg, var(--chakra-heart), var(--chakra-sacral)); padding: 40px; border-radius: 15px; margin-top: 20px; box-shadow: 0 8px 25px rgba(0,0,0,0.15); min-height: 800px;">
      <div style="background: rgba(255,255,255,0.95); padding: 30px; border-radius: 12px; color: var(--text-primary);">
        
        <div style="margin-bottom: 20px; text-align: left;">
          <button onclick="goBack()" style="background: transparent; color: #8F5AFF; border: 2px solid #8F5AFF; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 14px;">
            ← Back
          </button>
        </div>
        <h3 style="color: var(--chakra-crown); margin-bottom: 25px; font-size: 1.8em; text-align: center;">Your Doodle Canvas</h3>
        
        <div style="display: grid; grid-template-columns: 1fr 3fr 1fr; gap: 20px; align-items: start;">
          
          <!-- Left Panel - Drawing Tools -->
          <div style="background: var(--chakra-throat); color: white; padding: 20px; border-radius: 10px;">
            <h4 style="color: white; margin-bottom: 15px; font-size: 1.1em; text-align: center;">Drawing Tools</h4>
            
            <!-- Tool Selection -->
            <div style="margin-bottom: 20px;">
              <p style="margin-bottom: 10px; font-size: 0.9em;">Tool:</p>
              <div style="display: flex; flex-direction: column; gap: 8px;">
                <button id="brush-tool" onclick="setDrawingTool('brush')" class="tool-btn active-tool" style="background: rgba(255,255,255,0.3); color: white; border: 2px solid white; padding: 8px; border-radius: 5px; font-size: 0.9em;">
                  Brush
                </button>
                <button id="eraser-tool" onclick="setDrawingTool('eraser')" class="tool-btn" style="background: rgba(255,255,255,0.1); color: white; border: 2px solid rgba(255,255,255,0.3); padding: 8px; border-radius: 5px; font-size: 0.9em;">
                  Eraser
                </button>
                <button id="stamp-tool" onclick="setDrawingTool('stamp')" class="tool-btn" style="background: rgba(255,255,255,0.1); color: white; border: 2px solid rgba(255,255,255,0.3); padding: 8px; border-radius: 5px; font-size: 0.9em;">
                  Stamps
                </button>
              </div>
            </div>
            
            <!-- Brush Size -->
            <div style="margin-bottom: 20px;">
              <p style="margin-bottom: 10px; font-size: 0.9em;">Size: <span id="brush-size-display">8</span>px</p>
              <input type="range" id="brush-size" min="2" max="50" value="8" onchange="updateBrushSize(this.value)" style="width: 100%;">
            </div>
            
            <!-- Color Palettes -->
            <div style="margin-bottom: 20px;">
              <p style="margin-bottom: 10px; font-size: 0.9em;">Chakra Colors:</p>
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px; margin-bottom: 15px;">
                <div class="color-option chakra-color" data-color="#FF0000" style="width: 25px; height: 25px; background: #FF0000; border-radius: 50%; cursor: pointer; border: 2px solid rgba(255,255,255,0.5);" title="Root Chakra"></div>
                <div class="color-option chakra-color" data-color="#FF8C00" style="width: 25px; height: 25px; background: #FF8C00; border-radius: 50%; cursor: pointer; border: 2px solid rgba(255,255,255,0.5);" title="Sacral Chakra"></div>
                <div class="color-option chakra-color" data-color="#FFD700" style="width: 25px; height: 25px; background: #FFD700; border-radius: 50%; cursor: pointer; border: 2px solid rgba(255,255,255,0.5);" title="Solar Plexus"></div>
                <div class="color-option chakra-color" data-color="#32CD32" style="width: 25px; height: 25px; background: #32CD32; border-radius: 50%; cursor: pointer; border: 2px solid rgba(255,255,255,0.5);" title="Heart Chakra"></div>
                <div class="color-option chakra-color" data-color="#1E90FF" style="width: 25px; height: 25px; background: #1E90FF; border-radius: 50%; cursor: pointer; border: 2px solid rgba(255,255,255,0.5);" title="Throat Chakra"></div>
                <div class="color-option chakra-color" data-color="#8A2BE2" style="width: 25px; height: 25px; background: #8A2BE2; border-radius: 50%; cursor: pointer; border: 2px solid rgba(255,255,255,0.5);" title="Third Eye"></div>
                <div class="color-option chakra-color" data-color="#9400D3" style="width: 25px; height: 25px; background: #9400D3; border-radius: 50%; cursor: pointer; border: 2px solid rgba(255,255,255,0.5);" title="Crown Chakra"></div>
              </div>
              
              <p style="margin-bottom: 10px; font-size: 0.9em;">More Colors:</p>
              <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 5px; margin-bottom: 10px;">
                <div class="color-option" data-color="#000000" style="width: 25px; height: 25px; background: #000000; border-radius: 50%; cursor: pointer; border: 2px solid rgba(255,255,255,0.5);"></div>
                <div class="color-option" data-color="#FFFFFF" style="width: 25px; height: 25px; background: #FFFFFF; border-radius: 50%; cursor: pointer; border: 2px solid rgba(255,255,255,0.8);"></div>
                <div class="color-option" data-color="#FF69B4" style="width: 25px; height: 25px; background: #FF69B4; border-radius: 50%; cursor: pointer; border: 2px solid rgba(255,255,255,0.5);"></div>
                <div class="color-option" data-color="#00CED1" style="width: 25px; height: 25px; background: #00CED1; border-radius: 50%; cursor: pointer; border: 2px solid rgba(255,255,255,0.5);"></div>
                <div class="color-option" data-color="#98FB98" style="width: 25px; height: 25px; background: #98FB98; border-radius: 50%; cursor: pointer; border: 2px solid rgba(255,255,255,0.5);"></div>
                <div class="color-option" data-color="#DDA0DD" style="width: 25px; height: 25px; background: #DDA0DD; border-radius: 50%; cursor: pointer; border: 2px solid rgba(255,255,255,0.5);"></div>
                <div class="color-option" data-color="#F0E68C" style="width: 25px; height: 25px; background: #F0E68C; border-radius: 50%; cursor: pointer; border: 2px solid rgba(255,255,255,0.5);"></div>
                <div class="color-option" data-color="#FFA07A" style="width: 25px; height: 25px; background: #FFA07A; border-radius: 50%; cursor: pointer; border: 2px solid rgba(255,255,255,0.5);"></div>
              </div>
              
              <input type="color" id="custom-color" onchange="setCustomColor(this.value)" style="width: 100%; height: 30px; border: none; border-radius: 5px; margin-top: 5px;">
            </div>
            
            <!-- Undo/Redo -->
            <div style="display: flex; gap: 5px; margin-bottom: 15px;">
              <button onclick="undoDraw()" style="flex: 1; background: rgba(255,255,255,0.2); color: white; border: 1px solid white; padding: 5px; border-radius: 5px; font-size: 0.8em;">
                Undo
              </button>
              <button onclick="redoDraw()" style="flex: 1; background: rgba(255,255,255,0.2); color: white; border: 1px solid white; padding: 5px; border-radius: 5px; font-size: 0.8em;">
                Redo
              </button>
            </div>
            
            <!-- Canvas Actions -->
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <button onclick="clearCanvas()" style="background: rgba(255,255,255,0.2); color: white; border: 1px solid white; padding: 8px; border-radius: 5px; font-size: 0.9em;">
                Clear All
              </button>
              <button onclick="saveDoodleArt()" style="background: var(--chakra-heart); color: white; border: none; padding: 8px; border-radius: 5px; font-size: 0.9em;">
                Save Art
              </button>
            </div>
          </div>
          
          <!-- Center Panel - Large Canvas -->
          <div style="background: white; padding: 20px; border-radius: 10px; text-align: center;">
            <canvas id="doodle-canvas" width="600" height="450" style="border: 3px solid var(--chakra-crown); border-radius: 8px; touch-action: none; cursor: crosshair; max-width: 100%; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
              Your browser doesn't support canvas. Please update your browser.
            </canvas>
            <p style="margin-top: 10px; font-size: 0.9em; color: var(--text-primary); font-style: italic;">Click and drag to draw • Use tools on the left</p>
          </div>
          
          <!-- Right Panel - Stamps & Music -->
          <div>
            <!-- Stamps Panel -->
            <div id="stamps-panel" style="background: var(--chakra-sacral); color: white; padding: 20px; border-radius: 10px; margin-bottom: 20px; display: none;">
              <h4 style="color: white; margin-bottom: 15px; font-size: 1.1em; text-align: center;">Stamps</h4>
              
              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 15px;">
                <div class="stamp-option" data-stamp="heart" style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 5px; cursor: pointer; text-align: center; border: 2px solid transparent;">
                  <div style="font-size: 24px;">❤️</div>
                  <p style="font-size: 0.8em; margin: 5px 0 0 0;">Heart</p>
                </div>
                <div class="stamp-option" data-stamp="star" style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 5px; cursor: pointer; text-align: center; border: 2px solid transparent;">
                  <div style="font-size: 24px;">⭐</div>
                  <p style="font-size: 0.8em; margin: 5px 0 0 0;">Star</p>
                </div>
                <div class="stamp-option" data-stamp="flower" style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 5px; cursor: pointer; text-align: center; border: 2px solid transparent;">
                  <div style="font-size: 24px;">🌸</div>
                  <p style="font-size: 0.8em; margin: 5px 0 0 0;">Flower</p>
                </div>
                <div class="stamp-option" data-stamp="butterfly" style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 5px; cursor: pointer; text-align: center; border: 2px solid transparent;">
                  <div style="font-size: 24px;">🦋</div>
                  <p style="font-size: 0.8em; margin: 5px 0 0 0;">Butterfly</p>
                </div>
                <div class="stamp-option" data-stamp="moon" style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 5px; cursor: pointer; text-align: center; border: 2px solid transparent;">
                  <div style="font-size: 24px;">🌙</div>
                  <p style="font-size: 0.8em; margin: 5px 0 0 0;">Moon</p>
                </div>
                <div class="stamp-option" data-stamp="sun" style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 5px; cursor: pointer; text-align: center; border: 2px solid transparent;">
                  <div style="font-size: 24px;">☀️</div>
                  <p style="font-size: 0.8em; margin: 5px 0 0 0;">Sun</p>
                </div>
              </div>
              
              <p style="margin-bottom: 10px; font-size: 0.9em;">Stamp Size:</p>
              <input type="range" id="stamp-size" min="20" max="80" value="40" onchange="updateStampSize(this.value)" style="width: 100%;">
              <p style="font-size: 0.8em; text-align: center; margin: 5px 0 0 0;"><span id="stamp-size-display">40</span>px</p>
            </div>
            
            <!-- Music Panel -->
            <div style="background: var(--chakra-crown); color: white; padding: 20px; border-radius: 10px;">
              <h4 style="color: white; margin-bottom: 15px; font-size: 1.1em; text-align: center;">Concentration Music</h4>
              <div style="display: flex; flex-direction: column; gap: 8px;">
                <button onclick="playAmbientSound('rain')" class="concentration-sound-btn" data-sound="rain" style="background: rgba(255,255,255,0.2); color: white; border: 1px solid white; padding: 8px; border-radius: 5px; font-size: 0.9em; text-align: left;">
                  Gentle Rain
                </button>
                <button onclick="playAmbientSound('ocean')" class="concentration-sound-btn" data-sound="ocean" style="background: rgba(255,255,255,0.2); color: white; border: 1px solid white; padding: 8px; border-radius: 5px; font-size: 0.9em; text-align: left;">
                  Ocean Waves
                </button>
                <button onclick="playAmbientSound('forest')" class="concentration-sound-btn" data-sound="forest" style="background: rgba(255,255,255,0.2); color: white; border: 1px solid white; padding: 8px; border-radius: 5px; font-size: 0.9em; text-align: left;">
                  Forest Sounds
                </button>
                <button onclick="playAmbientSound('chakra')" class="concentration-sound-btn" data-sound="chakra" style="background: rgba(255,255,255,0.2); color: white; border: 1px solid white; padding: 8px; border-radius: 5px; font-size: 0.9em; text-align: left;">
                  Chakra Tones
                </button>
                <button onclick="stopAmbientSound()" style="background: rgba(255,255,255,0.1); color: white; border: 1px solid white; padding: 8px; border-radius: 5px; font-size: 0.9em; text-align: left;">
                  Stop Music
                </button>
              </div>
              <div id="music-controls" style="margin-top: 15px; display: none;">
                <p style="margin: 5px 0; font-size: 0.9em;">Playing: <span id="current-sound-name">None</span></p>
                <input type="range" id="volume-control" min="0" max="100" value="30" onchange="adjustVolume(this.value)" style="width: 100%;">
                <p style="margin: 5px 0; font-size: 0.8em; text-align: center;">Volume</p>
              </div>
            </div>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <p style="font-style: italic; margin-bottom: 25px; color: var(--chakra-third-eye); font-size: 1.1em;">
            "Create freely, express boldly, and let your soul speak through every stroke."
          </p>
          
          <button onclick="navigate('journal')" class="btn-primary" style="margin-right: 15px; font-size: 1.1em;">
            Journal About Your Art
          </button>
          <button onclick="navigate('soulart-cards')" class="btn-secondary" style="font-size: 1.1em;">
            Pull a SoulArt Card
          </button>
        </div>
      </div>
    </div>
  `;
  
  // Initialize the canvas after the HTML is loaded
  setTimeout(() => {
    initializeDoodleCanvas();
  }, 100);
}

// ===== DOODLE CANVAS AND MUSIC FUNCTIONS =====

let drawing = false;
let context;
let currentAmbientAudio = null;
let currentCanvas = null;
let currentTool = 'brush';
let currentColor = '#FF0000';
let brushSize = 8;
let stampSize = 40;
let selectedStamp = null;
let undoStack = [];
let redoStack = [];
let maxUndoSteps = 20;

// Initialize the Doodle Canvas
function initializeDoodleCanvas() {
  const canvas = document.getElementById('doodle-canvas');
  if (!canvas) return;
  
  currentCanvas = canvas;
  context = canvas.getContext('2d');
  context.lineWidth = brushSize;
  context.lineCap = 'round';
  context.lineJoin = 'round';
  context.strokeStyle = currentColor;
  context.globalCompositeOperation = 'source-over';
  
  // Make canvas responsive
  const container = canvas.parentElement;
  const containerWidth = container.clientWidth - 40; // Account for padding
  if (containerWidth < 600) {
    canvas.style.width = '100%';
    canvas.style.height = 'auto';
  }
  
  // Save initial state for undo
  saveCanvasState();
  
  // Add event listeners for both touch and mouse
  canvas.addEventListener('mousedown', startDoodleDrawing);
  canvas.addEventListener('mousemove', doodleDraw);
  canvas.addEventListener('mouseup', stopDoodleDrawing);
  canvas.addEventListener('mouseout', stopDoodleDrawing);
  
  canvas.addEventListener('touchstart', startDoodleDrawing);
  canvas.addEventListener('touchmove', doodleDraw);
  canvas.addEventListener('touchend', stopDoodleDrawing);
  
  // Set up color palette clicks
  setupColorPalette();
  setupStampPalette();
}

// Tool Management Functions
function setDrawingTool(tool) {
  currentTool = tool;
  
  // Update tool button styles
  document.querySelectorAll('.tool-btn').forEach(btn => {
    btn.style.background = 'rgba(255,255,255,0.1)';
    btn.style.border = '2px solid rgba(255,255,255,0.3)';
  });
  
  const activeBtn = document.getElementById(tool + '-tool');
  if (activeBtn) {
    activeBtn.style.background = 'rgba(255,255,255,0.3)';
    activeBtn.style.border = '2px solid white';
  }
  
  // Show/hide stamps panel
  const stampsPanel = document.getElementById('stamps-panel');
  if (stampsPanel) {
    stampsPanel.style.display = tool === 'stamp' ? 'block' : 'none';
  }
  
  // Update cursor and drawing mode
  if (currentCanvas) {
    if (tool === 'eraser') {
      currentCanvas.style.cursor = 'grab';
      context.globalCompositeOperation = 'destination-out';
    } else if (tool === 'stamp') {
      currentCanvas.style.cursor = 'pointer';
      context.globalCompositeOperation = 'source-over';
    } else {
      currentCanvas.style.cursor = 'crosshair';
      context.globalCompositeOperation = 'source-over';
    }
  }
}

function updateBrushSize(size) {
  brushSize = parseInt(size);
  document.getElementById('brush-size-display').textContent = brushSize;
  if (context) {
    context.lineWidth = brushSize;
  }
}

function updateStampSize(size) {
  stampSize = parseInt(size);
  document.getElementById('stamp-size-display').textContent = stampSize;
}

// Color Management Functions
function setupColorPalette() {
  const colorOptions = document.querySelectorAll('.color-option');
  colorOptions.forEach(colorOption => {
    colorOption.addEventListener('click', () => {
      const color = colorOption.dataset.color;
      setColor(color);
      
      // Update visual selection
      colorOptions.forEach(c => c.style.border = c.classList.contains('chakra-color') ? '2px solid rgba(255,255,255,0.5)' : '2px solid rgba(255,255,255,0.5)');
      colorOption.style.border = '3px solid white';
    });
  });
}

function setColor(color) {
  currentColor = color;
  if (context && currentTool !== 'eraser') {
    context.strokeStyle = color;
    context.fillStyle = color;
  }
}

function setCustomColor(color) {
  setColor(color);
  // Remove selection from other colors
  document.querySelectorAll('.color-option').forEach(c => {
    c.style.border = c.classList.contains('chakra-color') ? '2px solid rgba(255,255,255,0.5)' : '2px solid rgba(255,255,255,0.5)';
  });
}

// Stamp Management Functions
function setupStampPalette() {
  const stampOptions = document.querySelectorAll('.stamp-option');
  stampOptions.forEach(stampOption => {
    stampOption.addEventListener('click', () => {
      const stamp = stampOption.dataset.stamp;
      setStamp(stamp);
      
      // Update visual selection
      stampOptions.forEach(s => s.style.border = '2px solid transparent');
      stampOption.style.border = '2px solid white';
    });
  });
}

function setStamp(stamp) {
  selectedStamp = stamp;
  setDrawingTool('stamp');
}

// Drawing Functions
function startDoodleDrawing(e) {
  e.preventDefault();
  
  const rect = currentCanvas.getBoundingClientRect();
  const scaleX = currentCanvas.width / rect.width;
  const scaleY = currentCanvas.height / rect.height;
  
  let x, y;
  if (e.touches) {
    x = (e.touches[0].clientX - rect.left) * scaleX;
    y = (e.touches[0].clientY - rect.top) * scaleY;
  } else {
    x = (e.clientX - rect.left) * scaleX;
    y = (e.clientY - rect.top) * scaleY;
  }
  
  if (currentTool === 'stamp' && selectedStamp) {
    placeStamp(x, y);
    saveCanvasState();
    return;
  }
  
  drawing = true;
  context.beginPath();
  context.moveTo(x, y);
}

function doodleDraw(e) {
  e.preventDefault();
  if (!drawing || currentTool === 'stamp') return;
  
  const rect = currentCanvas.getBoundingClientRect();
  const scaleX = currentCanvas.width / rect.width;
  const scaleY = currentCanvas.height / rect.height;
  
  let x, y;
  if (e.touches) {
    x = (e.touches[0].clientX - rect.left) * scaleX;
    y = (e.touches[0].clientY - rect.top) * scaleY;
  } else {
    x = (e.clientX - rect.left) * scaleX;
    y = (e.clientY - rect.top) * scaleY;
  }
  
  context.lineTo(x, y);
  context.stroke();
}

function stopDoodleDrawing(e) {
  e.preventDefault();
  if (drawing) {
    drawing = false;
    saveCanvasState();
  }
}

function placeStamp(x, y) {
  const stampIcons = {
    heart: '❤️',
    star: '⭐',
    flower: '🌸',
    butterfly: '🦋',
    moon: '🌙',
    sun: '☀️'
  };
  
  const icon = stampIcons[selectedStamp];
  if (!icon) return;
  
  context.font = `${stampSize}px Arial`;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(icon, x, y);
}

// Undo/Redo Functions
function saveCanvasState() {
  if (!currentCanvas) return;
  
  undoStack.push(currentCanvas.toDataURL());
  if (undoStack.length > maxUndoSteps) {
    undoStack.shift();
  }
  redoStack = []; // Clear redo stack when new action is performed
}

function undoDraw() {
  if (undoStack.length <= 1) return; // Keep at least initial state
  
  redoStack.push(undoStack.pop());
  const previousState = undoStack[undoStack.length - 1];
  
  const img = new Image();
  img.onload = function() {
    context.clearRect(0, 0, currentCanvas.width, currentCanvas.height);
    context.drawImage(img, 0, 0);
  };
  img.src = previousState;
}

function redoDraw() {
  if (redoStack.length === 0) return;
  
  const nextState = redoStack.pop();
  undoStack.push(nextState);
  
  const img = new Image();
  img.onload = function() {
    context.clearRect(0, 0, currentCanvas.width, currentCanvas.height);
    context.drawImage(img, 0, 0);
  };
  img.src = nextState;
}

function clearCanvas() {
  if (context && currentCanvas) {
    context.clearRect(0, 0, currentCanvas.width, currentCanvas.height);
    saveCanvasState();
  }
}

// Save with Authentication
async function saveDoodleArt() {
  if (!currentCanvas) return;
  
  try {
    // Check if user is authenticated
    const authResponse = await fetch('/api/auth/user');
    if (!authResponse.ok) {
      if (confirm('You need to sign in to save your artwork. Would you like to sign in now?')) {
        window.location.href = '/api/login';
      }
      return;
    }
    
    const dataURL = currentCanvas.toDataURL('image/png');
    
    // Prepare artwork data
    const artworkData = {
      title: prompt('Give your artwork a title (optional):') || `Doodle Art ${new Date().toLocaleDateString()}`,
      imageDataUrl: dataURL,
      canvasWidth: currentCanvas.width,
      canvasHeight: currentCanvas.height,
      toolsUsed: {
        currentTool,
        currentColor,
        brushSize,
        stampSize,
        selectedStamp,
        timestamp: new Date().toISOString()
      }
    };
    
    // Save to server
    const saveResponse = await fetch('/api/artworks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(artworkData)
    });
    
    const result = await saveResponse.json();
    
    if (saveResponse.ok) {
      alert(`${result.message}\n\nYour artwork "${result.title}" has been saved to your SoulArt gallery!`);
      
      // Also offer to download locally
      if (confirm('Would you also like to download a copy to your device?')) {
        const link = document.createElement('a');
        link.download = `${result.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png`;
        link.href = dataURL;
        link.click();
      }
    } else {
      alert(result.message || 'Failed to save artwork to server. Please try again.');
    }
    
  } catch (error) {
    console.error('Save error:', error);
    alert('Unable to save artwork. Please check your connection and try again.');
  }
}

// Meditation Art Pieces Functions
function openMeditationPiece(pieceId) {
  const pieces = {
    1: {
      title: 'Sacred Courage',
      duration: 5,
      description: 'A 5-minute meditation to build inner courage and strength',
      music: 'chakra'
    },
    2: {
      title: 'Healing Waters',
      duration: 10,
      description: 'A 10-minute emotional healing meditation with flowing water energy',
      music: 'ocean'
    },
    3: {
      title: 'Inner Wisdom',
      duration: 15,
      description: 'A 15-minute meditation to connect with your inner wisdom and intuition',
      music: 'forest'
    }
  };
  
  const piece = pieces[pieceId];
  if (!piece) return;
  
  const container = document.getElementById('doodle-canvas-area');
  container.innerHTML = `
    <div style="background: linear-gradient(135deg, var(--chakra-crown), var(--chakra-third-eye)); padding: 40px; border-radius: 15px; margin-top: 20px; text-align: center; min-height: 600px;">
      <div style="background: rgba(255,255,255,0.95); padding: 40px; border-radius: 12px; color: var(--text-primary);">
        
        <h3 style="color: var(--chakra-crown); margin-bottom: 20px; font-size: 2em;">${piece.title}</h3>
        <p style="font-size: 1.2em; margin-bottom: 30px; color: var(--text-primary);">${piece.description}</p>
        
        <!-- Meditation Timer Display -->
        <div style="background: var(--chakra-throat); color: white; padding: 30px; border-radius: 15px; margin: 30px 0;">
          <div id="timer-display" style="font-size: 3em; font-weight: bold; margin-bottom: 20px;">
            ${String(piece.duration).padStart(2, '0')}:00
          </div>
          
          <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
            <button id="start-meditation" onclick="startMeditation(${piece.duration}, '${piece.music}')" style="background: var(--chakra-heart); color: white; border: none; padding: 15px 30px; border-radius: 8px; font-size: 1.1em; cursor: pointer;">
              Start Meditation
            </button>
            <button id="pause-meditation" onclick="pauseMeditation()" style="background: var(--chakra-sacral); color: white; border: none; padding: 15px 30px; border-radius: 8px; font-size: 1.1em; cursor: pointer; display: none;">
              Pause
            </button>
            <button id="stop-meditation" onclick="stopMeditation()" style="background: rgba(255,255,255,0.2); color: white; border: 1px solid white; padding: 15px 30px; border-radius: 8px; font-size: 1.1em; cursor: pointer;">
              Stop
            </button>
          </div>
          
          <!-- Timer Duration Selection -->
          <div style="margin-top: 20px;">
            <p style="margin-bottom: 10px; font-size: 1em;">Customize Duration:</p>
            <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
              <button onclick="setMeditationDuration(3)" style="background: rgba(255,255,255,0.2); color: white; border: 1px solid white; padding: 8px 15px; border-radius: 5px; font-size: 0.9em;">3 min</button>
              <button onclick="setMeditationDuration(5)" style="background: rgba(255,255,255,0.2); color: white; border: 1px solid white; padding: 8px 15px; border-radius: 5px; font-size: 0.9em;">5 min</button>
              <button onclick="setMeditationDuration(10)" style="background: rgba(255,255,255,0.2); color: white; border: 1px solid white; padding: 8px 15px; border-radius: 5px; font-size: 0.9em;">10 min</button>
              <button onclick="setMeditationDuration(15)" style="background: rgba(255,255,255,0.2); color: white; border: 1px solid white; padding: 8px 15px; border-radius: 5px; font-size: 0.9em;">15 min</button>
              <button onclick="setMeditationDuration(20)" style="background: rgba(255,255,255,0.2); color: white; border: 1px solid white; padding: 8px 15px; border-radius: 5px; font-size: 0.9em;">20 min</button>
            </div>
          </div>
        </div>
        
        <!-- Visualization Area -->
        <div style="background: linear-gradient(45deg, var(--chakra-heart), var(--chakra-sacral)); padding: 30px; border-radius: 15px; margin: 30px 0; min-height: 200px; display: flex; align-items: center; justify-content: center;">
          <div id="meditation-visual" style="text-align: center;">
            <div style="width: 150px; height: 150px; border: 3px solid rgba(255,255,255,0.6); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.1);">
              <span style="color: white; font-size: 2em;">🧘‍♀️</span>
            </div>
            <p style="color: white; font-size: 1.2em; font-style: italic;">
              "Find your center, breathe deeply, and allow peace to flow through you."
            </p>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <button onclick="showMeditationArtPieces()" class="btn-secondary" style="margin-right: 15px; font-size: 1.1em;">
            ← Back to Art Pieces
          </button>
          <button onclick="launchDoodleCanvas()" class="btn-primary" style="font-size: 1.1em;">
            Create Doodle Art
          </button>
        </div>
      </div>
    </div>
  `;
}

// Meditation Timer Functions
let meditationTimer = null;
let meditationTimeRemaining = 0;
let meditationPaused = false;

function setMeditationDuration(minutes) {
  meditationTimeRemaining = minutes * 60;
  updateTimerDisplay();
}

function startMeditation(minutes, musicType) {
  if (!meditationPaused) {
    meditationTimeRemaining = minutes * 60;
  }
  meditationPaused = false;
  
  // Start background music
  playAmbientSound(musicType);
  
  // Update button visibility
  document.getElementById('start-meditation').style.display = 'none';
  document.getElementById('pause-meditation').style.display = 'inline-block';
  
  // Start timer
  meditationTimer = setInterval(() => {
    meditationTimeRemaining--;
    updateTimerDisplay();
    
    if (meditationTimeRemaining <= 0) {
      completeMeditation();
    }
  }, 1000);
}

function pauseMeditation() {
  meditationPaused = true;
  clearInterval(meditationTimer);
  
  // Update button visibility
  document.getElementById('start-meditation').style.display = 'inline-block';
  document.getElementById('pause-meditation').style.display = 'none';
  document.getElementById('start-meditation').textContent = 'Resume';
  
  // Pause music
  stopAmbientSound();
}

function stopMeditation() {
  clearInterval(meditationTimer);
  meditationTimer = null;
  meditationPaused = false;
  
  // Reset buttons
  document.getElementById('start-meditation').style.display = 'inline-block';
  document.getElementById('pause-meditation').style.display = 'none';
  document.getElementById('start-meditation').textContent = 'Start Meditation';
  
  // Stop music
  stopAmbientSound();
  
  // Reset timer to original duration
  meditationTimeRemaining = 300; // Default 5 minutes
  updateTimerDisplay();
}

function completeMeditation() {
  clearInterval(meditationTimer);
  meditationTimer = null;
  
  // Stop music
  stopAmbientSound();
  
  // Show completion message
  document.getElementById('meditation-visual').innerHTML = `
    <div style="text-align: center;">
      <div style="width: 150px; height: 150px; border: 3px solid rgba(255,255,255,0.6); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.1);">
        <span style="color: white; font-size: 2em;">✨</span>
      </div>
      <p style="color: white; font-size: 1.3em; font-weight: bold;">
        Meditation Complete!
      </p>
      <p style="color: white; font-size: 1.1em; font-style: italic;">
        "You have completed your healing journey. Carry this peace with you."
      </p>
    </div>
  `;
  
  // Reset buttons
  document.getElementById('start-meditation').style.display = 'inline-block';
  document.getElementById('pause-meditation').style.display = 'none';
  document.getElementById('start-meditation').textContent = 'Start Again';
}

function updateTimerDisplay() {
  const minutes = Math.floor(meditationTimeRemaining / 60);
  const seconds = meditationTimeRemaining % 60;
  const display = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  
  const timerElement = document.getElementById('timer-display');
  if (timerElement) {
    timerElement.textContent = display;
  }
}

// ===== AMBIENT MUSIC FUNCTIONS =====

const ambientSounds = {
  rain: { name: 'Gentle Rain', freq: 'brownNoise' },
  ocean: { name: 'Ocean Waves', freq: 'oceanWaves' },
  forest: { name: 'Forest Sounds', freq: 'pinkNoise' },
  chakra: { name: 'Chakra Tones', freq: '528Hz' }
};

function playAmbientSound(soundType) {
  // Stop any current audio
  stopAmbientSound();
  
  const sound = ambientSounds[soundType];
  if (!sound) return;
  
  try {
    // Create audio using Web Audio API for better control
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    if (soundType === 'rain' || soundType === 'forest') {
      currentAmbientAudio = createNoiseBuffer(audioContext, soundType);
    } else if (soundType === 'ocean') {
      currentAmbientAudio = createOceanBuffer(audioContext);
    } else if (soundType === 'chakra') {
      currentAmbientAudio = createChakraBuffer(audioContext);
    }
    
    // Show music controls
    const controls = document.getElementById('music-controls');
    const soundName = document.getElementById('current-sound-name');
    if (controls && soundName) {
      controls.style.display = 'block';
      soundName.textContent = sound.name;
    }
    
    // Highlight active button
    const buttons = document.querySelectorAll('.concentration-sound-btn');
    buttons.forEach(btn => {
      if (btn.dataset.sound === soundType) {
        btn.style.background = 'rgba(255,255,255,0.4)';
      } else {
        btn.style.background = 'rgba(255,255,255,0.2)';
      }
    });
  } catch (error) {
    console.log('Audio not supported in this browser');
  }
}

function stopAmbientSound() {
  if (currentAmbientAudio) {
    try {
      currentAmbientAudio.stop();
    } catch (e) {
      // Audio might already be stopped
    }
    currentAmbientAudio = null;
  }
  
  // Hide controls
  const controls = document.getElementById('music-controls');
  if (controls) {
    controls.style.display = 'none';
  }
  
  // Reset button styles
  const buttons = document.querySelectorAll('.concentration-sound-btn');
  buttons.forEach(btn => {
    btn.style.background = 'rgba(255,255,255,0.2)';
  });
}

function adjustVolume(volume) {
  const vol = volume / 100;
  if (currentAmbientAudio && currentAmbientAudio.gainNode) {
    currentAmbientAudio.gainNode.gain.value = vol;
  }
}

// Audio generation functions
function createNoiseBuffer(audioContext, type) {
  const bufferSize = audioContext.sampleRate * 2;
  const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
  const output = buffer.getChannelData(0);
  
  let b0 = 0, b1 = 0;
  
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    
    if (type === 'rain') {
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      output[i] = (b0 + b1) * 0.3;
    } else {
      b0 = 0.99765 * b0 + white * 0.0990460;
      b1 = 0.96300 * b1 + white * 0.2965164;
      output[i] = (b0 + b1) * 0.2;
    }
  }
  
  const source = audioContext.createBufferSource();
  const gainNode = audioContext.createGain();
  
  source.buffer = buffer;
  source.loop = true;
  source.connect(gainNode);
  gainNode.connect(audioContext.destination);
  gainNode.gain.value = 0.3;
  
  source.start();
  source.gainNode = gainNode;
  return source;
}

function createOceanBuffer(audioContext) {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  const filter = audioContext.createBiquadFilter();
  
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(0.5, audioContext.currentTime);
  
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(800, audioContext.currentTime);
  
  oscillator.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(audioContext.destination);
  gainNode.gain.value = 0.2;
  
  const lfo = audioContext.createOscillator();
  const lfoGain = audioContext.createGain();
  lfo.frequency.setValueAtTime(0.1, audioContext.currentTime);
  lfoGain.gain.setValueAtTime(100, audioContext.currentTime);
  lfo.connect(lfoGain);
  lfoGain.connect(oscillator.frequency);
  
  oscillator.start();
  lfo.start();
  
  oscillator.gainNode = gainNode;
  return oscillator;
}

function createChakraBuffer(audioContext) {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(528, audioContext.currentTime);
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  gainNode.gain.value = 0.15;
  
  oscillator.start();
  oscillator.gainNode = gainNode;
  return oscillator;
}

function saveArt() {
  const canvas = document.getElementById('flowCanvas');
  const image = canvas.toDataURL("image/png");
  const link = document.createElement('a');
  link.download = 'soulart-fluid-art.png';
  link.href = image;
  link.click();
}
