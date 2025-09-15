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
    } else if (page === 'card') {
      main.innerHTML = `
        <h2>Receive a SoulArt Frequency</h2>
        <p>Pull a card. Receive the vibration. Feel the shift.</p>
      `;
    } else if (page === 'journal') {
      main.innerHTML = `
        <h2>Sacred Reflections Journal</h2>
        <textarea rows="10" cols="60" placeholder="What is rising in your awareness today?"></textarea><br><br>
        <button>Save Reflection</button>
      `;
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
                Upgrade to unlimited access for just <strong>$3.99/month</strong>
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
                Subscribe for $3.99/month
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

// Global variables to store emotion data
let emotionData = [];

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
              Subscribe for $3.99/month
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
        submitButton.textContent = 'Subscribe for $3.99/month';
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
    
    // Fetch usage statistics
    const usageResponse = await fetch('/api/usage/stats');
    let usageStats = { usage: 0, isSubscribed: false, history: [] };
    
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
              Upgrade to Premium - $3.99/month
            </button>` : 
            `<button onclick="manageBilling()" style="background: transparent; color: #8F5AFF; padding: 10px 20px; border: 2px solid #8F5AFF; border-radius: 8px; cursor: pointer; font-size: 14px; margin-top: 10px;">
              Manage Billing
            </button>`
          }
        </div>
      </div>
      
      <!-- Quick Actions -->
      <div style="background: white; padding: 25px; border-radius: 15px; border: 2px solid #8F5AFF20; margin: 20px 0;">
        <h3 style="color: #8F5AFF; margin-bottom: 20px;">Quick Actions</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
          <button onclick="navigate('emotion-decoder')" style="background: linear-gradient(135deg, #8F5AFF, #B785FF); color: white; padding: 15px 20px; border: none; border-radius: 10px; cursor: pointer; text-align: left;">
            <div style="font-weight: bold; margin-bottom: 5px;">🎯 Emotion Decoder</div>
            <div style="font-size: 12px; opacity: 0.9;">Release trapped emotions</div>
          </button>
          <button onclick="navigate('journal')" style="background: linear-gradient(135deg, #8ED6B7, #B0E5D1); color: white; padding: 15px 20px; border: none; border-radius: 10px; cursor: pointer; text-align: left;">
            <div style="font-weight: bold; margin-bottom: 5px;">📖 Journal</div>
            <div style="font-size: 12px; opacity: 0.9;">Track your progress</div>
          </button>
          <button onclick="navigate('card')" style="background: linear-gradient(135deg, #FF914D, #FFAD70); color: white; padding: 15px 20px; border: none; border-radius: 10px; cursor: pointer; text-align: left;">
            <div style="font-weight: bold; margin-bottom: 5px;">🌟 Soul Card</div>
            <div style="font-size: 12px; opacity: 0.9;">Discover your essence</div>
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
