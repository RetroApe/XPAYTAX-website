<?php

// At the top of your PHP file
ini_set('log_errors', 1);
ini_set('error_log', '/path/to/php-error.log'); // Ensure this path is writable
ini_set('display_errors', 0);
error_reporting(E_ALL);


if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Sanitize inputs
    $name = filter_var(trim($_POST["name"]), FILTER_SANITIZE_STRING);
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $phone = filter_var(trim($_POST["phone"]), FILTER_SANITIZE_STRING);
    $message = filter_var(trim($_POST["message"]), FILTER_SANITIZE_STRING);

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
    $headers = "From: $email";

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
    echo "Method Not Allowed";
    exit;
}
