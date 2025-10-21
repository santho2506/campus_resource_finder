package java_client;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;

public class JavaRestClientJsonOBJ {
    // Note: This URL must be running and accessible for the main method to work.
    private static final String BASE_URL = "http://localhost:3000/api";

    /**
     * Retrieves all users from the API.
     * @return JSON string of all users.
     * @throws IOException if the request fails.
     */
    public String getUsers() throws IOException {
        return sendGetRequest("/users");
    }
    
    /**
     * Retrieves all resources from the API.
     * @return JSON string of all resources.
     * @throws IOException if the request fails.
     */
    public String getResources() throws IOException {
        return sendGetRequest("/resources");
    }
    
    /**
     * Retrieves all bookings from the API.
     * @return JSON string of all bookings.
     * @throws IOException if the request fails.
     */
    public String getBookings() throws IOException {
        return sendGetRequest("/bookings");
    }
    
    /**
     * Retrieves a user by their ID.
     * @param userId The ID of the user.
     * @return JSON string of the user.
     * @throws IOException if the request fails.
     */
    public String getUserById(int userId) throws IOException {
        return sendGetRequest("/users/" + userId);
    }
    
    /**
     * Retrieves bookings associated with a specific user ID.
     * @param userId The ID of the user.
     * @return JSON string of the user's bookings.
     * @throws IOException if the request fails.
     */
    public String getBookingsByUser(int userId) throws IOException {
        return sendGetRequest("/bookings/user/" + userId);
    }
    
    /**
     * Creates a new user.
     * @param jsonBody The JSON payload for the new user.
     * @return JSON string of the created user.
     * @throws IOException if the request fails.
     */
    public String createUser(String jsonBody) throws IOException {
        return sendPostRequest("/users", jsonBody);
    }
    
    /**
     * Creates a new booking.
     * @param jsonBody The JSON payload for the new booking.
     * @return JSON string of the created booking.
     * @throws IOException if the request fails.
     */
    public String createBooking(String jsonBody) throws IOException {
        return sendPostRequest("/bookings", jsonBody);
    }
    
    /**
     * Updates an existing booking.
     * @param bookingId The ID of the booking to update.
     * @param jsonBody The JSON payload containing updated fields.
     * @return JSON string of the updated booking.
     * @throws IOException if the request fails.
     */
    public String updateBooking(int bookingId, String jsonBody) throws IOException {
        return sendPutRequest("/bookings/" + bookingId, jsonBody);
    }
    
    /**
     * Deletes a booking by ID.
     * @param bookingId The ID of the booking to delete.
     * @return A success message or the server's response.
     * @throws IOException if the request fails.
     */
    public String deleteBooking(int bookingId) throws IOException {
        return sendDeleteRequest("/bookings/" + bookingId);
    }
    
    /**
     * Generic GET request handler.
     * @param endpoint The API path (e.g., /users).
     * @return The response body as a String.
     * @throws IOException if the request fails.
     */
    private String sendGetRequest(String endpoint) throws IOException {
        URL url = new URL(BASE_URL + endpoint);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("GET");
        conn.setRequestProperty("Accept", "application/json");
        
        int responseCode = conn.getResponseCode();
        if (responseCode == HttpURLConnection.HTTP_OK) {
            return readResponse(conn);
        } else {
            // Attempt to read the error stream for detailed feedback
            String errorDetail = readErrorResponse(conn);
            throw new IOException("GET request failed: " + responseCode + 
                (errorDetail.isEmpty() ? "" : " - " + errorDetail));
        }
    }
    
    /**
     * Generic POST request handler.
     * @param endpoint The API path (e.g., /users).
     * @param jsonBody The JSON payload to send.
     * @return The response body as a String.
     * @throws IOException if the request fails.
     */
    private String sendPostRequest(String endpoint, String jsonBody) throws IOException {
        URL url = new URL(BASE_URL + endpoint);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "application/json");
        conn.setRequestProperty("Accept", "application/json");
        conn.setDoOutput(true);
        
