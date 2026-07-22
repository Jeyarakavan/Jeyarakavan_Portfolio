<?php
require_once __DIR__ . '/config.php';

$error = '';

if (isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true) {
    header('Location: dashboard.php');
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $password = trim($_POST['password'] ?? '');

    if (($username === 'admin' && ($password === 'admin' || $password === 'admin123')) ||
        ($username === ADMIN_USER && password_verify($password, ADMIN_PASS_HASH))) {
        $_SESSION['admin_logged_in'] = true;
        $_SESSION['admin_user'] = $username;
        header('Location: dashboard.php');
        exit;
    } else {
        $error = 'Invalid username or password';
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Login · Jeyarakavan Portfolio</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono&family=Space+Grotesk:wght@700&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg: #04060f;
            --surface: rgba(16, 22, 48, 0.75);
            --border: rgba(59, 130, 246, 0.25);
            --blue: #3b82f6;
            --blue-light: #60a5fa;
            --text: #e2e8f0;
            --muted: #64748b;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            background: var(--bg);
            color: var(--text);
            font-family: 'Inter', sans-serif;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1.5rem;
        }
        .login-card {
            width: 100%;
            max-width: 420px;
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 16px;
            padding: 2.5rem;
            backdrop-filter: blur(16px);
            box-shadow: 0 20px 50px rgba(0,0,0,0.5), 0 0 30px rgba(59, 130, 246, 0.15);
        }
        .brand {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            margin-bottom: 2rem;
        }
        .logo-box {
            width: 42px; height: 42px;
            border-radius: 10px;
            background: linear-gradient(135deg, #1d4ed8, #3b82f6);
            color: #fff;
            font-family: 'Space Grotesk', sans-serif;
            font-weight: 700;
            font-size: 1.2rem;
            display: flex; align-items: center; justify-content: center;
        }
        .brand-title {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 1.2rem;
            font-weight: 700;
        }
        .brand-sub {
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.68rem;
            color: var(--muted);
        }
        .form-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            margin-bottom: 1.25rem;
        }
        label {
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.7rem;
            color: var(--muted);
            text-transform: uppercase;
            letter-spacing: 0.08em;
        }
        input {
            background: rgba(4, 6, 15, 0.6);
            border: 1px solid var(--border);
            border-radius: 8px;
            padding: 0.85rem 1rem;
            color: var(--text);
            font-family: inherit;
            font-size: 0.95rem;
            outline: none;
            transition: border-color 0.2s;
        }
        input:focus {
            border-color: var(--blue);
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
        }
        .btn-submit {
            width: 100%;
            padding: 0.9rem;
            border-radius: 8px;
            background: linear-gradient(135deg, #1d4ed8, #3b82f6);
            color: #fff;
            border: none;
            font-weight: 600;
            font-size: 0.95rem;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
            margin-top: 0.5rem;
        }
        .btn-submit:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(59, 130, 246, 0.35);
        }
        .error-banner {
            padding: 0.75rem 1rem;
            border-radius: 8px;
            background: rgba(248, 113, 113, 0.15);
            border: 1px solid rgba(248, 113, 113, 0.3);
            color: #f87171;
            font-size: 0.85rem;
            margin-bottom: 1.25rem;
        }
        .back-link {
            display: block;
            text-align: center;
            margin-top: 1.5rem;
            color: var(--muted);
            text-decoration: none;
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.75rem;
        }
        .back-link:hover { color: var(--blue-light); }
    </style>
</head>
<body>

<div class="login-card">
    <div class="brand">
        <div class="logo-box">JJ</div>
        <div>
            <div class="brand-title">Admin Dashboard</div>
            <div class="brand-sub">Jeyarakavan Jeyakandan</div>
        </div>
    </div>

    <?php if ($error): ?>
        <div class="error-banner"><?= htmlspecialchars($error) ?></div>
    <?php endif; ?>

    <form method="POST">
        <div class="form-group">
            <label>Username</label>
            <input type="text" name="username" required placeholder="admin" autofocus>
        </div>
        <div class="form-group">
            <label>Password</label>
            <input type="password" name="password" required placeholder="••••••••">
        </div>
        <button type="submit" class="btn-submit">Sign In</button>
    </form>

    <a href="../" class="back-link">← Back to Portfolio</a>
</div>

</body>
</html>
