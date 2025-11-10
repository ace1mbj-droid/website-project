<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = htmlspecialchars(trim($_POST["name"]));
    $email = htmlspecialchars(trim($_POST["email"]));
    $message = htmlspecialchars(trim($_POST["message"]));
    
    if (empty($name) || empty($email) || empty($message)) {
        header("Location: contact-us.html?error=missing");
        exit;
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        header("Location: contact-us.html?error=invalid");
        exit;
    }
    
    $to = "ace1mbj@gmail.com";
    $subject = "New Contact Form Submission from Ace#1 Website";
    $body = "Name: " . $name . "\n";
    $body .= "Email: " . $email . "\n\n";
    $body .= "Message:\n" . $message;
    
    $headers = "From: " . $email . "\r\n";
    $headers .= "Reply-To: " . $email . "\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    
    if (mail($to, $subject, $body, $headers)) {
        header("Location: contact-us.html?success=1");
    } else {
        header("Location: contact-us.html?error=send");
    }
    exit;
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Contact Form</title>
</head>
<body>
    <p>This page handles form submissions. Please use the contact form instead.</p>
    <a href="contact-us.html">← Back to Contact Form</a>
</body>
</html>