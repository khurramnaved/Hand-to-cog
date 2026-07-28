const students = [
  {
    id: 'ST-104',
    name: 'Amira Khan',
    className: 'Grade 3A',
    age: 8,
    gender: 'Female',
    teacher: 'Ms. Rivera',
    lastScreening: 'Apr 19',
    status: 'High Risk',
  },
  {
    id: 'ST-112',
    name: 'Leo Martinez',
    className: 'Grade 4B',
    age: 9,
    gender: 'Male',
    teacher: 'Mr. Lewis',
    lastScreening: 'Apr 10',
    status: 'Medium Risk',
  },
  {
    id: 'ST-121',
    name: 'Sophia Chen',
    className: 'Grade 3A',
    age: 8,
    gender: 'Female',
    teacher: 'Ms. Carter',
    lastScreening: 'Mar 28',
    status: 'Low Risk',
  },
  {
    id: 'ST-128',
    name: 'Noah Patel',
    className: 'Grade 5C',
    age: 10,
    gender: 'Male',
    teacher: 'Ms. Rivera',
    lastScreening: 'Apr 22',
    status: 'Medium Risk',
  },
  {
    id: 'ST-130',
    name: 'Mia Johnson',
    className: 'Grade 4B',
    age: 9,
    gender: 'Female',
    teacher: 'Mr. Lewis',
    lastScreening: 'Apr 02',
    status: 'Low Risk',
  },
  {
    id: 'ST-137',
    name: 'Ethan Brooks',
    className: 'Grade 3A',
    age: 8,
    gender: 'Male',
    teacher: 'Ms. Carter',
    lastScreening: 'Mar 15',
    status: 'High Risk',
  },
  {
    id: 'ST-142',
    name: 'Ava Singh',
    className: 'Grade 5C',
    age: 10,
    gender: 'Female',
    teacher: 'Ms. Rivera',
    lastScreening: 'Apr 12',
    status: 'Low Risk',
  },
  {
    id: 'ST-149',
    name: 'Liam Torres',
    className: 'Grade 4B',
    age: 9,
    gender: 'Male',
    teacher: 'Mr. Lewis',
    lastScreening: 'Apr 17',
    status: 'Medium Risk',
  },
  {
    id: 'ST-153',
    name: 'Emma Brooks',
    className: 'Grade 3A',
    age: 8,
    gender: 'Female',
    teacher: 'Ms. Carter',
    lastScreening: 'Mar 31',
    status: 'High Risk',
  },
  {
    id: 'ST-160',
    name: 'Oliver Kim',
    className: 'Grade 5C',
    age: 10,
    gender: 'Male',
    teacher: 'Ms. Rivera',
    lastScreening: 'Apr 08',
    status: 'Low Risk',
  },
];

let currentSort = 'id';
let currentDirection = 'asc';

function renderTable() {
  const search =
    document.getElementById('studentSearch')?.value.toLowerCase() || '';
  const classFilter = document.getElementById('filterClass')?.value || 'All';
  const riskFilter = document.getElementById('filterRisk')?.value || 'All';
  const dateFilter = document.getElementById('filterDate')?.value || 'All';
  const teacherFilter =
    document.getElementById('filterTeacher')?.value || 'All';
  const ageFilter = document.getElementById('filterAge')?.value || 'All';
  const genderFilter = document.getElementById('filterGender')?.value || 'All';

  const filtered = students.filter((student) => {
    const matchesSearch = [
      student.id,
      student.name,
      student.className,
      student.status,
      student.teacher,
    ].some((value) => value.toLowerCase().includes(search));
    const matchesClass =
      classFilter === 'All' || student.className === classFilter;
    const matchesRisk = riskFilter === 'All' || student.status === riskFilter;
    const matchesDate =
      dateFilter === 'All' || student.lastScreening === dateFilter;
    const matchesTeacher =
      teacherFilter === 'All' || student.teacher === teacherFilter;
    const matchesAge =
      ageFilter === 'All' || student.age.toString() === ageFilter;
    const matchesGender =
      genderFilter === 'All' || student.gender === genderFilter;
    return (
      matchesSearch &&
      matchesClass &&
      matchesRisk &&
      matchesDate &&
      matchesTeacher &&
      matchesAge &&
      matchesGender
    );
  });

  const sorted = [...filtered].sort((a, b) => {
    const first = a[currentSort];
    const second = b[currentSort];
    if (typeof first === 'string') {
      return currentDirection === 'asc'
        ? first.localeCompare(second)
        : second.localeCompare(first);
    }
    return currentDirection === 'asc' ? first - second : second - first;
  });

  const tbody = document.getElementById('studentTableBody');
  if (!tbody) return;

  tbody.innerHTML = sorted
    .map((student) => {
      const badgeClass =
        student.status === 'High Risk'
          ? 'high'
          : student.status === 'Medium Risk'
            ? 'medium'
            : 'low';
      return `
      <tr>
        <td>${student.id}</td>
        <td>${student.name}</td>
        <td>${student.className}</td>
        <td>${student.age}</td>
        <td>${student.lastScreening}</td>
        <td><span class="status-badge ${badgeClass}">${student.status}</span></td>
        <td>
          <div class="action-group">
            <button class="btn btn-outline-primary btn-sm view-btn" type="button" data-student='${JSON.stringify(student)}'>View</button>
            <button class="btn btn-outline-secondary btn-sm" type="button">Upload</button>
            <button class="btn btn-outline-success btn-sm" type="button">Report</button>
          </div>
        </td>
      </tr>
    `;
    })
    .join('');

  tbody.querySelectorAll('.view-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const student = JSON.parse(button.getAttribute('data-student'));
      openStudentModal(student);
    });
  });
}

