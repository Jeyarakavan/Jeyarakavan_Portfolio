<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/db.php';

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    $input = $_POST;
}

$name = trim($input['name'] ?? '');
$email = trim($input['email'] ?? '');
$subject = trim($input['subject'] ?? 'New Portfolio Inquiry');
$message = trim($input['message'] ?? '');

if (empty($name) || empty($email) || empty($message)) {
    echo json_encode(['success' => false, 'error' => 'Please fill in all required fields.']);
    exit;
}

$pdo = getDBConnection();
$saved = false;

if ($pdo) {
    try {
        $stmt = $pdo->prepare("INSERT INTO messages (name, email, subject, message) VALUES (?, ?, ?, ?)");
        $stmt->execute([$name, $email, $subject, $message]);
        $saved = true;
    } catch (Exception $e) {
        // Log error
    }
}

// Forward email to jeyagandan74@gmail.com
$to = NOTIFICATION_EMAIL;
$mailSubject = "Portfolio Contact: " . $subject;
$mailBody = "New message received from your Portfolio website:\n\n"
          . "Name: $name\n"
          . "Email: $email\n"
          . "Subject: $subject\n\n"
          . "Message:\n$message\n\n"
          . "-------------------------\n"
          . "Sent from Jeyarakavan Portfolio";

$headers = "From: noreply@" . ($_SERVER['HTTP_HOST'] ?? 'jeyarakavan.com') . "\r\n"
         . "Reply-To: $email\r\n"
         . "X-Mailer: PHP/" . phpversion();

// Attempt mail send (returns true if sendmail configured on server)
@mail($to, $mailSubject, $mailBody, $headers);

echo json_encode([
    'success' => true,
    'message' => 'Your message has been received! I will reply to you as soon as possible.'
]);
