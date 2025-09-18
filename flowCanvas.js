function loadFlowCanvas() {
  const main = document.getElementById('main-content');
  main.innerHTML = `
    <h2>Flow Art Therapy</h2>
    <p>Choose a chakra colour and express what your soul is feeling through fluid movement.</p>
    <div style="margin: 20px 0;">
      <label>Select a Chakra Colour:</label><br>
      <select id="colorPicker" onchange="changeColor()" style="padding: 10px; margin-top: 10px;">
        <option value="#C1272D">Root (Red)</option>
        <option value="#F7931E">Sacral (Orange)</option>
        <option value="#FFD700">Solar Plexus (Yellow)</option>
        <option value="#009245">Heart (Green)</option>
        <option value="#2E3192">Throat (Blue)</option>
        <option value="#8E44AD">Third Eye (Indigo)</option>
        <option value="#FFFFFF">Crown (White)</option>
      </select>
    </div>

    <canvas id="flowCanvas" width="320" height="400" style="border:1px solid #aaa; touch-action: none;"></canvas>

    <div style="margin-top: 15px;">
      <button onclick="clearCanvas()">Clear Canvas</button>
      <button onclick="saveArt()">Download Art</button>
    </div>
  `;

  setupCanvas(); // load canvas logic
}