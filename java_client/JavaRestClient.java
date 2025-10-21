package java_client;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;

/**
 * A robust Java REST Client for the Campus Resource Finder API, using 
 * HttpURLConnection and the org.json library for structured JSON handling.
 */
public class JavaRestClient {
    
    // Base URL for the API endpoints
    private static final String BASE_URL = "http://localhost:3000/api";

    // --- Public API Methods (Resource Finder Endpoints) ---

    public String getUsers() throws IOException {
        return sendGetRequest("/users");
    }

    public String getResources() throws IOException {
        return sendGetRequest("/resources");
    }
    
    public String getBookings() throws IOException {
        return sendGetRequest("/bookings");
    }

    public String getUserById(int userId) throws IOException {
        return sendGetRequest("/users/" + userId);
    }
    
    public String getBookingById(String bookingId) throws IOException {
        return sendGetRequest("/bookings/" + bookingId);
    }

    /**
     * Creates a new user.
     * @param jsonBody JSON string representing the new user.
     * @return JSON string of the created user object.
     * @throws IOException if the request fails.
     */
    public String createUser(String jsonBody) throws IOException {
        return sendPostRequest("/users", jsonBody);
    }
    
    /**
     * Creates a new booking.
     * @param jsonBody JSON string representing the new booking.
     * @return JSON string of the created booking object.
     * @throws IOException if the request fails.
     */
    public String createBooking(String jsonBody) throws IOException {
        return sendPostRequest("/bookings", jsonBody);
    }
    
    /**
     * Updates an existing booking.
     * @param bookingId The ID of the booking to update.
     * @param jsonBody JSON string containing fields to update.
     * @return JSON string of the updated booking object.
     * @throws IOException if the request fails.
     */
    public String updateBooking(String bookingId, String jsonBody) throws IOException {
        return sendPutRequest("/bookings/" + bookingId, jsonBody);
    }
    
    /**
     * Deletes a booking by ID.
     * @param bookingId The ID of the booking to delete.
     * @return A success message or the server's response.
     * @throws IOException if the request fails.
     */
    public String deleteBooking(String bookingId) throws IOException {
        return sendDeleteRequest("/bookings/" + bookingId);
    }
    
    // --- Generic Private Request Handlers ---

    private String sendGetRequest(String endpoint) throws IOException {
        URL url = new URL(BASE_URL + endpoint);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("GET");
        conn.setRequestProperty("Accept", "application/json"); 
        
        int responseCode = conn.getResponseCode();
        if (responseCode == HttpURLConnection.HTTP_OK) {
            return readResponse(conn);
        } else {
            String errorDetail = readErrorResponse(conn);
            throw new IOException("GET request failed: " + responseCode + 
                (errorDetail.isEmpty() ? "" : " - " + errorDetail));
        }
    }
    
    private String sendPostRequest(String endpoint, String jsonBody) throws IOException {
        URL url = new URL(BASE_URL + endpoint);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "application/json"); 
        conn.setRequestProperty("Accept", "application/json");
        conn.setDoOutput(true);
        
        try (OutputStream os = conn.getOutputStream()) {
            byte[] input = jsonBody.getBytes(StandardCharsets.UTF_8); 
            os.write(input, 0, input.length);
        }
        
