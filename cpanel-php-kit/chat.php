<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// 1. Get Gemini API Key (from environment variable or paste directly below)
$apiKey = getenv('GEMINI_API_KEY') ?: 'YOUR_GEMINI_API_KEY_HERE';

if (!$apiKey || $apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
    http_response_code(500);
    echo json_encode(['error' => 'Gemini API key is not configured in chat.php']);
    exit;
}

// 2. Read incoming request
$input = json_decode(file_get_contents('php://input'), true);
$userMessage = isset($input['message']) ? trim($input['message']) : '';

if (empty($userMessage)) {
    http_response_code(400);
    echo json_encode(['error' => 'Message is required']);
    exit;
}

// 3. Prepare Prompt for Gemini
$systemInstruction = "You are the IMRC (International Monetary Rehabilitation Cooperation) AI Assistant. You help victims of identity theft and financial abuse. Be helpful, professional, and empathetic.\n\nUser says: " . $userMessage;

$apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" . urlencode($apiKey);

$payload = [
    "contents" => [
        [
            "parts" => [
                ["text" => $systemInstruction]
            ]
        ]
    ]
];

// 4. Send request to Google Gemini API via cURL
$ch = curl_init($apiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json'
]);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

if ($curlError) {
    http_response_code(500);
    echo json_encode(['error' => 'cURL error: ' . $curlError]);
    exit;
}

$responseData = json_decode($response, true);

if ($httpCode >= 400 || !isset($responseData['candidates'][0]['content']['parts'][0]['text'])) {
    http_response_code($httpCode >= 400 ? $httpCode : 500);
    echo json_encode(['error' => $responseData['error']['message'] ?? 'Failed to get response from Gemini AI']);
    exit;
}

$replyText = $responseData['candidates'][0]['content']['parts'][0]['text'];

echo json_encode(['reply' => $replyText]);
