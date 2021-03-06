<?php
  header('Content-Type: text/cache-manifest');
  echo "CACHE MANIFEST\n\n";
  echo "CACHE:\n";

  $hashes = "";
  $dir = new RecursiveDirectoryIterator(".");
  foreach(new RecursiveIteratorIterator($dir) as $file) {
    if ($file->IsFile() &&
    !strpos($file, 'manifest') &&
    substr($file->getFilename(), 0, 1) != ".") {
      echo $file . "\n";
      $hashes .= md5_file($file);
    }
  }

  echo "\n# Hash: " . md5($hashes) . "\n";
?>                 