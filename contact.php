<?php

if (isset($_POST['submit'])) {
    $name = $_POST['name'];
    $mailFrom = $_POST['email'];
    $message = $_POST['message'];

    $mailTo = "jackbiofryd11@gmail.com";
    $headers = "From: ".$mailFrom;
    $body = "Name: ".$name."\n"."Email: ".$mailFrom."\n\n".$message."\n";

    mail($mailTo, $subject, $body, $headers);
    echo('Mail Sent!');
}