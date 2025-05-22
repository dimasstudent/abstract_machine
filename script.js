// State Variables
let states = [];
let alphabet = [];
let initialState = null;
let finalStates = new Set();
// Transitions format: { from, symbol, to }
let transitions = [];
// Node positions storage
let nodePositions = {};

// DOM Elements
const statesInput = document.getElementById("statesInput");
const alphabetInput = document.getElementById("alphabetInput");
const initialStateSelect = document.getElementById("initialStateSelect");
const finalStatesSelect = document.getElementById("finalStatesSelect");
const fromStateSelect = document.getElementById("fromState");
const withSymbolSelect = document.getElementById("withSymbol");
const toStateSelect = document.getElementById("toState");
const addTransitionBtn = document.getElementById("addTransitionBtn");
const transitionsList = document.getElementById("transitionsList");
const inputString = document.getElementById("inputString");
const simulateBtn = document.getElementById("simulateBtn");
const result = document.getElementById("result");
const lockPositionsCheckbox = document.getElementById("lockPositions");
const resetPositionsBtn = document.getElementById("resetPositionsBtn");

// Update selects for states and alphabet
function updateSelectOptions() {
  // Clear all selects
  [
    initialStateSelect,
    finalStatesSelect,
    fromStateSelect,
    toStateSelect,
  ].forEach((select) => {
    select.innerHTML = "";
  });
  withSymbolSelect.innerHTML = "";

  // Populate states selects
  states.forEach((s) => {
    const option1 = document.createElement("option");
    option1.value = s;
    option1.textContent = s;
    initialStateSelect.appendChild(option1);

    const option2 = document.createElement("option");
    option2.value = s;
    option2.textContent = s;
    finalStatesSelect.appendChild(option2);

    const option3 = document.createElement("option");
    option3.value = s;
    option3.textContent = s;
    fromStateSelect.appendChild(option3);

    const option4 = document.createElement("option");
    option4.value = s;
    option4.textContent = s;
    toStateSelect.appendChild(option4);
  });

  // Populate alphabet select
  alphabet.forEach((sym) => {
    const option = document.createElement("option");
    option.value = sym;
    option.textContent = sym;
    withSymbolSelect.appendChild(option);
  });
}

// Update transitions list in UI
function updateTransitionsList() {
  transitionsList.innerHTML = "";
  transitions.forEach((t, i) => {
    const li = document.createElement("li");
    li.textContent = `δ(${t.from}, ${t.symbol}) → ${t.to}`;
    li.className = "flex justify-between items-center";
    // Add remove button
    const btn = document.createElement("button");
    btn.textContent = "hapus";
    btn.className = "text-red-500 hover:text-red-700 ml-2";
    btn.onclick = () => {
      transitions.splice(i, 1);
      updateTransitionsList();
      renderGraph();
    };
    li.appendChild(btn);
    transitionsList.appendChild(li);
  });

  renderGraph();
}

// Fungsi untuk menyimpan posisi node saat ini
function saveCurrentPositions() {
  if (window.network) {
    const networkPositions = window.network.getPositions();
    Object.keys(networkPositions).forEach((nodeId) => {
      nodePositions[nodeId] = {
        x: networkPositions[nodeId].x,
        y: networkPositions[nodeId].y,
      };
    });
  }
}