        int responseCode = conn.getResponseCode();
        if (responseCode == HttpURLConnection.HTTP_OK || 
            responseCode == HttpURLConnection.HTTP_CREATED) {
            return readResponse(conn);
        } else {
            String errorDetail = readErrorResponse(conn);
            throw new IOException("POST request failed: " + responseCode + 
                (errorDetail.isEmpty() ? "" : " - " + errorDetail));
        }
    }
    
    private String sendPutRequest(String endpoint, String jsonBody) throws IOException {
        URL url = new URL(BASE_URL + endpoint);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("PUT");
        conn.setRequestProperty("Content-Type", "application/json");
        conn.setRequestProperty("Accept", "application/json");
        conn.setDoOutput(true);
        
        try (OutputStream os = conn.getOutputStream()) {
            byte[] input = jsonBody.getBytes(StandardCharsets.UTF_8);
            os.write(input, 0, input.length);
        }
        
        int responseCode = conn.getResponseCode();
        
        if (responseCode == HttpURLConnection.HTTP_OK) {
            return readResponse(conn);
        } else if (responseCode == HttpURLConnection.HTTP_NO_CONTENT) {
             return "SUCCESS: Update completed (HTTP 204 No Content)";
        } else {
            String errorDetail = readErrorResponse(conn);
            throw new IOException("PUT request failed: " + responseCode + 
                (errorDetail.isEmpty() ? "" : " - " + errorDetail));
        }
    }
    
    private String sendDeleteRequest(String endpoint) throws IOException {
        URL url = new URL(BASE_URL + endpoint);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("DELETE");
        
        int responseCode = conn.getResponseCode();

        if (responseCode == HttpURLConnection.HTTP_OK) {
            return readResponse(conn);
        } else if (responseCode == HttpURLConnection.HTTP_NO_CONTENT) {
            return "SUCCESS: Deletion completed (HTTP 204 No Content)";
        } else {
            String errorDetail = readErrorResponse(conn);
            throw new IOException("DELETE request failed: " + responseCode + 
                (errorDetail.isEmpty() ? "" : " - " + errorDetail));
        }
    }
    
    // --- Response Reading Helpers ---

    private String readResponse(HttpURLConnection conn) throws IOException {
        try (BufferedReader br = new BufferedReader(
            new InputStreamReader(conn.getInputStream(), StandardCharsets.UTF_8))) {
            
            StringBuilder response = new StringBuilder();
            String responseLine;
            while ((responseLine = br.readLine()) != null) {
                response.append(responseLine.trim()); 
            }
            return response.toString();
        }
    }

    private String readErrorResponse(HttpURLConnection conn) {
        try (InputStream errorStream = conn.getErrorStream()) {
            if (errorStream == null) {
                return "";
            }
            
            try (BufferedReader br = new BufferedReader(
                new InputStreamReader(errorStream, StandardCharsets.UTF_8))) {
                
                StringBuilder response = new StringBuilder();
                String responseLine;
                while ((responseLine = br.readLine()) != null) {
                    response.append(responseLine.trim());
                }
                return response.toString();
            }
        } catch (Exception e) {
            return "";
        }
    }

    // --- Main Method for Testing ---

    public static void main(String[] args) {
        JavaRestClient client = new JavaRestClient();

        try {
            System.out.println("=== Testing Campus Resource Finder API ===\n");

            // 1. Get all resources
            System.out.println("1. Getting all resources:");
            String resources = client.getResources();
            System.out.println("Resources response length: " + resources.length());

            // 2. Create a booking
            int testUserId = 1;
            int testResourceId = 1;

            JSONObject newBooking = new JSONObject();
            newBooking.put("userId", testUserId);
            newBooking.put("resourceId", testResourceId);
            newBooking.put("date", "2026-01-20");
            newBooking.put("startTime", "14:00");
            newBooking.put("endTime", "16:00");

            System.out.println("\n2. Creating a booking:");
            String bookingResponse = client.createBooking(newBooking.toString());
            System.out.println("New Booking Created: " + bookingResponse);

            // Extract booking ID (supports string or numeric)
            String newBookingId = extractBookingId(bookingResponse);
            if (newBookingId == null) {
                System.err.println("Failed to extract booking ID. Exiting.");
                return;
            }

            // 3. Update the booking
            JSONObject updateBooking = new JSONObject();
            updateBooking.put("endTime", "17:00");

            System.out.println("\n3. Updating booking ID " + newBookingId + " (Changing end time to 17:00):");
            String updateResponse = client.updateBooking(newBookingId, updateBooking.toString());
            System.out.println("Update Response: " + updateResponse);

            // 4. Get updated booking
            System.out.println("\n4. Getting booking ID " + newBookingId + ":");
            String fetchedBooking = client.getBookingById(newBookingId);
            System.out.println("Fetched Booking: " + fetchedBooking);

            // 5. Delete the booking
            System.out.println("\n5. Deleting booking ID " + newBookingId + ":");
            String deleteResponse = client.deleteBooking(newBookingId);
            System.out.println("Delete Response: " + deleteResponse);

            // 6. Intentional error (404)
            String badId = "9999";
            System.out.println("\n6. Attempting to get user ID " + badId + " (Expected 404 Error):");
            try {
                client.getUserById(Integer.parseInt(badId));
            } catch (IOException e) {
                System.out.println("Successfully caught expected error: " + e.getMessage());
            }

        } catch (Exception e) {
            System.err.println("\n*** UNEXPECTED RUNTIME ERROR ***");
            e.printStackTrace();
        }
    }

    /**
     * Extracts the "id" from a JSON string, whether it's numeric or quoted.
     */
    private static String extractBookingId(String json) {
        try {
            int idIndex = json.indexOf("\"id\"");
            if (idIndex == -1) return null;

            int colonIndex = json.indexOf(":", idIndex);
            if (colonIndex == -1) return null;

            int start = colonIndex + 1;
            int end = json.indexOf(",", start);
            if (end == -1) end = json.indexOf("}", start);

            String idValue = json.substring(start, end).trim();
            // Remove quotes if present
            if (idValue.startsWith("\"") && idValue.endsWith("\"")) {
                idValue = idValue.substring(1, idValue.length() - 1);
            }
            return idValue;
        } catch (Exception e) {
            return null;
        }
    }
}
