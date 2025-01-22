<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// Include PHPMailer classes
require 'PHPMailer-master/src/PHPMailer.php';
require 'PHPMailer-master/src/SMTP.php';
require 'PHPMailer-master/src/Exception.php';

// Set up logging
$timestamp = date("Y-m-d-H-i-s");
$logFileName = "php-error-$timestamp.log";

ini_set('log_errors', 1);
ini_set('error_log', $logFileName);
ini_set('display_errors', 0);
error_reporting(E_ALL);

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Sanitize inputs
    $name = htmlspecialchars(trim($_POST["name"]), ENT_QUOTES, 'UTF-8');
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $phone = htmlspecialchars(trim($_POST["phone"]), ENT_QUOTES, 'UTF-8');
    $message = htmlspecialchars(trim($_POST["message"]), ENT_QUOTES, 'UTF-8');
    $privacyCheck = isset($_POST["privacy-check"]) ? 'Agreed' : 'Not Agreed';

    // Capture the IP address
    $ip = $_SERVER['REMOTE_ADDR'];
    if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
        $ip = $_SERVER['HTTP_CLIENT_IP'];
    } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $ip = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'])[0];
    }

    // Validate IP address
    if (!filter_var($ip, FILTER_VALIDATE_IP)) {
        $ip = "Invalid IP Address";
    }

    // Validate required fields
    $errors = [];
    if (empty($name)) {
        echo json_encode(["success" => false]);
        exit;
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(["success" => false]);
        exit;
    }
    if (empty($message)) {
        echo json_encode(["success" => false]);
        exit;
    }
    if ($privacyCheck === 'Not Agreed') {
        echo json_encode(["success" => false]);
        exit;
    }

    // Use PHPMailer to send the email
    $mail = new PHPMailer(true);

    try {
        // Server settings
        $mail->SMTPDebug = SMTP::DEBUG_OFF; // Turn off debugging in production
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'thunder.thoster@gmail.com';
        $mail->Password = 'yomf dbsl wlrp ltba'; // Use your app password
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        // Recipients
        $mail->setFrom('thunder.thoster@gmail.com', 'XPAYTAX');
        $mail->addAddress('thunder.thoster@gmail.com', 'Tomislav Suto');
        $mail->addReplyTo($email, $name); // User's email and name in Reply-To

        // Content
        $mail->isHTML(true);
        $mail->Subject = "Contact Form Submission - $name";
        $mail->Body = "
            <strong>Name:</strong> $name<br>
            <strong>Email:</strong> $email<br>
            <strong>Phone:</strong> $phone<br>
            <strong>Privacy Policy:</strong> $privacyCheck<br>
            <strong>IP Address:</strong> $ip<br>
            <strong>Message:</strong><br>$message
        ";
        $mail->AltBody = "
            Name: $name\n
            Email: $email\n
            Phone: $phone\n
            Privacy Policy Agreement: $privacyCheck\n
            IP Address: $ip\n
            Message:\n$message
        ";

        // Send the email
        $mail->send();
        echo json_encode(["success" => true]);
    } catch (Exception $e) {
        error_log("Mailer Error: " . $mail->ErrorInfo); // Log error for debugging
        echo json_encode(["success" => false]);
    }
    exit;
} else {
    http_response_code(405); // Method not allowed
    echo json_encode(["success" => false]);
    exit;
}