// Fungsi untuk mendapatkan layout posisi yang sesuai untuk nodes baru
function getNodeLayout(statesList) {
  const isLocked = lockPositionsCheckbox.checked;
  let newPositions = {};

  // Jika tidak ada posisi sebelumnya yang disimpan atau reset diminta
  if (Object.keys(nodePositions).length === 0 || !isLocked) {
    // Atur posisi default - circular layout
    const radius = 100;
    const centerX = 0;
    const centerY = 0;

    statesList.forEach((state, index) => {
      const angle = (2 * Math.PI * index) / statesList.length;
      newPositions[state] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      };
    });

    return newPositions;
  }

  // Gunakan posisi yang sudah ada untuk node yang ada
  // Dan buat posisi baru untuk node yang belum ada
  statesList.forEach((state, index) => {
    if (nodePositions[state]) {
      newPositions[state] = nodePositions[state];
    } else {
      // Posisi node baru - tempatkan di sekitar posisi rata-rata
      const avgX =
        Object.values(nodePositions).reduce((sum, pos) => sum + pos.x, 0) /
        Math.max(1, Object.keys(nodePositions).length);
      const avgY =
        Object.values(nodePositions).reduce((sum, pos) => sum + pos.y, 0) /
        Math.max(1, Object.keys(nodePositions).length);

      // Tambahkan offset acak dari posisi rata-rata
      newPositions[state] = {
        x: avgX + (Math.random() - 0.5) * 50,
        y: avgY + (Math.random() - 0.5) * 50,
      };
    }
  });

  return newPositions;
}

// Fungsi render graf dengan vis.js
function renderGraph() {
  // Simpan posisi sebelum membuat ulang graf
  if (window.network) {
    saveCurrentPositions();
  }

  const calculatedPositions = getNodeLayout(states);

  const nodes = states.map((s) => ({
    id: s,
    label: s,
    shape: "circle",
    color:
      s === initialState
        ? "#a3d9a5"
        : finalStates.has(s)
        ? "#f9d67a"
        : "#97c2fc",
    x: calculatedPositions[s].x,
    y: calculatedPositions[s].y,
    fixed: lockPositionsCheckbox.checked,
  }));

  // Buat edges dari transitions, tampilkan label simbol
  const edges = transitions.map((t) => ({
    from: t.from,
    to: t.to,
    label: t.symbol,
    arrows: "to",
    font: { align: "top" },
  }));

  const container = document.getElementById("graph");

  // Jika network sudah ada, hapus dulu supaya render ulang bersih
  if (window.network) {
    window.network.destroy();
  }

  const data = {
    nodes: new vis.DataSet(nodes),
    edges: new vis.DataSet(edges),
  };

  const options = {
    layout: {
      improvedLayout: true,
      hierarchical: false,
    },
    edges: {
      smooth: {
        type: "dynamic",
        roundness: 0.2,
      },
    },
    physics: {
      enabled: !lockPositionsCheckbox.checked,
      stabilization: { iterations: 100 },
    },
    interaction: {
      dragNodes: true,
    },
  };

  window.network = new vis.Network(container, data, options);

  // Event setelah drag selesai - simpan posisi baru
  window.network.on("dragEnd", function () {
    saveCurrentPositions();
  });

  // Event setelah posisi stabil - simpan posisi
  window.network.on("stabilizationIterationsDone", function () {
    saveCurrentPositions();
  });
}

// Read states and alphabet from input and update selects
function readStatesAndAlphabet() {
  states = statesInput.value
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s);
  alphabet = alphabetInput.value
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s);
  updateSelectOptions();

  // Reset initialState dan finalStates supaya graf konsisten
  initialState = null;
  finalStates = new Set();
  transitions = [];
  updateTransitionsList();
  renderGraph();
  result.textContent = "";
  transitionsList.innerHTML = ""; // Clear transitions list
}

// Add event listeners for states/alphabet input changes
statesInput.addEventListener("change", () => {
  readStatesAndAlphabet();
});

alphabetInput.addEventListener("change", () => {
  readStatesAndAlphabet();
});

// Handle initial and final states selection
initialStateSelect.addEventListener("change", () => {
  initialState = initialStateSelect.value;
  renderGraph();
  result.textContent = "";
});

finalStatesSelect.addEventListener("change", () => {
  finalStates = new Set(
    Array.from(finalStatesSelect.selectedOptions).map((opt) => opt.value)
  );
  renderGraph();
  result.textContent = "";
});

