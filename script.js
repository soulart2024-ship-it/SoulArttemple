function navigate(page) {
  const main = document.getElementById('main-content');
  main.style.opacity = 0;
  
  // Clean up any existing chart before navigation
  if (emotionChart) {
    emotionChart.destroy();
    emotionChart = null;
  }

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
        <p>You are beginning with: <strong>Be Courage</strong> 🔥</p>
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
        <h2>Thank You, Beloved ✨</h2>
        <p>Your sacred message has been received by Soraya.</p>
        <p>
          Within 72 hours, you’ll receive a personalized 
          <strong>Soul Frequency Snapshot</strong> PDF in your inbox.  
          This includes:
        </p>
        <ul>
          <li>🌟 Your unique vibrational frequency</li>
          <li>💬 Affirmation & soul guidance note</li>
          <li>🎨 A chakra colour or focus</li>
          <li>🖋️ Your next SoulArt step</li>
          <li>📜 A printable Frequency Certificate</li>
        </ul>
        <p style="margin-top: 20px;">
          This is your beginning, not your ending.  
          A sacred invitation to the 7-Step SoulArt Journey will follow soon after.
        </p>
        <button onclick="navigate('home')">Return to Home</button>
      `;
    } else if (page === 'emotion-decoder') {
      main.innerHTML = `
        <h2>🔮 Trapped Emotion Release Chart</h2>
        <p>Identify and release trapped emotions using the sacred SoulArt healing process.</p>
        
        <div style="margin: 20px 0;">
          <input type="text" id="emotion-search" placeholder="Search for a trapped emotion..." 
                 style="padding: 12px; width: 350px; border-radius: 8px; border: 2px solid #8F5AFF;" 
                 onkeyup="searchEmotions()">
        </div>
        
        <div style="margin: 20px 0; background: linear-gradient(135deg, #fef9f4, #EAD3FF20); 
                    padding: 20px; border-radius: 12px; border: 2px solid #8F5AFF;">
          <h3 style="margin: 0 0 15px 0; text-align: center; color: #8F5AFF;">
            🌟 Trapped Emotion Identification Chart 🌟
          </h3>
          <p style="text-align: center; font-size: 0.9em; margin-bottom: 15px; color: #8F5AFF;">
            Click on any trapped emotion to begin the healing process
          </p>
          <canvas id="emotionChart" style="max-height: 450px; margin: 0 auto; display: block;"></canvas>
        </div>
        
        <div id="emotion-results" style="margin-top: 20px;">
          <div style="text-align: center; color: #8F5AFF; font-style: italic;">
            Click on a trapped emotion above to begin your healing journey
          </div>
        </div>
        
        <div id="healing-process" style="margin-top: 30px; display: none;">
          <!-- Healing process will be inserted here -->
        </div>
      `;
      loadEmotionData();
    }

    main.style.opacity = 1;
  }, 200);
}

// Global variables to store emotion data and chart
let emotionData = [];
let emotionChart = null;

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
    
    // After loading data, render the chart
    setTimeout(renderEmotionChart, 100);
    
  } catch (error) {
    console.error('Error loading emotion data:', error);
  }
}

// Function to search emotions
function searchEmotions() {
  const searchTerm = document.getElementById('emotion-search').value.toLowerCase();
  const resultsDiv = document.getElementById('emotion-results');
  
  if (!searchTerm) {
    resultsDiv.innerHTML = `
      <div style="text-align: center; color: #8F5AFF; font-style: italic;">
        Click on a trapped emotion above to begin your healing journey
      </div>
    `;
    return;
  }
  
  // Find matching emotions
  const matches = emotionData.filter(emotion => 
    emotion.emotion.toLowerCase().includes(searchTerm)
  );
  
  if (matches.length === 0) {
    const safeSearchTerm = document.createElement('div');
    safeSearchTerm.textContent = searchTerm;
    resultsDiv.innerHTML = `
      <div style="text-align: center; color: #FF914D;">
        No trapped emotions found for "${safeSearchTerm.innerHTML}". Try searching for emotions like "shame", "fear", or "grief".
      </div>
    `;
    return;
  }
  
  // Display search results with healing buttons
  let resultsHTML = '';
  matches.forEach(emotion => {
    const primaryChakra = emotion.chakraBodyArea.split('–')[0].trim();
    const chakraKey = CHAKRA_CONFIG.order.find(chakra => primaryChakra.includes(chakra)) || 'Heart';
    const chakraColor = CHAKRA_CONFIG.colors[chakraKey];
    
    resultsHTML += `
      <div style="background: linear-gradient(135deg, ${chakraColor}20, transparent); 
                  border-left: 4px solid ${chakraColor}; 
                  margin: 15px 0; padding: 20px; border-radius: 8px; cursor: pointer;"
           onclick="startHealingProcess({
             emotion: '${emotion.emotion}',
             frequency: ${emotion.frequency},
             chakraBodyArea: '${emotion.chakraBodyArea}',
             soulArtColor: '${emotion.soulArtColor}',
             additionalSupport: '${emotion.additionalSupport}'
           })">
        <h3 style="margin: 0 0 10px 0; color: #8F5AFF;">🔮 ${emotion.emotion}</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
          <div><strong>Frequency:</strong> ${emotion.frequency} (Hawkins Scale)</div>
          <div><strong>Location:</strong> ${emotion.chakraBodyArea}</div>
          <div><strong>SoulArt Color:</strong> ${emotion.soulArtColor}</div>
        </div>
        <div style="margin-top: 15px; padding: 10px; background: #EAD3FF30; border-radius: 6px;">
          <strong>🌿 Additional Support:</strong> ${emotion.additionalSupport}
        </div>
        <div style="margin-top: 10px; text-align: center; color: #8F5AFF; font-weight: bold;">
          ✨ Click to Begin Healing Process ✨
        </div>
      </div>
    `;
  });
  
  resultsDiv.innerHTML = resultsHTML;
}

// Function to render the emotion chart
function renderEmotionChart() {
  const canvas = document.getElementById('emotionChart');
  if (!canvas || emotionData.length === 0) return;
  
  // Destroy existing chart if it exists
  if (emotionChart) {
    emotionChart.destroy();
  }
  
  // Prepare data for chart - group by row/frequency level
  const rowGroups = [...new Set(emotionData.map(e => e.row))];
  const datasets = rowGroups.map((rowGroup, groupIndex) => {
    const rowEmotions = emotionData.filter(emotion => emotion.row === rowGroup);
    
    // Get chakra from first emotion in group for coloring
    const primaryChakra = rowEmotions[0]?.chakraBodyArea.split('–')[0].trim() || 'Heart';
    const chakraKey = CHAKRA_CONFIG.order.find(chakra => primaryChakra.includes(chakra)) || 'Heart';
    
    return {
      label: `${rowGroup} (${primaryChakra})`,
      data: rowEmotions.map((emotion, index) => ({
        x: emotion.frequency,
        y: groupIndex + (index * 0.15) - (rowEmotions.length * 0.075), // Spread emotions in group
        emotion: emotion.emotion,
        chakraBodyArea: emotion.chakraBodyArea,
        soulArtColor: emotion.soulArtColor,
        additionalSupport: emotion.additionalSupport,
        frequency: emotion.frequency
      })),
      backgroundColor: CHAKRA_CONFIG.colors[chakraKey] + '80',
      borderColor: CHAKRA_CONFIG.colors[chakraKey],
      borderWidth: 2,
      pointRadius: 10,
      pointHoverRadius: 14
    };
  });
  
  const ctx = canvas.getContext('2d');
  emotionChart = new Chart(ctx, {
    type: 'scatter',
    data: { datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: false
        },
        legend: {
          display: true,
          position: 'right',
          labels: {
            usePointStyle: true,
            font: { size: 12 }
          }
        },
        tooltip: {
          callbacks: {
            title: function(tooltipItems) {
              const point = tooltipItems[0];
              return `Trapped Emotion: ${point.raw.emotion}`;
            },
            label: function(tooltipItem) {
              const point = tooltipItem.raw;
              return [
                `Frequency: ${point.frequency} (Hawkins Scale)`,
                `Location: ${point.chakraBodyArea}`,
                `SoulArt Color: ${point.soulArtColor}`
              ];
            }
          }
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Frequency Level',
            font: { size: 14, weight: 'bold' }
          },
          min: 0,
          max: 200
        },
        y: {
          title: {
            display: true,
            text: 'Emotion Groups',
            font: { size: 14, weight: 'bold' }
          },
          ticks: {
            callback: function(value, index) {
              const rowGroups = [...new Set(emotionData.map(e => e.row))];
              return rowGroups[Math.round(value)] || '';
            }
          }
        }
      },
      onClick: function(event, elements) {
        if (elements.length > 0) {
          const {datasetIndex, index} = elements[0];
          const rawData = emotionChart.data.datasets[datasetIndex].data[index];
          
          // Start the healing process for this trapped emotion
          startHealingProcess(rawData);
        }
      }
    }
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
        🔮 Trapped Emotion Release Process 🔮
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
        <h3 style="color: #8F5AFF;">Step 1: Set Your Intention 🎯</h3>
        <p>Place your hand on your heart and speak this intention aloud:</p>
        <div style="background: #EAD3FF20; padding: 15px; border-radius: 8px; font-style: italic; 
                    text-align: center; margin: 15px 0;">
          "I am ready to release the trapped emotion of <strong>${emotionData.emotion}</strong> 
          from my ${emotionData.chakraBodyArea}. I choose healing and freedom."
        </div>
        <button onclick="nextHealingStep(2)" style="background: ${chakraColor}; color: white; 
                       padding: 12px 24px; border: none; border-radius: 8px; cursor: pointer; 
                       font-size: 16px; margin-top: 15px;">
          ✨ Intention Set - Continue ✨
        </button>
      </div>
      
      <!-- Step 2: Magnet Release -->
      <div id="step-2" class="healing-step" style="display: none;">
        <h3 style="color: #8F5AFF;">Step 2: Central Meridian Release 🧲</h3>
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
          </div>
          <div style="text-align: center; background: #f0f0f0; padding: 20px; border-radius: 10px;">
            <div style="font-size: 60px;">👤</div>
            <div style="color: #8F5AFF; font-weight: bold;">Central Meridian</div>
            <div style="font-size: 30px;">⬇️🧲⬇️</div>
            <div style="font-size: 12px; color: #666;">Top of head to chin</div>
          </div>
        </div>
        <button onclick="nextHealingStep(3)" style="background: ${chakraColor}; color: white; 
                       padding: 12px 24px; border: none; border-radius: 8px; cursor: pointer; 
                       font-size: 16px; margin-top: 15px;">
          🧲 Release Complete - Continue 🧲
        </button>
      </div>
      
      <!-- Step 3: High Vibration Replacement -->
      <div id="step-3" class="healing-step" style="display: none;">
        <h3 style="color: #8F5AFF;">Step 3: Replace with High Vibration ✨</h3>
        <p>Choose a high vibration word to replace the released emotion:</p>
        <input type="text" id="high-vibe-word" placeholder="e.g., Love, Peace, Joy, Courage..." 
               style="padding: 12px; width: 300px; border: 2px solid ${chakraColor}; 
                      border-radius: 8px; margin: 15px 0; display: block;">
        <p>Now swipe the magnet 3 times again, saying:</p>
        <div style="background: #EAD3FF20; padding: 15px; border-radius: 8px; font-style: italic; 
                    text-align: center; margin: 15px 0;">
          "I now fill this space with <span id="replacement-word">[your chosen word]</span>. 
          This high vibration flows through my ${emotionData.chakraBodyArea}."
        </div>
        <button onclick="nextHealingStep(4)" style="background: ${chakraColor}; color: white; 
                       padding: 12px 24px; border: none; border-radius: 8px; cursor: pointer; 
                       font-size: 16px; margin-top: 15px;">
          ✨ Replacement Complete - Continue ✨
        </button>
      </div>
      
      <!-- Step 4: Chakra Color Healing -->
      <div id="step-4" class="healing-step" style="display: none;">
        <h3 style="color: #8F5AFF;">Step 4: Chakra Color Healing 🌈</h3>
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
          🌈 Color Healing Complete - Continue 🌈
        </button>
      </div>
      
      <!-- Step 5: Shadow Work Sealing -->
      <div id="step-5" class="healing-step" style="display: none;">
        <h3 style="color: #8F5AFF;">Step 5: Seal Your Shadow Work 🔐</h3>
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
          🌟 Complete Healing Journey 🌟
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
        🌟 Healing Complete! 🌟
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
        🔮 Return to Emotion Chart 🔮
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
  
  // Clear search box
  document.getElementById('emotion-search').value = '';
}
