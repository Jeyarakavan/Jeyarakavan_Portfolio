<?php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/api/db.php';

if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: index.php');
    exit;
}

$pdo = getDBConnection();
$msg = '';
$err = '';

$action = $_POST['action'] ?? $_GET['action'] ?? '';
$tab = $_GET['tab'] ?? 'messages';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    if ($action === 'save_experience') {
        $id = $_POST['id'] ?? '';
        $period = trim($_POST['period'] ?? '');
        $role = trim($_POST['role'] ?? '');
        $company = trim($_POST['company'] ?? '');
        $type = trim($_POST['type'] ?? 'Internship');
        $bullets = json_encode(array_filter(array_map('trim', explode("\n", $_POST['bullets'] ?? ''))));
        $tags = json_encode(array_filter(array_map('trim', explode(',', $_POST['tags'] ?? ''))));

        $photos = [];
        $documents = [];

        if (!empty($_FILES['photos']['name'][0])) {
            foreach ($_FILES['photos']['name'] as $k => $name) {
                if ($_FILES['photos']['error'][$k] === UPLOAD_ERR_OK) {
                    $tmpName = $_FILES['photos']['tmp_name'][$k];
                    $filename = time() . '_' . preg_replace('/[^a-zA-Z0-9_\.-]/', '_', $name);
                    move_uploaded_file($tmpName, UPLOAD_DIR . $filename);
                    $photos[] = $filename;
                }
            }
        }

        if (!empty($_FILES['documents']['name'][0])) {
            foreach ($_FILES['documents']['name'] as $k => $name) {
                if ($_FILES['documents']['error'][$k] === UPLOAD_ERR_OK) {
                    $tmpName = $_FILES['documents']['tmp_name'][$k];
                    $filename = time() . '_' . preg_replace('/[^a-zA-Z0-9_\.-]/', '_', $name);
                    move_uploaded_file($tmpName, UPLOAD_DIR . $filename);
                    $documents[] = $filename;
                }
            }
        }

        if ($pdo) {
            if ($id) {
                $stmt = $pdo->prepare("UPDATE experience SET period=?, role=?, company=?, type=?, bullets=?, tags=? WHERE id=?");
                $stmt->execute([$period, $role, $company, $type, $bullets, $tags, $id]);

                if (!empty($photos)) {
                    $stmt = $pdo->prepare("UPDATE experience SET photos=? WHERE id=?");
                    $stmt->execute([json_encode($photos), $id]);
                }
                if (!empty($documents)) {
                    $stmt = $pdo->prepare("UPDATE experience SET documents=? WHERE id=?");
                    $stmt->execute([json_encode($documents), $id]);
                }
                $msg = 'Experience updated successfully!';
            } else {
                $stmt = $pdo->prepare("INSERT INTO experience (period, role, company, type, bullets, tags, photos, documents) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
                $stmt->execute([$period, $role, $company, $type, $bullets, $tags, json_encode($photos), json_encode($documents)]);
                $msg = 'Experience added successfully!';
            }
        } else {
            $msg = 'Saved locally';
        }
        $tab = 'experience';
    }

    if ($action === 'delete_experience' && isset($_POST['id'])) {
        if ($pdo) {
            $stmt = $pdo->prepare("DELETE FROM experience WHERE id=?");
            $stmt->execute([$_POST['id']]);
            $msg = 'Experience entry deleted.';
        }
        $tab = 'experience';
    }

    if ($action === 'save_project') {
        $id = $_POST['id'] ?? '';
        $title = trim($_POST['title'] ?? '');
        $type = trim($_POST['type'] ?? '');
        $desc = trim($_POST['description'] ?? '');
        $badge = trim($_POST['badge'] ?? '');
        $badge_type = trim($_POST['badge_type'] ?? 'badge-blue');
        $github_url = trim($_POST['github_url'] ?? '');
        $demo_url = trim($_POST['demo_url'] ?? '');
        $tech = json_encode(array_filter(array_map('trim', explode(',', $_POST['tech'] ?? ''))));

        $banner_image = '';
        if (!empty($_FILES['banner_image']['name'])) {
            $filename = time() . '_' . preg_replace('/[^a-zA-Z0-9_\.-]/', '_', $_FILES['banner_image']['name']);
            move_uploaded_file($_FILES['banner_image']['tmp_name'], UPLOAD_DIR . $filename);
            $banner_image = $filename;
        }

        if ($pdo) {
            if ($id) {
                $stmt = $pdo->prepare("UPDATE projects SET title=?, type=?, description=?, tech=?, badge=?, badge_type=?, github_url=?, demo_url=? WHERE id=?");
                $stmt->execute([$title, $type, $desc, $tech, $badge, $badge_type, $github_url, $demo_url, $id]);
                if ($banner_image) {
                    $stmt = $pdo->prepare("UPDATE projects SET banner_image=? WHERE id=?");
                    $stmt->execute([$banner_image, $id]);
                }
                $msg = 'Project updated successfully!';
            } else {
                $stmt = $pdo->prepare("INSERT INTO projects (title, type, description, tech, badge, badge_type, github_url, demo_url, banner_image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
                $stmt->execute([$title, $type, $desc, $tech, $badge, $badge_type, $github_url, $demo_url, $banner_image]);
                $msg = 'Project added successfully!';
            }
        }
        $tab = 'projects';
    }

    if ($action === 'delete_project' && isset($_POST['id'])) {
        if ($pdo) {
            $stmt = $pdo->prepare("DELETE FROM projects WHERE id=?");
            $stmt->execute([$_POST['id']]);
            $msg = 'Project deleted.';
        }
        $tab = 'projects';
    }

    if ($action === 'save_skill') {
        $id = $_POST['id'] ?? '';
        $name = trim($_POST['name'] ?? '');
        $category = trim($_POST['category'] ?? 'Frontend Development');
        $key_name = strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $name));

        $logo_url = '';
        if (!empty($_FILES['logo_image']['name'])) {
            $filename = time() . '_' . preg_replace('/[^a-zA-Z0-9_\.-]/', '_', $_FILES['logo_image']['name']);
            move_uploaded_file($_FILES['logo_image']['tmp_name'], UPLOAD_DIR . $filename);
            $logo_url = $filename;
        }

        if ($pdo) {
            if ($id) {
                $stmt = $pdo->prepare("UPDATE skills SET name=?, category=?, key_name=? WHERE id=?");
                $stmt->execute([$name, $category, $key_name, $id]);
                if ($logo_url) {
                    $stmt = $pdo->prepare("UPDATE skills SET logo_url=? WHERE id=?");
                    $stmt->execute([$logo_url, $id]);
                }
                $msg = 'Skill updated!';
            } else {
                $stmt = $pdo->prepare("INSERT INTO skills (name, category, key_name, logo_url) VALUES (?, ?, ?, ?)");
                $stmt->execute([$name, $category, $key_name, $logo_url]);
                $msg = 'Skill added!';
            }
        }
        $tab = 'skills';
    }

    if ($action === 'delete_skill' && isset($_POST['id'])) {
        if ($pdo) {
            $stmt = $pdo->prepare("DELETE FROM skills WHERE id=?");
            $stmt->execute([$_POST['id']]);
            $msg = 'Skill deleted.';
        }
        $tab = 'skills';
    }

    if ($action === 'save_achievement') {
        $id = $_POST['id'] ?? '';
        $title = trim($_POST['title'] ?? '');
        $year = trim($_POST['year'] ?? '');
        $description = trim($_POST['description'] ?? '');
        $issuer = trim($_POST['issuer'] ?? '');
        $type = trim($_POST['type'] ?? 'award');

        $certificate_image = '';
        if (!empty($_FILES['certificate_image']['name'])) {
            $filename = time() . '_' . preg_replace('/[^a-zA-Z0-9_\.-]/', '_', $_FILES['certificate_image']['name']);
            move_uploaded_file($_FILES['certificate_image']['tmp_name'], UPLOAD_DIR . $filename);
            $certificate_image = $filename;
        }

        if ($pdo) {
            if ($id) {
                $stmt = $pdo->prepare("UPDATE achievements SET title=?, year=?, description=?, issuer=?, type=? WHERE id=?");
                $stmt->execute([$title, $year, $description, $issuer, $type, $id]);
                if ($certificate_image) {
                    $stmt = $pdo->prepare("UPDATE achievements SET certificate_image=? WHERE id=?");
                    $stmt->execute([$certificate_image, $id]);
                }
                $msg = 'Achievement/Certification updated!';
            } else {
                $stmt = $pdo->prepare("INSERT INTO achievements (title, year, description, issuer, type, certificate_image) VALUES (?, ?, ?, ?, ?, ?)");
                $stmt->execute([$title, $year, $description, $issuer, $type, $certificate_image]);
                $msg = 'Achievement/Certification added!';
            }
        }
        $tab = 'achievements';
    }

    if ($action === 'delete_achievement' && isset($_POST['id'])) {
        if ($pdo) {
            $stmt = $pdo->prepare("DELETE FROM achievements WHERE id=?");
            $stmt->execute([$_POST['id']]);
            $msg = 'Item deleted.';
        }
        $tab = 'achievements';
    }

    if ($action === 'delete_message' && isset($_POST['id'])) {
        if ($pdo) {
            $stmt = $pdo->prepare("DELETE FROM messages WHERE id=?");
            $stmt->execute([$_POST['id']]);
            $msg = 'Message deleted.';
        }
        $tab = 'messages';
    }
}

