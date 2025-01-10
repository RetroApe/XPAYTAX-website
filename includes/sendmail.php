<?php

$timestamp = date("Y-m-d-H-i-s");
$logFileName = "php-error-$timestamp.log";

ini_set('log_errors', 1);
ini_set('error_log', $logFileName);
ini_set('display_errors', 0);
error_reporting(E_ALL);
error_log("Request method: " . $_SERVER["REQUEST_METHOD"]);


if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Sanitize inputs
    $name = htmlspecialchars(trim($_POST["name"]), ENT_QUOTES, 'UTF-8');
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL); // Email sanitization remains valid
    $phone = htmlspecialchars(trim($_POST["phone"]), ENT_QUOTES, 'UTF-8');
    $message = htmlspecialchars(trim($_POST["message"]), ENT_QUOTES, 'UTF-8');

    // Validate required fields
    $errors = [];
    if (empty($name)) {
        $errors[] = "Name is required.";
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Invalid email address.";
    }
    if (empty($message)) {
        $errors[] = "Message is required.";
    }

    // If there are errors, redirect back to the form with error messages
    if (!empty($errors)) {
        exit;
    }

    // Email configuration
    $to = "thunder.thoster@gmail.com";
    $subject = "New Contact Form Submission";
    $body = "Name: $name\nEmail: $email\nPhone: $phone\n\nMessage:\n$message";
    $headers =  "From: $email\r\n" .
                "Reply-To: $email\r\n" .
                "X-Mailer: PHP/" . phpversion();

    // Send the email
    if (mail($to, $subject, $body, $headers)) {
        // Respond with success
        echo json_encode(["success" => true]);
    } else {
        // Respond with failure
        echo json_encode(["success" => false]);
    }
    exit;
} else {
    http_response_code(405); // Method not allowed
    echo json_encode(["success" => false]);
    exit;
}
