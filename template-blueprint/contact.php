<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// 1. Enter your email address here!
$recipient_email = "your-email@company.com";
$subject_prefix = "New Website Contact: ";

// Read the JSON data sent from the React Frontend
$rest_json = file_get_contents("php://input");
$_POST = json_decode($rest_json, true);

if (empty($_POST['name']) || empty($_POST['email']) || empty($_POST['message'])) {
    echo json_encode(["status" => "error", "message" => "Please fill all required fields."]);
    exit();
}

$name = filter_var($_POST['name'], FILTER_SANITIZE_STRING);
$email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
$message = filter_var($_POST['message'], FILTER_SANITIZE_STRING);

$headers = "From: " . $email . "\r\n";
$headers .= "Reply-To: " . $email . "\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";

$full_message = "
    <h3>New Contact Submission</h3>
    <p><strong>Name:</strong> {$name}</p>
    <p><strong>Email:</strong> {$email}</p>
    <p><strong>Message:</strong><br/>" . nl2br($message) . "</p>
";

// Send the email
if(mail($recipient_email, $subject_prefix . $name, $full_message, $headers)) {
    echo json_encode(["status" => "success", "message" => "Email sent successfully!"]);
} else {
    echo json_encode(["status" => "error", "message" => "Server failed to send email."]);
}
?>