$experiences = $pdo ? $pdo->query("SELECT * FROM experience ORDER BY id DESC")->fetchAll() : [];
$projects = $pdo ? $pdo->query("SELECT * FROM projects ORDER BY id DESC")->fetchAll() : [];
$skills = $pdo ? $pdo->query("SELECT * FROM skills ORDER BY id DESC")->fetchAll() : [];
$achievements = $pdo ? $pdo->query("SELECT * FROM achievements ORDER BY id DESC")->fetchAll() : [];
$messages = $pdo ? $pdo->query("SELECT * FROM messages ORDER BY id DESC")->fetchAll() : [];
$unreadCount = 0;
foreach ($messages as $m) { if (empty($m['is_read'])) $unreadCount++; }
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard · Jeyarakavan Jeyakandan</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono&family=Space+Grotesk:wght@700&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-0: #04060f;
            --bg-1: #07091a;
            --surface-1: rgba(16, 22, 48, 0.75);
            --surface-2: rgba(20, 30, 65, 0.85);
            --border: rgba(59, 130, 246, 0.22);
            --border-bright: rgba(96, 165, 250, 0.45);
            --blue-2: #1d4ed8;
            --blue-3: #3b82f6;
            --blue-4: #60a5fa;
            --cyan: #06b6d4;
            --text: #e2e8f0;
            --text-dim: #94a3b8;
            --text-muted: #64748b;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            background: var(--bg-0);
            color: var(--text);
            font-family: 'Inter', sans-serif;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }
        .admin-nav {
            background: var(--bg-1);
            border-bottom: 1px solid var(--border);
            padding: 1rem 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .admin-brand {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            text-decoration: none;
            color: var(--text);
        }
        .admin-initials {
            width: 36px; height: 36px;
            border-radius: 8px;
            background: linear-gradient(135deg, var(--blue-2), var(--blue-3));
            color: #fff;
            font-family: 'Space Grotesk', sans-serif;
            font-weight: 700;
            display: flex; align-items: center; justify-content: center;
        }
        .admin-title { font-family: 'Space Grotesk', sans-serif; font-size: 1.1rem; font-weight: 700; }
        .nav-right { display: flex; align-items: center; gap: 1rem; }
        .btn-view-site {
            padding: 0.45rem 1rem;
            border-radius: 6px;
            background: rgba(59,130,246,0.15);
            color: var(--blue-4);
            border: 1px solid var(--border);
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.75rem;
            text-decoration: none;
        }
        .btn-logout {
            padding: 0.45rem 1rem;
            border-radius: 6px;
            background: rgba(248,113,113,0.15);
            color: #f87171;
            border: 1px solid rgba(248,113,113,0.3);
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.75rem;
            text-decoration: none;
        }
        .admin-container {
            display: flex;
            flex: 1;
        }
        .sidebar {
            width: 240px;
            background: var(--bg-1);
            border-right: 1px solid var(--border);
            padding: 1.5rem 1rem;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }
        .sidebar-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0.75rem 1rem;
            border-radius: 8px;
            color: var(--text-dim);
            text-decoration: none;
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.8rem;
            transition: all 0.2s;
        }
        .sidebar-item:hover, .sidebar-item.active {
            background: var(--surface-2);
            color: var(--blue-4);
            border: 1px solid var(--border);
        }
        .badge-count {
            background: var(--blue-3);
            color: #fff;
            padding: 0.15rem 0.5rem;
            border-radius: 99px;
            font-size: 0.65rem;
        }
        .main-content {
            flex: 1;
            padding: 2.5rem;
            overflow-y: auto;
        }
        .page-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
        }
        .page-title {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 1.6rem;
            font-weight: 700;
        }
        .alert-msg {
            padding: 0.85rem 1.25rem;
            border-radius: 8px;
            background: rgba(52,211,153,0.15);
            border: 1px solid rgba(52,211,153,0.3);
            color: #34d399;
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.8rem;
            margin-bottom: 1.5rem;
        }
        .card {
            background: var(--surface-1);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 1.75rem;
            margin-bottom: 2rem;
        }
        .card-title {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 1.15rem;
            margin-bottom: 1.25rem;
            color: var(--blue-4);
        }
        .form-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: 1rem;
            margin-bottom: 1.25rem;
        }
        .form-group {
            display: flex;
            flex-direction: column;
            gap: 0.4rem;
        }
        .form-group.full { grid-column: 1 / -1; }
        label {
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.7rem;
            color: var(--text-muted);
            text-transform: uppercase;
        }
        input, select, textarea {
            background: rgba(4, 6, 15, 0.7);
            border: 1px solid var(--border);
            border-radius: 6px;
            padding: 0.75rem;
            color: var(--text);
            font-family: inherit;
            font-size: 0.9rem;
            outline: none;
        }
        input:focus, select:focus, textarea:focus {
            border-color: var(--blue-3);
        }
        textarea { height: 100px; resize: vertical; }
        .btn-primary {
            padding: 0.75rem 1.75rem;
            border-radius: 6px;
            background: linear-gradient(135deg, var(--blue-2), var(--blue-3));
            color: #fff;
            border: none;
            font-weight: 600;
            font-size: 0.85rem;
            cursor: pointer;
        }
        .btn-danger {
            padding: 0.4rem 0.8rem;
            border-radius: 4px;
            background: rgba(248,113,113,0.15);
            color: #f87171;
            border: 1px solid rgba(248,113,113,0.3);
            font-size: 0.75rem;
            cursor: pointer;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.88rem;
        }
        th, td {
            padding: 0.85rem 1rem;
            text-align: left;
            border-bottom: 1px solid var(--border);
        }
        th {
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.7rem;
            color: var(--cyan);
            text-transform: uppercase;
            background: rgba(4,6,15,0.4);
        }
        tr:hover td { background: rgba(255,255,255,0.02); }
    </style>
