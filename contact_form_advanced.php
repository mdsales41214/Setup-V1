<?php
/**
 * Geavanceerd contactformulier voor Dekvloers Meren
 * Inclusief spam protection, validation en CRM integratie
 */

// Security headers
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');

// Rate limiting
session_start();
$max_submissions = 3;
$time_window = 3600; // 1 hour

if (!isset($_SESSION['submissions'])) {
    $_SESSION['submissions'] = [];
}

// Clean old submissions
$_SESSION['submissions'] = array_filter($_SESSION['submissions'], function($time) use ($time_window) {
    return (time() - $time) < $time_window;
});

if (count($_SESSION['submissions']) >= $max_submissions) {
    http_response_code(429);
    die(json_encode(['error' => 'Te veel aanvragen. Probeer het later opnieuw.']));
}

class ContactFormHandler {
    private $honeypot_field = 'website_url';
    private $required_fields = ['name', 'email', 'phone', 'message', 'service_type'];
    private $max_message_length = 2000;
    private $allowed_file_types = ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'];
    private $max_file_size = 5 * 1024 * 1024; // 5MB
    
    public function __construct() {
        $this->validateCSRF();
    }
    
    private function validateCSRF() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            if (!isset($_POST['csrf_token']) || !hash_equals($_SESSION['csrf_token'], $_POST['csrf_token'])) {
                http_response_code(403);
                die(json_encode(['error' => 'Ongeldige aanvraag. Ververs de pagina en probeer opnieuw.']));
            }
        }
    }
    
    public function generateCSRFToken() {
        if (!isset($_SESSION['csrf_token'])) {
            $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
        }
        return $_SESSION['csrf_token'];
    }
    
    public function processForm() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            return $this->showForm();
        }
        
        // Honeypot check
        if (!empty($_POST[$this->honeypot_field])) {
            // Silent fail for bots
            http_response_code(200);
            die(json_encode(['success' => true, 'message' => 'Bedankt voor uw bericht!']));
        }
        
        $data = $this->validateInput($_POST);
        
        if (!$data['valid']) {
            http_response_code(400);
            return json_encode(['error' => $data['errors']]);
        }
        
        // Process file uploads
        $attachments = $this->handleFileUploads();
        
        // Send emails
        $email_sent = $this->sendEmails($data['data'], $attachments);
        
        // Save to database/CRM
        $saved = $this->saveToCRM($data['data'], $attachments);
        
        // Log submission
        $this->logSubmission($data['data']);
        
        $_SESSION['submissions'][] = time();
        
        if ($email_sent && $saved) {
            return json_encode([
                'success' => true, 
                'message' => 'Bedankt voor uw bericht! We nemen binnen 24 uur contact met u op.',
                'redirect' => '/bedankt'
            ]);
        } else {
            http_response_code(500);
            return json_encode(['error' => 'Er is een probleem opgetreden. Probeer het opnieuw of bel ons direct.']);
        }
    }
    
    private function validateInput($input) {
        $errors = [];
        $data = [];
        
        // Required fields
        foreach ($this->required_fields as $field) {
            if (empty($input[$field])) {
                $errors[] = "Het veld '{$this->getFieldLabel($field)}' is verplicht.";
            } else {
                $data[$field] = trim($input[$field]);
            }
        }
        
        // Email validation
        if (!empty($data['email']) && !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            $errors[] = 'Voer een geldig e-mailadres in.';
        }
        
        // Phone validation (Dutch format)
        if (!empty($data['phone']) && !preg_match('/^(\+31|0031|0)[1-9][0-9]{8}$/', preg_replace('/[\s\-\(\)]/', '', $data['phone']))) {
            $errors[] = 'Voer een geldig Nederlands telefoonnummer in.';
        }
        
        // Message length
        if (!empty($data['message']) && strlen($data['message']) > $this->max_message_length) {
            $errors[] = "Uw bericht mag maximaal {$this->max_message_length} karakters bevatten.";
        }
        
        // Service type validation
        $valid_services = ['cementdekvloer', 'anhydriet', 'vloerverwarming', 'zwevende-dekvloer', 'anders'];
        if (!empty($data['service_type']) && !in_array($data['service_type'], $valid_services)) {
            $errors[] = 'Selecteer een geldige dienst.';
        }
        
        // Spam detection
        if ($this->isSpam($data)) {
            $errors[] = 'Uw bericht werd gedetecteerd als spam. Probeer het opnieuw.';
        }
        
        // Additional fields
        $data['project_size'] = $input['project_size'] ?? '';
        $data['timeline'] = $input['timeline'] ?? '';
        $data['budget'] = $input['budget'] ?? '';
        $data['location'] = $input['location'] ?? '';
        $data['newsletter'] = isset($input['newsletter']) ? 1 : 0;
        
        return [
            'valid' => empty($errors),
            'errors' => $errors,
            'data' => $data
        ];
    }
    
    private function isSpam($data) {
        $spam_keywords = ['buy now', 'click here', 'free money', 'viagra', 'casino', 'lottery'];
        $message_lower = strtolower($data['message'] ?? '');
        
        foreach ($spam_keywords as $keyword) {
            if (strpos($message_lower, $keyword) !== false) {
                return true;
            }
        }
        
        // Too many URLs
        if (substr_count($message_lower, 'http') > 2) {
            return true;
        }
        
        return false;
    }
    
    private function handleFileUploads() {
        $attachments = [];
        
        if (!empty($_FILES['attachments']['name'][0])) {
            foreach ($_FILES['attachments']['name'] as $key => $name) {
                if ($_FILES['attachments']['error'][$key] === UPLOAD_ERR_OK) {
                    $file = [
                        'name' => $name,
                        'tmp_name' => $_FILES['attachments']['tmp_name'][$key],
                        'size' => $_FILES['attachments']['size'][$key],
                        'type' => $_FILES['attachments']['type'][$key]
                    ];
                    
                    if ($this->validateFile($file)) {
                        $safe_name = $this->sanitizeFileName($name);
                        $upload_path = "uploads/" . uniqid() . "_" . $safe_name;
                        
                        if (move_uploaded_file($file['tmp_name'], $upload_path)) {
                            $attachments[] = $upload_path;
                        }
                    }
                }
            }
        }
        
        return $attachments;
    }
    
    private function validateFile($file) {
        $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        
        if (!in_array($extension, $this->allowed_file_types)) {
            return false;
        }
        
        if ($file['size'] > $this->max_file_size) {
            return false;
        }
        
        return true;
    }
    
    private function sanitizeFileName($filename) {
        return preg_replace('/[^a-zA-Z0-9._-]/', '', $filename);
    }
    
    private function sendEmails($data, $attachments) {
        // Email to company
        $to_company = 'info@dekvloersmeren.com';
        $subject_company = "Nieuwe offerteaanvraag: {$data['service_type']}";
        $message_company = $this->buildCompanyEmail($data);
        
        // Email to customer
        $to_customer = $data['email'];
        $subject_customer = 'Bedankt voor uw aanvraag - Dekvloers Meren';
        $message_customer = $this->buildCustomerEmail($data);
        
        $headers = [
            'From: noreply@dekvloersmeren.com',
            'Reply-To: info@dekvloersmeren.com',
            'Content-Type: text/html; charset=UTF-8',
            'X-Mailer: PHP/' . phpversion()
        ];
        
        $company_sent = mail($to_company, $subject_company, $message_company, implode("\r\n", $headers));
        $customer_sent = mail($to_customer, $subject_customer, $message_customer, implode("\r\n", $headers));
        
        return $company_sent && $customer_sent;
    }
    
    private function buildCompanyEmail($data) {
        return "
        <h2>Nieuwe offerteaanvraag</h2>
        <p><strong>Naam:</strong> {$data['name']}</p>
        <p><strong>Email:</strong> {$data['email']}</p>
        <p><strong>Telefoon:</strong> {$data['phone']}</p>
        <p><strong>Dienst:</strong> {$data['service_type']}</p>
        <p><strong>Projectgrootte:</strong> {$data['project_size']}</p>
        <p><strong>Timeline:</strong> {$data['timeline']}</p>
        <p><strong>Budget:</strong> {$data['budget']}</p>
        <p><strong>Locatie:</strong> {$data['location']}</p>
        <p><strong>Bericht:</strong></p>
        <p>{$data['message']}</p>
        <p><strong>Ontvangen op:</strong> " . date('d-m-Y H:i:s') . "</p>
        ";
    }
    
    private function buildCustomerEmail($data) {
        return "
        <h2>Bedankt voor uw aanvraag!</h2>
        <p>Beste {$data['name']},</p>
        <p>We hebben uw aanvraag voor <strong>{$data['service_type']}</strong> ontvangen.</p>
        <p>Een van onze specialisten neemt binnen 24 uur contact met u op via:</p>
        <ul>
            <li>Email: {$data['email']}</li>
            <li>Telefoon: {$data['phone']}</li>
        </ul>
        <p>Voor dringende vragen kunt u ons direct bellen: <strong>020-1234567</strong></p>
        <p>Met vriendelijke groet,<br>Team Dekvloers Meren</p>
        ";
    }
    
    private function saveToCRM($data, $attachments) {
        // Database connection
        try {
            $pdo = new PDO('mysql:host=localhost;dbname=dekvloers_meren', $username, $password);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            
            $stmt = $pdo->prepare("
                INSERT INTO contact_submissions 
                (name, email, phone, service_type, message, project_size, timeline, budget, location, newsletter, attachments, created_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
            ");
            
            return $stmt->execute([
                $data['name'], $data['email'], $data['phone'], $data['service_type'],
                $data['message'], $data['project_size'], $data['timeline'], $data['budget'],
                $data['location'], $data['newsletter'], json_encode($attachments)
            ]);
            
        } catch (PDOException $e) {
            error_log("Database error: " . $e->getMessage());
            return false;
        }
    }
    
    private function logSubmission($data) {
        $log_entry = date('Y-m-d H:i:s') . " - Contact form submission from {$data['email']}\n";
        file_put_contents('logs/contact_forms.log', $log_entry, FILE_APPEND | LOCK_EX);
    }
    
    private function getFieldLabel($field) {
        $labels = [
            'name' => 'Naam',
            'email' => 'E-mailadres',
            'phone' => 'Telefoonnummer',
            'message' => 'Bericht',
            'service_type' => 'Type dienst'
        ];
        
        return $labels[$field] ?? $field;
    }
    
    public function showForm() {
        $csrf_token = $this->generateCSRFToken();
        // Return form HTML with CSRF token
        return '';
    }
}

// Process the form
$handler = new ContactFormHandler();
echo $handler->processForm();
?>