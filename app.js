(() => {
  const STORAGE_KEY = 'studio_organizer_state_v1';
  const MS_PER_DAY = 24 * 60 * 60 * 1000;

  const defaultState = createDefaultState();
  let state = loadState();

  const elements = {
    headerDate: document.getElementById('currentDate'),
    quickTaskForm: document.getElementById('quickTaskForm'),
    quickTaskInput: document.getElementById('quickTaskInput'),
    sidebar: document.querySelector('.sidebar'),
    projectList: document.getElementById('projectList'),
    toggleProjectForm: document.getElementById('toggleProjectForm'),
    cancelProject: document.getElementById('cancelProject'),
    projectForm: document.getElementById('projectForm'),
    projectName: document.getElementById('projectName'),
    projectColor: document.getElementById('projectColor'),
    statusFilters: document.getElementById('statusFilters'),
    agendaList: document.getElementById('agendaList'),
    agendaRange: document.getElementById('agendaRange'),
    summaryGrid: document.getElementById('summaryGrid'),
    taskForm: document.getElementById('taskForm'),
    taskTitle: document.getElementById('taskTitle'),
    taskDue: document.getElementById('taskDue'),
    taskPriority: document.getElementById('taskPriority'),
    taskStatus: document.getElementById('taskStatus'),
    taskDescription: document.getElementById('taskDescription'),
    taskList: document.getElementById('taskList'),
    taskCountLabel: document.getElementById('taskCountLabel'),
    currentProjectTitle: document.getElementById('currentProjectTitle'),
    generalNotes: document.getElementById('generalNotes'),
    projectNotes: document.getElementById('projectNotes'),
    projectNotesHint: document.getElementById('projectNotesHint')
  };

  init();

  function init() {
    ensureSelectedProject();
    bindEvents();
    renderAll();
  }

  function createDefaultState() {
    const projects = [
      { id: 'proj-editorial', name: 'Calendário Editorial', color: '#6366f1' },
      { id: 'proj-edicao', name: 'Edição de Vídeo', color: '#ec4899' },
      { id: 'proj-backoffice', name: 'Backoffice & Clientes', color: '#22c55e' }
    ];

    const tasks = [
      {
        id: 'task-roteiro',
        projectId: 'proj-editorial',
        title: 'Fechar pautas do mês de dezembro',
        description: 'Validar temas com base nas métricas da última semana.',
        dueDate: '2025-11-15',
        status: 'em_progresso',
        priority: 'alta',
        createdAt: new Date().toISOString()
      },
      {
        id: 'task-revisao',
        projectId: 'proj-edicao',
        title: 'Revisar cortes do vídeo “Making Of”',
        description: 'Aplicar LUT final e corrigir trilha a partir do minuto 02:40.',
        dueDate: '2025-11-14',
        status: 'pendente',
        priority: 'media',
        createdAt: new Date().toISOString()
      },
      {
        id: 'task-entrega',
        projectId: 'proj-backoffice',
        title: 'Enviar proposta atualizada para cliente Amanda',
        description: 'Incluir pacote de reels e cronograma de entregas.',
        dueDate: '2025-11-18',
        status: 'pendente',
        priority: 'alta',
        createdAt: new Date().toISOString()
      },
      {
        id: 'task-relatorio',
        projectId: 'proj-editorial',
        title: 'Gerar relatório de desempenho das campanhas',
        description: 'Compartilhar com a equipe até sexta-feira.',
        dueDate: '2025-11-20',
        status: 'pendente',
        priority: 'media',
        createdAt: new Date().toISOString()
      },
      {
        id: 'task-arquivar',
        projectId: 'proj-edicao',
        title: 'Arquivar projetos antigos no NAS',
        description: '',
        dueDate: '2025-11-10',
        status: 'pendente',
        priority: 'baixa',
        createdAt: new Date().toISOString()
      }
    ];

    return {
      projects,
      tasks,
      notes: {
        general: 'Use este bloco para capturar ideias rápidas, feedbacks ou links que não podem se perder.',
        projectNotes: {
          'proj-editorial': 'Rever performance do post de terça-feira e regravar B-roll se necessário.',
          'proj-edicao': 'Criar template de lower thirds com identidade nova.',
          'proj-backoffice': ''
        }
      },
      selectedProjectId: projects[0].id,
      filters: {
        status: 'all',
        agendaRange: 7
      },
      lastUpdated: new Date().toISOString()
    };
  }

  function loadState() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return deepClone(defaultState);
      }
      const parsed = JSON.parse(stored);
      return ensureStateIntegrity(parsed);
    } catch (error) {
      console.warn('Não foi possível carregar o estado salvo, usando padrão.', error);
      return deepClone(defaultState);
    }
  }

  function ensureStateIntegrity(data) {
    const safeDefault = deepClone(defaultState);
    if (!data || typeof data !== 'object') {
      return safeDefault;
    }

    const projects = Array.isArray(data.projects) && data.projects.length
      ? data.projects
      : safeDefault.projects;

    const tasks = Array.isArray(data.tasks) ? data.tasks : safeDefault.tasks;

    const notes = {
      general: data.notes?.general ?? safeDefault.notes.general,
      projectNotes: {
        ...safeDefault.notes.projectNotes,
        ...(data.notes?.projectNotes || {})
      }
    };

    // Garante que todo projeto tenha uma nota mapeada.
    projects.forEach(project => {
      if (!(project.id in notes.projectNotes)) {
        notes.projectNotes[project.id] = '';
      }
    });

    const filters = {
      status: data.filters?.status ?? safeDefault.filters.status,
      agendaRange: Number(data.filters?.agendaRange) || safeDefault.filters.agendaRange
    };

    const selectedProjectId = projects.find(p => p.id === data.selectedProjectId)?.id
      ?? projects[0]?.id
      ?? safeDefault.selectedProjectId;

    return {
      projects,
      tasks,
      notes,
      filters,
      selectedProjectId,
      lastUpdated: data.lastUpdated ?? safeDefault.lastUpdated
    };
  }

  function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function saveState() {
    try {
      state.lastUpdated = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.warn('Não foi possível salvar o estado.', error);
    }
  }

  function ensureSelectedProject() {
    if (!state.selectedProjectId || !getProjectById(state.selectedProjectId)) {
      state.selectedProjectId = state.projects[0]?.id ?? null;
    }
  }

  function bindEvents() {
    if (elements.toggleProjectForm) {
      elements.toggleProjectForm.addEventListener('click', () => {
        const isHidden = elements.projectForm.classList.contains('hidden');
        elements.projectForm.classList.toggle('hidden');
        if (isHidden) {
          elements.projectName.focus();
        }
      });
    }

    if (elements.cancelProject) {
      elements.cancelProject.addEventListener('click', () => {
        hideProjectForm();
      });
    }

    if (elements.projectForm) {
      elements.projectForm.addEventListener('submit', handleProjectSubmit);
    }

    if (elements.quickTaskForm) {
      elements.quickTaskForm.addEventListener('submit', handleQuickTaskSubmit);
    }

    if (elements.taskForm) {
      elements.taskForm.addEventListener('submit', handleTaskSubmit);
    }

    if (elements.agendaRange) {
      elements.agendaRange.addEventListener('change', handleAgendaRangeChange);
    }

    if (elements.statusFilters) {
      elements.statusFilters.addEventListener('click', event => {
        const button = event.target.closest('[data-status-filter]');
        if (!button) return;
        const status = button.dataset.statusFilter;
        if (!status || state.filters.status === status) return;
        state.filters.status = status;
        saveState();
        syncStatusFilters();
        renderTasks();
      });
    }

    if (elements.generalNotes) {
      elements.generalNotes.addEventListener('input', debounce(event => {
        state.notes.general = event.target.value;
        saveState();
      }, 400));
    }

    if (elements.projectNotes) {
      elements.projectNotes.addEventListener('input', debounce(event => {
        if (!state.selectedProjectId) return;
        state.notes.projectNotes[state.selectedProjectId] = event.target.value;
        saveState();
      }, 400));
    }
  }

  function handleProjectSubmit(event) {
    event.preventDefault();
    const name = elements.projectName.value.trim();
    const color = elements.projectColor.value || getRandomPaletteColor();
    if (!name) {
      return;
    }

    const newProject = {
      id: generateId('proj'),
      name,
      color
    };

    state.projects.push(newProject);
    state.selectedProjectId = newProject.id;
    state.notes.projectNotes[newProject.id] = '';
    saveState();

    elements.projectForm.reset();
    elements.projectColor.value = color;
    hideProjectForm();

    renderProjects();
    renderNotes();
    renderTasks();
    renderSummary();
    renderAgenda();
  }

  function hideProjectForm() {
    elements.projectForm.classList.add('hidden');
    elements.projectForm.reset();
    elements.projectColor.value = '#4f46e5';
  }

  function handleQuickTaskSubmit(event) {
    event.preventDefault();
    const title = elements.quickTaskInput.value.trim();
    if (!title) return;
    if (!state.selectedProjectId) {
      alert('Crie ou selecione um projeto antes de adicionar tarefas.');
      return;
    }

    const newTask = {
      id: generateId('task'),
      projectId: state.selectedProjectId,
      title,
      description: '',
      dueDate: '',
      status: 'pendente',
      priority: 'media',
      createdAt: new Date().toISOString()
    };

    state.tasks.push(newTask);
    saveState();

    elements.quickTaskInput.value = '';
    renderTasks();
    renderSummary();
    renderAgenda();
  }

  function handleTaskSubmit(event) {
    event.preventDefault();
    const title = elements.taskTitle.value.trim();
    if (!title) return;
    if (!state.selectedProjectId) {
      alert('Selecione um projeto para cadastrar a tarefa.');
      return;
    }

    const task = {
      id: generateId('task'),
      projectId: state.selectedProjectId,
      title,
      description: elements.taskDescription.value.trim(),
      dueDate: elements.taskDue.value || '',
      status: elements.taskStatus.value || 'pendente',
      priority: elements.taskPriority.value || 'media',
      createdAt: new Date().toISOString()
    };

    state.tasks.push(task);
    saveState();

    elements.taskForm.reset();
    elements.taskPriority.value = 'media';
    elements.taskStatus.value = 'pendente';

    renderTasks();
    renderSummary();
    renderAgenda();
  }

  function handleAgendaRangeChange(event) {
    const value = Number(event.target.value) || 7;
    state.filters.agendaRange = value;
    saveState();
    renderAgenda();
    renderSummary();
  }

  function renderAll() {
    updateCurrentDate();
    renderProjects();
    syncStatusFilters();
    renderSummary();
    renderAgenda();
    renderTasks();
    renderNotes();
  }

  function renderProjects() {
    elements.projectList.innerHTML = '';

    if (!state.projects.length) {
      const empty = document.createElement('li');
      empty.className = 'project-item';
      empty.innerHTML = '<div class="project-meta"><strong>Nenhum projeto</strong><small>Crie o primeiro para começar.</small></div>';
      elements.projectList.appendChild(empty);
      state.selectedProjectId = null;
      return;
    }

    state.projects.forEach(project => {
      const li = document.createElement('li');
      const isSelected = project.id === state.selectedProjectId;
      li.className = `project-item${isSelected ? ' selected' : ''}`;
      li.dataset.projectId = project.id;

      const colorDot = document.createElement('span');
      colorDot.className = 'color-dot';
      colorDot.style.background = project.color || '#6366f1';

      const meta = document.createElement('div');
      meta.className = 'project-meta';
      const title = document.createElement('strong');
      title.textContent = project.name;
      const projectTasks = state.tasks.filter(task => task.projectId === project.id);
      const openCount = projectTasks.filter(task => task.status !== 'concluido').length;
      const caption = document.createElement('small');
      caption.textContent = projectTasks.length
        ? `${openCount} de ${projectTasks.length} em andamento`
        : 'Sem tarefas ainda';

      meta.appendChild(title);
      meta.appendChild(caption);

      li.appendChild(colorDot);
      li.appendChild(meta);

      const deleteButton = document.createElement('button');
      deleteButton.className = 'delete-project';
      deleteButton.type = 'button';
      deleteButton.textContent = 'Excluir';
      deleteButton.title = 'Excluir projeto';

      deleteButton.addEventListener('click', event => {
        event.stopPropagation();
        handleProjectDeletion(project.id);
      });

      li.appendChild(deleteButton);

      li.addEventListener('click', () => {
        if (state.selectedProjectId === project.id) return;
        state.selectedProjectId = project.id;
        saveState();
        renderProjects();
        renderTasks();
        renderNotes();
      });

      elements.projectList.appendChild(li);
    });
  }

  function handleProjectDeletion(projectId) {
    const project = getProjectById(projectId);
    if (!project) return;

    if (state.projects.length === 1) {
      alert('Mantenha ao menos um projeto para continuar usando o painel.');
      return;
    }

    const confirmed = confirm(`Tem certeza que deseja remover o projeto "${project.name}"? Todas as tarefas relacionadas também serão removidas.`);
    if (!confirmed) return;

    state.projects = state.projects.filter(p => p.id !== projectId);
    state.tasks = state.tasks.filter(task => task.projectId !== projectId);
    delete state.notes.projectNotes[projectId];

    if (state.selectedProjectId === projectId) {
      state.selectedProjectId = state.projects[0]?.id ?? null;
    }

    saveState();
    renderProjects();
    renderTasks();
    renderSummary();
    renderAgenda();
    renderNotes();
  }

  function renderSummary() {
    const totalTasks = state.tasks.length;
    const activeTasks = state.tasks.filter(task => task.status !== 'concluido').length;
    const completedTasks = state.tasks.filter(task => task.status === 'concluido').length;
    const overdueTasks = state.tasks.filter(task => isTaskOverdue(task)).length;
    const agendaRange = Number(state.filters.agendaRange) || 7;
    const upcomingTasks = state.tasks.filter(task => isTaskUpcoming(task, agendaRange)).length;

    elements.summaryGrid.innerHTML = `
      <div class="summary-card">
        <h4>Tarefas ativas</h4>
        <strong>${activeTasks}</strong>
        <span>Em todos os projetos</span>
      </div>
      <div class="summary-card">
        <h4>Concluídas</h4>
        <strong>${completedTasks}</strong>
        <span>Total geral (${totalTasks} registradas)</span>
      </div>
      <div class="summary-card">
        <h4>Agenda (${agendaRange} dias)</h4>
        <strong>${upcomingTasks}</strong>
        <span>Prazos próximos</span>
      </div>
      <div class="summary-card">
        <h4>Em atraso</h4>
        <strong>${overdueTasks}</strong>
        <span>Tarefas que precisam de atenção</span>
      </div>
    `;
  }

  function renderAgenda() {
    const tasksWithDueDate = state.tasks
      .map(task => ({
        ...task,
        due: parseDate(task.dueDate)
      }))
      .filter(task => task.due instanceof Date && !isNaN(task.due.getTime()));

    const today = startOfDay(new Date());
    const range = Number(state.filters.agendaRange) || 7;

    const relevantTasks = tasksWithDueDate.filter(task => {
      const diff = differenceInDays(task.due, today);
      return diff <= range || diff < 0;
    }).sort((a, b) => a.due - b.due);

    if (!relevantTasks.length) {
      elements.agendaList.innerHTML = '<div class="agenda-empty">Nenhuma entrega para o período selecionado. Aproveite para adiantar algo!</div>';
      return;
    }

    const groups = new Map();
    relevantTasks.forEach(task => {
      const key = task.due.toISOString().slice(0, 10);
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key).push(task);
    });

    elements.agendaList.innerHTML = '';

    groups.forEach((tasks, key) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'agenda-day';

      const header = document.createElement('header');
      const dateLabel = document.createElement('h4');
      const date = parseDate(key);
      dateLabel.textContent = formatLongDate(date);
      const qty = document.createElement('span');
      qty.textContent = tasks.length === 1 ? '1 entrega' : `${tasks.length} entregas`;

      header.appendChild(dateLabel);
      header.appendChild(qty);
      wrapper.appendChild(header);

      tasks.forEach(task => {
        const project = getProjectById(task.projectId);
        const pillColor = project?.color || '#6366f1';
        const taskRow = document.createElement('div');
        taskRow.className = `agenda-task${isTaskOverdue(task) ? ' overdue' : ''}`;

        const badge = document.createElement('span');
        badge.className = 'agenda-project';
        badge.style.color = pillColor;
        badge.textContent = project ? project.name : 'Projeto removido';

        const title = document.createElement('span');
        title.className = 'agenda-title';
        title.textContent = task.title;

        const dueTime = document.createElement('span');
        dueTime.className = 'agenda-due';
        const diff = differenceInDays(task.due, today);
        dueTime.textContent = diff === 0
          ? 'vence hoje'
          : diff < 0
            ? `${Math.abs(diff)} dia(s) atrás`
            : `em ${diff} dia(s)`;

        taskRow.appendChild(badge);
        taskRow.appendChild(title);
        taskRow.appendChild(dueTime);
        wrapper.appendChild(taskRow);
      });

      elements.agendaList.appendChild(wrapper);
    });
  }

  function renderTasks() {
    const project = getProjectById(state.selectedProjectId);

    if (!project) {
      elements.currentProjectTitle.textContent = 'Tarefas';
      elements.taskCountLabel.textContent = 'Nenhum projeto selecionado.';
      elements.taskList.innerHTML = '<div class="task-empty">Crie um projeto para começar a organizar as tarefas.</div>';
      return;
    }

    elements.currentProjectTitle.textContent = `Tarefas — ${project.name}`;

    const projectTasks = state.tasks.filter(task => task.projectId === project.id);
    const total = projectTasks.length;
    const completed = projectTasks.filter(task => task.status === 'concluido').length;
    elements.taskCountLabel.textContent = total
      ? `${completed} de ${total} concluídas`
      : 'Nenhuma tarefa cadastrada ainda.';

    const filter = state.filters.status;
    const filteredTasks = filter === 'all'
      ? projectTasks
      : projectTasks.filter(task => task.status === filter);

    const sortedTasks = filteredTasks.slice().sort((a, b) => {
      if (a.status === 'concluido' && b.status !== 'concluido') return 1;
      if (b.status === 'concluido' && a.status !== 'concluido') return -1;

      const dateA = parseDate(a.dueDate);
      const dateB = parseDate(b.dueDate);

      if (dateA && dateB) {
        return dateA.getTime() - dateB.getTime();
      }
      if (dateA) return -1;
      if (dateB) return 1;

      return a.title.localeCompare(b.title, 'pt-BR');
    });

    if (!sortedTasks.length) {
      const message = filter === 'all'
        ? 'Adicione tarefas para este projeto e acompanhe o progresso por aqui.'
        : 'Nenhuma tarefa com este status. Que tal atualizar alguma?';
      elements.taskList.innerHTML = `<div class="task-empty">${message}</div>`;
      return;
    }

    elements.taskList.innerHTML = '';

    sortedTasks.forEach(task => {
      const item = document.createElement('article');
      item.className = 'task-item';
      item.dataset.taskId = task.id;

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'task-checkbox';
      checkbox.checked = task.status === 'concluido';
      checkbox.title = task.status === 'concluido' ? 'Marcar como não concluída' : 'Marcar como concluída';
      checkbox.addEventListener('change', () => {
        const nextStatus = checkbox.checked ? 'concluido' : 'pendente';
        updateTask(task.id, { status: nextStatus });
      });

      const body = document.createElement('div');
      body.className = 'task-body';

      const titleRow = document.createElement('div');
      titleRow.className = 'task-title';
      titleRow.textContent = task.title;

      const statusPill = document.createElement('span');
      statusPill.className = `status-pill ${task.status}`;
      statusPill.textContent = formatStatus(task.status);
      titleRow.appendChild(statusPill);

      body.appendChild(titleRow);

      if (task.description) {
        const description = document.createElement('p');
        description.className = 'task-description';
        description.textContent = task.description;
        body.appendChild(description);
      }

      const meta = document.createElement('div');
      meta.className = 'task-meta';

      if (task.dueDate) {
        const due = document.createElement('span');
        due.className = 'due';
        if (isTaskOverdue(task)) {
          due.classList.add('overdue');
        }
        due.textContent = `Prazo: ${formatShortDate(parseDate(task.dueDate))}`;
        meta.appendChild(due);
      }

      const priority = document.createElement('span');
      priority.className = `priority-pill ${task.priority}`;
      priority.textContent = `Prioridade ${formatPriority(task.priority)}`;
      meta.appendChild(priority);

      body.appendChild(meta);

      const controls = document.createElement('div');
      controls.className = 'task-controls';

      const statusSelect = document.createElement('select');
      ['pendente', 'em_progresso', 'concluido'].forEach(statusValue => {
        const option = document.createElement('option');
        option.value = statusValue;
        option.textContent = formatStatus(statusValue);
        statusSelect.appendChild(option);
      });
      statusSelect.value = task.status;
      statusSelect.addEventListener('change', () => {
        updateTask(task.id, { status: statusSelect.value });
      });

      const deleteButton = document.createElement('button');
      deleteButton.type = 'button';
      deleteButton.textContent = 'Remover';
      deleteButton.addEventListener('click', () => {
        const confirmDelete = confirm(`Deseja remover a tarefa "${task.title}"?`);
        if (!confirmDelete) return;
        removeTask(task.id);
      });

      controls.appendChild(statusSelect);
      controls.appendChild(deleteButton);

      item.appendChild(checkbox);
      item.appendChild(body);
      item.appendChild(controls);

      elements.taskList.appendChild(item);
    });
  }

  function renderNotes() {
    if (document.activeElement !== elements.generalNotes) {
      elements.generalNotes.value = state.notes.general || '';
    }

    const project = getProjectById(state.selectedProjectId);

    if (!project) {
      elements.projectNotesHint.textContent = 'Nenhum projeto selecionado.';
      elements.projectNotes.value = '';
      elements.projectNotes.disabled = true;
      return;
    }

    elements.projectNotes.disabled = false;
    elements.projectNotesHint.textContent = `Projeto: ${project.name}`;

    const currentNote = state.notes.projectNotes?.[project.id] ?? '';
    if (document.activeElement !== elements.projectNotes) {
      elements.projectNotes.value = currentNote;
    }
  }

  function updateTask(taskId, changes) {
    const index = state.tasks.findIndex(task => task.id === taskId);
    if (index === -1) return;
    state.tasks[index] = { ...state.tasks[index], ...changes };
    saveState();
    renderTasks();
    renderSummary();
    renderAgenda();
  }

  function removeTask(taskId) {
    state.tasks = state.tasks.filter(task => task.id !== taskId);
    saveState();
    renderTasks();
    renderSummary();
    renderAgenda();
  }

  function syncStatusFilters() {
    if (!elements.statusFilters) return;
    const buttons = elements.statusFilters.querySelectorAll('[data-status-filter]');
    buttons.forEach(button => {
      const status = button.dataset.statusFilter;
      if (status === state.filters.status) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });
  }

  function updateCurrentDate() {
    if (!elements.headerDate) return;
    const now = new Date();
    const formatted = new Intl.DateTimeFormat('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    }).format(now);
    elements.headerDate.textContent = capitalize(formatted);
  }

  function generateId(prefix) {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return `${prefix}-${crypto.randomUUID()}`;
    }
    return `${prefix}-${Math.random().toString(36).slice(2, 11)}`;
  }

  function getProjectById(projectId) {
    return state.projects.find(project => project.id === projectId) || null;
  }

  function parseDate(value) {
    if (!value || typeof value !== 'string') return null;
    const [year, month, day] = value.split('-').map(Number);
    if (!year || !month || !day) return null;
    const date = new Date();
    date.setFullYear(year, month - 1, day);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  function startOfDay(date) {
    const clone = new Date(date.getTime());
    clone.setHours(0, 0, 0, 0);
    return clone;
  }

  function differenceInDays(dateA, dateB) {
    const diff = startOfDay(dateA).getTime() - startOfDay(dateB).getTime();
    return Math.round(diff / MS_PER_DAY);
  }

  function isTaskOverdue(task) {
    if (!task.dueDate || task.status === 'concluido') return false;
    const due = parseDate(task.dueDate);
    if (!due) return false;
    const today = startOfDay(new Date());
    return due.getTime() < today.getTime();
  }

  function isTaskUpcoming(task, range) {
    if (!task.dueDate || task.status === 'concluido') return false;
    const due = parseDate(task.dueDate);
    if (!due) return false;
    const today = startOfDay(new Date());
    const diff = differenceInDays(due, today);
    return diff >= 0 && diff <= range;
  }

  function formatLongDate(date) {
    if (!(date instanceof Date) || isNaN(date.getTime())) return 'Data indefinida';
    return capitalize(new Intl.DateTimeFormat('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    }).format(date));
  }

  function formatShortDate(date) {
    if (!(date instanceof Date) || isNaN(date.getTime())) return '-';
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short'
    }).format(date);
  }

  function formatStatus(status) {
    switch (status) {
      case 'pendente':
        return 'Pendente';
      case 'em_progresso':
        return 'Em andamento';
      case 'concluido':
        return 'Concluída';
      default:
        return 'Pendente';
    }
  }

  function formatPriority(priority) {
    switch (priority) {
      case 'alta':
        return 'alta';
      case 'baixa':
        return 'baixa';
      default:
        return 'média';
    }
  }

  function capitalize(text) {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  function debounce(fn, delay = 300) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn.apply(null, args), delay);
    };
  }

  function getRandomPaletteColor() {
    const palette = ['#6366f1', '#ec4899', '#22c55e', '#f59e0b', '#06b6d4', '#f97316'];
    return palette[Math.floor(Math.random() * palette.length)];
  }
})();
