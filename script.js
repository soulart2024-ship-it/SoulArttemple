function navigate(page) {
  const main = document.getElementById('main-content');
  main.style.opacity = 0;
  
  // Navigation cleanup - no chart to destroy with tile layout

  setTimeout(() => {
    if (page === 'home') {
      main.innerHTML = `
        <h2>Welcome to the SoulArt Temple</h2>
        <p>This is your sacred digital space to heal, harmonise, and embody your highest truth.</p>
        <button onclick="navigate('initiation')">Begin Your SoulArt Journey</button>
        <p style="margin-top: 40px; font-style: italic; color: var(--chakra-third-eye);">“I honoured my shadows and chose to rise.”</p>
      `;
    } else if (page === 'initiation') {
      main.innerHTML = `
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
        <h2>Self Therapy with SoulArt</h2>
        <p>Here you will move through the 7-step Harmonic Healing System.</p>
      `;
    } else if (page === 'soulart-cards') {
      showSoulArtCards();
      return; // Exit early since showSoulArtCards handles the display
    } else if (page === 'journal') {
      main.innerHTML = `
        <div class="journal-container">
          <h2>Sacred Reflections Journal</h2>
          <p class="journal-subtitle">A space for your spiritual insights and daily reflections</p>
          
          <div class="journal-actions">
            <button onclick="showJournalEntryForm()" class="btn-primary">✨ New Entry</button>
            <button onclick="downloadJournalEntries()" class="btn-secondary">📥 Download All Entries</button>
            <span class="entry-count">Loading entries...</span>
          </div>

          <div id="journal-entry-form" class="journal-form" style="display: none;">
            <h3>✍️ Create New Entry</h3>
            <input type="text" id="entry-title" placeholder="Entry title (optional)" class="journal-title-input">
            <textarea id="entry-content" rows="8" placeholder="What is rising in your awareness today? Share your thoughts, feelings, and insights..." class="journal-content-area"></textarea>
            
            <div class="journal-meta">
              <select id="entry-mood" class="journal-mood-select">
                <option value="">Select mood (optional)</option>
                <option value="grateful">🙏 Grateful</option>
                <option value="peaceful">🕊️ Peaceful</option>
                <option value="reflective">🤔 Reflective</option>
                <option value="inspired">✨ Inspired</option>
                <option value="curious">🔍 Curious</option>
                <option value="challenged">💪 Challenged</option>
                <option value="emotional">💗 Emotional</option>
                <option value="joyful">😊 Joyful</option>
              </select>
              
              <input type="text" id="entry-tags" placeholder="Tags (comma separated)" class="journal-tags-input">
            </div>
            
            <div class="journal-form-actions">
              <button onclick="saveJournalEntry()" class="btn-primary">💾 Save Entry</button>
              <button onclick="cancelJournalEntry()" class="btn-cancel">❌ Cancel</button>
            </div>
          </div>

          <div id="journal-entries-list" class="journal-entries">
            <div class="loading">Loading your sacred reflections...</div>
          </div>
        </div>
      `;
      
      loadJournalEntries();
    }else if (page === 'thankyou') {
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
      // Check authentication and usage first
      checkAllergyIdentifierAccess().then(accessInfo => {
        if (accessInfo.needsAuth) {
          main.innerHTML = `
            <h2>Allergy Identification System</h2>
            <div style="text-align: center; padding: 40px; background: linear-gradient(135deg, #EAD3FF20, #8ED6B720); border-radius: 15px; margin: 20px 0;">
              <h3 style="color: #8F5AFF; margin-bottom: 15px;">Sign In Required</h3>
              <p style="margin-bottom: 20px; color: #666;">
                Please sign in to access the Allergy Identifier and track your healing journey.
              </p>
              <button onclick="window.location.href='/api/login'" style="background: #8F5AFF; color: white; padding: 15px 30px; border: none; border-radius: 8px; cursor: pointer; font-size: 16px;">
                Sign In to Continue
              </button>
            </div>
          `;
          return;
        }

        if (accessInfo.needsSubscription) {
          main.innerHTML = `
            <h2>Allergy Identification System</h2>
            <div style="text-align: center; padding: 40px; background: linear-gradient(135deg, #FF914D20, #EAD3FF20); border-radius: 15px; margin: 20px 0;">
              <h3 style="color: #FF914D; margin-bottom: 15px;">Upgrade to Unlimited Access</h3>
              <p style="margin-bottom: 10px; color: #666;">
                You've used all 3 free allergy identification sessions.
              </p>
              <p style="margin-bottom: 20px; color: #666;">
                Upgrade to unlimited access for just <strong>£3.99/month</strong>
              </p>
              <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0; border: 2px solid #8F5AFF;">
                <h4 style="color: #8F5AFF; margin-bottom: 15px;">Unlimited Membership Includes:</h4>
                <ul style="text-align: left; color: #666; max-width: 300px; margin: 0 auto;">
                  <li>Unlimited allergy identifier sessions</li>
                  <li>Complete healing protocols</li>
                  <li>Usage analytics and progress tracking</li>
                  <li>Priority access to new features</li>
                </ul>
              </div>
              <button onclick="subscribeToUnlimited()" style="background: #8F5AFF; color: white; padding: 15px 30px; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; margin-right: 10px;">
                Subscribe for £3.99/month
              </button>
              <button onclick="navigate('home')" style="background: transparent; color: #8F5AFF; padding: 15px 30px; border: 2px solid #8F5AFF; border-radius: 8px; cursor: pointer; font-size: 16px;">
                Return Home
              </button>
            </div>
          `;
          return;
        }

        // Show the allergy identifier interface
        main.innerHTML = `
        <h2>Allergy Identification System</h2>
        <div style="background: linear-gradient(135deg, #8ED6B7, #85C9F2); padding: 15px; border-radius: 10px; margin-bottom: 20px; text-align: center;">
          <p style="color: white; margin: 0; font-weight: bold;">
            ${accessInfo.isSubscribed ? 
              'Unlimited Access Active' : 
              `${accessInfo.usageCount}/3 Free Sessions Used`
            }
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
      }).catch(error => {
        console.error('Error checking access:', error);
        main.innerHTML = `
          <h2>Allergy Identification System</h2>
          <div style="text-align: center; padding: 40px; background: #FF914D20; border-radius: 15px; margin: 20px 0;">
            <p style="color: #FF914D;">Error checking access. Please try again.</p>
            <button onclick="navigate('home')">Return Home</button>
          </div>
        `;
      });

    } else if (page === 'belief-decoder') {
      // Check authentication and usage first
      checkBeliefDecoderAccess().then(accessInfo => {
        if (accessInfo.needsAuth) {
          main.innerHTML = `
            <h2>Belief Decoder System</h2>
            <div style="text-align: center; padding: 40px; background: linear-gradient(135deg, #EAD3FF20, #8ED6B720); border-radius: 15px; margin: 20px 0;">
              <h3 style="color: #8F5AFF; margin-bottom: 15px;">Sign In Required</h3>
              <p style="margin-bottom: 20px; color: #666;">
                Please sign in to access the Belief Decoder and transform limiting beliefs.
              </p>
              <button onclick="window.location.href='/api/login'" style="background: #8F5AFF; color: white; padding: 15px 30px; border: none; border-radius: 8px; cursor: pointer; font-size: 16px;">
                Sign In to Continue
              </button>
            </div>
          `;
          return;
        }

        if (accessInfo.needsSubscription) {
          main.innerHTML = `
            <h2>Belief Decoder System</h2>
            <div style="text-align: center; padding: 40px; background: linear-gradient(135deg, #FF914D20, #EAD3FF20); border-radius: 15px; margin: 20px 0;">
              <h3 style="color: #FF914D; margin-bottom: 15px;">Upgrade to Unlimited Access</h3>
              <p style="margin-bottom: 10px; color: #666;">
                You've used all 3 free belief decoding sessions.
              </p>
              <p style="margin-bottom: 20px; color: #666;">
                Upgrade to unlimited access for just <strong>£3.99/month</strong>
              </p>
              <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0; border: 2px solid #8F5AFF;">
                <h4 style="color: #8F5AFF; margin-bottom: 15px;">Unlimited Membership Includes:</h4>
                <ul style="text-align: left; color: #666; max-width: 300px; margin: 0 auto;">
                  <li>Unlimited belief decoder sessions</li>
                  <li>Complete healing protocols</li>
                  <li>Usage analytics and progress tracking</li>
                  <li>Priority access to new features</li>
                </ul>
              </div>
              <button onclick="subscribeToUnlimited()" style="background: #8F5AFF; color: white; padding: 15px 30px; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; margin-right: 10px;">
                Subscribe for £3.99/month
              </button>
              <button onclick="navigate('home')" style="background: transparent; color: #8F5AFF; padding: 15px 30px; border: 2px solid #8F5AFF; border-radius: 8px; cursor: pointer; font-size: 16px;">
                Return Home
              </button>
            </div>
          `;
          return;
        }

        // Show the belief decoder interface
        main.innerHTML = `
        <h2>Belief Decoder System</h2>
        <div style="background: linear-gradient(135deg, #8ED6B7, #85C9F2); padding: 15px; border-radius: 10px; margin-bottom: 20px; text-align: center;">
          <p style="color: white; margin: 0; font-weight: bold;">
            ${accessInfo.isSubscribed ? 
              'Unlimited Access Active' : 
              `${accessInfo.usageCount}/3 Free Sessions Used`
            }
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
      }).catch(error => {
        console.error('Error checking access:', error);
        main.innerHTML = `
          <h2>Belief Decoder System</h2>
          <div style="text-align: center; padding: 40px; background: #FF914D20; border-radius: 15px; margin: 20px 0;">
            <p style="color: #FF914D;">Error checking access. Please try again.</p>
            <button onclick="navigate('home')">Return Home</button>
          </div>
        `;
      });

    } else if (page === 'emotion-decoder') {
      // Check authentication and usage first
      checkEmotionDecoderAccess().then(accessInfo => {
        if (accessInfo.needsAuth) {
          main.innerHTML = `
            <h2>Trapped Emotion Release Tiles</h2>
            <div style="text-align: center; padding: 40px; background: linear-gradient(135deg, #EAD3FF20, #8ED6B720); border-radius: 15px; margin: 20px 0;">
              <h3 style="color: #8F5AFF; margin-bottom: 15px;">Sign In Required</h3>
              <p style="margin-bottom: 20px; color: #666;">
                Please sign in to access the Emotion Decoder and track your healing journey.
              </p>
              <button onclick="window.location.href='/api/login'" style="background: #8F5AFF; color: white; padding: 15px 30px; border: none; border-radius: 8px; cursor: pointer; font-size: 16px;">
                Sign In to Continue
              </button>
            </div>
          `;
          return;
        }

        if (accessInfo.needsSubscription) {
          main.innerHTML = `
            <h2>Trapped Emotion Release Tiles</h2>
            <div style="text-align: center; padding: 40px; background: linear-gradient(135deg, #FF914D20, #EAD3FF20); border-radius: 15px; margin: 20px 0;">
              <h3 style="color: #FF914D; margin-bottom: 15px;">Upgrade to Unlimited Access</h3>
              <p style="margin-bottom: 10px; color: #666;">
                You've used all 3 free emotion healing sessions.
              </p>
              <p style="margin-bottom: 20px; color: #666;">
                Upgrade to unlimited access for just <strong>£3.99/month</strong>
              </p>
              <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0; border: 2px solid #8F5AFF;">
                <h4 style="color: #8F5AFF; margin-bottom: 15px;">Unlimited Membership Includes:</h4>
                <ul style="text-align: left; color: #666; max-width: 300px; margin: 0 auto;">
                  <li>Unlimited emotion decoder sessions</li>
                  <li>Complete 5-step healing process</li>
                  <li>Usage analytics and progress tracking</li>
                  <li>Priority access to new features</li>
                </ul>
              </div>
              <button onclick="subscribeToUnlimited()" style="background: #8F5AFF; color: white; padding: 15px 30px; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; margin-right: 10px;">
                Subscribe for £3.99/month
              </button>
              <button onclick="navigate('home')" style="background: transparent; color: #8F5AFF; padding: 15px 30px; border: 2px solid #8F5AFF; border-radius: 8px; cursor: pointer; font-size: 16px;">
                Return Home
              </button>
            </div>
          `;
          return;
        }

        // Normal access - show the decoder
        main.innerHTML = `
          <h2>Trapped Emotion Release Tiles</h2>
          <p>Use muscle testing (Kinesiology) to identify which trapped emotion is ready for release today.</p>
          
          <div style="display: flex; justify-content: space-between; align-items: center; margin: 20px 0; padding: 15px; background: linear-gradient(135deg, #8ED6B720, #EAD3FF20); border-radius: 10px;">
            <div style="text-align: left;">
              <h4 style="color: #8F5AFF; margin: 0;">Your Usage</h4>
              <p style="margin: 5px 0; color: #666;">${accessInfo.isSubscribed ? 'Unlimited Access' : `${accessInfo.usageCount}/3 free sessions used`}</p>
            </div>
            <div style="text-align: right;">
              ${accessInfo.isSubscribed ? 
                '<span style="background: #8ED6B7; color: white; padding: 5px 15px; border-radius: 20px; font-size: 12px; font-weight: bold;">PREMIUM</span>' :
                `<span style="color: #FF914D; font-size: 14px;">${3 - accessInfo.usageCount} sessions remaining</span>`
              }
            </div>
          </div>
          
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
      }).catch(error => {
        console.error('Error checking access:', error);
        main.innerHTML = `
          <h2>Trapped Emotion Release Tiles</h2>
          <div style="text-align: center; padding: 40px; background: #FFE6E6; border-radius: 15px; margin: 20px 0;">
            <h3 style="color: #FF6B6B; margin-bottom: 15px;">Connection Error</h3>
            <p style="margin-bottom: 20px; color: #666;">
              Unable to connect to the server. Please try again.
            </p>
            <button onclick="navigate('home')" style="background: #8F5AFF; color: white; padding: 15px 30px; border: none; border-radius: 8px; cursor: pointer; font-size: 16px;">
              Return Home
            </button>
          </div>
        `;
      });
    } else if (page === 'membership') {
      // Check authentication and load membership dashboard
      checkAuthAndLoadMembership();
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
      <h3 style="color: #8F5AFF; text-align: center; margin-bottom: 20px;">🌿 Allergy Healing Protocol</h3>
      
      <div style="background: white; padding: 25px; border-radius: 12px; border-left: 5px solid #8ED6B7; margin-bottom: 20px;">
        <h4 style="color: #8ED6B7; margin-bottom: 15px;">✨ Identified Allergen</h4>
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
        <h4 style="color: #FF914D; margin-bottom: 15px;">🎯 5-Step Healing Process</h4>
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
        <h4 style="color: #8F5AFF; margin-bottom: 15px;">💫 Additional Healing Support</h4>
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
      <h3 style="color: #8F5AFF; text-align: center; margin-bottom: 20px;">🌟 Belief Transformation Protocol</h3>
      
      <div style="background: white; padding: 25px; border-radius: 12px; border-left: 5px solid #8ED6B7; margin-bottom: 20px;">
        <h4 style="color: #8ED6B7; margin-bottom: 15px;">🎯 Identified Limiting Belief</h4>
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
        <h4 style="color: #FF914D; margin-bottom: 15px;">✨ 5-Step Belief Transformation</h4>
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
        <h4 style="color: #8F5AFF; margin-bottom: 15px;">💫 Additional Transformation Support</h4>
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
  
  healingDiv.innerHTML = `
    <div style="background: linear-gradient(135deg, #8ED6B7, #EAD3FF); 
                padding: 40px; border-radius: 15px; text-align: center;">
      <h2 style="color: white; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
        Healing Complete!
      </h2>
      <p style="font-size: 18px; color: white; margin: 20px 0;">
        You have successfully released your trapped emotion and filled the space with high vibration energy.
      </p>
      <p style="color: white; font-style: italic;">
        Remember to work with your chosen colors and continue your shadow work practice.
      </p>
      <button onclick="returnToChart()" style="background: white; color: #8F5AFF; 
                     padding: 15px 30px; border: none; border-radius: 8px; 
                     cursor: pointer; font-size: 16px; margin-top: 20px; font-weight: bold;">
        Return to Emotion Tiles
      </button>
    </div>
  `;
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

// Function to check emotion decoder access and usage
async function checkEmotionDecoderAccess() {
  try {
    const response = await fetch('/api/emotion-decoder/can-use');
    
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

// Function to record emotion decoder usage
async function recordEmotionDecoderUsage(emotion) {
  try {
    const response = await fetch('/api/emotion-decoder/use', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ emotion })
    });
    
    if (response.status === 403) {
      const data = await response.json();
      if (data.needsSubscription) {
        // Redirect to subscription page
        navigate('emotion-decoder');
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

// Function to check allergy identifier access and usage
async function checkAllergyIdentifierAccess() {
  try {
    const response = await fetch('/api/allergy-identifier/can-use');
    
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
    const response = await fetch('/api/allergy-identifier/use', {
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
    const response = await fetch('/api/belief-decoder/can-use');
    
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
    const response = await fetch('/api/belief-decoder/use', {
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

// Function to subscribe to unlimited access
async function subscribeToUnlimited() {
  try {
    // Show loading state
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = 'Processing...';
    button.disabled = true;
    
    const response = await fetch('/api/get-or-create-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to create subscription');
    }
    
    const { clientSecret, subscriptionId } = await response.json();
    
    if (clientSecret) {
      // Initialize Stripe and handle payment
      if (typeof Stripe === 'undefined') {
        // Load Stripe if not already loaded
        const script = document.createElement('script');
        script.src = 'https://js.stripe.com/v3/';
        script.onload = () => initializeStripePayment(clientSecret);
        document.head.appendChild(script);
      } else {
        initializeStripePayment(clientSecret);
      }
    } else {
      // Subscription already active
      alert('Your subscription is already active!');
      navigate('emotion-decoder');
    }
  } catch (error) {
    console.error('Subscription error:', error);
    alert('Failed to process subscription. Please try again.');
    
    // Reset button
    const button = event.target;
    button.textContent = 'Subscribe for $3.99/month';
    button.disabled = false;
  }
}

// Function to initialize Stripe payment
async function initializeStripePayment(clientSecret) {
  try {
    // Load Stripe.js if not already loaded
    if (typeof Stripe === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://js.stripe.com/v3/';
      document.head.appendChild(script);
      
      // Wait for Stripe to load
      await new Promise((resolve) => {
        script.onload = resolve;
      });
    }

    // Initialize Stripe - use your actual public key here
    const stripe = Stripe('pk_test_51234...'); // Replace with actual public key
    
    // Create a simple payment form
    const paymentContainer = document.createElement('div');
    paymentContainer.innerHTML = `
      <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; align-items: center; justify-content: center;">
        <div style="background: white; padding: 30px; border-radius: 15px; max-width: 400px; width: 90%;">
          <h3 style="color: #8F5AFF; margin-bottom: 20px; text-align: center;">Complete Your Subscription</h3>
          <div id="card-element" style="margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 8px;">
            <!-- Stripe Elements will create form elements here -->
          </div>
          <div style="text-align: center; margin-top: 20px;">
            <button id="submit-payment" style="background: #8F5AFF; color: white; padding: 15px 30px; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; margin-right: 10px;">
              Subscribe for £3.99/month
            </button>
            <button onclick="this.closest('div[style*=fixed]').remove()" style="background: transparent; color: #8F5AFF; padding: 15px 30px; border: 2px solid #8F5AFF; border-radius: 8px; cursor: pointer; font-size: 16px;">
              Cancel
            </button>
          </div>
          <div id="card-errors" style="color: red; margin-top: 10px; text-align: center;"></div>
        </div>
      </div>
    `;
    
    document.body.appendChild(paymentContainer);
    
    // Create card element
    const elements = stripe.elements();
    const cardElement = elements.create('card', {
      style: {
        base: {
          fontSize: '16px',
          color: '#424770',
          '::placeholder': {
            color: '#aab7c4',
          },
        },
      },
    });
    
    cardElement.mount('#card-element');
    
    // Handle form submission
    const submitButton = paymentContainer.querySelector('#submit-payment');
    const cardErrors = paymentContainer.querySelector('#card-errors');
    
    submitButton.addEventListener('click', async (event) => {
      event.preventDefault();
      
      submitButton.disabled = true;
      submitButton.textContent = 'Processing...';
      
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        }
      });
      
      if (result.error) {
        cardErrors.textContent = result.error.message;
        submitButton.disabled = false;
        submitButton.textContent = 'Subscribe for £3.99/month';
      } else {
        // Payment succeeded
        paymentContainer.remove();
        alert('Welcome to unlimited access! Your subscription is now active.');
        navigate('emotion-decoder');
      }
    });
    
  } catch (error) {
    console.error('Stripe initialization error:', error);
    alert('Payment system unavailable. Please try again later.');
  }
}

// Function to check authentication and load membership dashboard
async function checkAuthAndLoadMembership() {
  const main = document.querySelector('main');
  
  try {
    const response = await fetch('/api/auth/user');
    
    if (response.status === 401) {
      // Not authenticated
      main.innerHTML = `
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
    const usageResponse = await fetch('/api/usage/stats');
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
            <span style="background: ${usageStats.isSubscribed ? '#8ED6B7' : '#FF914D'}; color: white; padding: 3px 10px; border-radius: 10px; font-size: 12px; font-weight: bold;">
              ${usageStats.isSubscribed ? 'PREMIUM MEMBER' : 'FREE MEMBER'}
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
          ${usageStats.isSubscribed ? 
            '<div style="color: #8ED6B7; font-weight: bold;">✓ Unlimited Access Active</div>' :
            `<div style="margin-bottom: 15px;">
              <strong>Free Sessions:</strong> ${Math.max(0, 3 - usageStats.usage)}/3 remaining
            </div>`
          }
          ${!usageStats.isSubscribed ? 
            `<button onclick="subscribeToUnlimited()" style="background: #8F5AFF; color: white; padding: 12px 20px; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; margin-top: 10px;">
              Upgrade to Premium - £3.99/month
            </button>` : 
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
            <div style="font-weight: bold; margin-bottom: 5px;">🎯 Emotion Decoder</div>
            <div style="font-size: 12px; opacity: 0.9;">Release trapped emotions</div>
            <div style="font-size: 11px; opacity: 0.8; margin-top: 5px;">${usageStats.emotionUsage || 0} sessions completed</div>
          </button>
          <button onclick="navigate('allergy-identifier')" style="background: linear-gradient(135deg, #8ED6B7, #B0E5D1); color: white; padding: 15px 20px; border: none; border-radius: 10px; cursor: pointer; text-align: left;">
            <div style="font-weight: bold; margin-bottom: 5px;">🌿 Allergy Identifier</div>
            <div style="font-size: 12px; opacity: 0.9;">Identify & heal allergens</div>
            <div style="font-size: 11px; opacity: 0.8; margin-top: 5px;">${usageStats.allergyUsage || 0} sessions completed</div>
          </button>
          <button onclick="navigate('belief-decoder')" style="background: linear-gradient(135deg, #FF914D, #FFAD70); color: white; padding: 15px 20px; border: none; border-radius: 10px; cursor: pointer; text-align: left;">
            <div style="font-weight: bold; margin-bottom: 5px;">⭐ Belief Decoder</div>
            <div style="font-size: 12px; opacity: 0.9;">Transform limiting beliefs</div>
            <div style="font-size: 11px; opacity: 0.8; margin-top: 5px;">${usageStats.beliefUsage || 0} sessions completed</div>
          </button>
          <button onclick="navigate('journal')" style="background: linear-gradient(135deg, #85C9F2, #B3D9FF); color: white; padding: 15px 20px; border: none; border-radius: 10px; cursor: pointer; text-align: left;">
            <div style="font-weight: bold; margin-bottom: 5px;">📖 Journal</div>
            <div style="font-size: 12px; opacity: 0.9;">Track your progress</div>
            <div style="font-size: 11px; opacity: 0.8; margin-top: 5px;">Sacred reflections</div>
          </button>
          <button onclick="navigate('card')" style="background: linear-gradient(135deg, #EAD3FF, #F0E5FF); color: #8F5AFF; padding: 15px 20px; border: none; border-radius: 10px; cursor: pointer; text-align: left;">
            <div style="font-weight: bold; margin-bottom: 5px;">🌟 Soul Card</div>
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
      <h2>Membership Dashboard</h2>
      <div style="text-align: center; padding: 40px; background: #FFE6E6; border-radius: 15px; margin: 20px 0;">
        <h3 style="color: #FF6B6B; margin-bottom: 15px;">Connection Error</h3>
        <p style="margin-bottom: 20px; color: #666;">
          Unable to load your membership dashboard. Please try again.
        </p>
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
    const response = await fetch('/api/journal/entries');
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
        <p>📱 Please sign in to access your journal entries</p>
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
        <div class="empty-journal-icon">📖</div>
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
            <button onclick="editJournalEntry('${entry.id}')" class="btn-edit" title="Edit">✏️</button>
            <button onclick="deleteJournalEntry('${entry.id}')" class="btn-delete" title="Delete">🗑️</button>
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

    const response = await fetch(url, {
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
      showSuccessMessage(currentEditingEntry ? 'Entry updated successfully! ✨' : 'Entry saved successfully! ✨');
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
    const response = await fetch(`/api/journal/entries/${entryId}`);
    const entry = await response.json();
    
    if (response.ok) {
      currentEditingEntry = entryId;
      document.getElementById('entry-title').value = entry.title || '';
      document.getElementById('entry-content').value = entry.content;
      document.getElementById('entry-mood').value = entry.mood || '';
      document.getElementById('entry-tags').value = entry.tags || '';
      showJournalEntryForm();
      document.getElementById('journal-entry-form').querySelector('h3').textContent = '✏️ Edit Entry';
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
    const response = await fetch(`/api/journal/entries/${entryId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      await loadJournalEntries();
      showSuccessMessage('Entry deleted successfully! 🗑️');
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
        <button onclick="closeJournalModal()" class="btn-close">❌</button>
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
        <button onclick="editJournalEntry('${entry.id}'); closeJournalModal();" class="btn-primary">✏️ Edit</button>
        <button onclick="deleteJournalEntry('${entry.id}'); closeJournalModal();" class="btn-delete">🗑️ Delete</button>
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
    const response = await fetch('/api/journal/download');
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
      
      showSuccessMessage('Journal downloaded successfully! 📥');
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
  const moodEmojis = {
    grateful: '🙏',
    peaceful: '🕊️',
    reflective: '🤔',
    inspired: '✨',
    curious: '🔍',
    challenged: '💪',
    emotional: '💗',
    joyful: '😊'
  };
  return moodEmojis[mood] || '💭';
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
// SOULART CARDS - 44 CARD SPIRITUAL DECK
// ========================================

const soulArtCards = [
  {
    id: 1,
    title: "Divine Connection",
    message: "You are deeply connected to the infinite source of love and wisdom within you.",
    guidance: "Take time today to quiet your mind and listen to your inner voice. Trust the guidance that emerges.",
    affirmation: "I am divinely guided and supported in all that I do.",
    element: "Spirit",
    color: "#C9A24F"
  },
  {
    id: 2,
    title: "Healing Waters",
    message: "Emotional healing flows through you like a gentle, cleansing stream.",
    guidance: "Allow yourself to feel deeply. Your emotions are messengers guiding you toward wholeness.",
    affirmation: "I embrace my emotions as sacred teachers on my healing journey.",
    element: "Water",
    color: "#8ED6B7"
  },
  {
    id: 3,
    title: "Sacred Boundaries",
    message: "Your energy is precious. Honor it by creating healthy boundaries with love.",
    guidance: "Say no to what drains you and yes to what nourishes your soul.",
    affirmation: "I set boundaries that honor my energy and support my highest good.",
    element: "Earth",
    color: "#E9D8A6"
  },
  {
    id: 4,
    title: "Inner Fire",
    message: "Your passion and creative life force are ready to ignite and inspire.",
    guidance: "Don't dim your light for others. Let your authentic self shine brightly.",
    affirmation: "I embrace my inner fire and let my authentic light shine.",
    element: "Fire",
    color: "#F76C6C"
  },
  {
    id: 5,
    title: "Breath of Freedom",
    message: "Release what no longer serves you and breathe in fresh possibilities.",
    guidance: "Take three deep breaths and let go of old patterns that limit your growth.",
    affirmation: "I release the old with gratitude and welcome new possibilities.",
    element: "Air",
    color: "#85C9F2"
  },
  {
    id: 6,
    title: "Heart Wisdom",
    message: "Your heart holds ancient wisdom. Trust its guidance above all else.",
    guidance: "When faced with decisions, place your hand on your heart and listen.",
    affirmation: "I trust the wisdom of my heart to guide me toward love.",
    element: "Love",
    color: "#FF9AAF"
  },
  {
    id: 7,
    title: "Ancestral Healing",
    message: "You are healing patterns for yourself and generations before and after you.",
    guidance: "Honor your lineage by breaking cycles that no longer serve your family line.",
    affirmation: "I heal ancestral patterns with love and create positive change for all generations.",
    element: "Earth",
    color: "#8B7355"
  },
  {
    id: 8,
    title: "Quantum Leap",
    message: "You are ready to make a significant shift in consciousness and reality.",
    guidance: "Trust that you can leap into a new version of yourself with grace and ease.",
    affirmation: "I embrace transformation and step boldly into my highest potential.",
    element: "Spirit",
    color: "#B19CD9"
  },
  {
    id: 9,
    title: "Sacred Pause",
    message: "Sometimes the most powerful action is to pause, breathe, and simply be.",
    guidance: "Give yourself permission to rest. Your being is as valuable as your doing.",
    affirmation: "I honor my need for rest and trust in divine timing.",
    element: "Air",
    color: "#D4B5A0"
  },
  {
    id: 10,
    title: "Creative Flow",
    message: "You are a channel for divine creativity. Let inspiration move through you.",
    guidance: "Create without judgment. Let your hands, voice, or movement express your soul.",
    affirmation: "I am a clear channel for divine creativity and inspiration.",
    element: "Water",
    color: "#FFB347"
  },
  {
    id: 11,
    title: "Truth Speaker",
    message: "Your authentic voice is needed in this world. Speak your truth with courage.",
    guidance: "Honor your truth, even if your voice shakes. The world needs your unique message.",
    affirmation: "I speak my truth with love, courage, and authenticity.",
    element: "Air",
    color: "#4ECDC4"
  },
  {
    id: 12,
    title: "Shadow Integration",
    message: "Embrace all parts of yourself. Your shadow holds gifts waiting to be reclaimed.",
    guidance: "Look with compassion at what you've rejected in yourself. Find the gift within.",
    affirmation: "I embrace all aspects of myself with love and understanding.",
    element: "Spirit",
    color: "#6B6B6B"
  },
  {
    id: 13,
    title: "Divine Feminine",
    message: "The nurturing, intuitive, and receptive aspects of your being are awakening.",
    guidance: "Honor your intuition, embrace your sensitivity, and trust your inner knowing.",
    affirmation: "I honor and embody the divine feminine energy within me.",
    element: "Water",
    color: "#DDA0DD"
  },
  {
    id: 14,
    title: "Divine Masculine",
    message: "Your focused, protective, and action-oriented energy is ready to manifest.",
    guidance: "Channel your inner strength to protect what you love and create what you desire.",
    affirmation: "I embody healthy masculine energy in service of love and creation.",
    element: "Fire",
    color: "#CD853F"
  },
  {
    id: 15,
    title: "Soul Family",
    message: "You are being called into deeper connection with your spiritual family.",
    guidance: "Trust the magnetic pull toward certain people. Soul family recognizes soul family.",
    affirmation: "I attract and recognize my soul family with ease and joy.",
    element: "Love",
    color: "#98D8C8"
  },
  {
    id: 16,
    title: "Mystic Vision",
    message: "Your third eye is opening. Trust the visions and insights you receive.",
    guidance: "Pay attention to symbols, synchronicities, and the messages behind your dreams.",
    affirmation: "I trust my inner vision and the spiritual insights I receive.",
    element: "Spirit",
    color: "#9370DB"
  },
  {
    id: 17,
    title: "Earthly Angel",
    message: "You are an angel in human form, here to spread light and healing.",
    guidance: "Remember your divine nature while honoring your human experience.",
    affirmation: "I am a divine being having a human experience, here to serve love.",
    element: "Spirit",
    color: "#F0F8FF"
  },
  {
    id: 18,
    title: "Phoenix Rising",
    message: "You are rising from the ashes of your old self into magnificent transformation.",
    guidance: "Trust the process of death and rebirth happening in your life right now.",
    affirmation: "I rise from every challenge stronger, wiser, and more radiant.",
    element: "Fire",
    color: "#FF6347"
  },
  {
    id: 19,
    title: "Ocean Depths",
    message: "Dive deep into your subconscious. Treasures await in your inner depths.",
    guidance: "What you seek is not on the surface. Go deeper into meditation and self-reflection.",
    affirmation: "I fearlessly explore the depths of my being and discover hidden treasures.",
    element: "Water",
    color: "#006994"
  },
  {
    id: 20,
    title: "Mountain Strength",
    message: "You possess an unshakeable inner strength that cannot be moved by outer storms.",
    guidance: "Ground yourself in your center. You are more resilient than you realize.",
    affirmation: "I am grounded, strong, and unshakeable in my truth.",
    element: "Earth",
    color: "#8B4513"
  },
  {
    id: 21,
    title: "Star Seed",
    message: "You carry the wisdom of the stars and are here to help Earth ascend.",
    guidance: "Remember your cosmic origins and the larger purpose of your incarnation here.",
    affirmation: "I remember my stellar origins and fulfill my cosmic mission on Earth.",
    element: "Spirit",
    color: "#191970"
  },
  {
    id: 22,
    title: "Rainbow Bridge",
    message: "You are a bridge between worlds, helping others cross from fear to love.",
    guidance: "Your role as a healer and guide is more important than you know.",
    affirmation: "I am a bridge of light, helping others move from darkness to illumination.",
    element: "Spirit",
    color: "#FF69B4"
  },
  {
    id: 23,
    title: "Golden Hour",
    message: "This is your time to shine. Everything you've learned has prepared you for now.",
    guidance: "Step fully into your power. The world is ready for what you have to offer.",
    affirmation: "This is my time to shine and share my gifts with the world.",
    element: "Fire",
    color: "#FFD700"
  },
  {
    id: 24,
    title: "Sacred Solitude",
    message: "In solitude, you remember who you truly are beyond all roles and relationships.",
    guidance: "Spend time alone with yourself. In the silence, your authentic self emerges.",
    affirmation: "I cherish sacred time alone and connect deeply with my authentic self.",
    element: "Spirit",
    color: "#E6E6FA"
  },
  {
    id: 25,
    title: "Abundant Harvest",
    message: "Your seeds of intention are ready to bloom into beautiful manifestations.",
    guidance: "Celebrate what you've already created while staying open to receiving more.",
    affirmation: "I celebrate my creations and remain open to abundant blessings.",
    element: "Earth",
    color: "#32CD32"
  },
  {
    id: 26,
    title: "Mirror of Truth",
    message: "Others are reflecting aspects of yourself back to you. What do you see?",
    guidance: "What triggers you in others points to unhealed aspects within yourself.",
    affirmation: "I see others as mirrors and use their reflections for my growth.",
    element: "Spirit",
    color: "#C0C0C0"
  },
  {
    id: 27,
    title: "Violet Flame",
    message: "The violet flame of transformation is burning away what no longer serves you.",
    guidance: "Visualize violet light surrounding you, transmuting all lower energies.",
    affirmation: "I call upon the violet flame to transform all that is ready to be released.",
    element: "Fire",
    color: "#8A2BE2"
  },
  {
    id: 28,
    title: "Crystal Clear",
    message: "Your intuition is crystal clear. Trust the first insights that come to you.",
    guidance: "Don't overthink. Your first instinct usually contains the most truth.",
    affirmation: "My intuition is clear and I trust the first guidance I receive.",
    element: "Spirit",
    color: "#E0FFFF"
  },
  {
    id: 29,
    title: "Thunder Medicine",
    message: "Powerful changes are thundering toward you. Prepare for a breakthrough.",
    guidance: "Don't fear the storm. It's clearing the path for something magnificent.",
    affirmation: "I welcome powerful changes and trust they bring me blessings.",
    element: "Air",
    color: "#4B0082"
  },
  {
    id: 30,
    title: "Flower Power",
    message: "You are blooming into the fullest expression of your beautiful soul.",
    guidance: "Like a flower, you don't force your blooming. Trust your natural timing.",
    affirmation: "I bloom naturally and beautifully in perfect divine timing.",
    element: "Earth",
    color: "#FFB6C1"
  },
  {
    id: 31,
    title: "Cosmic Dance",
    message: "You are dancing with the universe in perfect synchronicity.",
    guidance: "Move with life's rhythms rather than fighting against them.",
    affirmation: "I dance with life's rhythms and find joy in the cosmic flow.",
    element: "Spirit",
    color: "#9932CC"
  },
  {
    id: 32,
    title: "Ancient Wisdom",
    message: "You carry ancient wisdom in your soul. Trust what you already know.",
    guidance: "The answers you seek are already within you. Get quiet and remember.",
    affirmation: "I trust the ancient wisdom that lives within my soul.",
    element: "Spirit",
    color: "#800000"
  },
  {
    id: 33,
    title: "Love Frequency",
    message: "You are being attuned to the highest frequency of unconditional love.",
    guidance: "Choose love in every situation, especially when it feels difficult.",
    affirmation: "I vibrate at the frequency of pure, unconditional love.",
    element: "Love",
    color: "#FF1493"
  },
  {
    id: 34,
    title: "Sacred Geometry",
    message: "Your life is aligning with divine patterns and sacred designs.",
    guidance: "Trust that there's a perfect pattern unfolding, even when you can't see it.",
    affirmation: "My life unfolds according to divine patterns and sacred geometry.",
    element: "Spirit",
    color: "#00CED1"
  },
  {
    id: 35,
    title: "Midnight Sun",
    message: "Even in your darkest moments, your inner light continues to shine.",
    guidance: "Remember your light, especially when you feel lost in darkness.",
    affirmation: "My inner light shines brightly, illuminating even the darkest moments.",
    element: "Fire",
    color: "#FFE4B5"
  },
  {
    id: 36,
    title: "Spirit Animal",
    message: "Your spirit animal is calling you to embody its sacred medicine.",
    guidance: "What animal have you been drawn to lately? What qualities does it embody?",
    affirmation: "I embody the sacred medicine of my spirit animal guides.",
    element: "Earth",
    color: "#D2691E"
  },
  {
    id: 37,
    title: "Time Weaver",
    message: "You have the power to heal past wounds and create a luminous future.",
    guidance: "Send love to your past self and hold a vision of your highest future.",
    affirmation: "I heal my past and weave a beautiful future with threads of love.",
    element: "Spirit",
    color: "#6495ED"
  },
  {
    id: 38,
    title: "Temple Keeper",
    message: "Your body is a sacred temple. Honor it with love and reverence.",
    guidance: "Treat your body as the sacred vessel that houses your beautiful soul.",
    affirmation: "I honor my body as a sacred temple and care for it with love.",
    element: "Earth",
    color: "#DEB887"
  },
  {
    id: 39,
    title: "Sound Healing",
    message: "Your voice carries healing frequencies. Use it to heal yourself and others.",
    guidance: "Hum, sing, or tone. Let healing sounds flow through you without judgment.",
    affirmation: "My voice carries healing frequencies that benefit all who hear it.",
    element: "Air",
    color: "#40E0D0"
  },
  {
    id: 40,
    title: "Energy Alchemist",
    message: "You have the power to transform any energy into love through your consciousness.",
    guidance: "Practice transmuting challenging energies by breathing love into them.",
    affirmation: "I am an alchemist, transforming all energies into love and light.",
    element: "Spirit",
    color: "#9400D3"
  },
  {
    id: 41,
    title: "Moon Cycles",
    message: "Align with lunar rhythms to amplify your manifestation and release work.",
    guidance: "New moon for planting seeds, full moon for celebrating and releasing.",
    affirmation: "I align with natural cycles and honor the wisdom of the moon.",
    element: "Water",
    color: "#C0C0C0"
  },
  {
    id: 42,
    title: "Sacred Union",
    message: "The divine masculine and feminine within you are coming into perfect balance.",
    guidance: "Honor both your action-oriented and receptive qualities equally.",
    affirmation: "I embody the sacred union of divine masculine and feminine energy.",
    element: "Spirit",
    color: "#DA70D6"
  },
  {
    id: 43,
    title: "Crystal Light",
    message: "You are a crystal being, here to anchor higher frequencies on Earth.",
    guidance: "Imagine your entire being made of light. You are transmitting love constantly.",
    affirmation: "I am a crystal being of light, anchoring higher frequencies on Earth.",
    element: "Spirit",
    color: "#F8F8FF"
  },
  {
    id: 44,
    title: "Infinite Possibility",
    message: "You exist in a field of infinite possibility. Anything is possible for you.",
    guidance: "Release limiting beliefs and open to the miraculous potential of your life.",
    affirmation: "I live in infinite possibility and welcome miracles into my life.",
    element: "Spirit",
    color: "#FFFACD"
  }
];

// Current selected card(s) for display
let selectedCards = [];
let cardSpreadActive = false;

// ========================================
// SOULART CARDS FUNCTIONS
// ========================================

function showSoulArtCards() {
  hideAllSections();
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
      <h2>SoulArt Oracle Cards</h2>
      <p class="cards-subtitle">
        Connect with your inner wisdom through this sacred 44-card deck. 
        Let your intuition guide you to the messages your soul needs to hear today.
      </p>
      
      <div class="card-reading-options">
        <button class="btn-primary" onclick="drawSingleCard()">Draw Single Card</button>
        <button class="btn-secondary" onclick="drawThreeCards()">Three Card Spread</button>
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
              <div class="card-symbol">✨</div>
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
