<?php
/**
 * Created by PhpStorm.
 * User: yurab
 * Date: 12.07.2017
 * Time: 22:54
 */

if ($_POST) {
    $user['name'] = $_POST['name'];
    $user['secondname'] = $_POST['secondname'];
    $user['lastname'] = $_POST['lastname'];
    $user['age'] = $_POST['age'];

    $text_file = fopen("./user-file.txt", "w");
    $txt = json_encode($user);
    fwrite($text_file, $txt);
    fclose($text_file);

    echo json_encode(['success' => true]);
} elseif ($_GET['balance']) {
    $rand = rand(1,3);
    $res = true;

    if($rand === 1)
        $res = false;

    echo json_encode(['success' => $res, 'balance' => rand(200, 20000), 'message' => 'СООБЩЕНИЕ ОШИБКИ']);
}