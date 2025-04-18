<?php
include("sql_login.php");

$connection = mysqli_connect($dbServer, $dbUsername, $dbPassword, $dbName);
mysqli_set_charset($connection, "utf8mb4");


if ($connection == false){
    echo "no connection";
}

$user = mysqli_real_escape_string($connection, $_REQUEST['user']);
$token = mysqli_real_escape_string($connection, $_REQUEST['token']);

$result = mysqli_query($connection, "SELECT * FROM `tt-users` WHERE `user` = '$user'");


if(mysqli_num_rows($result) >= 1){
    $rows = array();
    while($row = mysqli_fetch_assoc($result)){
        $rows[] = $row;
    }

    if($token==$rows[0]['token']){
        $result = mysqli_query($connection, "UPDATE `tt-users` SET `token`= 0 WHERE `user` = '$user'");
    }
    
}

mysqli_close($connection);
?>