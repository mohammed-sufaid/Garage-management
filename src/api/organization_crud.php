<?php
header("Content-Type: application/json");

// Include config
require_once 'config.php';

// Get JSON input for POST/PUT
$input = json_decode(file_get_contents("php://input"), true);

// Determine request method
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            $id = intval($_GET['id']);
            $sql = "SELECT * FROM organization_details WHERE organization_id = $id";
            $result = $conn->query($sql);
            $data = $result->fetch_assoc();
        } else {
            $sql = "SELECT * FROM organization_details";
            $result = $conn->query($sql);
            $data = [];
            while ($row = $result->fetch_assoc()) {
                $data[] = $row;
            }
        }
        echo json_encode($data);
        break;

    case 'POST':
        if (!$input) {
            echo json_encode(["status" => "error", "message" => "No input data"]);
            exit();
        }

        $stmt = $conn->prepare("
        INSERT INTO organization_details 
        (organization_name, email_address, phone_number, address, city, state, country, gst_number, zipCode, pan_number, website_url, description) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param(
            "ssssssssssss",
            $input['organization_name'],
            $input['email_address'],
            $input['phone_number'],
            $input['address'],
            $input['city'],
            $input['state'],
            $input['country'],
            $input['gst_number'],
            $input['zipCode'],
            $input['pan_number'],
            $input['website_url'],
            $input['description']
        );

        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Organization added successfully"]);
        } else {
            echo json_encode(["status" => "error", "message" => $stmt->error]);
        }

        $stmt->close();
        break;

    case 'PUT':
        if (!isset($_GET['id'])) {
            echo json_encode(["status" => "error", "message" => "Missing ID in URL"]);
            exit();
        }

        $id = intval($_GET['id']);

        $stmt = $conn->prepare("UPDATE organization_details SET organization_name=?, email_address=?, phone_number=?, address=?, city=?, state=?, country=?, gst_number=?, zipCode=?, pan_number=?, website_url=?, description=? WHERE organization_id=?");
        $stmt->bind_param(
            "ssssssssssssi",
            $input['organization_name'],
            $input['email_address'],
            $input['phone_number'],
            $input['address'],
            $input['city'],
            $input['state'],
            $input['country'],
            $input['gst_number'],
            $input['zipCode'],
            $input['pan_number'],
            $input['website_url'],
            $input['description'],
            $id
        );

        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Organization updated successfully"]);
        } else {
            echo json_encode(["status" => "error", "message" => $stmt->error]);
        }

        $stmt->close();
        break;
    default:
        echo json_encode(["status" => "error", "message" => "Invalid request method"]);
        break;
}

$conn->close();
?>