// Add transition button
addTransitionBtn.addEventListener("click", () => {
  const from = fromStateSelect.value;
  const symbol = withSymbolSelect.value;
  const to = toStateSelect.value;

  if (!from || !symbol || !to) {
    alert("Semua pilihan transisi harus diisi");
    return;
  }

  transitions.push({ from, symbol, to });
  updateTransitionsList();
  result.textContent = "";
});

// Lock positions checkbox change
lockPositionsCheckbox.addEventListener("change", () => {
  if (window.network) {
    if (lockPositionsCheckbox.checked) {
      // Simpan posisi saat ini sebelum mengunci
      saveCurrentPositions();
      // Nonaktifkan physics ketika dalam mode lock
      window.network.setOptions({ physics: { enabled: false } });
      // Tetapkan semua node sebagai fixed
      const nodeIds = window.network.body.data.nodes.getIds();
      nodeIds.forEach((id) => {
        window.network.body.data.nodes.update({ id: id, fixed: true });
      });
    } else {
      // Aktifkan kembali physics ketika unlock
      window.network.setOptions({ physics: { enabled: true } });
      // Lepaskan fixed pada semua node
      const nodeIds = window.network.body.data.nodes.getIds();
      nodeIds.forEach((id) => {
        window.network.body.data.nodes.update({ id: id, fixed: false });
      });
    }
  }
  renderGraph();
});

// Reset positions button
resetPositionsBtn.addEventListener("click", () => {
  nodePositions = {}; // Reset posisi yang tersimpan
  renderGraph(); // Render ulang dengan layout baru
});

// Simulator function for DFA (deterministic)
function simulateDFA(inputStr) {
  const history = [];
  if (!initialState)
    return {
      accepted: false,
      error: "Initial state belum dipilih",
      history: [],
    };
  if (finalStates.size === 0)
    return {
      accepted: false,
      error: "Final states belum dipilih",
      history: [],
    };

  let currentState = initialState;
  history.push({ step: 0, state: currentState, symbol: null });

  for (let i = 0; i < inputStr.length; i++) {
    const ch = inputStr[i];
    const trans = transitions.find(
      (t) => t.from === currentState && t.symbol === ch
    );

    if (!trans) {
      return {
        accepted: false,
        error: `Tidak ada transisi dari ${currentState} dengan simbol '${ch}'`,
        history,
      };
    }

    currentState = trans.to;
    history.push({ step: i + 1, state: currentState, symbol: ch });
  }

  return {
    accepted: finalStates.has(currentState),
    error: null,
    history,
  };
}

function simulateNFA(inputStr) {
  const history = [];
  if (!initialState)
    return {
      accepted: false,
      error: "Initial state belum dipilih",
      history: [],
    };
  if (finalStates.size === 0)
    return {
      accepted: false,
      error: "Final states belum dipilih",
      history: [],
    };

  let currentStates = new Set([initialState]);
  history.push({
    step: 0,
    states: Array.from(currentStates),
    symbol: null,
  });

  for (let i = 0; i < inputStr.length; i++) {
    const ch = inputStr[i];
    let nextStates = new Set();

    for (const state of currentStates) {
      const transitionsFromState = transitions.filter(
        (t) => t.from === state && t.symbol === ch
      );
      for (const transition of transitionsFromState) {
        nextStates.add(transition.to);
      }
    }

    if (nextStates.size === 0) {
      return {
        accepted: false,
        error: `No transition from any current state with symbol '${ch}'`,
        history,
      };
    }

    currentStates = nextStates;
    history.push({
      step: i + 1,
      states: Array.from(currentStates),
      symbol: ch,
    });
  }

  // Cek apakah salah satu state adalah final
  let accepted = false;
  for (const state of currentStates) {
    if (finalStates.has(state)) {
      accepted = true;
      break;
    }
  }

  return {
    accepted,
    error: null,
    history,
  };
}