</head>
<body>

<header class="admin-nav">
    <a href="dashboard.php" class="admin-brand">
        <div class="admin-initials">JJ</div>
        <div class="admin-title">Portfolio Admin Panel</div>
    </a>
    <div class="nav-right">
        <a href="../" target="_blank" class="btn-view-site">🌐 View Site</a>
        <a href="logout.php" class="btn-logout">Logout</a>
    </div>
</header>

<div class="admin-container">
    <aside class="sidebar">
        <a href="?tab=messages" class="sidebar-item <?= $tab === 'messages' ? 'active' : '' ?>">
            <span>📬 Messages</span>
            <?php if ($unreadCount > 0): ?>
                <span class="badge-count"><?= $unreadCount ?></span>
            <?php endif; ?>
        </a>
        <a href="?tab=experience" class="sidebar-item <?= $tab === 'experience' ? 'active' : '' ?>">
            <span>💼 Experience</span>
        </a>
        <a href="?tab=projects" class="sidebar-item <?= $tab === 'projects' ? 'active' : '' ?>">
            <span>🚀 Projects</span>
        </a>
        <a href="?tab=skills" class="sidebar-item <?= $tab === 'skills' ? 'active' : '' ?>">
            <span>⚡ Skills</span>
        </a>
        <a href="?tab=achievements" class="sidebar-item <?= $tab === 'achievements' ? 'active' : '' ?>">
            <span>🏆 Awards & Certs</span>
        </a>
    </aside>

    <main class="main-content">
        <?php if ($msg): ?>
            <div class="alert-msg">✅ <?= htmlspecialchars($msg) ?></div>
        <?php endif; ?>

        <?php if ($tab === 'messages'): ?>
            <div class="page-header">
                <h1 class="page-title">Inbox Messages</h1>
            </div>
            <div class="card">
                <?php if (empty($messages)): ?>
                    <p style="color: var(--text-muted); font-family: 'JetBrains Mono';">No contact messages received yet.</p>
                <?php else: ?>
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Subject</th>
                                <th>Message</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($messages as $m): ?>
                                <tr>
                                    <td style="font-family: 'JetBrains Mono'; font-size: 0.75rem; color: var(--text-muted);"><?= htmlspecialchars($m['received_at'] ?? '') ?></td>
                                    <td><strong><?= htmlspecialchars($m['name']) ?></strong></td>
                                    <td><a href="mailto:<?= htmlspecialchars($m['email']) ?>" style="color: var(--blue-4);"><?= htmlspecialchars($m['email']) ?></a></td>
                                    <td><?= htmlspecialchars($m['subject'] ?? '') ?></td>
                                    <td style="max-width: 300px;"><?= nl2br(htmlspecialchars($m['message'])) ?></td>
                                    <td>
                                        <form method="POST" style="display:inline;">
                                            <input type="hidden" name="action" value="delete_message">
                                            <input type="hidden" name="id" value="<?= $m['id'] ?>">
                                            <button type="submit" class="btn-danger" onclick="return confirm('Delete message?')">Delete</button>
                                        </form>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                <?php endif; ?>
            </div>
        <?php endif; ?>

        <?php if ($tab === 'experience'): ?>
            <div class="page-header">
                <h1 class="page-title">Work Experience</h1>
            </div>
            <div class="card">
                <h3 class="card-title">+ Add New Experience</h3>
                <form method="POST" enctype="multipart/form-data">
                    <input type="hidden" name="action" value="save_experience">
                    <div class="form-grid">
                        <div class="form-group">
                            <label>Role / Position</label>
                            <input type="text" name="role" required placeholder="Software Engineer Intern">
                        </div>
                        <div class="form-group">
                            <label>Company / Organization</label>
                            <input type="text" name="company" required placeholder="Company Name">
                        </div>
                        <div class="form-group">
                            <label>Period</label>
                            <input type="text" name="period" required placeholder="2025 Nov — 2026 May">
                        </div>
                        <div class="form-group">
                            <label>Type</label>
                            <input type="text" name="type" placeholder="Internship / Full-time">
                        </div>
                        <div class="form-group full">
                            <label>Bullet Points (One per line)</label>
                            <textarea name="bullets" required placeholder="Implemented core features...&#10;Optimized REST APIs..."></textarea>
                        </div>
                        <div class="form-group full">
                            <label>Tech Tags (Comma-separated)</label>
                            <input type="text" name="tags" placeholder="React, Node.js, REST API, MySQL">
                        </div>
                        <div class="form-group">
                            <label>Photos / Screenshots</label>
                            <input type="file" name="photos[]" multiple accept="image/*">
                        </div>
                        <div class="form-group">
                            <label>Documents (PDF / Proof)</label>
                            <input type="file" name="documents[]" multiple accept=".pdf,.doc,.docx">
                        </div>
                    </div>
                    <button type="submit" class="btn-primary">Save Experience</button>
                </form>
            </div>

            <div class="card">
                <h3 class="card-title">Existing Experience Entries</h3>
                <?php if (empty($experiences)): ?>
                    <p style="color: var(--text-muted);">No experience entries found in database.</p>
                <?php else: ?>
                    <table>
                        <thead>
                            <tr>
                                <th>Role</th>
                                <th>Company</th>
                                <th>Period</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($experiences as $exp): ?>
                                <tr>
                                    <td><strong><?= htmlspecialchars($exp['role']) ?></strong></td>
                                    <td><?= htmlspecialchars($exp['company']) ?></td>
                                    <td style="font-family: 'JetBrains Mono'; font-size: 0.75rem;"><?= htmlspecialchars($exp['period']) ?></td>
                                    <td>
                                        <form method="POST" style="display:inline;">
                                            <input type="hidden" name="action" value="delete_experience">
                                            <input type="hidden" name="id" value="<?= $exp['id'] ?>">
                                            <button type="submit" class="btn-danger" onclick="return confirm('Delete this experience?')">Delete</button>
                                        </form>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                <?php endif; ?>
            </div>
        <?php endif; ?>

        <?php if ($tab === 'projects'): ?>
            <div class="page-header">
                <h1 class="page-title">Projects</h1>
            </div>
            <div class="card">
                <h3 class="card-title">+ Add New Project</h3>
                <form method="POST" enctype="multipart/form-data">
                    <input type="hidden" name="action" value="save_project">
                    <div class="form-grid">
                        <div class="form-group">
                            <label>Project Title</label>
                            <input type="text" name="title" required placeholder="AI Receptionist System">
                        </div>
                        <div class="form-group">
                            <label>Project Type / Subtitle</label>
                            <input type="text" name="type" placeholder="Final Year Project | Group">
                        </div>
                        <div class="form-group">
                            <label>Badge Label</label>
                            <input type="text" name="badge" placeholder="AI / Full Stack">
                        </div>
                        <div class="form-group">
                            <label>Badge Style</label>
                            <select name="badge_type">
                                <option value="badge-blue">Blue</option>
                                <option value="badge-cyan">Cyan</option>
                                <option value="badge-purple">Purple</option>
                                <option value="badge-teal">Teal</option>
                            </select>
                        </div>
                        <div class="form-group full">
                            <label>Description</label>
                            <textarea name="description" required placeholder="Project overview..."></textarea>
                        </div>
                        <div class="form-group">
                            <label>Tech Stack (Comma-separated)</label>
                            <input type="text" name="tech" placeholder="React, Django, PostgreSQL">
                        </div>
                        <div class="form-group">
                            <label>GitHub Repository URL</label>
                            <input type="url" name="github_url" placeholder="https://github.com/...">
                        </div>
                        <div class="form-group">
                            <label>Live Demo URL</label>
                            <input type="url" name="demo_url" placeholder="https://demo.vercel.app">
                        </div>
                        <div class="form-group">
                            <label>Project Banner Image</label>
                            <input type="file" name="banner_image" accept="image/*">
                        </div>
                    </div>
                    <button type="submit" class="btn-primary">Save Project</button>
                </form>
            </div>

            <div class="card">
                <h3 class="card-title">Existing Projects</h3>
                <?php if (empty($projects)): ?>
                    <p style="color: var(--text-muted);">No projects found.</p>
                <?php else: ?>
                    <table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Badge</th>
                                <th>Links</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($projects as $p): ?>
                                <tr>
                                    <td><strong><?= htmlspecialchars($p['title']) ?></strong></td>
                                    <td><span style="color: var(--cyan);"><?= htmlspecialchars($p['badge'] ?? '') ?></span></td>
                                    <td>
                                        <?php if (!empty($p['github_url'])): ?><a href="<?= htmlspecialchars($p['github_url']) ?>" target="_blank" style="color:var(--blue-4); margin-right:8px;">GitHub</a><?php endif; ?>
                                        <?php if (!empty($p['demo_url'])): ?><a href="<?= htmlspecialchars($p['demo_url']) ?>" target="_blank" style="color:var(--cyan);">Demo</a><?php endif; ?>
                                    </td>
                                    <td>
                                        <form method="POST" style="display:inline;">
                                            <input type="hidden" name="action" value="delete_project">
                                            <input type="hidden" name="id" value="<?= $p['id'] ?>">
                                            <button type="submit" class="btn-danger" onclick="return confirm('Delete project?')">Delete</button>
                                        </form>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                <?php endif; ?>
            </div>
        <?php endif; ?>

        <?php if ($tab === 'skills'): ?>
            <div class="page-header">
                <h1 class="page-title">Skills & Technologies</h1>
            </div>
            <div class="card">
                <h3 class="card-title">+ Add New Skill</h3>
                <form method="POST" enctype="multipart/form-data">
                    <input type="hidden" name="action" value="save_skill">
                    <div class="form-grid">
                        <div class="form-group">
                            <label>Skill Name</label>
                            <input type="text" name="name" required placeholder="TypeScript">
                        </div>
                        <div class="form-group">
                            <label>Category</label>
                            <select name="category">
                                <option value="Frontend Development">Frontend Development</option>
                                <option value="Backend Development">Backend Development</option>
                                <option value="Databases">Databases</option>
                                <option value="Tools & Platforms">Tools & Platforms</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Custom Logo Image</label>
                            <input type="file" name="logo_image" accept="image/*">
                        </div>
                    </div>
                    <button type="submit" class="btn-primary">Save Skill</button>
                </form>
            </div>
        <?php endif; ?>

        <?php if ($tab === 'achievements'): ?>
            <div class="page-header">
                <h1 class="page-title">Awards & Certifications</h1>
            </div>
            <div class="card">
                <h3 class="card-title">+ Add Award or Certification</h3>
                <form method="POST" enctype="multipart/form-data">
                    <input type="hidden" name="action" value="save_achievement">
                    <div class="form-grid">
                        <div class="form-group">
                            <label>Title / Name</label>
                            <input type="text" name="title" required placeholder="AWS Certified Developer">
                        </div>
                        <div class="form-group">
                            <label>Type</label>
                            <select name="type">
                                <option value="award">Award / Recognition</option>
                                <option value="certification">Certification</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Year / Date</label>
                            <input type="text" name="year" placeholder="2025">
                        </div>
                        <div class="form-group">
                            <label>Issuing Organization</label>
                            <input type="text" name="issuer" placeholder="Amazon Web Services / SLIIT">
                        </div>
                        <div class="form-group full">
                            <label>Description</label>
                            <textarea name="description" placeholder="Details about this achievement or certificate..."></textarea>
                        </div>
                        <div class="form-group">
                            <label>Certificate Image / Photo</label>
                            <input type="file" name="certificate_image" accept="image/*">
                        </div>
                    </div>
                    <button type="submit" class="btn-primary">Save Item</button>
                </form>
            </div>

            <div class="card">
                <h3 class="card-title">Existing Items</h3>
                <?php if (empty($achievements)): ?>
                    <p style="color: var(--text-muted);">No entries yet.</p>
                <?php else: ?>
                    <table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Type</th>
                                <th>Year</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($achievements as $ach): ?>
                                <tr>
                                    <td><strong><?= htmlspecialchars($ach['title']) ?></strong></td>
                                    <td><span style="color: var(--cyan);"><?= ucfirst(htmlspecialchars($ach['type'] ?? 'award')) ?></span></td>
                                    <td style="font-family: 'JetBrains Mono';"><?= htmlspecialchars($ach['year'] ?? '') ?></td>
                                    <td>
                                        <form method="POST" style="display:inline;">
                                            <input type="hidden" name="action" value="delete_achievement">
                                            <input type="hidden" name="id" value="<?= $ach['id'] ?>">
                                            <button type="submit" class="btn-danger" onclick="return confirm('Delete item?')">Delete</button>
                                        </form>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                <?php endif; ?>
            </div>
        <?php endif; ?>

    </main>
</div>

</body>
</html>
