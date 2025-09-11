function navigate(page) {
  const main = document.getElementById('main-content');

  if (page === 'home') {
    main.innerHTML = `
      <h2>Welcome to the SoulArt Temple</h2>
      <p>This is your sacred digital space to heal, harmonise, and embody your highest truth.</p>
      <button onclick="navigate('initiation')">Begin Your SoulArt Journey</button>
      <p style="margin-top: 40px; font-style: italic; color: var(--chakra-third-eye);">“I honoured my shadows and chose to rise.”</p>
    `;
  } else if (page === 'initiation') {
    main.innerHTML = `
      <h2>Begin Your SoulArt Initiation</h2>
      <p>You are invited to identify your unique frequency. Submit your voice, your feeling, or your reflection below to begin the journey.</p>
      <textarea placeholder="Share a voice note transcript, feeling, or insight..." rows="6" cols="50"></textarea><br><br>
      <button onclick="navigate('snapshot')">Receive My Soul Frequency Snapshot</button>
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
  }
}
