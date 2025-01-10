<?php

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
        header("Location: ../contact-form.html?error=" . urlencode(implode(", ", $errors)));
        exit;
    }

    // Email configuration
    $to = "your-email@example.com"; // Replace with your email address
    $subject = "New Contact Form Submission";
    $body = "Name: $name\nEmail: $email\nPhone: $phone\n\nMessage:\n$message";
    $headers = "From: $email";

    // Send the email
    if (mail($to, $subject, $body, $headers)) {
        // Redirect to a success page or add query param for success
        header("Location: ../contact-form.html?success=true");
    } else {
        // Redirect back with error
        header("Location: ../contact-form.html?error=Failed to send email. Please try again.");
    }
    exit;
} else {
    http_response_code(405); // Method not allowed
    echo "Method Not Allowed";
    exit;
}