function attachSorting() {
  document.querySelectorAll('.sort-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const key = button.getAttribute('data-sort');
      if (currentSort === key) {
        currentDirection = currentDirection === 'asc' ? 'desc' : 'asc';
      } else {
        currentSort = key;
        currentDirection = 'asc';
      }
      renderTable();
    });
  });
}

function initCounters() {
  document.querySelectorAll('.counter').forEach((counter) => {
    const target = Number(counter.getAttribute('data-target'));
    let value = 0;
    const step = Math.max(1, Math.ceil(target / 30));
    const timer = setInterval(() => {
      value += step;
      if (value >= target) {
        counter.textContent = target.toString();
        clearInterval(timer);
      } else {
        counter.textContent = value.toString();
      }
    }, 40);
  });
}

function initSections() {
  document.querySelectorAll('[data-section]').forEach((button) => {
    button.addEventListener('click', () => {
      const section = button.getAttribute('data-section');
      document
        .querySelectorAll('.content-section')
        .forEach((panel) => panel.classList.remove('active'));
      const target = document.getElementById(`${section}Section`);
      if (target) target.classList.add('active');
    });
  });
}

function initUploadExperience() {
  const zone = document.getElementById('uploadZone');
  const input = document.getElementById('fileInput');
  const progressBar = document.getElementById('uploadProgress');
  const success = document.getElementById('uploadSuccess');
  const button = document.getElementById('uploadButton');
  const browseButton = document.getElementById('browseButton');
  const processingProgress = document.getElementById('processingProgress');
  const processSteps = document.querySelectorAll('.process-step');
  const processingStatus = document.getElementById('processingStatus');
  const consistencyMetric = document.getElementById('consistencyMetric');
  const spacingMetric = document.getElementById('spacingMetric');
  const effortMetric = document.getElementById('effortMetric');
  const insightSummary = document.getElementById('insightSummary');
  const insightList = document.getElementById('insightList');

  if (!zone || !input) return;

  const openPicker = () => input.click();

  browseButton?.addEventListener('click', openPicker);
  zone.addEventListener('dragover', (event) => {
    event.preventDefault();
    zone.classList.add('dragover');
  });
  zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));
  zone.addEventListener('drop', (event) => {
    event.preventDefault();
    zone.classList.remove('dragover');
    const [file] = event.dataTransfer.files;
    if (file) handleFile(file);
  });
  input.addEventListener('change', (event) =>
    handleFile(event.target.files[0]),
  );

  function handleFile(file) {
    if (!file) return;
    const canvas = document.getElementById('handwritingCanvas');
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, rect.width, rect.height);

    const drawPaper = () => {
      ctx.fillStyle = '#fffdf8';
      ctx.fillRect(0, 0, rect.width, rect.height);
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
      ctx.lineWidth = 1;
      for (let y = 40; y < rect.height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(rect.width, y);
        ctx.stroke();
      }
    };
    drawPaper();

    if (file.type.startsWith('image/')) {
      const objectUrl = URL.createObjectURL(file);
      const image = new Image();
      image.onload = () => {
        const scale =
          Math.min(rect.width / image.width, rect.height / image.height) * 0.9;
        const drawWidth = image.width * scale;
        const drawHeight = image.height * scale;
        const x = (rect.width - drawWidth) / 2;
        const y = (rect.height - drawHeight) / 2;
        ctx.drawImage(image, x, y, drawWidth, drawHeight);
        if (consistencyMetric) consistencyMetric.textContent = '84%';
        if (spacingMetric) spacingMetric.textContent = '76%';
        if (effortMetric) effortMetric.textContent = '68%';
        if (insightSummary)
          insightSummary.textContent =
            'Uploaded sample shows moderate spacing variability and steady line control.';
        if (insightList)
          insightList.innerHTML =
            '<li>Image preview is now live and aligned to the current sample view.</li><li>Spacing and effort signals are being updated from the uploaded sample.</li><li>These notes remain supportive and non-diagnostic.</li>';
      };
      image.src = objectUrl;
    }

    let width = 0;
    let stepIndex = 0;
    const interval = setInterval(() => {
      width += 10;
      progressBar.style.width = `${Math.min(width, 100)}%`;
      if (processingProgress)
        processingProgress.style.width = `${Math.min(width, 100)}%`;
      if (processSteps[stepIndex]) {
        processSteps.forEach((step) => step.classList.remove('active'));
        processSteps[stepIndex].classList.add('active');
        stepIndex += 1;
      }
      if (processingStatus)
        processingStatus.textContent =
          width < 100 ? 'Processing sample...' : 'Analysis complete';
      if (width >= 100) {
        clearInterval(interval);
        success.classList.add('show');
        if (processingStatus) processingStatus.textContent = 'Preview ready';
      }
    }, 140);
    button?.addEventListener(
      'click',
      () => {
        success.classList.add('show');
        progressBar.style.width = '100%';
        if (processingProgress) processingProgress.style.width = '100%';
        if (processingStatus) processingStatus.textContent = 'Preview ready';
      },
      { once: true },
    );
  }
}

