let nodes = [];
let originalValues = [];
let flippedValues = [];
let currentStep = 0;
let prev = null;
let curr = 0;
let animationInterval = null;

function createList() {
  const input = document.getElementById("listInput").value;
  const values = input.split(",").map(s => s.trim()).filter(s => s !== "");
  originalValues = [...values];
  flippedValues = [];

  nodes = values.map((val, index) => ({
    id: index,
    value: val,
    next: index + 1 < values.length ? index + 1 : null
  }));

  currentStep = 0;
  prev = null;
  curr = 0;
  clearInterval(animationInterval);
  drawLinkedList(nodes);
}

function reverseListStepByStep() {
  clearInterval(animationInterval);
  animationInterval = setInterval(() => {
    if (curr !== null) {
      const next = nodes[curr].next;
      nodes[curr].next = prev;
      flippedValues.unshift(nodes[curr].value);
      prev = curr;
      curr = next;
      currentStep++;
      drawLinkedList(nodes);
    } else {
      clearInterval(animationInterval);
      drawLinkedList(nodes);
    }
  }, 800);
}

function drawLinkedList(list) {
  const svg = document.getElementById("linkedListCanvas");
  svg.innerHTML = "";

  const nodeWidth = 60;
  const spacing = 100;
  const startX = 20;
  const y = 80;
  const nodePositions = {};

  // Draw nodes and values
  list.forEach((node, index) => {
    const x = startX + index * spacing;
    nodePositions[node.id] = x;

    // Rectangle
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", x);
    rect.setAttribute("y", y);
    rect.setAttribute("width", nodeWidth);
    rect.setAttribute("height", 40);
    rect.setAttribute("rx", "10");
    rect.setAttribute("fill", node.id === curr ? "#facc15" : node.id === prev ? "#10b981" : "#6366f1");
    svg.appendChild(rect);

    // Text
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", x + nodeWidth / 2);
    text.setAttribute("y", y + 25);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("font-size", "16");
    text.setAttribute("fill", "white");

    if (curr === null) {
      text.textContent = flippedValues[index];
    } else if (index < flippedValues.length) {
      text.textContent = flippedValues[index];
    } else {
      text.textContent = originalValues[index];
    }

    svg.appendChild(text);
  });

  // Draw animated arrows using <path>
  list.forEach((node) => {
    if (node.next !== null) {
      const fromX = nodePositions[node.id];
      const toX = nodePositions[node.next];
      const yMid = y + 20;

      const arrow = document.createElementNS("http://www.w3.org/2000/svg", "path");
      arrow.setAttribute("fill", "none");
      arrow.setAttribute("stroke", "#000");
      arrow.setAttribute("stroke-width", "1.5");

      let startX, endX;

      if (node.next < node.id) {
        // Reverse pointer → draw left
        startX = fromX;
        endX = toX + nodeWidth;
        arrow.setAttribute("marker-start", "url(#arrow-reverse)");
        arrow.removeAttribute("marker-end");
      } else {
        // Forward pointer → draw right
        startX = fromX + nodeWidth;
        endX = toX;
        arrow.setAttribute("marker-end", "url(#arrow)");
        arrow.removeAttribute("marker-start");
      }

      // Straight or curved arrow path
      arrow.setAttribute("d", `M ${startX} ${yMid} L ${endX} ${yMid}`);
      arrow.classList.add("animated-arrow");
      svg.appendChild(arrow);
    }
  });

  // Arrowhead markers
  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  defs.innerHTML = `
    <marker id="arrow" markerWidth="10" markerHeight="10" refX="10" refY="3" orient="auto">
      <path d="M0,0 L0,6 L9,3 z" fill="#000" />
    </marker>
    <marker id="arrow-reverse" markerWidth="10" markerHeight="10" refX="0" refY="3" orient="auto">
      <path d="M9,0 L9,6 L0,3 z" fill="#000" />
    </marker>
  `;
  svg.appendChild(defs);
}