// Simulate button click
simulateBtn.addEventListener("click", () => {
  const str = inputString.value.trim();
  if (!str) {
    alert("Masukkan string untuk simulasi");
    return;
  }

  for (const ch of str) {
    if (!alphabet.includes(ch)) {
      alert(`Simbol '${ch}' tidak ada di alfabet`);
      return;
    }
  }

  function isDFA() {
    const keySet = new Set();
    for (const t of transitions) {
      const key = `${t.from},${t.symbol}`;
      if (keySet.has(key)) return false;
      keySet.add(key);
    }
    return true;
  }

  const isDfa = isDFA();
  let simResult;

  if (isDfa) {
    simResult = simulateDFA(str);
  } else {
    simResult = simulateNFA(str);
  }

  // Tampilkan hasil utama
  if (simResult.error) {
    result.textContent = "Error: " + simResult.error;
    result.className = "mt-2 font-semibold text-red-600";
  } else if (simResult.accepted) {
    result.textContent = `String DITERIMA oleh mesin ${isDfa ? "DFA" : "NFA"}.`;
    result.className = "mt-2 font-semibold text-green-600";
  } else {
    result.textContent = `String TIDAK DITERIMA oleh mesin ${
      isDfa ? "DFA" : "NFA"
    }.`;
    result.className = "mt-2 font-semibold text-red-600";
  }

  // Tampilkan jalur
  const pathDiv = document.getElementById("pathResult");
  pathDiv.innerHTML = "<strong>Jalur Eksekusi:</strong><br>";
  simResult.history.forEach((step, index) => {
    if (isDfa) {
      pathDiv.innerHTML += `Langkah ${step.step}: (${step.symbol ?? "-"}) → ${
        step.state
      }<br>`;
    } else {
      pathDiv.innerHTML += `Langkah ${step.step}: (${
        step.symbol ?? "-"
      }) → [${step.states.join(", ")}]<br>`;
    }
  });

  // Highlight jalur di graf
  highlightPath(simResult.history, isDfa);
});

function highlightPath(history, isDfa) {
  const nodesData = window.network.body.data.nodes;
  const edgesData = window.network.body.data.edges;

  // Reset semua warna
  nodesData.update(
  nodesData.getIds().map((id) => {
    if (id === initialState) {
      return { id, color: "#a3d9a5" }; // Warna hijau muda → initial state (state awal)
    } else if (finalStates.has(id)) {
      return { id, color: "#f9d67a" }; // Warna kuning/oranye muda → final state (state akhir)
    } else {
      return { id, color: "#97c2fc" }; // Warna biru muda → state biasa (default)
    }
  })
);

// Reset warna edge ke abu-abu
edgesData.update(edgesData.getIds().map((id) => ({ id, color: "#848484" }))); // Warna abu-abu → default edge

if (isDfa) {
  history.forEach((step, index) => {
    if (index > 0) {
      const prevStep = history[index - 1];
      const edgeId = edgesData.getIds().find((id) => {
        const edge = edgesData.get(id);
        return edge.from === prevStep.state && edge.to === step.state;
      });
      if (edgeId) {
        edgesData.update({ id: edgeId, color: { color: "#a3d9a5" } }); // Warna hijau muda → jalur transisi yang dilalui
      }
    }
  });
} else {
  // Jika NFA
  history.forEach((step, index) => {
    if (index > 0) {
      const prevStep = history[index - 1];
      step.states.forEach((state) => {
        prevStep.states.forEach((prevState) => {
          const edgeId = edgesData.getIds().find((id) => {
            const edge = edgesData.get(id);
            return edge.from === prevState && edge.to === state;
          });
          if (edgeId) {
            edgesData.update({ id: edgeId, color: { color: "#a3d9a5" } }); // Warna hijau muda → jalur transisi NFA
          }
        });
      });
    }
  });
}


}

// Inisialisasi kosong
readStatesAndAlphabet();
