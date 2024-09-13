 <?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST["name"];
    $organization = $_POST["organization"];
    $email = $_POST["email"];
    $inquiry = $_POST["inquiry"];

    $to = "hugohuijs@hotmail.com"; // Replace with your email address
    $subject = "New Contact Form Submission";
    $message = "Name: $name\n";
    $message .= "Organization: $organization\n";
    $message .= "Email: $email\n";
    $message .= "Message:\n$inquiry\n";

    $headers = "From: $email";

    if (mail($to, $subject, $message, $headers)) {
        // Email sent successfully
        echo "Thank you for your submission. We will get back to you shortly.";
    } else {
        // Email sending failed
        echo "Sorry, there was an error sending your message.";
    }
}
?>