function initThemeToggle() {
  const toggle = document.getElementById('themeToggle');
  const root = document.documentElement;
  const stored = localStorage.getItem('theme');
  if (stored === 'dark') {
    root.setAttribute('data-bs-theme', 'dark');
  }
  toggle?.addEventListener('click', () => {
    const isDark = root.getAttribute('data-bs-theme') === 'dark';
    root.setAttribute('data-bs-theme', isDark ? 'light' : 'dark');
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
  });
}

function initCharts() {
  const barCtx = document.getElementById('barChart');
  if (barCtx) {
    new Chart(barCtx, {
      type: 'bar',
      data: {
        labels: ['Grade 3A', 'Grade 4B', 'Grade 5C', 'Grade 6D'],
        datasets: [
          {
            label: 'Students Screened',
            data: [18, 15, 11, 7],
            backgroundColor: ['#2563eb', '#10b981', '#f59e0b', '#ef4444'],
          },
        ],
      },
      options: { responsive: true, plugins: { legend: { display: false } } },
    });
  }

  const pieCtx = document.getElementById('pieChart');
  if (pieCtx) {
    new Chart(pieCtx, {
      type: 'pie',
      data: {
        labels: ['Low Risk', 'Medium Risk', 'High Risk'],
        datasets: [
          {
            data: [54, 24, 16],
            backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
          },
        ],
      },
      options: { responsive: true },
    });
  }

  const lineCtx = document.getElementById('lineChart');
  if (lineCtx) {
    new Chart(lineCtx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Screenings',
            data: [14, 19, 23, 28, 31, 35],
            borderColor: '#2563eb',
            backgroundColor: 'rgba(37,99,235,0.12)',
            fill: true,
            tension: 0.35,
          },
        ],
      },
      options: { responsive: true, plugins: { legend: { display: false } } },
    });
  }

  const radarCtx = document.getElementById('radarChart');
  if (radarCtx) {
    new Chart(radarCtx, {
      type: 'radar',
      data: {
        labels: [
          'Dyslexia',
          'Dysgraphia',
          'Cognitive Load',
          'Spacing',
          'Formation',
        ],
        datasets: [
          {
            label: 'Current',
            data: [68, 34, 71, 61, 64],
            backgroundColor: 'rgba(37,99,235,0.2)',
            borderColor: '#2563eb',
          },
        ],
      },
      options: { responsive: true },
    });
  }

  const scatterCtx = document.getElementById('scatterChart');
  if (scatterCtx) {
    new Chart(scatterCtx, {
      type: 'scatter',
      data: {
        datasets: [
          {
            label: 'Progress',
            data: [
              { x: 1, y: 58 },
              { x: 2, y: 65 },
              { x: 3, y: 72 },
              { x: 4, y: 81 },
            ],
            backgroundColor: '#10b981',
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: { title: { display: true, text: 'Screenings' } },
          y: { title: { display: true, text: 'Performance' } },
        },
      },
    });
  }
}

