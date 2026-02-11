document.addEventListener('DOMContentLoaded', () => {
    
    // --- ESTADO GLOBAL ---
    // Aquí guardaremos los archivos en memoria para poder moverlos a la papelera
    let globalFiles = [];
    let currentView = 'active'; // Puede ser 'active' o 'trash'

    // Referencias DOM
    const listContainer = document.getElementById('file-list-container');
    const pageTitle = document.getElementById('page-title');
    const totalIndicator = document.getElementById('total-indicator');
    const searchInput = document.getElementById('search-input');
    
    // Botones
    const btnSelectText = document.getElementById('btn-select-text');
    const headerCheckbox = document.getElementById('header-checkbox');
    const btnDelete = document.getElementById('btn-delete');
    const btnRestore = document.getElementById('btn-restore');
    
    // Navegación
    const navFiles = document.getElementById('nav-files');
    const navTrash = document.getElementById('nav-trash');
    const linkTrashBottom = document.getElementById('link-trash-bottom');
    const trashBadge = document.getElementById('trash-badge');
    
    // Grupos de botones
    const activeButtons = document.getElementById('active-buttons');
    const trashButtons = document.getElementById('trash-buttons');

    // Configuración iconos
    const typeConfig = {
        'pdf':   { icon: 'fa-file-pdf',    class: 'bg-pdf',   color: '#EF4444' },
        'img':   { icon: 'fa-image',       class: 'bg-img',   color: '#3B82F6' },
        'excel': { icon: 'fa-file-excel',  class: 'bg-excel', color: '#10B981' },
        'def':   { icon: 'fa-file',        class: 'bg-default', color: '#6B7280' }
    };

    // 1. CARGA INICIAL
    fetch('files.json')
        .then(res => res.json())
        .then(data => {
            // Añadimos la propiedad 'deleted' a false a todos los archivos
            globalFiles = data.map(f => ({ ...f, deleted: false }));
            renderTable();
        })
        .catch(err => console.error("Error cargando JSON", err));

    // 2. FUNCIÓN RENDERIZAR (Cambia según la vista)
    function renderTable() {
        listContainer.innerHTML = '';
        
        // Filtramos: Si vista es 'active', mostramos no borrados. Si es 'trash', mostramos borrados.
        const filesToShow = globalFiles.filter(file => {
            const matchesSearch = file.name.toLowerCase().includes(searchInput.value.toLowerCase());
            const matchesView = currentView === 'active' ? !file.deleted : file.deleted;
            return matchesSearch && matchesView;
        });

        // Actualizar UI
        updateInterfaceState(filesToShow.length);

        // Generar filas
        filesToShow.forEach(file => {
            const conf = typeConfig[file.type] || typeConfig['def'];
            
            const tr = document.createElement('tr');
            // Guardamos el ID en el elemento para saber cual borrar
            tr.dataset.id = file.id; 
            
            tr.innerHTML = `
                <td><input type="checkbox" class="file-checkbox"></td>
                <td>
                    <i class="fa-regular ${conf.icon}" style="color: ${conf.color}; margin-right:8px;"></i>
                    <b>${file.name}</b>
                </td>
                <td><span class="badge ${conf.class}">${file.type}</span></td>
                <td>${file.size}</td>
                <td>
                    ${!file.deleted 
                        ? '<span class="status-ok"><i class="fa-solid fa-circle-check"></i> Activo</span>' 
                        : '<span class="status-del"><i class="fa-solid fa-trash-can"></i> Eliminado</span>'}
                </td>
            `;
            listContainer.appendChild(tr);
        });

        attachCheckboxEvents();
        updateTrashBadge();
    }

    // 3. CAMBIO DE VISTA (NAVEGACIÓN)
    function switchView(viewName) {
        currentView = viewName;
        
        // Resetear selección
        headerCheckbox.checked = false;
        btnSelectText.innerHTML = '<i class="fa-regular fa-square-check"></i> Seleccionar todos';
        btnSelectText.classList.remove('active');

        // Cambiar estilos de navegación
        if (viewName === 'active') {
            pageTitle.textContent = "Mis Archivos";
            navFiles.classList.add('active');
            navTrash.classList.remove('active');
            activeButtons.classList.remove('hidden');
            trashButtons.classList.add('hidden');
            linkTrashBottom.style.display = 'block'; // Mostrar enlace abajo
        } else {
            pageTitle.textContent = "Papelera de Reciclaje";
            navFiles.classList.remove('active');
            navTrash.classList.add('active');
            activeButtons.classList.add('hidden');
            trashButtons.classList.remove('hidden');
            linkTrashBottom.style.display = 'none'; // Ocultar enlace abajo (ya estamos ahí)
        }
        renderTable();
    }

    // Eventos Click Navegación
    navFiles.addEventListener('click', () => switchView('active'));
    navTrash.addEventListener('click', () => switchView('trash'));
    linkTrashBottom.addEventListener('click', (e) => {
        e.preventDefault(); // Evitar salto de pagina
        switchView('trash');
    });

    // 4. LÓGICA DE BORRADO Y RESTAURACIÓN (SIN PREGUNTAR)
    
    // Función genérica para cambiar estado
    function toggleFileStatus(targetStatusIsDeleted) {
        const checkedBoxes = document.querySelectorAll('.file-checkbox:checked');
        
        if (checkedBoxes.length === 0) return;

        // Recorremos los checkboxes marcados
        checkedBoxes.forEach(cb => {
            const row = cb.closest('tr');
            const id = parseInt(row.dataset.id);
            
            // Buscamos el archivo en el array global y cambiamos su estado
            const file = globalFiles.find(f => f.id === id);
            if (file) {
                file.deleted = targetStatusIsDeleted;
            }
        });

        // Animación rápida y recarga
        renderTable();
        
        // Resetear botón maestro
        headerCheckbox.checked = false;
        btnSelectText.innerHTML = '<i class="fa-regular fa-square-check"></i> Seleccionar todos';
        btnSelectText.classList.remove('active');
    }

    // Botón Eliminar (Mueve a papelera)
    btnDelete.addEventListener('click', () => toggleFileStatus(true));

    // Botón Restaurar (Saca de papelera)
    btnRestore.addEventListener('click', () => toggleFileStatus(false));


    // 5. EVENTOS VARIOS DE UI
    function attachCheckboxEvents() {
        const checkboxes = document.querySelectorAll('.file-checkbox');
        checkboxes.forEach(cb => {
            cb.addEventListener('change', (e) => {
                const row = e.target.closest('tr');
                if(e.target.checked) row.classList.add('selected');
                else row.classList.remove('selected');
                updateSelectionCount();
            });
        });
    }

    function updateSelectionCount() {
        const count = document.querySelectorAll('.file-checkbox:checked').length;
        if(count > 0) {
            btnDelete.classList.remove('hidden');
            btnRestore.classList.remove('hidden');
        } else {
            btnDelete.classList.add('hidden');
            btnRestore.classList.add('hidden');
        }
    }

    function updateInterfaceState(count) {
        totalIndicator.textContent = `${count} elementos mostrados`;
    }

    function updateTrashBadge() {
        const deletedCount = globalFiles.filter(f => f.deleted).length;
        trashBadge.textContent = deletedCount;
        if(deletedCount > 0) trashBadge.classList.remove('hidden');
        else trashBadge.classList.add('hidden');
    }

    // Botón Seleccionar Todos
    btnSelectText.addEventListener('click', () => {
        headerCheckbox.checked = !headerCheckbox.checked;
        headerCheckbox.dispatchEvent(new Event('change'));
    });

    headerCheckbox.addEventListener('change', (e) => {
        const isChecked = e.target.checked;
        const rows = document.querySelectorAll('#file-list-container tr');
        rows.forEach(row => {
            row.querySelector('.file-checkbox').checked = isChecked;
            if(isChecked) row.classList.add('selected');
            else row.classList.remove('selected');
        });
        
        if(isChecked) {
            btnSelectText.innerHTML = '<i class="fa-regular fa-square-minus"></i> Deseleccionar';
            btnSelectText.classList.add('active');
        } else {
            btnSelectText.innerHTML = '<i class="fa-regular fa-square-check"></i> Seleccionar todos';
            btnSelectText.classList.remove('active');
        }
        updateSelectionCount();
    });

    searchInput.addEventListener('keyup', renderTable);
});