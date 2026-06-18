// Core dataset simulating an API payload
const jobsData = [
    {
        id: 1,
        title: "Software Engineer Intern",
        company: "TechCorp Solutions",
        role: "Engineering",
        location: "Bangalore",
        salary: "₹6,00,000 - ₹8,00,000 LPA",
        shortDesc: "Join our core platform engineering team to build scalable cloud architectures.",
        longDesc: "As a Software Engineer Intern, you will work side-by-side with senior developers to construct high-throughput REST microservices, implement modern database solutions, and contribute directly to production deployments.",
        requirements: ["Proficiency in JavaScript, Python, or Java", "Understanding of SQL/NoSQL databases", "Basic knowledge of Git & version control", "Good communication skills"]
    },
    {
        id: 2,
        title: "Data Analyst",
        company: "FinData Analytics",
        role: "Data Science",
        location: "Mumbai",
        salary: "₹7,50,000 - ₹9,00,000 LPA",
        shortDesc: "Transform raw financial variables into actionable insights for executive leadership.",
        longDesc: "You will manipulate financial market data arrays, manage custom internal reports, and construct analytical visualization pipelines to evaluate active business metrics.",
        requirements: ["Strong hands-on Python or R data modeling skills", "Advanced Excel & Tableau dashboard generation", "Deep expertise in complex SQL aggregations"]
    },
    {
        id: 3,
        title: "UI/UX Product Designer",
        company: "Creatives Studio",
        role: "Design",
        location: "Remote",
        salary: "₹5,00,000 - ₹7,00,000 LPA",
        shortDesc: "Design intuitive digital user pathways across web and native mobile products.",
        longDesc: "Collaborate directly with cross-functional product managers and frontend engineering teams to craft interactive wireframes, component design systems, and beautiful layout templates.",
        requirements: ["Exceptional portfolio showing end-to-end product thinking", "Mastery of Figma or Adobe XD layouts", "Familiarity with atomic design paradigms"]
    },
    {
        id: 4,
        title: "Associate Product Manager",
        company: "GrowthScale Inc",
        role: "Management",
        location: "Hyderabad",
        salary: "₹10,00,000 - ₹12,00,000 LPA",
        shortDesc: "Own the roadmap, feature specification documentation, and lifecycle of core items.",
        longDesc: "Synthesize target market research, author granular product requirement write-ups, and coordinate agile sprint execution timelines alongside engineering and design leads.",
        requirements: ["Excellent written and verbal articulation abilities", "Strong problem-solving framework and structural reasoning", "Prior technology project leadership experience"]
    },
    {
        id: 5,
        title: "Full Stack Developer",
        company: "TechCorp Solutions",
        role: "Engineering",
        location: "Remote",
        salary: "₹8,00,000 - ₹11,00,000 LPA",
        shortDesc: "Own full stack capabilities from system services down to client interfaces.",
        longDesc: "Build and deploy flexible, high-uptime web features utilizing React.js UI modules, responsive frameworks, backend runtime systems, and standardized application environments.",
        requirements: ["Solid foundations in Node.js ecosystem layouts", "Advanced knowledge of modern React context states", "Familiarity with containerized execution styles"]
    }
];

// Track user's bookmarked job IDs in LocalStorage for persistence
let bookmarkedJobs = JSON.parse(localStorage.getItem('bookmarkedJobs')) || [];

// DOM elements
const jobsContainer = document.getElementById('jobs-container');
const jobCount = document.getElementById('job-count');
const searchInput = document.getElementById('search-input');
const roleSelect = document.getElementById('role-select');
const locationSelect = document.getElementById('location-select');
const bookmarkToggle = document.getElementById('bookmark-toggle');

const modal = document.getElementById('job-modal');
const closeModalBtn = document.getElementById('close-modal-btn');

// Render matching jobs to grid
function renderJobs() {
    const searchQuery = searchInput.value.toLowerCase().trim();
    const selectedRole = roleSelect.value;
    const selectedLocation = locationSelect.value;
    const showSavedOnly = bookmarkToggle.checked;

    // Filter logic
    const filteredJobs = jobsData.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchQuery) || 
                              job.company.toLowerCase().includes(searchQuery) ||
                              job.shortDesc.toLowerCase().includes(searchQuery);
        const matchesRole = selectedRole === 'all' || job.role === selectedRole;
        const matchesLocation = selectedLocation === 'all' || job.location === selectedLocation;
        const matchesSaved = !showSavedOnly || bookmarkedJobs.includes(job.id);

        return matchesSearch && matchesRole && matchesLocation && matchesSaved;
    });

    // Update visible counter
    jobCount.textContent = `Showing ${filteredJobs.length} job opening${filteredJobs.length === 1 ? '' : 's'}`;

    // Clear container
    jobsContainer.innerHTML = '';

    if (filteredJobs.length === 0) {
        jobsContainer.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px 0;">No job listings match your current filters.</p>`;
        return;
    }

    // Build out individual job cards
    filteredJobs.forEach(job => {
        const isBookmarked = bookmarkedJobs.includes(job.id);
        const card = document.createElement('div');
        card.className = 'job-card';
        card.innerHTML = `
            <button class="bookmark-btn ${isBookmarked ? 'active' : ''}" onclick="toggleBookmark(${job.id}, event)">
                ★
            </button>
            <div>
                <h3 class="job-title">${job.title}</h3>
                <div class="job-company">${job.company}</div>
                <div class="job-meta">
                    <span class="badge">${job.role}</span>
                    <span class="badge loc">${job.location}</span>
                </div>
                <p class="job-desc">${job.shortDesc}</p>
            </div>
            <button class="view-btn" onclick="openModal(${job.id})">View Details</button>
        `;
        jobsContainer.appendChild(card);
    });
}

// Toggle handling for Bookmarking
window.toggleBookmark = function(id, event) {
    event.stopPropagation(); // Stop parent triggers
    if (bookmarkedJobs.includes(id)) {
        bookmarkedJobs = bookmarkedJobs.filter(jobId => jobId !== id);
    } else {
        bookmarkedJobs.push(id);
    }
    localStorage.setItem('bookmarkedJobs', JSON.stringify(bookmarkedJobs));
    renderJobs();
};

// Open detailed View Modal
window.openModal = function(id) {
    const job = jobsData.find(j => j.id === id);
    if (!job) return;

    document.getElementById('modal-title').textContent = job.title;
    document.getElementById('modal-company').textContent = job.company;
    document.getElementById('modal-role').textContent = job.role;
    document.getElementById('modal-location').textContent = job.location;
    document.getElementById('modal-salary').textContent = job.salary;
    document.getElementById('modal-desc').textContent = job.longDesc;

    const reqList = document.getElementById('modal-requirements');
    reqList.innerHTML = '';
    job.requirements.forEach(req => {
        const li = document.createElement('li');
        li.textContent = req;
        reqList.appendChild(li);
    });

    modal.style.display = 'flex';
};

// Close Modal Hooks
closeModalBtn.addEventListener('click', () => modal.style.display = 'none');
window.addEventListener('click', (e) => { if(e.target === modal) modal.style.display = 'none'; });

// Input Action Listeners
searchInput.addEventListener('input', renderJobs);
roleSelect.addEventListener('change', renderJobs);
locationSelect.addEventListener('change', renderJobs);
bookmarkToggle.addEventListener('change', renderJobs);

// Bootstrap rendering
renderJobs();