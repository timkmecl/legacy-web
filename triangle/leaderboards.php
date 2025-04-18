<?php

include("sql_login.php");

$connection = mysqli_connect($dbServer, $dbUsername, $dbPassword, $dbName);
mysqli_set_charset($connection, "utf8mb4");


if ($connection == false){
    echo "no connection";
}

$user = mysqli_real_escape_string($connection, $_REQUEST['user']);


$result = mysqli_query($connection, "SELECT `user`, `best`, 
                        CASE WHEN `user` = '$user' THEN 1 ELSE 0 END as `current` 
                        FROM `tt-users` ORDER BY `best` DESC");

$leaderboard = "";
$rows = array();
while($row = mysqli_fetch_assoc($result)){
    $rows[] = $row;

    $leaderboard .= '[' . json_encode($row['user'], JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP | JSON_UNESCAPED_UNICODE) . ', ' . $row['best'] . ', ' . $row['current'] . ' ],';
}

echo '{"leaderboards" : [' . substr($leaderboard, 0, -1) . '] } ';



mysqli_close($connection);
?>