        // Write JSON body
        try (OutputStream os = conn.getOutputStream()) {
            byte[] input = jsonBody.getBytes(StandardCharsets.UTF_8);
            os.write(input, 0, input.length);
        }
        
        int responseCode = conn.getResponseCode();
        if (responseCode == HttpURLConnection.HTTP_OK || 
            responseCode == HttpURLConnection.HTTP_CREATED) {
            return readResponse(conn);
        } else {
            // Attempt to read the error stream for detailed feedback
            String errorDetail = readErrorResponse(conn);
            throw new IOException("POST request failed: " + responseCode + 
                (errorDetail.isEmpty() ? "" : " - " + errorDetail));
        }
    }
    
    /**
     * Generic PUT request handler.
     * This method was corrected to properly check the response code.
     * @param endpoint The API path (e.g., /bookings/1).
     * @param jsonBody The JSON payload to send.
     * @return The response body as a String.
     * @throws IOException if the request fails.
     */
    private String sendPutRequest(String endpoint, String jsonBody) throws IOException {
        URL url = new URL(BASE_URL + endpoint);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("PUT");
        conn.setRequestProperty("Content-Type", "application/json");
        conn.setRequestProperty("Accept", "application/json");
        conn.setDoOutput(true);
        
        // Write JSON body
        try (OutputStream os = conn.getOutputStream()) {
            byte[] input = jsonBody.getBytes(StandardCharsets.UTF_8);
            os.write(input, 0, input.length);
        }
        
        int responseCode = conn.getResponseCode();
        
        // Standard success codes for PUT are 200 (OK) or 204 (No Content)
        if (responseCode == HttpURLConnection.HTTP_OK) {
            return readResponse(conn);
        } else if (responseCode == HttpURLConnection.HTTP_NO_CONTENT) {
             return "SUCCESS: Update completed (HTTP 204 No Content)";
        } else {
            // Attempt to read the error stream for detailed feedback
            String errorDetail = readErrorResponse(conn);
            throw new IOException("PUT request failed: " + responseCode + 
                (errorDetail.isEmpty() ? "" : " - " + errorDetail));
        }
    }
    
    /**
     * Generic DELETE request handler.
     * This method was corrected to properly check the response code.
     * @param endpoint The API path (e.g., /bookings/1).
     * @return A success message or the response body as a String.
     * @throws IOException if the request fails.
     */
    private String sendDeleteRequest(String endpoint) throws IOException {
        URL url = new URL(BASE_URL + endpoint);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("DELETE");
        
        int responseCode = conn.getResponseCode();

        // Standard success codes for DELETE are 200 (OK), 202 (Accepted), 204 (No Content)
        if (responseCode == HttpURLConnection.HTTP_OK) {
            return readResponse(conn);
        } else if (responseCode == HttpURLConnection.HTTP_NO_CONTENT) {
            return "SUCCESS: Deletion completed (HTTP 204 No Content)";
        } else {
            // Attempt to read the error stream for detailed feedback
            String errorDetail = readErrorResponse(conn);
            throw new IOException("DELETE request failed: " + responseCode + 
                (errorDetail.isEmpty() ? "" : " - " + errorDetail));
        }
    }
    
    /**
     * Reads the response body from a successful connection's InputStream.
     * @param conn The established HttpURLConnection.
     * @return The response body as a String.
     * @throws IOException if an error occurs during reading.
     */
    private String readResponse(HttpURLConnection conn) throws IOException {
        // Read from the standard InputStream for successful requests
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

    /**
     * Attempts to read the response body from a failed connection's ErrorStream.
     * @param conn The established HttpURLConnection.
     * @return The error response body as a String, or an empty string if none is available.
     */
    private String readErrorResponse(HttpURLConnection conn) {
        // Read from the ErrorStream for failed requests (e.g., 4xx, 5xx)
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
            // Ignore exception if error stream is already closed or not available
            return "";
        }
    }
    
    /**
     * Main method for testing the client functionality.
     * NOTE: Requires a local server running at http://localhost:3000/api 
     * with the expected endpoints and data.
     */
    public static void main(String[] args) {
        JavaRestClientJsonOBJ client = new JavaRestClientJsonOBJ();
        
        try {
            System.out.println("=== Testing Campus Resource Finder API ===\n");
            
            // --- Preparation: Create a Test User and Resource for booking tests ---
            // Assuming the mock API supports creation and returns IDs
            
            // Test 1: Get all resources
            System.out.println("1. Getting all resources:");
            String resources = client.getResources();
            System.out.println(resources + "\n");
            
            // Test 2: Get all users
            System.out.println("2. Getting all users:");
            String users = client.getUsers();
            System.out.println(users + "\n");
            
            // Test 3: Create a booking (Assuming user ID 1 and resource ID 1 exist)
            int testUserId = 1; // Assuming these exist in your mock/dummy data
            int testResourceId = 1; 
            System.out.println("3. Creating a booking (User " + testUserId + ", Resource " + testResourceId + "):");
            String bookingJson = String.format(
                "{\"userId\":%d,\"resourceId\":%d,\"date\":\"2025-10-25\",\"startTime\":\"10:00\",\"endTime\":\"12:00\"}",
                testUserId, testResourceId
            );
            String bookingResponse = client.createBooking(bookingJson);
            System.out.println("New Booking: " + bookingResponse + "\n");

            // Extract the new booking ID (this is highly mock-API dependent, 
            // so we'll assume the API returns it in the response for demo purposes. 
            // A real app would use a JSON library like Jackson to parse this.)
            // For a basic demo, we'll assume the ID is 99 or can be hardcoded for the mock.
            // Since we can't parse JSON here, we'll try to update/delete an ID known to the mock server, e.g., 99.
            int createdBookingId = 99; // Placeholder ID for demonstration
            
            // Test 4: Get all bookings
            System.out.println("4. Getting all bookings:");
            String bookings = client.getBookings();
            System.out.println(bookings + "\n");
            
            // Test 5: Update the created booking
            System.out.println("5. Updating booking ID " + createdBookingId + " (Changing end time):");
            String updateJson = "{\"userId\":1,\"resourceId\":1,\"date\":\"2025-10-25\",\"startTime\":\"10:00\",\"endTime\":\"13:00\"}";
            String updateResponse = client.updateBooking(createdBookingId, updateJson);
            System.out.println("Update Response: " + updateResponse + "\n");

            // Test 6: Get bookings by user
            System.out.println("6. Getting bookings for User ID " + testUserId + ":");
            String userBookings = client.getBookingsByUser(testUserId);
            System.out.println("User Bookings: " + userBookings + "\n");

            // Test 7: Delete the created booking
            System.out.println("7. Deleting booking ID " + createdBookingId + ":");
            String deleteResponse = client.deleteBooking(createdBookingId);
            System.out.println("Delete Response: " + deleteResponse + "\n");

            // Test 8: Get the deleted booking (should result in a 404 error)
            System.out.println("8. Attempting to get deleted booking ID " + createdBookingId + " (Expected Failure):");
            try {
                client.getBookingById(createdBookingId); // Add a helper method for this if needed, or just use a generic call
            } catch (IOException e) {
                 System.out.println("Successfully caught expected error: " + e.getMessage() + "\n");
            }
            
        } catch (IOException e) {
            System.err.println("CRITICAL ERROR DURING TESTING: " + e.getMessage());
            // e.printStackTrace(); // Uncomment for full stack trace
        }
    }
    
    // Simple helper method to test the GET error case in the main method
    public String getBookingById(int bookingId) throws IOException {
        return sendGetRequest("/bookings/" + bookingId);
    }
}