function initSidebar() {
  const sidebar = document.getElementById('sidebar');
  const toggle = document.getElementById('sidebarToggle');
  const mobile = document.getElementById('mobileToggle');
  const toggleCollapsed = () => sidebar?.classList.toggle('collapsed');
  toggle?.addEventListener('click', toggleCollapsed);
  mobile?.addEventListener('click', toggleCollapsed);
}

function openStudentModal(student) {
  const modalBody = document.getElementById('studentModalBody');
  if (!modalBody) return;
  const riskPercent =
    student.status === 'High Risk'
      ? 82
      : student.status === 'Medium Risk'
        ? 64
        : 40;
  const insightText =
    student.status === 'High Risk'
      ? 'This student shows frequent pauses and irregular spacing during copying tasks.'
      : student.status === 'Medium Risk'
        ? 'The pattern suggests moderate effort but still requires continued classroom observation.'
        : 'The sample appears relatively stable with only mild support needs.';
  modalBody.innerHTML = `
    <div class="student-modal-grid">
      <div class="student-profile-card">
        <div class="student-photo">${student.name.charAt(0)}</div>
        <h5>${student.name}</h5>
        <p>${student.className} • ${student.age} years • ${student.gender}</p>
        <p><strong>ID:</strong> ${student.id}</p>
        <p><strong>Teacher:</strong> ${student.teacher}</p>
        <p><strong>Last Screening:</strong> ${student.lastScreening}</p>
        <div class="mt-3">
          <span class="status-badge ${student.status === 'High Risk' ? 'high' : student.status === 'Medium Risk' ? 'medium' : 'low'}">${student.status}</span>
        </div>
      </div>
      <div>
        <h6>Current Support Focus</h6>
        <p>${insightText}</p>
        <h6 class="mt-3">Previous Reports</h6>
        <ul class="check-list"><li><i class="bi bi-file-earmark-text"></i> Report • Apr 19</li><li><i class="bi bi-file-earmark-text"></i> Report • Mar 28</li></ul>
        <h6 class="mt-3">Attendance</h6>
        <p>95% attendance this term</p>
        <h6 class="mt-3">Risk Trend</h6>
        <div class="mini-gauge"><div style="width: ${riskPercent}%"></div></div>
        <h6 class="mt-3">Teacher Notes</h6>
        <p>Needs support with letter spacing and slower pacing during copying tasks, while remaining calm and engaged in class.</p>
      </div>
    </div>
  `;
  const modal = new bootstrap.Modal(document.getElementById('studentModal'));
  modal.show();
}

function initAssistant() {
  const toggle = document.getElementById('assistantToggle');
  const panel = document.getElementById('assistantPanel');
  const response = document.getElementById('assistantResponse');
  if (toggle && panel) {
    toggle.addEventListener('click', () => panel.classList.toggle('open'));
  }
  document.querySelectorAll('.assistant-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      if (response) response.textContent = chip.getAttribute('data-answer');
    });
  });
}

function initAccessibility() {
  const contrastToggle = document.getElementById('highContrastToggle');
  const fontToggle = document.getElementById('largeFontToggle');
  contrastToggle?.addEventListener('change', (event) => {
    document.body.classList.toggle('high-contrast', event.target.checked);
  });
  fontToggle?.addEventListener('change', (event) => {
    document.body.classList.toggle('large-font', event.target.checked);
  });
}

