/**
 * Orange Bytes — Agents Catalog JavaScript
 * Agent data, rendering, filtering, search
 */

document.addEventListener('DOMContentLoaded', () => {

  // ========== Agent Data ==========
  const agents = [
    { id: 1, name: 'Sarah Chen', role: 'Senior Financial Analyst', department: 'finance', deptLabel: 'Finance', hourly: 45, monthly: 7200, rating: 4.9, image: 'assets/agents/sarah-chen.png', skills: ['Financial Modeling', 'Forecasting', 'Risk Analysis', 'Excel Automation'], types: ['fulltime', 'freelance'] },
    { id: 2, name: 'Marcus Williams', role: 'Full-Stack Developer', department: 'it', deptLabel: 'IT', hourly: 65, monthly: 10400, rating: 4.8, image: 'assets/agents/marcus-williams.png', skills: ['React', 'Node.js', 'Python', 'AWS'], types: ['fulltime', 'freelance', 'project'] },
    { id: 3, name: 'Emma Rodriguez', role: 'Customer Success Manager', department: 'support', deptLabel: 'Support', hourly: 25, monthly: 4000, rating: 4.7, image: 'assets/agents/emma-rodriguez.png', skills: ['CRM', 'Live Chat', 'Ticketing', 'Escalation Mgmt'], types: ['fulltime', 'freelance'] },
    { id: 4, name: "James O'Brien", role: 'Data Scientist', department: 'analytics', deptLabel: 'Analytics', hourly: 75, monthly: 12000, rating: 5.0, image: 'assets/agents/james-obrien.png', skills: ['Machine Learning', 'Python', 'SQL', 'BigQuery'], types: ['fulltime', 'freelance', 'project'] },
    { id: 5, name: 'Priya Sharma', role: 'Content Strategist', department: 'marketing', deptLabel: 'Marketing', hourly: 35, monthly: 5600, rating: 4.8, image: 'assets/agents/priya-sharma.png', skills: ['SEO', 'Copywriting', 'Social Media', 'Brand Voice'], types: ['fulltime', 'freelance'] },
    { id: 6, name: 'David Kim', role: 'DevOps Engineer', department: 'it', deptLabel: 'IT', hourly: 55, monthly: 8800, rating: 4.9, image: 'assets/agents/david-kim.png', skills: ['Kubernetes', 'Docker', 'Terraform', 'CI/CD'], types: ['fulltime', 'freelance', 'project'] },
    { id: 7, name: 'Rachel Foster', role: 'Legal Compliance Officer', department: 'legal', deptLabel: 'Legal', hourly: 60, monthly: 9600, rating: 4.8, image: 'assets/agents/rachel-foster.png', skills: ['Contract Review', 'GDPR', 'Regulatory', 'Compliance'], types: ['fulltime', 'project'] },
    { id: 8, name: 'Alex Thompson', role: 'UX/UI Designer', department: 'creative', deptLabel: 'Creative', hourly: 50, monthly: 8000, rating: 4.7, image: 'assets/agents/alex-thompson.png', skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems'], types: ['fulltime', 'freelance', 'project'] },
    { id: 9, name: 'Maria Santos', role: 'Healthcare Admin Specialist', department: 'healthcare', deptLabel: 'Healthcare', hourly: 30, monthly: 4800, rating: 4.9, image: 'assets/agents/maria-santos.png', skills: ['EHR Systems', 'Billing', 'Scheduling', 'HIPAA'], types: ['fulltime', 'freelance'] },
    { id: 10, name: 'Ryan Mitchell', role: 'Sales Development Rep', department: 'sales', deptLabel: 'Sales', hourly: 20, monthly: 3200, rating: 4.6, image: 'assets/agents/ryan-mitchell.png', skills: ['Lead Gen', 'Outbound', 'CRM', 'Pipeline Mgmt'], types: ['fulltime', 'freelance'] },
    { id: 11, name: 'Aisha Patel', role: 'HR & Recruitment Specialist', department: 'hr', deptLabel: 'HR', hourly: 35, monthly: 5600, rating: 4.8, image: 'assets/agents/aisha-patel.png', skills: ['Screening', 'Onboarding', 'Talent Mgmt', 'ATS'], types: ['fulltime', 'freelance'] },
    { id: 12, name: 'Chris Nakamura', role: 'Cybersecurity Analyst', department: 'security', deptLabel: 'Security', hourly: 85, monthly: 13600, rating: 4.9, image: 'assets/agents/chris-nakamura.png', skills: ['Threat Detection', 'SIEM', 'Pen Testing', 'Incident Response'], types: ['fulltime', 'project'] },
  ];

  const grid = document.getElementById('agentsGrid');
  const searchInput = document.getElementById('searchInput');
  const deptFilter = document.getElementById('deptFilter');
  const typeFilter = document.getElementById('typeFilter');
  const resultsCount = document.getElementById('resultsCount');

  function renderAgents(filteredAgents) {
    grid.innerHTML = '';

    if (filteredAgents.length === 0) {
      grid.innerHTML = `
        <div class="no-results">
          <div class="no-results-icon">🔍</div>
          <h3>No agents found</h3>
          <p>Try adjusting your filters or search terms.</p>
        </div>
      `;
      resultsCount.querySelector('span').textContent = '0';
      return;
    }

    resultsCount.querySelector('span').textContent = filteredAgents.length;

    filteredAgents.forEach((agent, index) => {
      const card = document.createElement('div');
      card.className = 'agent-card';
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';
      card.innerHTML = `
        <img src="${agent.image}" alt="${agent.name}" class="agent-card-image" loading="lazy">
        <div class="agent-card-body">
          <div class="agent-card-header">
            <span class="agent-card-name">${agent.name}</span>
            <span class="agent-card-status"><span class="dot"></span> Available</span>
          </div>
          <div class="agent-card-role">${agent.role}</div>
          <div class="agent-card-tags">
            <span class="tag tag-dept">${agent.deptLabel}</span>
            ${agent.skills.slice(0, 3).map(s => `<span class="tag">${s}</span>`).join('')}
          </div>
          <div class="agent-card-footer">
            <div class="agent-card-rate">
              <span class="rate-amount">$${agent.hourly}<small>/hr</small></span>
              <span class="rate-period">$${agent.monthly.toLocaleString()}/mo</span>
            </div>
            <span class="agent-card-rating">★ ${agent.rating}</span>
          </div>
        </div>
      `;
      grid.appendChild(card);

      // Animate in
      setTimeout(() => {
        card.style.transition = 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, index * 80);

      // Add hover tilt
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 30;
        const rotateY = (centerX - x) / 30;
        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  function filterAgents() {
    const query = searchInput.value.toLowerCase().trim();
    const dept = deptFilter.value;
    const type = typeFilter.value;

    let filtered = agents;

    if (dept) {
      filtered = filtered.filter(a => a.department === dept);
    }

    if (type) {
      filtered = filtered.filter(a => a.types.includes(type));
    }

    if (query) {
      filtered = filtered.filter(a =>
        a.name.toLowerCase().includes(query) ||
        a.role.toLowerCase().includes(query) ||
        a.skills.some(s => s.toLowerCase().includes(query)) ||
        a.deptLabel.toLowerCase().includes(query)
      );
    }

    renderAgents(filtered);
  }

  // Event listeners
  searchInput.addEventListener('input', filterAgents);
  deptFilter.addEventListener('change', filterAgents);
  typeFilter.addEventListener('change', filterAgents);

  // Initial render
  renderAgents(agents);

});
