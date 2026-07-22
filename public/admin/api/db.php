<?php
require_once __DIR__ . '/../config.php';

function getDBConnection() {
    static $pdo = null;
    if ($pdo !== null) return $pdo;

    try {
        $driver = DB_DRIVER;
        if ($driver === 'pgsql') {
            $dsn = "pgsql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";sslmode=require";
            $pdo = new PDO($dsn, DB_USER, DB_PASS, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
            ]);
        } elseif ($driver === 'mysql') {
            $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=utf8mb4";
            $pdo = new PDO($dsn, DB_USER, DB_PASS, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
            ]);
        } else {
            $sqliteFile = __DIR__ . '/../portfolio.sqlite';
            $pdo = new PDO("sqlite:" . $sqliteFile, null, null, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
            ]);
            initSqliteTables($pdo);
        }
        return $pdo;
    } catch (PDOException $e) {
        return null;
    }
}

function initSqliteTables($pdo) {
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS experience (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            period TEXT, role TEXT, company TEXT, type TEXT,
            bullets TEXT, tags TEXT, documents TEXT, photos TEXT,
            sort_order INT DEFAULT 0, created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS projects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT, type TEXT, description TEXT, tech TEXT,
            badge TEXT, badge_type TEXT, github_url TEXT, demo_url TEXT,
            banner_image TEXT, shape TEXT, color1 TEXT, color2 TEXT,
            sort_order INT DEFAULT 0, created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS skills (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT, category TEXT, key_name TEXT, logo_url TEXT, sort_order INT DEFAULT 0
        );
        CREATE TABLE IF NOT EXISTS achievements (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT, year TEXT, description TEXT, issuer TEXT,
            type TEXT DEFAULT 'award', certificate_image TEXT,
            sort_order INT DEFAULT 0, created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT, email TEXT, subject TEXT, message TEXT,
            is_read INTEGER DEFAULT 0, received_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    ");
}