function initHandwritingCanvas() {
  const canvas = document.getElementById('handwritingCanvas');
  const clearButton = document.getElementById('clearCanvas');
  const sampleButton = document.getElementById('sampleCanvas');
  const consistencyMetric = document.getElementById('consistencyMetric');
  const spacingMetric = document.getElementById('spacingMetric');
  const effortMetric = document.getElementById('effortMetric');
  const insightSummary = document.getElementById('insightSummary');
  const insightList = document.getElementById('insightList');

  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.lineWidth = 2.4;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = '#2563eb';

  let drawing = false;
  let lastX = 0;
  let lastY = 0;

  const drawLine = (x, y) => {
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();
    lastX = x;
    lastY = y;
  };

  const updateMetrics = (points) => {
    const avgGap =
      points.length > 1
        ? points.reduce((acc, point, index) => {
            if (index === 0) return acc;
            return (
              acc +
              Math.hypot(
                point.x - points[index - 1].x,
                point.y - points[index - 1].y,
              )
            );
          }, 0) / Math.max(1, points.length - 1)
        : 0;
    const consistency = Math.max(30, Math.min(95, 95 - avgGap * 0.3));
    const spacing = Math.max(28, Math.min(92, 72 + (points.length % 6) * 3));
    const effort = Math.max(38, Math.min(88, 50 + (points.length % 7) * 5));
    if (consistencyMetric)
      consistencyMetric.textContent = `${Math.round(consistency)}%`;
    if (spacingMetric) spacingMetric.textContent = `${Math.round(spacing)}%`;
    if (effortMetric) effortMetric.textContent = `${Math.round(effort)}%`;
    if (insightSummary) {
      const insight =
        consistency < 70
          ? 'The strokes suggest uneven rhythm and possible effort during copying.'
          : 'The tracing pattern looks fairly steady, with mild spacing variation only.';
      insightSummary.textContent = insight;
    }
    if (insightList) {
      const hints = [
        consistency < 70
          ? 'Frequent changes in stroke quality may reflect higher cognitive effort.'
          : 'The line form appears comparatively stable.',
        spacing < 65
          ? 'Spacing between marks appears uneven and deserves closer observation.'
          : 'Spacing is mostly regular with slight variability.',
        'These observations support classroom conversation and not diagnosis.',
      ];
      insightList.innerHTML = hints.map((hint) => `<li>${hint}</li>`).join('');
    }
  };

  const points = [];
  const getPoint = (event) => {
    const bounds = canvas.getBoundingClientRect();
    const x = event.touches ? event.touches[0].clientX : event.clientX;
    const y = event.touches ? event.touches[0].clientY : event.clientY;
    return { x: x - bounds.left, y: y - bounds.top };
  };

  const startDraw = (event) => {
    event.preventDefault();
    drawing = true;
    const point = getPoint(event);
    lastX = point.x;
    lastY = point.y;
    points.push(point);
  };

  const continueDraw = (event) => {
    if (!drawing) return;
    event.preventDefault();
    const point = getPoint(event);
    drawLine(point.x, point.y);
    points.push(point);
    updateMetrics(points);
  };

  const stopDraw = () => {
    drawing = false;
  };

  canvas.addEventListener('mousedown', startDraw);
  canvas.addEventListener('mousemove', continueDraw);
  window.addEventListener('mouseup', stopDraw);
  canvas.addEventListener('touchstart', startDraw, { passive: false });
  canvas.addEventListener('touchmove', continueDraw, { passive: false });
  canvas.addEventListener('touchend', stopDraw);

  clearButton?.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    points.length = 0;
    if (consistencyMetric) consistencyMetric.textContent = '—';
    if (spacingMetric) spacingMetric.textContent = '—';
    if (effortMetric) effortMetric.textContent = '—';
    if (insightSummary)
      insightSummary.textContent =
        'Waiting for a sample to surface classroom-ready observations.';
    if (insightList)
      insightList.innerHTML =
        '<li>Draw a few lines to see spacing and rhythm signals.</li><li>Upload a page to compare the sample against the current profile.</li><li>These notes are supportive and not diagnostic.</li>';
  });

  sampleButton?.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.moveTo(30, 200);
    ctx.lineTo(110, 144);
    ctx.lineTo(185, 185);
    ctx.lineTo(250, 132);
    ctx.lineTo(330, 171);
    ctx.lineTo(410, 128);
    ctx.lineTo(470, 170);
    ctx.lineTo(560, 125);
    ctx.stroke();
    points.length = 0;
    points.push(
      { x: 30, y: 200 },
      { x: 110, y: 144 },
      { x: 185, y: 185 },
      { x: 250, y: 132 },
      { x: 330, y: 171 },
      { x: 410, y: 128 },
      { x: 470, y: 170 },
      { x: 560, y: 125 },
    );
    updateMetrics(points);
  });
}

window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('pageLoader')?.classList.add('hide');
  }, 650);
  renderTable();
  attachSorting();
  initCounters();
  initSections();
  initUploadExperience();
  initThemeToggle();
  initCharts();
  initSidebar();
  initAssistant();
  initAccessibility();
  initHandwritingCanvas();
  document
    .getElementById('studentSearch')
    ?.addEventListener('input', renderTable);
  document
    .querySelectorAll(
      '#filterClass, #filterRisk, #filterDate, #filterTeacher, #filterAge, #filterGender',
    )
    .forEach((element) => element.addEventListener('change', renderTable));
  const tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]'),
  );
  tooltipTriggerList.map(
    (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl),
  );
});
