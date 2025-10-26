document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('projectForm');
    const input = document.getElementById('projectInput');
    const list = document.getElementById('projectList');
    const STORAGE_KEY = 'meinPortfolioProjects';

    let projects = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

    // Normalisiere vorhandene Projekte: falls keine id vorhanden, hinzufügen
    projects = projects.map(p => p.id ? p : ({ ...p, id: Date.now().toString(36) + Math.random().toString(36).slice(2) }));

    function save() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    }

    function render() {
        list.innerHTML = '';
        projects.forEach((p) => {
            const li = document.createElement('li');
            li.className = 'project-item projekt-box';

            const title = document.createElement('span');
            title.className = 'title' + (p.done ? ' done' : '');
            title.textContent = p.name;

            const controls = document.createElement('div');

            const toggleBtn = document.createElement('button');
            toggleBtn.type = 'button';
            toggleBtn.className = 'btn toggle';
            toggleBtn.textContent = p.done ? 'Unerledigt' : 'Erledigt';
            toggleBtn.setAttribute('aria-pressed', String(!!p.done));
            toggleBtn.setAttribute('aria-label', (p.done ? 'Als unerledigt markieren: ' : 'Als erledigt markieren: ') + p.name);
            toggleBtn.addEventListener('click', () => {
                const idx = projects.findIndex(x => x.id === p.id);
                if (idx === -1) return;
                projects[idx].done = !projects[idx].done;
                save();
                render();
            });

            const delBtn = document.createElement('button');
            delBtn.type = 'button';
            delBtn.className = 'btn';
            delBtn.textContent = 'Löschen';
            delBtn.setAttribute('aria-label', 'Projekt löschen: ' + p.name);
            delBtn.addEventListener('click', () => {
                projects = projects.filter(x => x.id !== p.id);
                save();
                render();
            });

            controls.appendChild(toggleBtn);
            controls.appendChild(delBtn);

            li.appendChild(title);
            li.appendChild(controls);
            list.appendChild(li);
        });
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = input.value.trim();
        if (!name) return;
        const id = Date.now().toString(36) + Math.random().toString(36).slice(2);
        projects.push({ id, name, done: false });
        input.value = '';
        save();
        render();
    });

    render();
    console.log('Interaktive Projektliste geladen');
});