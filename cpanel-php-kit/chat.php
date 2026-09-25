<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// ==================================================================
// 🔑 PASTE YOUR GEMINI API KEY HERE ON LINE 15:
// ==================================================================
$apiKey = 'PASTE_YOUR_GEMINI_API_KEY_HERE';


// Clean up any accidental spaces or surrounding quotes
$apiKey = trim($apiKey, " \t\n\r\0\x0B'\"");

// List of fallback models if one experiences peak traffic spikes
$activeModels = [
    'gemini-3.8-flash',
    'gemini-2.5-pro',
    'gemini-3.6-flash',
    'gemini-2.5-flash-preview-tts',
    'gemma-4-26b-a4b-it'
];

// 🩺 Browser Diagnostics & Live AI Generation Test
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $hasKey = ($apiKey !== 'PASTE_YOUR_GEMINI_API_KEY_HERE' && !empty($apiKey));
    $testReply = null;
    $errorMsg = null;
    $testedModel = null;

    if ($hasKey) {
        $testPayload = [
            "system_instruction" => [
                "parts" => [
                    ["text" => "You are the IMRC (International Monetary Rehabilitation Cooperation) AI Assistant. Help victims of identity theft and financial abuse. Output ONLY your final direct response to the user."]
                ]
            ],
            "contents" => [
                [
                    "role" => "user",
                    "parts" => [["text" => "hi"]]
                ]
            ]
        ];
        $jsonData = json_encode($testPayload);

        foreach ($activeModels as $model) {
            $testUrl = "https://generativelanguage.googleapis.com/v1beta/models/" . $model . ":generateContent?key=" . urlencode($apiKey);
            $ch = curl_init($testUrl);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonData);
            curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
            curl_setopt($ch, CURLOPT_TIMEOUT, 15);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
            $res = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);

            $json = json_decode($res, true);
            if ($httpCode === 200 && isset($json['candidates'][0]['content']['parts'][0]['text'])) {
                $testReply = trim($json['candidates'][0]['content']['parts'][0]['text']);
                $testedModel = $model;
                break;
            } else {
                $errorMsg = $json['error']['message'] ?? ("HTTP " . $httpCode);
            }
        }
    }

    echo json_encode([
        'status' => 'healthy',
        'key_configured' => $hasKey,
        'ai_generation_status' => $testReply ? 'SUCCESS (Working via ' . $testedModel . ')' : 'FAILED',
        'sample_response' => $testReply,
        'last_error' => $testReply ? null : $errorMsg,
        'php_version' => phpversion()
    ], JSON_PRETTY_PRINT);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed.']);
    exit;
}

if (empty($apiKey) || $apiKey === 'PASTE_YOUR_GEMINI_API_KEY_HERE') {
    http_response_code(500);
    echo json_encode(['error' => 'Gemini API key is not configured.']);
    exit;
}

// 1. Read message from visitor
$rawInput = file_get_contents('php://input');
$input = json_decode($rawInput, true);
$userMessage = isset($input['message']) ? trim($input['message']) : '';

if (empty($userMessage)) {
    http_response_code(400);
    echo json_encode(['error' => 'Message is required.']);
    exit;
}

// 2. Prepare Structured Prompt with system_instruction so Gemini returns only clean visitor dialogue
$payload = [
    "system_instruction" => [
        "parts" => [
            ["text" => "You are the official IMRC (International Monetary Rehabilitation Cooperation) AI Assistant. You assist victims of identity theft, financial fraud, and abuse. Provide compassionate, clear, concise, and professional guidance. Speak directly to the user in a natural, supportive tone without showing internal thought steps, notes, or meta-analysis."]
        ]
    ],
    "contents" => [
        [
            "role" => "user",
            "parts" => [
                ["text" => $userMessage]
            ]
        ]
    ]
];
$jsonData = json_encode($payload);

// 3. Multi-Model Failover
$replyText = null;
$lastError = '';

foreach ($activeModels as $model) {
    $url = "https://generativelanguage.googleapis.com/v1beta/models/" . $model . ":generateContent?key=" . urlencode($apiKey);

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonData);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_TIMEOUT, 25);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);

    $res = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $err = curl_error($ch);
    curl_close($ch);

    if (!$err && $httpCode === 200) {
        $data = json_decode($res, true);
        if (!empty($data['candidates'][0]['content']['parts'][0]['text'])) {
            $rawReply = $data['candidates'][0]['content']['parts'][0]['text'];
            
            // Clean any markdown thought artifacts if present
            $replyText = trim($rawReply);
            break;
        }
    } else {
        $data = json_decode($res, true);
        $lastError = $data['error']['message'] ?? ($err ?: ("HTTP " . $httpCode));
    }
}

if ($replyText) {
    echo json_encode(['reply' => $replyText]);
} else {
    http_response_code(500);
    echo json_encode(['error' => $lastError ?: 'The AI service is temporarily busy. Please try again shortly.']);
}
