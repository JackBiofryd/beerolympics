<?php

if (isset($_POST['submit'])) {
    $name = $_POST['name'];
    $mailFrom = $_POST['email'];
    $message = $_POST['message'];

    $mailTo = "jobico8561@svcache.com";
    $headers = "From: ".$mailFrom;
    $body = "Name: ".$name."\n"."Email: ".$mailFrom."\n\n".$message."\n";

    mail($mailTo, $subject, $body, $headers);
    header('Location: index.html');
}

?>