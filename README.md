
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Enterprise Data Manager</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <div class="app-container">
        
        <!-- SIDEBAR -->
        <aside class="sidebar">
            <div class="logo-area">
                <div class="logo-icon">
                    <i class="fa-solid fa-cube"></i>
                </div>
                <span>NexusCloud</span>
            </div>

            <nav class="nav-links">
                <div class="nav-category">NAVEGACIÓN</div>
                <button id="nav-files" class="nav-item active">
                    <i class="fa-regular fa-folder-open"></i> Mis Archivos
                </button>
                
                <div class="nav-category">HERRAMIENTAS</div>
                <button id="nav-trash" class="nav-item">
                    <i class="fa-regular fa-trash-can"></i> Papelera de Reciclaje
                    <span id="trash-badge" class="badge-count hidden">0</span>
                </button>
            </nav>
        </aside>

        <!-- MAIN CONTENT -->
        <main class="main-content">
            
            <!-- HEADER -->
            <header class="top-header">
                <div class="breadcrumbs">
                    <span class="crumb-root">Sistema</span>
                    <i class="fa-solid fa-chevron-right separator"></i>
                    <span id="page-title" class="crumb-current">Mis Archivos</span>
                </div>
            </header>

            <!-- WORKSPACE -->
            <section class="workspace">
                
                <!-- TOOLBAR -->
                <div class="toolbar">
                    <div class="search-bar">
                        <i class="fa-solid fa-magnifying-glass"></i>
                        <input type="text" id="search-input" placeholder="Buscar...">
                    </div>
                    
                    <div class="action-buttons">
                        <button id="btn-select-text" class="btn btn-secondary">
                            <i class="fa-regular fa-square-check"></i> Seleccionar todos
                        </button>

                        <div id="active-buttons" class="btn-group">
                            <button id="btn-delete" class="btn btn-danger hidden">
                                <i class="fa-regular fa-trash-can"></i> Mover a Papelera
                            </button>
                        </div>

                        <div id="trash-buttons" class="btn-group hidden">
                            <button id="btn-restore" class="btn btn-success hidden">
                                <i class="fa-solid fa-rotate-left"></i> Restaurar
                            </button>
                        </div>
                    </div>
                </div>

                <!-- DATA TABLE -->
                <div class="table-wrapper">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th width="40">
                                    <input type="checkbox" id="header-checkbox">
                                </th>
                                <th>Nombre del Archivo</th>
                                <th>Tipo</th>
                                <th>Tamaño</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody id="file-list-container">
                        </tbody>
                    </table>
                </div>

                <!-- FOOTER -->
                <div class="table-footer">
                    <span id="total-indicator" class="text-muted">Cargando...</span>
                    
                    <div class="footer-links">
                        <button id="link-trash-bottom" class="trash-link">
                            <i class="fa-solid fa-trash"></i> Ver archivos eliminados
                        </button>
                    </div>
                </div>

            </section>
        </main>
    </div>

    <script src="logic.js"></script>
</body>
</html>
