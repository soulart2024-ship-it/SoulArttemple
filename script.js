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
        <h2>🌈 Sacred Emotion Decoder</h2>
        <p>Discover the vibrational frequency of your emotions and find your healing path.</p>
        
        <div style="margin: 20px 0;">
          <input type="text" id="emotion-search" placeholder="Search for an emotion..." 
                 style="padding: 12px; width: 300px; border-radius: 8px; border: 2px solid var(--chakra-heart);" 
                 onkeyup="searchEmotions()">
        </div>
        
        <div style="margin: 20px 0; background: linear-gradient(135deg, #fef9f4, #EAD3FF20); 
                    padding: 20px; border-radius: 12px; border: 2px solid #EAD3FF;">
          <h3 style="margin: 0 0 15px 0; text-align: center; color: #8F5AFF;">
            ✨ Emotion Frequency & Chakra Map ✨
          </h3>
          <p style="text-align: center; font-size: 0.9em; margin-bottom: 15px; color: #8F5AFF;">
            Click on any point to explore that emotion
          </p>
          <canvas id="emotionChart" style="max-height: 400px; margin: 0 auto; display: block;"></canvas>
        </div>
        
        <div id="emotion-results" style="margin-top: 20px;">
          <div style="text-align: center; color: var(--chakra-third-eye); font-style: italic;">
            Enter an emotion above or click a point on the chart to discover its sacred healing pathway
          </div>
        </div>
        
        <div style="margin-top: 30px; font-size: 0.9em; color: var(--chakra-third-eye);">
          <strong>Available emotions:</strong> Abandonment, Anger, Anxiety, Bitterness, Blame, and more...
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
    const response = await fetch('emotion_decoder_data.csv');
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
            emotion: values[0].trim(),
            frequency: parseInt(values[1]) || 0,
            chakra: values[2].trim(),
            bodyArea: values[3].trim(),
            colour: values[4].trim(),
            releaseMethod: values[5].trim()
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
      <div style="text-align: center; color: var(--chakra-third-eye); font-style: italic;">
        Enter an emotion above to discover its sacred healing pathway
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
      <div style="text-align: center; color: var(--chakra-sacral);">
        No matches found for "${safeSearchTerm.innerHTML}". Try searching for emotions like "anger", "anxiety", or "joy".
      </div>
    `;
    return;
  }
  
  // Display results
  let resultsHTML = '';
  matches.forEach(emotion => {
    const chakraColor = getChakraColor(emotion.chakra);
    resultsHTML += `
      <div style="background: linear-gradient(135deg, ${chakraColor}20, transparent); 
                  border-left: 4px solid ${chakraColor}; 
                  margin: 15px 0; padding: 20px; border-radius: 8px;">
        <h3 style="margin: 0 0 10px 0; color: var(--chakra-third-eye);">${emotion.emotion}</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
          <div><strong>Frequency Level:</strong> ${emotion.frequency}</div>
          <div><strong>Chakra:</strong> ${emotion.chakra}</div>
          <div><strong>Body Area:</strong> ${emotion.bodyArea}</div>
          <div><strong>Sacred Color:</strong> <span style="color: ${chakraColor};">●</span> ${emotion.colour}</div>
        </div>
        <div style="margin-top: 15px; padding: 10px; background: var(--chakra-crown)30; border-radius: 6px;">
          <strong>🌿 Healing Method:</strong> ${emotion.releaseMethod}
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
  
  // Prepare data for chart - group by chakra
  const datasets = CHAKRA_CONFIG.order.map((chakra, index) => {
    const chakraEmotions = emotionData.filter(emotion => emotion.chakra === chakra);
    
    return {
      label: chakra,
      data: chakraEmotions.map(emotion => ({
        x: emotion.frequency,
        y: index + Math.random() * 0.3 - 0.15, // Small jitter to avoid overlap
        emotion: emotion.emotion,
        chakra: emotion.chakra,
        bodyArea: emotion.bodyArea,
        releaseMethod: emotion.releaseMethod
      })),
      backgroundColor: CHAKRA_CONFIG.colors[chakra] + '80', // Semi-transparent
      borderColor: CHAKRA_CONFIG.colors[chakra],
      borderWidth: 2,
      pointRadius: 8,
      pointHoverRadius: 12
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
              return point.raw.emotion;
            },
            label: function(tooltipItem) {
              const point = tooltipItem.raw;
              return [
                `Chakra: ${point.chakra}`,
                `Frequency: ${point.x}`,
                `Body Area: ${point.bodyArea}`
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
            text: 'Chakra',
            font: { size: 14, weight: 'bold' }
          },
          min: -0.5,
          max: 6.5,
          ticks: {
            callback: function(value) {
              return CHAKRA_CONFIG.order[Math.round(value)] || '';
            },
            stepSize: 1
          }
        }
      },
      onClick: function(event, elements) {
        if (elements.length > 0) {
          const {datasetIndex, index} = elements[0];
          const rawData = emotionChart.data.datasets[datasetIndex].data[index];
          
          // Set the search box and trigger search
          document.getElementById('emotion-search').value = rawData.emotion;
          searchEmotions();
        }
      }
    }
  });
}

// Function to get chakra colors (updated for explicit colors)
function getChakraColor(chakra) {
  return CHAKRA_CONFIG.colors[chakra] || CHAKRA_CONFIG.colors['Heart'];
}
